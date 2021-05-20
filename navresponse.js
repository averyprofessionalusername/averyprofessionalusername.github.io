console.log("doing something");

menuButton = document.getElementById("dropdown");
navigation = document.querySelectorAll("nav a");
console.log("doing something");
menu_toggle = false;

menuButton.onclick = showMenu;

function showMenu() {
  if (!menu_toggle) {
    navigation.forEach(showItem);
    menu_toggle = true;
  } else {
    navigation.forEach(hideItem);
    menu_toggle = false;
  }
}

function showItem(item) {
  console.log("showItem");
  item.style.display = "block";
}

function hideItem(item) {
  item.style.display = "none";
}
