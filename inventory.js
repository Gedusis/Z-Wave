console.log("Inventory script loaded");
class InventoryNode {
  constructor(item) {
    this.item = item;
    this.next = null;
    this.prev = null;
  }
}
const firstNode = new InventoryNode({ name: "Health Potion", quantity: 2 });
console.log(firstNode);

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
  printItems() {
    if (this.head === null) return;

    let current = this.head;
    do {
      console.log(current.item);
      current = current.next;
    } while (current !== this.head);
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
}
const player = {
  health: 60,
  maxHealth: 100,
};

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
function renderPlayer() {
  const health = document.getElementById("player-health");
  health.textContent = `HP ${player.health} / ${player.maxHealth}`;
}

const inventory = new Inventory();
inventory.append({
  name: "Sword",
  quantity: 1,
  description: "Steel blade for fighting zombies up close.",
  type: "equipment",
});
inventory.append({
  name: "Shield",
  quantity: 1,
  description: "Sturdy wooden shield that helps block zombie attacks.",
  type: "equipment",
});
inventory.append({
  name: "Health Potion",
  quantity: 3,
  description: "Restores 15 HP when consumed",
  type: "consumable",
  healAmount: 15,
});

renderInventory();
renderPlayer();

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowDown") {
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
  }
});
