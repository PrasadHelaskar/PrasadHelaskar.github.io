const username = "PrasadHelaskar";
const container = document.getElementById("repo-container");

/* Map repo data → tech tags */
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

/* Render repo card */
function renderRepo(repo) {
  const card = document.createElement("div");
  card.className = "project-card";

  const badges = mapTech(repo)
    .map(tag => `<span class="badge">${tag}</span>`)
    .join("");

  card.innerHTML = `
    <h3>${repo.name}</h3>
    <p>${repo.description || "QA / Automation related project."}</p>

    <div class="badges">${badges}</div>

    <div class="project-links">
      <a href="${repo.html_url}" target="_blank">Repo</a>
      ${repo.homepage ? `<a href="${repo.homepage}" target="_blank">Live</a>` : ""}
    </div>
  `;

  return card;
}

/* AUTO SYNC ALL REPOS */

fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`)
  .then(res => res.json())
  .then(repos => {

    repos
      .filter(repo => !repo.fork && !repo.archived)
      .slice(0, 12)
      .forEach(repo => {
        container.appendChild(renderRepo(repo));
      });
  })
  .catch(() => {
    container.innerHTML =
      "<p style='color:#94a3b8'>Unable to load projects currently.</p>";
  });
