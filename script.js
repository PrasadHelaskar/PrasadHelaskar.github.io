const username = "PrasadHelaskar";

const featuredContainer = document.getElementById("featured-container");
const allContainer = document.getElementById("repo-container");

/* ---------------- BADGE LOGIC ---------------- */

function mapTech(repo) {
  const tags = new Set();

  if (repo.language) tags.add(repo.language);

  const text = `${repo.name} ${repo.description || ""}`.toLowerCase();

  if (text.includes("selenium")) tags.add("Selenium");
  if (text.includes("pytest")) tags.add("PyTest");
  if (text.includes("api")) tags.add("API");
  if (text.includes("cicd") || text.includes("pipeline")) tags.add("CI/CD");
  if (text.includes("docker")) tags.add("Docker");
  if (text.includes("parallel")) tags.add("Parallel");
  if (text.includes("self")) tags.add("Self-Healing");
  if (text.includes("performance")) tags.add("Performance");

  return [...tags];
}

/* ---------------- CARD RENDER ---------------- */

function renderCard(repo) {
  const card = document.createElement("div");
  card.className = "project-card";

  const badges = mapTech(repo)
    .map(t => `<span class="badge">${t}</span>`)
    .join("");

  card.innerHTML = `
    <h3>${repo.name}</h3>
    <p>${repo.description || "QA / Automation project."}</p>

    <div class="badges">${badges}</div>

    <div class="project-links">
      <a href="${repo.url}"
         target="_blank"
         class="project-link"
         data-project="${repo.name}">
         Repo
      </a>
    </div>
  `;

  return card;
}

/* ---------------- FEATURED (PINNED) ---------------- */

fetch("featured.json")
  .then(res => res.json())
  .then(pinned => {
    pinned.forEach(repo => {
      featuredContainer.appendChild(renderCard(repo));
    });
  })
  .catch(() => {
    featuredContainer.innerHTML =
      "<p style='color:#94a3b8'>Unable to load featured repos.</p>";
  });

/* ---------------- ALL PROJECTS ---------------- */

fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`)
  .then(res => res.json())
  .then(repos => {

    fetch("featured.json")
      .then(r => r.json())
      .then(pinned => {

        const featuredNames = new Set(pinned.map(p => p.name));

        repos
          .filter(r => !r.fork && !r.archived)
          .filter(r =>
            r.name !== `${username}.github.io` &&
            r.name !== username
          )
          .filter(r => !featuredNames.has(r.name))
          .slice(0, 12)
          .forEach(repo => {

            allContainer.appendChild(
              renderCard({
                name: repo.name,
                description: repo.description,
                url: repo.html_url,
                language: repo.language
              })
            );

          });
      });
  })
  .catch(() => {
    allContainer.innerHTML =
      "<p style='color:#94a3b8'>Unable to load repositories.</p>";
  });
