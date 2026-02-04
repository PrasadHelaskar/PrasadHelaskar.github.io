import fs from "fs";

const TOKEN = process.env.GH_TOKEN;
const USER = "PrasadHelaskar";

if (!TOKEN) {
  console.error("Missing GH_TOKEN");
  process.exit(1);
}

const query = {
  query: `
    query {
      user(login: "${USER}") {
        pinnedItems(first: 6, types: REPOSITORY) {
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

const res = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify(query)
});

const json = await res.json();

const pinned =
  json.data.user.pinnedItems.nodes.map(r => ({
    name: r.name,
    description: r.description,
    url: r.url,
    language: r.primaryLanguage?.name || ""
  }));

fs.writeFileSync("featured.json", JSON.stringify(pinned, null, 2));

console.log("featured.json updated");
