const grid = document.getElementById("collection-grid");
SITE.collection.forEach((item, index) => {
  const card = document.createElement("article");
  card.className = "collectible";
  card.innerHTML = item.image
    ? `<img src="${item.image}" alt="${item.name}"><div class="collectible-meta"><span>#${item.id}</span><h3>${item.name}</h3></div>`
    : `<div class="pixel-placeholder variant-${(index % 3) + 1}"><span>ARTWORK<br>COMING<br>SOON</span></div><div class="collectible-meta"><span>#${item.id}</span><h3>${item.name}</h3></div>`;
  grid.append(card);
});

const questList = document.getElementById("quest-list");
SITE.quests.forEach((quest, index) => {
  const item = document.createElement("article");
  item.className = "quest";
  item.innerHTML = `<div class="quest-index">0${index + 1}</div><div><h3>${quest.title}</h3><p>${quest.detail}</p></div><a class="quest-button" href="${quest.url}" ${quest.url.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>OPEN TASK ↗</a>`;
  questList.append(item);
});

/* A verification service can call this after it has confirmed every X action. */
window.unlockWaitlist = () => document.getElementById("wallet-gate").hidden = false;

document.getElementById("wallet-button").addEventListener("click", async () => {
  const status = document.getElementById("wallet-status");
  if (!window.ethereum) {
    status.textContent = "MetaMask was not found. Install or unlock MetaMask, then try again.";
    return;
  }
  try {
    const [address] = await window.ethereum.request({ method: "eth_requestAccounts" });
    status.textContent = `Wallet connected: ${address.slice(0, 6)}...${address.slice(-4)}`;
  } catch {
    status.textContent = "Wallet connection was cancelled or could not be completed.";
  }
});

const menu = document.querySelector(".menu-button");
const nav = document.querySelector(".main-nav");
menu.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(isOpen));
});
