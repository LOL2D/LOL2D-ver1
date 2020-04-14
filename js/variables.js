var sceneManager; // biến Scene manager quản lý các scenes của game

var player; // người chơi

var AI_Players = []; // máy chơi
var numOfAI; // số lượng máy
var autoFire = true; // máy tự động bắn

var urfMode = false;
var urfValue = .4; // phần trăm giảm hồi chiêu trong urf mode

var objects = []; // lưu các vật thể trong game
var images = {}; // các hình ảnh cần cho game

var gamemap; // biến bản đồ
var viewport; // biến theo dõi - tầm nhìn

var hacked = false; // hiện đường đạn

function newGame() {
    // map
    gamemap = new GameMap(2000, 2000, 250);
    objects = [];

    // URF
    urfMode = document.getElementById("inpUrf").value == "on";

	// player and AI
    player = createCharacter(document.getElementById("selectNhanVat").value);
    player.name = document.getElementById("ip-name").value || player.name;

    AI_Players = [];
    numOfAI = 4;
    for (var i = 0; i < numOfAI; i++) {
        AI_Players.push(createCharacter(null, true));
    }

    viewport = new ViewPort(player);

    // chuyển cảnh qua game
    sceneManager.showScene(Game);
}

function checkNewGame() {
    var allDied = true;
    for (var comp of AI_Players) {
        if (!comp.died) {
            allDied = false;
            break;
        }
    }

    if (player.died || allDied) {
        menuWhenDie('open');

        // nếu chết thì mở lại scene Loading
        // sceneManager.showScene( Loading );
    }
}

function createCharacter(_name, _isAuto) {
    var names = ["Yasuo", "Blitzcrank", "Jinx", "Lux"];
    var randomName = names[floor(random(names.length))];

    if(_name) randomName = _name;

    if (_isAuto) {
        return eval("new Auto" + randomName + "(null, random(gamemap.width), random(gamemap.height))");
    }
    return eval("new " + randomName + "('" + randomName + "', random(gamemap.width), random(gamemap.height))");
}

function menuWhenDie(e) {
	var element = document.getElementById("menuWhenDie")
	if(e == "switch") {
		var current = element.style.display;
		element.style.display = (current == "block" ? "none" : "block");
	} else {
		element.style.display = (e == "open" ? "block" : "none");	
	}

    return element.style.display == "block";
}

function randHex() {
    return ("#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}));
}

window.onload = function() {
    // cản chuột phải
    document.addEventListener('contextmenu', e => e.preventDefault());

    // bộ chọn màu ở menu
    document.getElementById('pickColor').value = randHex();
    var color_picker = document.getElementById("pickColor");
    var color_picker_wrapper = document.getElementById("color-picker-wrapper");
    color_picker.onchange = function() {
        color_picker_wrapper.style.backgroundColor = color_picker.value;    
    }
    color_picker_wrapper.style.backgroundColor = color_picker.value;

    // new game
    document.getElementById('solo')
        .addEventListener('click', (e) => {
            // nếu vào game thì mở scene Game
            menuWhenDie("close");

            newGame(); // ván mới
        });

    // chác chơi
    document.getElementById('cachchoi')
        .addEventListener('click', e => {
            var guide = document.getElementsByClassName('guide')[0];
            if(guide.style.display == "") {
                guide.style.display = "block";
                document.getElementById('cachchoi').scrollIntoView({ behavior: 'smooth', block: 'start' });

            } else {
                document.getElementById('ip-name').scrollIntoView({ behavior: 'smooth', block: 'end' });
                setTimeout(()=>{
                    guide.style.display = "";
                }, 200);
            }
        })
}