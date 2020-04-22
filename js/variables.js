let sceneManager; // biến Scene manager quản lý các scenes của game

let player; // người chơi

let AI_Players = []; // máy chơi
let numOfAI; // số lượng máy
let autoFire = true; // máy tự động bắn

let urfMode = false;
let urfValue = 0.4; // phần trăm giảm hồi chiêu trong urf mode

let objects = []; // lưu các vật thể trong game
let images = {}; // các hình ảnh cần cho game

let gamemap; // biến bản đồ
let viewport; // biến theo dõi - tầm nhìn
let beginMatchTime = 0;

let hackerMode = false; // hiện đường đạn

function newGame(config = {}) {
  const {
    mapW = 3000,
    mapH = 4000,
    mapCell = 250,

    urf = document.getElementById("inpUrf").checked,
    hacked = document.getElementById("inpHackMode").checked,
    championName = document.getElementById("selectNhanVat").value,

    aiCount = 9,
  } = config;

  // map
  gamemap = new GameMap(mapW, mapH, mapCell);
  gamemap.addRandomObject(Tree, 20);
  objects = [];

  // time
  beginMatchTime = millis();

  // URF
  urfMode = urf;

  // HackMode
  hackerMode = hacked;

  // player and AI
  player = createCharacter(championName);

  let name = document.getElementById("ip-name").value;
  player.name = name || localStorage.getItem("LOL2D-name") || player.name;

  if (name) localStorage.setItem("LOL2D-name", name);

  AI_Players = [];
  numOfAI = aiCount;
  for (let i = 0; i < numOfAI; i++) {
    AI_Players.push(createCharacter(null, true));
  }

  viewport = new ViewPort(player);

  // chuyển cảnh qua game
  sceneManager.showScene(Game);
}

function checkNewGame() {
  let allDied = true;
  for (let comp of AI_Players) {
    if (!comp.died) {
      allDied = false;
      break;
    }
  }

  if (player.died || allDied) {
    menuWhenDie("open");

    // nếu chết thì mở lại scene Loading
    // sceneManager.showScene( Loading );
  }
}

function createCharacter(_name, _isAuto) {
  let names = ["Yasuo", "Blitzcrank", "Jinx", "Lux"];
  let randomName = names[floor(random(names.length))];

  if (_name) randomName = _name;

  if (_isAuto) {
    return eval(
      "new Auto" +
        randomName +
        "(null, random(gamemap.width), random(gamemap.height))"
    );
  }
  return eval(
    "new " +
      randomName +
      "('" +
      randomName +
      "', random(gamemap.width), random(gamemap.height))"
  );
}

function menuWhenDie(e) {
  let element = document.getElementById("menuWhenDie");
  if (e == "switch") {
    let current = element.style.display;
    element.style.display = current == "block" ? "none" : "block";
  } else {
    element.style.display = e == "open" ? "block" : "none";
  }

  return element.style.display == "block";
}

function randHex() {
  return "#000000".replace(/0/g, function () {
    return (~~(Math.random() * 16)).toString(16);
  });
}

function getUrlVars() {
  let vars = {};
  window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (
    m,
    key,
    value
  ) {
    vars[key] = value;
  });
  return vars;
}

window.onload = function () {
  // cản chuột phải
  document.addEventListener("contextmenu", (e) => e.preventDefault());

  // name
  let name = localStorage.getItem("LOL2D-name");
  if (name) document.getElementById("ip-name").value = name;

  // bộ chọn màu ở menu
  document.getElementById("pickColor").value = randHex();
  let color_picker = document.getElementById("pickColor");
  let color_picker_wrapper = document.getElementById("color-picker-wrapper");
  color_picker.onchange = function () {
    color_picker_wrapper.style.backgroundColor = color_picker.value;
  };
  color_picker_wrapper.style.backgroundColor = color_picker.value;

  // new game
  document.getElementById("solo").addEventListener("click", (e) => {
    // nếu vào game thì mở scene Game
    menuWhenDie("close");

    newGame(); // ván mới
  });

  ["vn", "en"].forEach((lang) => {
    // cách chơi
    const btn = this.document.getElementById("cachchoi-" + lang);

    btn.addEventListener("click", (e) => {
      let guide = document.getElementById("guide-" + lang);
      if (guide.style.display == "") {
        guide.style.display = "block";
        e.target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        document
          .getElementById("ip-name")
          .scrollIntoView({ behavior: "smooth", block: "end" });
        setTimeout(() => {
          guide.style.display = "";
        }, 200);
      }
    });
  });

  // config from link
  const { champion, urf, hacker } = getUrlVars();
  if (champion) {
    document.getElementById("selectNhanVat").value = champion;
  }
  if (urf) {
    document.getElementById("inpUrf").checked = urf != "false";
  }
  if (hacker) {
    this.document.getElementById("inpHackMode").checked = hacker != "false";
  }
};
