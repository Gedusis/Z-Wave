class InventoryNode {
  constructor(item) {
    this.item = item;
    this.next = null;
    this.prev = null;
  }
}
class ItemLibraryNode {
  constructor(item) {
    this.item = item;
    this.next = null;
  }
}
class ItemLibrary {
  constructor() {
    this.head = null;
    this.tail = null;
  }
  append(item) {
    const node = new ItemLibraryNode(item);

    if (this.head === null) {
      this.head = node;
      this.tail = node;
      return;
    }
    this.tail.next = node;
    this.tail = node;
  }
}
class Inventory {
  constructor() {
    this.head = null;
    this.selected = null;
  }
  append(item) {
    const node = new InventoryNode(item);

    if (this.head === null) {
      node.next = node;
      node.prev = node;
      this.head = node;
      this.selected = node;
      return;
    }
    const tail = this.head.prev;

    node.prev = tail;
    node.next = this.head;

    tail.next = node;
    this.head.prev = node;
  }
  selectNext() {
    if (this.selected === null) return;

    this.selected = this.selected.next;
  }
  selectPrevious() {
    if (this.selected === null) return;

    this.selected = this.selected.prev;
  }
  removeSelected() {
    //Jeigu tuscias inv
    if (this.selected === null) return;

    //Jeigu 1 itemas
    if (this.selected.next === this.selected) {
      this.head = null;
      this.selected = null;
      return;
    }
    //Jeigu >1 itemas
    let previous = this.selected.prev;
    let next = this.selected.next;

    previous.next = next;
    next.prev = previous;

    if (this.head === this.selected) {
      this.head = next;
    }

    this.selected = next;
  }

  useSelected() {
    if (this.selected === null) return;
    //Potion
    else if (this.selected.item.type === "consumable") {
      if (player.health === player.maxHealth) {
        console.log("Character is currently at full HP");
        return;
      } else if (player.health < player.maxHealth) {
        player.health = player.health + this.selected.item.healAmount;
        if (player.health > player.maxHealth) {
          player.health = player.maxHealth;
        }
        if (this.selected.item.quantity > 0) {
          this.selected.item.quantity--;
          if (this.selected.item.quantity === 0) {
            this.removeSelected();
          }
        }
      }
    }
  }
  equipSelected() {
    if (this.selected === null) return;
    else if (this.selected.item.type === "equipment") {
      if (
        this.selected.item.slot === "rightHand" &&
        player.rightHand === null
      ) {
        player.rightHand = this.selected.item;
        this.removeSelected();
      } else if (
        this.selected.item.slot === "leftHand" &&
        player.leftHand === null
      ) {
        player.leftHand = this.selected.item;
        this.removeSelected();
      } else if (this.selected.item.slot === "head" && player.head === null) {
        player.head = this.selected.item;
        this.removeSelected();
      } else if (this.selected.item.slot === "body" && player.body === null) {
        player.body = this.selected.item;
        this.removeSelected();
      }
    }
  }
  unequipRightHand() {
    if (player.rightHand === null) return;

    this.append(player.rightHand);
    player.rightHand = null;
  }
  unequipLeftHand() {
    if (player.leftHand === null) return;

    this.append(player.leftHand);
    player.leftHand = null;
  }
  unequipHead() {
    if (player.head === null) return;

    this.append(player.head);
    player.head = null;
  }
  unequipBody() {
    if (player.body === null) return;

    this.append(player.body);
    player.body = null;
  }
  sortByName() {
    if (this.selected === null || this.selected.next === this.selected) return;

    let swapped;

    do {
      swapped = false;
      let first = this.head;

      while (first.next !== this.head) {
        const second = first.next;
        if (first.item.name.localeCompare(second.item.name) > 0) {
          const temp = first.item;
          first.item = second.item;
          second.item = temp;
          swapped = true;
        }
        first = second;
      }
    } while (swapped);
  }
  sortByType() {
    if (this.selected === null || this.selected.next === this.selected) return;

    let swapped;

    do {
      swapped = false;
      let first = this.head;

      while (first.next !== this.head) {
        const second = first.next;
        if (first.item.type.localeCompare(second.item.type) > 0) {
          const temp = first.item;
          first.item = second.item;
          second.item = temp;
          swapped = true;
        }
        first = second;
      }
    } while (swapped);
  }
}
const player = {
  health: 60,
  maxHealth: 100,
  rightHand: null,
  leftHand: null,
  head: null,
  body: null,
};
async function loadItemLibrary() {
  const response = await fetch("item-library.json");
  const items = await response.json();

  for (const item of items) {
    itemLibrary.append({ ...item });
  }
  renderItemLibrary();
}

async function loadInventory() {
  const response = await fetch("inventory.json");
  const items = await response.json();

  for (const item of items) {
    inventory.append({ ...item });
  }
  renderInventory();
}

async function loadPlayer() {
  const response = await fetch("player.json");
  const data = await response.json();

  Object.assign(player, data);
  renderPlayer();
}
function renderInventory() {
  const list = document.getElementById("inventory-list");
  list.textContent = "";
  if (inventory.head === null) return;

  let current = inventory.head;
  do {
    const li = document.createElement("li");
    li.textContent = `${current.item.name} x ${current.item.quantity}`;
    li.title = current.item.description;
    list.appendChild(li);
    if (current === inventory.selected) {
      li.classList.add("selected");
    }
    current = current.next;
  } while (current !== inventory.head);
}
function renderItemLibrary() {
  const library = document.getElementById("item-library-list");
  library.textContent = "";

  let current = itemLibrary.head;

  while (current !== null) {
    const item = current.item;
    const li = document.createElement("li");
    const button = document.createElement("button");
    li.textContent = `${current.item.name}`;
    button.textContent = `Add`;
    button.addEventListener("click", function () {
      inventory.append({ ...item });
      renderInventory();
    });

    li.appendChild(button);
    library.appendChild(li);

    current = current.next;
  }
}
function renderPlayer() {
  const health = document.getElementById("player-health");
  health.textContent = `HP ${player.health} / ${player.maxHealth}`;

  const rHand = document.getElementById("right-hand");
  if (player.rightHand === null) {
    rHand.textContent = `R. Hand: Empty`;
  } else {
    rHand.textContent = `R. Hand: ${player.rightHand.name}`;
  }
  const lHand = document.getElementById("left-hand");
  if (player.leftHand === null) {
    lHand.textContent = `L. Hand: Empty`;
  } else {
    lHand.textContent = `L. Hand: ${player.leftHand.name}`;
  }
  const head = document.getElementById("head");
  if (player.head === null) {
    head.textContent = `Head: Empty`;
  } else {
    head.textContent = `Head: ${player.head.name}`;
  }
  const body = document.getElementById("body");
  if (player.body === null) {
    body.textContent = `Body: Empty`;
  } else {
    body.textContent = `Body: ${player.body.name}`;
  }
}

const inventory = new Inventory();
const itemLibrary = new ItemLibrary();

loadPlayer();
loadItemLibrary();
loadInventory();

const gamePanel = document.querySelector("main");
const exitButton = document.getElementById("exit-game");
const gameEnded = document.getElementById("game-ended");
exitButton.addEventListener("click", function () {
  gamePanel.hidden = true;
  gameEnded.hidden = false;
});

document.addEventListener("keydown", function (event) {
  if (gamePanel.hidden === true) return;
  const inventorySection = document.getElementById("inventory");
  if (event.key.toLowerCase() === "i") {
    inventorySection.hidden = !inventorySection.hidden;
    return;
  }
  if (inventorySection.hidden === true) {
    return;
  } else if (event.key === "ArrowDown") {
    inventory.selectNext();
    event.preventDefault();
    renderInventory();
  } else if (event.key === "ArrowUp") {
    inventory.selectPrevious();
    event.preventDefault();
    renderInventory();
  } else if (event.key === "Delete") {
    inventory.removeSelected();
    renderInventory();
  } else if (event.key === "e") {
    inventory.useSelected();
    renderInventory();
    renderPlayer();
  } else if (event.key === "f") {
    inventory.equipSelected();
    renderInventory();
    renderPlayer();
  } else if (event.key.toLowerCase() === "r") {
    inventory.unequipRightHand();
    renderInventory();
    renderPlayer();
  } else if (event.key.toLowerCase() === "l") {
    inventory.unequipLeftHand();
    renderInventory();
    renderPlayer();
  } else if (event.key.toLowerCase() === "h") {
    inventory.unequipHead();
    renderInventory();
    renderPlayer();
  } else if (event.key.toLowerCase() === "b") {
    inventory.unequipBody();
    renderInventory();
    renderPlayer();
  } else if (event.key.toLowerCase() === "n") {
    inventory.sortByName();
    renderInventory();
  } else if (event.key.toLowerCase() === "t") {
    inventory.sortByType();
    renderInventory();
  }
});
