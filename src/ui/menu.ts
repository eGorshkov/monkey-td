import { TOWERS } from "../constants/towers";
import { Ui } from "./ui";

const MENU_ELEMENT = document.getElementById("ui-overlay");

export function callMenu(e: MouseEvent, cell) {
  MENU_ELEMENT.setAttribute("active", "");

  const menu = document.createElement("div");
  menu.setAttribute("id", "menu");
  menu.style.left = e.x + "px";
  menu.style.top = e.y + "px";

  cell.tower ? createTowerUpgrades(menu, cell) : createTowerButtons(menu, cell);

  MENU_ELEMENT.appendChild(menu);
}

export function removeAll() {
  while (MENU_ELEMENT.firstChild) {
    MENU_ELEMENT.removeChild(MENU_ELEMENT.firstChild);
  }
  MENU_ELEMENT.removeAttribute("active");
}

function createTowerButtons(menu, cell) {
  Object.keys(TOWERS).forEach((key) => {
    const element = document.createElement("button");
    element.innerText = `${key} - ${TOWERS[key].price} gold`;
    element.disabled = Ui.gold < TOWERS[key].price;
    element.addEventListener("click", () => {
      Ui.removeGold(100);
      cell.createTower(key);
      removeAll();
    });
    menu.appendChild(element);
  });
}

function createTowerUpgrades(menu, cell) {
  const element = document.createElement("button");
  element.innerText = "Upgrade level " + (cell.tower.upgradeLevel + 2);
  element.disabled = Ui.gold < cell.tower.nextUpgrade.gold;
  element.addEventListener("click", () => {
    Ui.removeGold(cell.tower.nextUpgrade.gold);
    cell.tower.upgrade();
    removeAll();
  });
  menu.appendChild(element);
}
