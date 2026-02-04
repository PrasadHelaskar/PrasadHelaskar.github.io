const fs = require("fs");

const TOKEN = process.env.GH_TOKEN;
const USER = "PrasadHelaskar";

if (!TOKEN) {
  console.error("❌ Missing GH_TOKEN");
  process.exit(1);
}

console.log("✅ Token loaded");

/* ----- Load desired order ----- */

let order = [];
try {
  order = JSON.parse(fs.readFileSync("featured-order.json", "utf-8"));
  console.log("✅ featured-order.json loaded:", order);
} catch (err) {
  console.error("❌ Failed to read featured-order.json", err);
  process.exit(1);
}

/* ----- GraphQL Query ----- */

const query = {
  query: `
    query {
      user(login: "${USER}") {
        pinnedItems(first: 10, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              url
              primaryLanguage { name }
            }
          }
        }
      }
    }
  `
};

(async () => {
  try {
    console.log("📡 Fetching pinned repos...");

    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(query)
    });

    const json = await res.json();

    console.log("📦 GraphQL response:", JSON.stringify(json, null, 2));

    if (!json.data || !json.data.user) {
      console.error("❌ GraphQL returned no data");
      process.exit(1);
    }

    const pinned = json.data.user.pinnedItems.nodes.map(r => ({
      name: r.name,
      description: r.description,
      url: r.url,
      language: r.primaryLanguage?.name || ""
    }));

    console.log("📌 Pinned repos found:", pinned.map(p => p.name));

    /* ----- Sort according to featured-order.json ----- */

    const orderMap = new Map();
    order.forEach((name, idx) => orderMap.set(name, idx));

    pinned.sort((a, b) => {
      return (
        (orderMap.get(a.name) ?? 999) -
        (orderMap.get(b.name) ?? 999)
      );
    });

    fs.writeFileSync("featured.json", JSON.stringify(pinned, null, 2));

    console.log("✅ featured.json written successfully");
  } catch (err) {
    console.error("🔥 Script crashed:", err);
    process.exit(1);
  }
})();
