//

// Place savecode here \/
var saveCode = "";

/**    

    CBV R.1
    by @Tazal
    Attribution-NoDerivatives 
    4.0 International (CC BY-ND 4.0)
    https://creativecommons.org/licenses/by-nd/4.0/
    
**/
/**    >>>> CONTROLS <<<< **/
/*
    
    [w][a][s][d]/arrow keys : move
    [space]/[rmb] : fire
    [shift] : sprint
    [r] : reload
    [f] : use powerup
    [v] : use knife
    [q] : open shop
    [e] : close shop

*/
/**  >>>> WEAPON INFO <<<< **/
/*

    Firing mode :
     “Auto” - fires automatically when the mouse is pressed 
     “Simi” - fires once per click
     “Manl” - fires once per click, reloads one bullet at a time
    Damage      : the amount of damage each bullet deals
    Piercing    : how many enemies the bullet can go through
    Accuracy    : How close the bullets are to where you aim
    Ammo        : number of bullets the gun holds
    Firerate    : how fast the bullets can be fired
    Reload speed: how fast the weapon can be reloaded
    Weight      : how slow the player is when holding the weapon

*/
/**  >>>> WEAPON TYPES <<<< **/
/*

    Pistols       - 
    ultra lightweight, small magazine size, fast reload

    SMGs          - 
    lightweight, large magazine size, rapid firing

    Rifles        - 
    heavy, large magazine, rapid firing, piercing bullets 

    Shotguns      - 
    heavy, small magazine, slow firing, multiple bullets per shot

    Snipers       - 
    heavy, small magazine, slow firing, powerful, piercing bullets

    Heavy Weapons - 
    extremely heavy, huge magazine, rapid firing

*/
/**    >>>>> Features <<<<< **/
/*
    - 12 Unique zombie types
    - Better Ai
    - Better shop ui
    - scales to any size
    - more content
  
*/
/**    >>>> Known Bugs <<<< **/
/*
    - __env__. is not a function [fix - restart program]
    - Input sticking [ fix - unknown ]

*/
/**    >>>> Fixed Bugs <<<< **/
/*
    - weapon reload + shop bug
    - Weapon ammo reset bug [thxs @Ethan_Keiernan]

*/
/**    >>>> Small fixes <<<< **/
/*
    - Nerfed mare
    - buffed weapons
    - Added RMB reloading
    - Added dif scaling
    
*/
/**    >>>> Update log <<<< **/
/*
    - d.1.1 : Dif scaling, achievements, player skins
    - d.1.2 : bug fixes + saving
    - d.1.3 : more zombies, boss
    - d.1.4 : added gems, and grenades, should work at any res
    - d.1.5 : added logo, bug fixes, hints
    - d.1.6 : added gem weapons
    - d.1.7 : bug fixes
    - R.1   : game relased 
    - R.1.1 : added knife
    - R.1.2 : added more hud features
    - R.1.3 : trying to fixed shotguns
    
*/

/**  TODO LIST   */
// Add more content
// Add better Title screen
// Clean up code

function setup() {
  createCanvas(window.innerHeight, window.innerHeight, 1);
  noStroke();
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(20);
}

var rotate1 = function (a) {
  rotate(a * (PI / 180));
};
var cos1 = function (a) {
  return Math.cos((a / 180) * Math.PI);
};
var sin1 = function (a) {
  return Math.sin((a / 180) * Math.PI);
};
var atan3 = function (a, b) {
  return (atan2(a, b) / PI) * 180;
};
var MX, MY;

var UP = 0,
  DOWN = 1,
  LEFT = 2,
  RIGHT = 3;

// textFont(createFont("Arial Bold"));

// -================== player ===================-
var p = {
  x: 300,
  y: 300, //Player x and y
  angle: 90,
  speed: 7,
  health: 100,
  healthMax: 100,
  healthRegen: 6,
  stamina: 10000,
  staminaMax: 100,
  staminaRegen: 2,
  defense: 100,
  equ: 0, // equipped weapon ( 0 or 1)
  equWep: [1, 1], // weapon ids
  equWepMag: [0, 0], // weapons ammo
  wepAcc: 0, // weapons accarcy
};

// -=========== Basic game data ============-
var g = {
  playerDie: false,
  gameTimer: 0, // generl game timer
  money: 0, // money the player has
  gems: 0, // gems the player has
  wave: 0, // what wave the player is on
  waveTimer: 0, // delay between waves
  rumble: 0, // screen shake
  hurt: 0, // Red over screen
};

// -================== powerup ===================-
var powerup = {
  delay: 500,
  timer: 0,
};

// -================== difficulty ===================-
var d = {
  difMult: 1, // difficulty of zombies
  waveTAdd: 1200, // delay between wave
  difIncr: 0.15, // difficulty increase
};

// -================ Stats ==================-
var stats = {
  bulletsShot: 0,
  ZombiesKilled: 0,
  moneyEarned: 0,
  moneySpent: 0,
  highestWave: 0,
};

//achievements

/** TODO Make the shop code less garbage*/

// -================== Player upgrades ===================-
var shops = {
  upgrades: [
    {
      name: "Health regen",
      cost: 0,
      addCost: 0,
      level: 0,
      maxLevel: 10,
      onBuy: function () {
        p.healthRegen += 0.006;
      },
    },
    {
      name: "Max Health",
      cost: 0,
      addCost: 0,
      level: 0,
      maxLevel: 8,
      onBuy: function () {
        p.healthMax += 50;
      },
    },
    {
      name: "Stamina regen",
      cost: 0,
      addCost: 0,
      level: 0,
      maxLevel: 10,
      onBuy: function () {
        p.staminaRegen += 1;
      },
    },
    {
      name: "Max stamina",
      cost: 0,
      addCost: 0,
      level: 0,
      maxLevel: 10,
      onBuy: function () {
        p.staminaMax += 25;
      },
    },
    {
      name: "defense",
      cost: 0,
      addCost: 0,
      level: 0,
      maxLevel: 10,
      onBuy: function () {
        p.defense -= 0.05;
      },
    },
  ],
};

//Scene controls
var scene = "main",
  subScene = "main",
  shopSubScene = "pistols"; // what subScene the user is on

var clicked = false; //if player clicks

var cam = {
  x: 0,
  y: 0,
}; //camera movement cords
var camEasing = 0.1; // speed the camera trails
var laggy = false; // If the game is laggy
var particleDieTimer = 1; // how fast particles die
var playerColor = [255, 255, 255]; //players hand color
var rediColor = [255, 255, 255];
var rediColorIvt = [0, 0, 0];
var shopBackGround; // stores the screenshot for the shop

var entitys = [],
  bullets = [],
  otherEn = [],
  dropitm = [],
  particl = [],
  SceenPd = [];

// notification pop up
/* {m: message,sm: sub message,l:1} */
var notif = [];

// number of upgrades you can buy
var shopcanbuy = 0;

// -================== Weapons Math ==============-
var wepMath = {
    firing: false, //if player is firing weapon
    reloading: false, //if reloading is firing weapon
    fireDelay: 0, //timer for delay between shots
    reloadDelay: 0, //timer for weapon reload
    clickedTwice: 0,
  },
  // -================== Weapons ===================-
  /** 
    @KEY 
    nam - name            | FlT - flavor text     
    typ - weapon type     | frM - fire mode
    dam - Damage          | acc - accarcy
    rcl - weapon recoil   | stb - stablity
    sqd - bullet speed    | prc - piercing 
    mag - ammo amount     | frt - fire rate
    bpS - bullets per shot| rSp - reload speed
    wgh - weight          |
    dis - the graphics for the weapon
*/
  wep = [
    {
      nam: "Tazal's sideArm",
      FlT: "Tazal's fav gun",
      Typ: "Lazer",
      frM: "simi",
      dam: 800,
      acc: 0.0,
      rcl: 0.01,
      stb: 0.003,
      spd: 25,
      prc: 3,
      mag: 5,
      frt: 10,
      bpS: 5,
      rSp: 0.01,
      wgh: 0,
      dis: function () {
        fill(90, 218, 250);
        rect(0, -20, 3, 15);
        fill(playerColor);
        ellipse(0, -15, 5, 5);
        ellipse(3, -15, 5, 5);
      },
    },

    {
      nam: "colt-1190",
      FlT: "Ol` reliable",
      Typ: "pistol",
      frM: "simi",
      dam: 200,
      acc: 0.5,
      rcl: 0.08,
      stb: 0.003,
      spd: 30,
      prc: 1,
      mag: 7,
      frt: 20,
      bpS: 1,
      rSp: 20,
      wgh: 0.9,
      dis: function () {
        fill(87, 86, 87);
        rect(0, -20, 3, 10);
        fill(playerColor);
        ellipse(0, -15, 5, 5);
        ellipse(3, -15, 5, 5);
      },
    },
    {
      nam: "Defender-90",
      FlT: "Law enforcements weapon of choice",
      Typ: "pistol",
      frM: "simi",
      dam: 250,
      acc: 0.8,
      rcl: 0.05,
      stb: 0.003,
      spd: 30,
      prc: 1,
      mag: 10,
      frt: 10,
      bpS: 1,
      rSp: 20,
      wgh: 0.8,
      dis: function () {
        fill(0, 0, 0);
        rect(0, -20, 3, 10);
        fill(playerColor);
        ellipse(0, -15, 5, 5);
        ellipse(3, -15, 5, 5);
      },
    },
    {
      nam: "HandCannon",
      FlT: "A high caliber pistol",
      Typ: "pistol",
      frM: "simi",
      dam: 35,
      acc: 0.7,
      rcl: 0.2,
      stb: 0.003,
      spd: 40,
      prc: 5,
      mag: 5,
      frt: 20,
      bpS: 1,
      rSp: 100,
      wgh: 1.3,
      dis: function () {
        fill(77, 77, 77);
        rect(0, -23, 4, 15);
        fill(playerColor);
        ellipse(0, -15, 5, 5);
        ellipse(3, -15, 5, 5);
      },
    },
    {
      nam: "Mare .35",
      FlT: "The gun that won the west",
      Typ: "pistol",
      frM: "manl",
      dam: 30,
      acc: 0.8,
      rcl: 0.1,
      stb: 0.003,
      spd: 30,
      prc: 1,
      mag: 7,
      frt: 0,
      bpS: 1,
      rSp: 5,
      wgh: 1.2,
      dis: function () {
        fill(125, 124, 125);
        rect(0, -20, 4, 10);
        fill(playerColor);
        ellipse(0, -15, 5, 5);
        ellipse(3, -15, 5, 5);
      },
    },
    {
      nam: "The Basilisk",
      FlT: "An ultralight polymers handgun",
      Typ: "pistol",
      frM: "auto",
      dam: 25,
      acc: 0.8,
      rcl: 0.06,
      stb: 0.003,
      spd: 30,
      prc: 1,
      mag: 20,
      frt: 6,
      bpS: 1,
      rSp: 20,
      wgh: 0,
      dis: function () {
        fill(0, 0, 0);
        rect(0, -20, 3, 10);
        fill(playerColor);
        ellipse(0, -15, 5, 5);
        ellipse(3, -15, 5, 5);
      },
    },

    // SMGS
    {
      nam: "Piranha B8",
      FlT: "",
      Typ: "smg",
      frM: "auto",
      dam: 10,
      acc: 0.4,
      rcl: 0.04,
      stb: 0.006,
      spd: 30,
      prc: 1,
      mag: 30,
      frt: 5,
      bpS: 1,
      rSp: 40,
      wgh: 1.4,
      dis: function () {
        fill(71, 71, 71);
        rect(-6, -15, 2, 24);
        fill(122, 122, 122);
        rect(-6, -20, 4, 8);
        fill(playerColor);
        ellipse(-3, -18, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },
    {
      nam: "Barracuda B9",
      FlT: "",
      Typ: "smg",
      frM: "auto",
      dam: 12,
      acc: 0.4,
      rcl: 0.03,
      stb: 0.006,
      spd: 30,
      prc: 1,
      mag: 30,
      frt: 4,
      bpS: 1,
      rSp: 40,
      wgh: 1.4,
      dis: function () {
        fill(31, 31, 31);
        rect(-6, -15, 2, 24);
        fill(0, 0, 0);
        rect(-6, -20, 4, 8);
        fill(playerColor);
        ellipse(-3, -18, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },
    {
      nam: "viper-30",
      FlT: "The gun first used by the cdc to contain the virus",
      Typ: "smg",
      frM: "auto",
      dam: 20,
      acc: 0.5,
      rcl: 0.05,
      stb: 0.006,
      spd: 35,
      prc: 1,
      mag: 25,
      frt: 6,
      bpS: 1,
      rSp: 30,
      wgh: 1.4,
      dis: function () {
        fill(13, 13, 13);
        rect(-6, -15, 2, 24);
        fill(122, 122, 122);
        rect(-6, -20, 4, 8);
        fill(playerColor);
        ellipse(-3, -18, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },
    {
      nam: "TOM-9",
      FlT: "A gun commonly used by gangsters",
      Typ: "smg",
      frM: "auto",
      dam: 8,
      acc: 0.3,
      rcl: 0.05,
      stb: 0.006,
      spd: 35,
      prc: 1,
      mag: 100,
      frt: 3,
      bpS: 1,
      rSp: 50,
      wgh: 1.4,
      dis: function () {
        fill(89, 87, 83);
        rect(-6, -18, 9, 3);
        fill(77, 75, 77);
        rect(-6, -15, 2, 24);
        fill(212, 123, 21);
        rect(-6, -20, 4, 8);
        fill(playerColor);
        ellipse(-3, -18, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },
    {
      nam: "The Griffin",
      FlT: "",
      Typ: "smg",
      frM: "auto",
      dam: 25,
      acc: 0.4,
      rcl: 0.04,
      stb: 0.006,
      spd: 30,
      prc: 1,
      mag: 50,
      frt: 5,
      bpS: 1,
      rSp: 50,
      wgh: 1.4,
      dis: function () {
        fill(82, 82, 80);
        rect(-6, -15, 2, 24);
        fill(173, 159, 33);
        rect(-6, -20, 4, 8);
        fill(playerColor);
        ellipse(-3, -18, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },
    {
      nam: "The Ocelot",
      FlT: "a hightech weapon with high veilocity bullets",
      Typ: "smg",
      frM: "auto",
      dam: 12,
      acc: 0.8,
      rcl: 0.065,
      stb: 0.006,
      spd: 40,
      prc: 3,
      mag: 20,
      frt: 5,
      bpS: 1,
      rSp: 50,
      wgh: 1.4,
      dis: function () {
        fill(110, 100, 110);
        rect(-6, -15, 2, 24);
        fill(175, 227, 143);
        rect(-6, -20, 4, 8);
        fill(playerColor);
        ellipse(-3, -18, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },

    // Rifle

    {
      nam: "Attack Rifle",
      FlT: "",
      Typ: "Rifle",
      frM: "auto",
      dam: 10,
      acc: 0.6,
      spd: 30,
      prc: 2,
      rcl: 0.05,
      stb: 0.003,
      mag: 30,
      frt: 10,
      bpS: 1,
      rSp: 60,
      wgh: 2,
      dis: function () {
        fill(71, 71, 71);
        rect(-6, -20, 2, 24);
        fill(176, 91, 0);
        rect(-6, -20, 4, 10);
        fill(playerColor);
        ellipse(-3, -18, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },
    {
      nam: "RN50 TacticalRifle",
      FlT: "The rifle used by SWAT",
      Typ: "Rifle",
      frM: "auto",
      dam: 15,
      acc: 0.6,
      rcl: 0.03,
      stb: 0.003,
      spd: 30,
      prc: 2,
      mag: 35,
      frt: 5,
      bpS: 1,
      rSp: 60,
      wgh: 2,
      dis: function () {
        fill(41, 41, 41);
        rect(-6, -20, 2, 24);
        fill(36, 36, 36);
        rect(-6, -20, 4, 10);
        fill(playerColor);
        ellipse(-3, -18, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },
    {
      nam: "T8-Wolf",
      FlT: Math.random() >= 0.8 ? "OwO...Woof" : "the armys weapon of choice",
      Typ: "Rifle",
      frM: "auto",
      dam: 16,
      acc: 0.7,
      rcl: 0.03,
      stb: 0.003,
      spd: 30,
      prc: 3,
      mag: 40,
      frt: 8,
      bpS: 1,
      rSp: 60,
      wgh: 2,
      dis: function () {
        fill(71, 71, 71);
        rect(-6, -20, 2, 24);
        fill(97, 96, 96);
        rect(-6, -20, 4, 10);
        fill(playerColor);
        ellipse(-3, -18, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },
    {
      nam: "US-15",
      FlT: "",
      Typ: "Rifle",
      frM: "simi",
      dam: 20,
      acc: 0.7,
      rcl: 0.03,
      stb: 0.003,
      spd: 30,
      prc: 2,
      mag: 30,
      frt: 5,
      bpS: 1,
      rSp: 40,
      wgh: 2,
      dis: function () {
        fill(71, 71, 71);
        rect(-6, -20, 2, 24);
        fill(79, 63, 63);
        rect(-6, -20, 4, 10);
        fill(playerColor);
        ellipse(-3, -18, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },
    {
      nam: "The Chimera",
      FlT: "A real monster",
      Typ: "Rifle",
      frM: "auto",
      dam: 18,
      acc: 0.7,
      rcl: 0.03,
      stb: 0.003,
      spd: 35,
      prc: 2,
      mag: 30,
      frt: 5,
      bpS: 1,
      rSp: 20,
      wgh: 2,
      dis: function () {
        fill(71, 71, 71);
        rect(-6, -20, 2, 24);
        fill(31, 30, 31);
        rect(-6, -35, 3, 10);
        fill(23, 23, 23);
        rect(-6, -20, 4, 10);
        fill(playerColor);
        ellipse(-3, -18, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },

    //Shotguns
    {
      nam: "PumpAction shotgun",
      FlT: "",
      Typ: "shotgun",
      frM: "manl",
      dam: 15,
      acc: 0.2,
      rcl: 0.09,
      stb: 0.003,
      spd: 30,
      prc: 1,
      mag: 5,
      frt: 40,
      bpS: 5,
      rSp: 25,
      wgh: 2,
      dis: function () {
        fill(71, 71, 71);
        rect(-6, -20, 3, 24);
        //rect(-2,-20,3,24);
        fill(176, 91, 0);
        rect(-4, -18, 6, 10);
        fill(playerColor);
        ellipse(-0, -22, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },
    {
      nam: "DoB shotgun",
      FlT: "an old double barrel shotgun",
      Typ: "shotgun",
      frM: "manl",
      dam: 25,
      acc: 0.2,
      rcl: 0.09,
      stb: 0.03,
      spd: 30,
      prc: 1,
      mag: 2,
      frt: 10,
      bpS: 6,
      rSp: 8,
      wgh: 2,
      dis: function () {
        fill(71, 71, 71);
        rect(-6, -20, 3, 24);
        rect(-2, -20, 3, 24);
        fill(176, 91, 0);
        rect(-4, -18, 6, 10);
        fill(playerColor);
        ellipse(-0, -22, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },
    {
      nam: "R90-rhino",
      FlT: "Military-grade Assault shotgun",
      Typ: "shotgun",
      frM: "auto",
      dam: 15,
      acc: 0.1,
      rcl: 0.09,
      stb: 0.003,
      spd: 25,
      prc: 1,
      mag: 10,
      frt: 30,
      bpS: 6,
      rSp: 100,
      wgh: 2,
      dis: function () {
        fill(71, 71, 71);
        rect(-6, -20, 3, 24);
        //rect(-2,-20,3,24);
        fill(82, 82, 82);
        rect(-4, -18, 6, 10);
        fill(playerColor);
        ellipse(-0, -22, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },
    {
      nam: "12g-beagle",
      FlT: "A single shot hunting shotgun",
      Typ: "shotgun",
      frM: "simi",
      dam: 18,
      acc: 0.2,
      rcl: 0,
      stb: 0,
      spd: 30,
      prc: 1,
      mag: 1,
      frt: 40,
      bpS: 10,
      rSp: 20,
      wgh: 2,
      dis: function () {
        fill(71, 71, 71);
        rect(-6, -20, 2, 24);
        //rect(-2,-20,3,24);
        fill(176, 91, 0);
        rect(-7, -18, 4, 10);
        fill(playerColor);
        ellipse(-3, -22, 5, 5);
        ellipse(-5, -13, 5, 5);
      },
    },
    {
      nam: "sawed off",
      FlT: "a modified DoB shotgun",
      Typ: "shotgun",
      frM: "manl",
      dam: 25,
      acc: 0.1,
      rcl: 0.11,
      stb: 0.03,
      spd: 30,
      prc: 1,
      mag: 2,
      frt: 5,
      bpS: 8,
      rSp: 5,
      wgh: 2,
      dis: function () {
        fill(71, 71, 71);
        rect(-6, -20, 3, 16);
        rect(-2, -20, 3, 16);
        fill(176, 91, 0);
        rect(-4, -18, 6, 10);
        fill(playerColor);
        ellipse(-0, -22, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },
    {
      nam: "The Suger",
      FlT: "I am fate",
      Typ: "shotgun",
      frM: "auto",
      dam: 30,
      acc: 0.3,
      rcl: 0.09,
      stb: 0.003,
      spd: 30,
      prc: 2,
      mag: 8,
      frt: 50,
      bpS: 6,
      rSp: 120,
      wgh: 2,
      dis: function () {
        fill(71, 71, 71);
        rect(-6, -20, 3, 24);
        fill(0, 0, 0);
        rect(-4, -18, 6, 10);
        fill(playerColor);
        ellipse(-0, -22, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },

    //snipers

    {
      nam: "hunting rifle",
      FlT: "An old deer rifle",
      Typ: "sniper",
      frM: "manl",
      dam: 110,
      acc: 0.85,
      rcl: 0.2,
      stb: 0.003,
      spd: 35,
      prc: 10,
      mag: 3,
      frt: 60,
      bpS: 1,
      rSp: 25,
      wgh: 3,
      dis: function () {
        fill(77, 76, 77);
        rect(-6, -20, 3, 34);
        fill(122, 65, 15);
        rect(-6, -20, 5, 10);
        fill(playerColor);
        ellipse(-3, -18, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },
    {
      nam: "Falcon .308",
      FlT: "Hunting rifle for large game",
      Typ: "sniper",
      frM: "simi",
      dam: 115,
      acc: 0.85,
      rcl: 0.3,
      stb: 0.003,
      spd: 35,
      prc: 10,
      mag: 5,
      frt: 50,
      bpS: 1,
      rSp: 150,
      wgh: 3,
      dis: function () {
        fill(64, 63, 64);
        rect(-6, -20, 3, 34);
        fill(87, 86, 87);
        rect(-6, -20, 5, 10);
        fill(playerColor);
        ellipse(-3, -18, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },
    {
      nam: "Ranger .50cal",
      FlT: "the rifle used by elite snipers",
      Typ: "sniper",
      frM: "manl",
      dam: 165,
      acc: 0.9,
      rcl: 0.4,
      stb: 0.003,
      spd: 35,
      prc: 10,
      mag: 7,
      frt: 50,
      bpS: 1,
      rSp: 20,
      wgh: 3,
      dis: function () {
        fill(0, 0, 0);
        rect(-6, -20, 3, 34);
        fill(128, 128, 128);
        rect(-6, -20, 5, 10);
        rect(-6, -38, 5, 3);
        fill(playerColor);
        ellipse(-3, -18, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },
    {
      nam: "mosK10",
      FlT: "Soviet sniper rifle",
      Typ: "sniper",
      frM: "auto",
      dam: 85,
      acc: 0.8,
      rcl: 0.15,
      stb: 0.003,
      spd: 35,
      prc: 10,
      mag: 5,
      frt: 30,
      bpS: 1,
      rSp: 100,
      wgh: 3,
      dis: function () {
        fill(64, 63, 64);
        rect(-6, -20, 2, 34);
        fill(191, 85, 10);
        rect(-6, -20, 3, 10);
        fill(playerColor);
        ellipse(-3, -18, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },
    {
      nam: "lever action",
      FlT: "An old rifle monogrammed A.M.",
      Typ: "sniper",
      frM: "manl",
      dam: 75,
      acc: 0.8,
      rcl: 0.3,
      stb: 0.003,
      spd: 35,
      prc: 10,
      mag: 5,
      frt: 10,
      bpS: 1,
      rSp: 20,
      wgh: 3,
      dis: function () {
        fill(64, 63, 64);
        rect(-6, -20, 4, 24);
        fill(87, 86, 87);
        rect(-6, -20, 5, 10);
        fill(playerColor);
        ellipse(-3, -18, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },
    {
      nam: "The Dragon",
      FlT: "",
      Typ: "sniper",
      frM: "auto",
      dam: 99,
      acc: 0.9,
      rcl: 0.15,
      stb: 0.003,
      spd: 35,
      prc: 10,
      mag: 20,
      frt: 40,
      bpS: 1,
      rSp: 100,
      wgh: 3,
      dis: function () {
        fill(38, 38, 38);
        rect(-6, -20, 3, 34);
        fill(168, 108, 5);
        rect(-6, -20, 5, 10);
        fill(playerColor);
        ellipse(-3, -18, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },

    //Heavy

    {
      nam: "Fang - 10",
      FlT: "",
      Typ: "heavy",
      frM: "auto",
      dam: 18,
      acc: 0.4,
      rcl: 0.03,
      stb: 0.003,
      spd: 30,
      prc: 1,
      mag: 100,
      frt: 6,
      bpS: 1,
      rSp: 200,
      wgh: 3,
      dis: function () {
        fill(11, 92, 11);
        rect(-8, -20, 10, 8);
        fill(71, 71, 71);
        rect(-6, -20, 3, 24);
        fill(176, 91, 0);
        rect(-6, -20, 5, 10);
        fill(playerColor);
        ellipse(-3, -22, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },
    {
      nam: "P23-Lion",
      FlT: "",
      Typ: "heavy",
      frM: "auto",
      dam: 25,
      acc: 0.4,
      rcl: 0.025,
      stb: 0.003,
      spd: 30,
      prc: 1,
      mag: 100,
      frt: 7,
      bpS: 1,
      rSp: 200,
      wgh: 3,
      dis: function () {
        fill(0, 0, 0);
        rect(-8, -20, 12, 6);
        fill(46, 46, 46);
        rect(-6, -20, 3, 24);
        fill(99, 98, 99);
        rect(-6, -20, 5, 10);
        fill(playerColor);
        ellipse(-3, -22, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },
    {
      nam: "N35 - Chaingun",
      FlT: "A hightech weapon with anti-recoil gyroscopes",
      Typ: "heavy",
      frM: "auto",
      dam: 19,
      acc: 0.5,
      rcl: -0.01,
      stb: 0.005,
      spd: 30,
      prc: 1,
      mag: 100,
      frt: 3,
      bpS: 1,
      rSp: 250,
      wgh: 3,
      dis: function () {
        if (subScene === "game") {
          p.wepAcc -= 0.001;
        }
        fill(71, 71, 71);
        rect(-6, -28, 2, 14);
        rect(-9, -28, 2, 14);
        fill(18, 18, 18);
        rect(-8, -20, 10, 8);
        rect(-8, -34, 7, 4);
        fill(18, 18, 18);
        rect(-6, -20, 5, 10);
        fill(playerColor);
        ellipse(-3, -22, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },
    {
      nam: "The hydra",
      FlT: "The beast",
      Typ: "heavy",
      frM: "auto",
      dam: 18,
      acc: 0.5,
      rcl: -0.01,
      stb: 0.005,
      spd: 30,
      prc: 1,
      mag: 500,
      frt: 2,
      bpS: 1,
      rSp: 250,
      wgh: 3.5,
      dis: function () {
        if (subScene === "game") {
          p.wepAcc -= 0.001;
        }
        fill(97, 97, 97);
        rect(-6, -28, 2, 12);
        rect(-9, -28, 2, 14);
        fill(61, 61, 61);
        rect(-8, -20, 10, 8);
        rect(-8, -34, 7, 4);
        fill(18, 18, 18);
        rect(-6, -20, 5, 18);
        fill(playerColor);
        ellipse(-3, -22, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },

    // Special weapons

    {
      nam: "the prototype",
      FlT: "4UMF",
      Typ: "Lazer",
      frM: "auto",
      dam: 28,
      acc: 0.9,
      rcl: 0.01,
      stb: 0.005,
      spd: 0,
      prc: 3,
      mag: 30,
      frt: 8,
      bpS: 1,
      rSp: 60,
      wgh: 1,
      dis: function () {
        fill(0, 0, 0);
        rect(-6, -20, 6, 10);
        fill(255, 0, 0);
        rect(-6, -20, 2, 24);
        fill(255, 0, 0, 100);
        rect(-6, -20, 4, 26, 2);
        fill(255, 0, 0, 50);
        rect(-6, -20, 4, 33, 5);
        fill(133, 116, 116);
        rect(-6, -25, 5, 3, 5);
        fill(playerColor);
        ellipse(-3, -18, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },

    {
      nam: "Grenade launcher",
      FlT: "Thump!",
      Typ: "rocket",
      frM: "simi",
      dam: 20,
      acc: 0.9,
      rcl: 0.08,
      stb: 0.003,
      spd: 30,
      prc: 1,
      mag: 100,
      frt: 20,
      bpS: 1,
      rSp: 50,
      wgh: 2,
      dis: function () {
        fill(61, 61, 61);
        rect(-6, -20, 5, 20);
        //rect(-2,-20,3,24);
        fill(38, 97, 27);
        rect(-4, -18, 6, 10);
        fill(playerColor);
        ellipse(-0, -22, 5, 5);
        ellipse(-7, -13, 5, 5);
      },
    },
    {
      nam: "Aimbot",
      FlT: "I'm reporting you!",
      Typ: "aimbot",
      frM: "auto",
      dam: 500,
      acc: 1,
      rcl: 0.0,
      stb: 0.003,
      spd: 35,
      prc: 0.1,
      mag: 100,
      frt: 5,
      bpS: 1,
      rSp: 2,
      wgh: 0.1,
      dis: function () {
        fill(87, 86, 87);
        rect(0, -20, 3, 10);
        fill(playerColor);
        ellipse(0, -15, 5, 5);
        ellipse(3, -15, 5, 5);
      },
    },

    {
      nam: "Void popper",
      FlT: "what?",
      Typ: "Lazer",
      frM: "auto",
      dam: 500,
      acc: -100.0,
      rcl: 0.0,
      stb: 0.0,
      spd: 10,
      prc: 0.1,
      mag: 50,
      frt: 10,
      bpS: 15,
      rSp: 80,
      wgh: 0,
      dis: function () {
        fill(234, 240, 51);
        rect(0, -20, 8, 8);
        fill(playerColor);
        ellipse(0, -15, 5, 5);
        ellipse(3, -15, 5, 5);
      },
    },
  ];

/* Player skins/models
   equModel - [ 0 - 13 ]
*/

var unLockedModels = [
  true,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
];
var equModel = 0;
var playerModel = [
  {
    name: "Default",
    hc: 0,
    display: function () {
      fill(playerColor);
      ellipse(0, 0, 20, 20);
      fill(0, 0, 0);
      rect(-3, -5, 2, 6);
      rect(3, -5, 2, 6);
    },
  },
  {
    name: "Dooms day preper",
    hc: 0,
    display: function () {
      fill(179, 149, 0);
      rect(0, 0 + 12, 20, 12, 6);
      fill(71, 58, 0);
      rect(0 - 5, 0 + 12, 3, 12, 6);
      rect(0 + 5, 0 + 12, 3, 12, 6);
      fill(playerColor);
      ellipse(0, 0, 20, 20);
      fill(0, 0, 0);
      rect(-3, -5, 2, 6);
      rect(3, -5, 2, 6);
    },
  },
  {
    name: "Bandit",
    hc: 0,
    display: function () {
      fill(playerColor);
      ellipse(0, 0, 20, 20);
      fill(230, 39, 71);
      triangle(8, -6, 0, -12, -8, -6);
      fill(playerColor);
      ellipse(0, -6, 10, 3);
      fill(0, 0, 0);
      rect(-3, -5, 2, 4);
      rect(3, -5, 2, 4);
    },
  },
  {
    name: "Marksman",
    hc: 0,
    display: function () {
      fill(playerColor);
      ellipse(0, 0, 20, 20);
      fill(0, 0, 0);
      rect(-3, -5, 2, 6);
      rect(3, -5, 2, 6);
      fill(107, 107, 107);
      rect(0, 2, 20, 3);
      fill(61, 61, 61);
      rect(10, 2, 5, 8, 3);
      rect(-10, 2, 5, 8, 3);
    },
  },
  {
    name: "Cop",
    hc: 0,
    display: function () {
      fill(playerColor);
      ellipse(0, 0, 20, 20);
      fill(0, 0, 0);
      rect(-3, -5, 2, 6);
      rect(3, -5, 2, 6);
      fill(94, 115, 199);
      rect(0, 4, 12, 10, 3);
      fill(20, 39, 110);
      ellipse(0, 8, 20, 10);
      fill(199, 167, 40);
      ellipse(0, 8, 3, 3);
    },
  },
  {
    name: "Game Warden",
    hc: 0,
    display: function () {
      fill(playerColor);
      ellipse(0, 0, 20, 20);
      fill(0, 0, 0);
      rect(-3, -5, 2, 6);
      rect(3, -5, 2, 6);
      fill(71, 163, 41);
      ellipse(0, 6, 18, 15);
      fill(66, 66, 66);
      ellipse(0, 8, 12, 13);
      fill(102, 204, 47);
      ellipse(0, 8, 10, 12);
      fill(76, 153, 29);
      ellipse(0, 8, 4, 10);
    },
  },
  {
    name: "CDC agent",
    hc: [255, 175, 15],
    display: function () {
      fill(255, 175, 15);
      ellipse(0, 0, 20, 20);
      fill(54, 53, 54);
      arc(0, 0, 20, 20, 180, 360);
      fill(138, 135, 138);
      rect(0, 0 + 5, 3, 10);
      fill(114, 224, 215);
      rect(0, 0 - 6, 8, 3);
      push();
      rotate1(40);
      fill(82, 82, 82);
      rect(0, 0 - 14, 7, 5);
      rect(0, 0 - 12, 3, 5);
      pop();
    },
  },
  {
    name: "SWAT",
    hc: 0,
    display: function () {
      fill(playerColor);
      ellipse(0, 0, 20, 20);
      fill(0, 0, 0);
      rect(-3, -5, 2, 6);
      rect(3, -5, 2, 6);
      fill(60, 64, 143);
      ellipse(0, 7, 19, 14);
      rect(9, 3, 5, 8, 4);
      rect(-9.5, 3, 5, 8, 4);
    },
  },
  {
    name: "Army",
    hc: 0,
    display: function () {
      fill(38, 135, 0);
      rect(0, 0 + 12, 20, 8, 6);
      fill(82, 204, 0);
      rect(0 - 5, 0 + 12, 3, 8, 6);
      rect(0 + 5, 0 + 12, 3, 8, 6);
      fill(43, 102, 0);
      rect(0, 0 + 16, 10, 3, 6);
      fill(playerColor);
      ellipse(0, 0, 20, 20);
      fill(0, 0, 0);
      rect(-3, -5, 2, 6);
      rect(3, -5, 2, 6);
      fill(30, 87, 15);
      ellipse(0, 4, 20, 15);
    },
  },
  {
    name: "Sniper",
    hc: 0,
    display: function () {
      fill(playerColor);
      ellipse(0, 0, 20, 20);
      fill(0, 0, 0);
      rect(-3, -5, 2, 6);
      rect(3, -5, 2, 6);
      fill(116, 130, 116);
      rect(0, 2, 20, 3);
      rect(-10, 2, 5, 8, 4);
      rect(10, 2, 5, 8, 4);
      fill(43, 92, 13);
      rect(0, 6, 15, 13, 6);
    },
  },
  {
    name: "Spec ops",
    hc: [138, 138, 138],
    display: function () {
      fill(97, 96, 97);
      ellipse(0, 0, 20, 20);
      fill(48, 48, 48);
      arc(0, 0, 20, 20, 180, 360);
      fill(56, 52, 56);
      rect(0, 0 + 5, 3, 10);
      fill(26, 25, 26);
      rect(0 - 5, 0 - 8, 5, 6);
      fill(26, 25, 26);
      rect(0 + 5, 0 - 8, 5, 6);
      fill(94, 255, 0);
      ellipse(0 + 5, 0 - 9.5, 5, 3);
      ellipse(0 - 5, 0 - 9.5, 5, 3);
      ellipse(0, 0 - 5.5, 5, 3);
    },
  },
  {
    name: "Spec ops HevWep",
    hc: 0,
    display: function () {
      fill(97, 97, 97);
      rect(0, 12, 20, 12, 6);
      fill(36, 36, 36);
      rect(-5, 12, 3, 12, 6);
      rect(5, 12, 3, 12, 6);
      fill(36, 36, 36);
      rect(-10, 11, 4, 9, 4);
      rect(10, 11, 4, 9, 4);
      rect(0, 19, 10, 4, 4);
      fill(playerColor);
      ellipse(0, 0, 20, 20);
      fill(0, 0, 0);
      rect(-3, -5, 2, 6);
      rect(3, -5, 2, 6);
      fill(122, 122, 122);
      rect(0, 0, 20, 3);
      fill(59, 59, 59);
      rect(-11, 0, 5, 8);
      rect(11, 0, 5, 8);
      fill(59, 59, 59);
      rect(10, -4, 2, 12);
    },
  },
  {
    name: "Spec ops sniper",
    hc: 0,
    display: function () {
      fill(115, 114, 110);
      rect(0, 0 + 12, 20, 8, 6);
      fill(0, 0, 0);
      rect(0 - 5, 0 + 12, 3, 8, 6);
      rect(0 + 5, 0 + 12, 3, 8, 6);
      fill(playerColor);
      ellipse(0, 0, 20, 20);
      fill(54, 53, 54);
      arc(0, 0, 20, 20, 180, 360);
      fill(138, 135, 138);
      rect(0, 0 + 5, 3, 10);
      fill(107, 107, 107);
      ellipse(0 - 3, 0 - 5, 4, 4);
      ellipse(0 + 3, 0 - 5, 4, 4);
      fill(114, 224, 215);
      ellipse(0 - 3, 0 - 5, 2, 5);
      ellipse(0 + 3, 0 - 5, 2, 5);
      push();
      rotate1(40);
      fill(82, 82, 82);
      rect(0, 0 - 14, 7, 5);
      rect(0, 0 - 12, 3, 5);
      pop();
      push();
      rotate1(-40);
      fill(82, 82, 82);
      rect(0, 0 - 14, 7, 5);
      rect(0, 0 - 12, 3, 5);
      pop();
    },
  },
  {
    name: "unit BR-90 Elite",
    hc: [138, 138, 138],
    display: function () {
      fill(97, 97, 97);
      rect(0, 10, 20, 12, 3);
      fill(36, 36, 36);
      rect(-5, 10, 3, 12, 2);
      rect(5, 10, 3, 12, 6);
      fill(36, 36, 36);
      rect(0, 17, 10, 4, 4);
      fill(138, 138, 138);
      ellipse(0, 0, 20, 20);
      fill(28, 28, 28);
      arc(0, 0, 20, 20, 180, 360);
      fill(56, 54, 56);
      rect(0, 0 + 5, 3, 10);
      fill(33, 255, 33);
      ellipse(0 - 4, 0 - 6, 5, 3);
      ellipse(0 + 4, 0 - 6, 5, 3);
      ellipse(0, -3, 5, 2);
      push();
      rotate1(40);
      fill(82, 82, 82);
      rect(0, 0 - 14, 7, 5);
      rect(0, 0 - 12, 3, 5);
      pop();
      push();
      rotate1(-40);
      fill(82, 82, 82);
      rect(0, 0 - 14, 7, 5);
      rect(0, 0 - 12, 3, 5);
      pop();
    },
  },
];

/*
    weapons for sale in shop
    
    id: index of weapon in wep array
    pr: price of weapon
    un: if the weapon is unlocked
*/
var wepShop = {
  pistols: [
    {
      id: 1,
      pr: 0,
      un: true,
    },
    {
      id: 2,
      pr: 0,
      un: false,
    },
    {
      id: 3,
      pr: 0,
      un: false,
    },
    {
      id: 4,
      pr: 0,
      un: false,
    },
    {
      id: 5,
      pr: 0,
      un: false,
    },
  ],
  smgs: [
    {
      id: 6,
      pr: 0,
      un: false,
    },
    {
      id: 7,
      pr: 0,
      un: false,
    },
    {
      id: 8,
      pr: 0,
      un: false,
    },
    {
      id: 9,
      pr: 0,
      un: false,
    },
    {
      id: 10,
      pr: 0,
      un: false,
    },
    {
      id: 11,
      pr: 0,
      un: false,
    },
  ],
  rifles: [
    {
      id: 12,
      pr: 0,
      un: false,
    },
    {
      id: 13,
      pr: 0,
      un: false,
    },
    {
      id: 14,
      pr: 0,
      un: false,
    },
    {
      id: 15,
      pr: 0,
      un: false,
    },
    {
      id: 16,
      pr: 0,
      un: false,
    },
  ],
  shotguns: [
    {
      id: 17,
      pr: 0,
      un: false,
    },
    {
      id: 18,
      pr: 0,
      un: false,
    },
    {
      id: 19,
      pr: 0,
      un: false,
    },
    {
      id: 20,
      pr: 0,
      un: false,
    },
    {
      id: 21,
      pr: 0,
      un: false,
    },
    {
      id: 22,
      pr: 0,
      un: false,
    },
  ],
  snipers: [
    {
      id: 23,
      pr: 0,
      un: false,
    },
    {
      id: 24,
      pr: 0,
      un: false,
    },
    {
      id: 25,
      pr: 0,
      un: false,
    },
    {
      id: 26,
      pr: 0,
      un: false,
    },
    {
      id: 27,
      pr: 0,
      un: false,
    },
    {
      id: 28,
      pr: 0,
      un: false,
    },
  ],
  heavywep: [
    {
      id: 29,
      pr: 0,
      un: false,
    },
    {
      id: 30,
      pr: 0,
      un: false,
    },
    {
      id: 31,
      pr: 0,
      un: false,
    },
    {
      id: 32,
      pr: 0,
      un: false,
    },
  ],
  Special: [
    {
      id: 33,
      pr: 0,
      un: false,
    },
    {
      id: 34,
      pr: 0,
      un: false,
    },
    {
      id: 35,
      pr: 0,
      un: false,
    },
    {
      id: 0,
      pr: 0,
      un: false,
    },
    {
      id: 36,
      pr: 0,
      un: false,
    },
    //   {id:0,pr:1,un:false},
  ],
};

// -================== items ===================-
var items = [
  {
    name: "money",
    onPickUp: function () {
      g.money += 10;
      stats.moneyEarned++;
    },
    display: function () {
      fill(26, 153, 20);
      rect(0, 0, 5, 8);
      fill(161, 255, 156);
      rect(0, 0, 5, 4);
    },
  },
  {
    name: "HealthKit",
    onPickUp: function () {
      p.health += 20;
    },
    display: function () {
      fill(158, 0, 0);
      rect(0, 0, 8, 8);
    },
  },
  {
    name: "gems",
    onPickUp: function () {
      g.gems++;
    },
    display: function () {
      fill(54, 135, 130);
      beginShape();
      vertex(-8, 0);
      vertex(-3, -4);
      vertex(3, -4);
      vertex(8, 0);
      vertex(0, 8);
      endShape();
      fill(16, 227, 213);
      beginShape();
      vertex(-6, 0);
      vertex(-2, -3);
      vertex(2, -3);
      vertex(6, 0);
      vertex(0, 6);
      endShape();
    },
  },
];

var rHint = 0;
var hints = [
  "Don’t forget to reload",
  "destroy crates to get the money inside",
  "New zombies appear on higher waves",
  "Use sprint to get out of sticky situations",
  "It's a good idea to switch to a sidearm if you need to flee",
  "You can push barrels around",
  "Pick the money up or it will disappear",
  "Spend money while you can, you lose it when you die.",
  "Golden zombies want hugs.",
  "Look out for flying goo balls",
  "You can save the game on the main menu",
  "Press [f] to use powerups",
  "you have a knife press [v] to use it",
];

// 3 5 10
// 2 4 12
// 1 8 11
// 9 7 13
// - 6
var achv = [
  {
    name: "Target partice",
    info: "Fire 100 bullets",
    lock: false,
    chek: function () {
      if (stats.bulletsShot >= 100) {
        return true;
      }
    },
    rewd: function () {
      unLockedModels[3] = true;
    },
  },
  {
    name: "Spray and pray",
    info: "Fire 1,000 bullets",
    lock: false,
    chek: function () {
      if (stats.bulletsShot >= 1000) {
        return true;
      }
    },
    rewd: function () {
      unLockedModels[5] = true;
    },
  },
  {
    name: "Bullet Storm",
    info: "Fire 10,000 bullets",
    lock: false,
    chek: function () {
      if (stats.bulletsShot >= 10000) {
        return true;
      }
    },
    rewd: function () {
      unLockedModels[10] = true;
    },
  },
  {
    name: "Killer",
    info: "Kill 20 zombies",
    lock: false,
    chek: function () {
      if (stats.ZombiesKilled >= 20) {
        return true;
      }
    },
    rewd: function () {
      unLockedModels[2] = true;
    },
  },
  {
    name: "Purger",
    info: "Kill 100 zombies",
    lock: false,
    chek: function () {
      if (stats.ZombiesKilled >= 100) {
        return true;
      }
    },
    rewd: function () {
      unLockedModels[4] = true;
    },
  },
  {
    name: "Annihilator",
    info: "Kill 1000 zombies",
    lock: false,
    chek: function () {
      if (stats.ZombiesKilled >= 1000) {
        return true;
      }
    },
    rewd: function () {
      unLockedModels[12] = true;
    },
  },
  {
    name: "Rich",
    info: "Earn 100$ and spend 50$",
    lock: false,
    chek: function () {
      if (stats.moneyEarned >= 100 && stats.moneySpent >= 50) {
        return true;
      }
    },
    rewd: function () {
      unLockedModels[1] = true;
    },
  },
  {
    name: "Money bags",
    info: "Earn 500$ and spend 250$",
    lock: false,
    chek: function () {
      if (stats.moneyEarned >= 500 && stats.moneySpent >= 250) {
        return true;
      }
    },
    rewd: function () {
      unLockedModels[8] = true;
    },
  },
  {
    name: "Tycoon",
    info: "Earn 2,500$ and spend 1,500$",
    lock: false,
    chek: function () {
      if (stats.moneyEarned >= 2500 && stats.moneySpent >= 1500) {
        return true;
      }
    },
    rewd: function () {
      unLockedModels[11] = true;
    },
  },
  {
    name: "Tough",
    info: "Survive 15 waves",
    lock: false,
    chek: function () {
      if (stats.highestWave >= 15) {
        return true;
      }
    },
    rewd: function () {
      unLockedModels[9] = true;
    },
  },
  {
    name: "Hardcore",
    info: "Survive 35 waves",
    lock: false,
    chek: function () {
      if (stats.highestWave >= 35) {
        return true;
      }
    },
    rewd: function () {
      unLockedModels[7] = true;
    },
  },
  {
    name: "Legendary",
    info: "Survive 65 waves",
    lock: false,
    chek: function () {
      if (stats.highestWave >= 65) {
        return true;
      }
    },
    rewd: function () {
      unLockedModels[13] = true;
    },
  },
  {
    name: "Failed",
    info: "Sad",
    lock: false,
    chek: function () {
      if (p.health <= 0 && g.wave <= 1) {
        return true;
      }
    },
    rewd: function () {},
  },
  {
    name: "Contaminated",
    info: "Sleep it off",
    lock: false,
    chek: function () {
      if (p.health <= 1 && g.wave % 2 === 0) {
        return true;
      }
    },
    rewd: function () {
      unLockedModels[6] = true;
    },
  },
  {
    name: "Balanced",
    info: "snap",
    lock: false,
    chek: function () {
      if (
        ~~p.health === ~~(p.healthMax / 2) &&
        ~~p.stamina === ~~(p.staminaMax / 2)
      ) {
        return true;
      }
    },
    rewd: function () {},
  },
  {
    name: "Savior",
    info: "Save the game",
    lock: false,
    chek: function () {
      if (saveCode !== "") {
        return true;
      }
    },
    rewd: function () {
      unLockedModels[6] = true;
    },
  },
  {
    name: "Lottery",
    info: "Be lucky",
    lock: false,
    chek: function () {
      if (random(0, 100000) === 1) {
        return true;
      }
    },
    rewd: function () {
      g.money += 10000;
    },
  },
  {
    name: "Is Tazal",
    info: "be Tazal",
    lock: false,
    chek: function () {
      if (false) {
        return true;
      }
    },
    rewd: function () {
      noLoop();
    },
  },
];

var knife = {
  delay: 0,
  timer: 0,
  angle: 0,
  x: 0,
  y: 0,
};

var clogo = function (r, g, b, r1, g1, b1, x, y, s) {
  strokeCap(SQUARE);

  for (var e = 0; e < 360; e += 120) {
    push();
    translate(x, y);
    scale(s);
    rotate1(e);
    fill(r1, g1, b1);
    ellipse(0, -100, 200, 200);
    fill(r, g, b);
    ellipse(0, -120, 150, 150);
    ellipse(0, -200, 30, 30);
    rect(0, -20, 10, 70);
    ellipse(300, 300, 50, 50);
    noFill();
    strokeWeight(25);
    stroke(r1, g1, b1);
    arc(0, 0, 180, 180, -122, -58);
    noStroke();
    fill(r, g, b);
    ellipse(0, 0, 50, 50);
    pop();
  }
};

/*
    maps
*/
// ====================================
var selmap = 2; //Selected map
var maps = [
  {
    size: 400,
    name: "Basic - Super Small",
    lock: true, //Unlocked
    display: function () {
      fill(61, 61, 61);
      rect(200, 200, 400, 400);
      fill(92, 64, 7);
      rect(200, 200, 370, 370);
    },
  },
  {
    size: 600,
    name: "Basic - Small",
    lock: true, //Unlocked
    display: function () {
      fill(61, 61, 61);
      rect(300, 300, 600, 600);
      fill(92, 64, 7);
      rect(300, 300, 570, 570);
      clogo(54, 54, 54, 43, 43, 43, 300, 320, 1.5);
    },
  },
  {
    size: 800,
    name: "Basic - Normal",
    lock: true, //Unlocked
    display: function () {
      fill(61, 61, 61);
      rect(400, 400, 800, 800);
      fill(92, 64, 7);
      rect(400, 400, 770, 770);
      clogo(92, 64, 7, 86, 56, 6, 400, 440, 2.1);
    },
  },
  {
    size: 1000,
    name: "Basic - big",
    lock: true, //Unlocked
    display: function () {
      fill(61, 61, 61);
      rect(500, 500, 1000, 1000);
      fill(92, 64, 7);
      rect(500, 500, 970, 970);
    },
  },
  /*
    {
        size:800,
        name:"test",
        lock:true,//Unlocked
        display:function(){
            fill(61, 61, 61);
            rect(500,500,1000,1000);
            fill(140, 140, 140);
            rect(500,500,970,970);
            fill(255, 0, 0);
            textSize(50);
            text("Wow, it works",400,400);
        }
    },
    */
];

var input = []; //stores user key input

// rectMode(CENTER);

var incodeArray = function (a) {
  if (a.length > 31) {
    console.log("Error:max array size");
    return;
  }
  var aa;
  for (var i in a) {
    aa = (aa << 1) | a[i];
  }
  return aa.toString(32) + "w" + a.length.toString(32);
};
var decodeSave = function (s) {
  var o = [];
  s = s.split("w", 2);
  for (var i = 0; i < parseInt(s[1], 32); i++) {
    o.unshift([false, true][(parseInt(s[0], 32) >> i) & 1]);
  }
  return o;
};

//Achv
//pistols
//smgs
//rifles
//shotguns
//snipers
//heavywep
//playerModels
// upgrades
/*
    bulletsShot  : 0,
    ZombiesKilled: 0,
    moneyEarned  : 0,
    moneySpent   : 0,
    highestWave  : 0,
*/

var getSave = function () {
  console.log("Save : ");
  var tSave = "";
  var _tempA = [];
  for (var i in achv) {
    _tempA[i] = achv[i].lock;
  }

  tSave += incodeArray(_tempA) + "z";
  _tempA = [];
  for (var i in wepShop.pistols) {
    _tempA.push(wepShop.pistols[i].un);
  }
  tSave += incodeArray(_tempA) + "z";
  _tempA = [];

  for (var i in wepShop.smgs) {
    _tempA.push(wepShop.smgs[i].un);
  }
  tSave += incodeArray(_tempA) + "z";
  _tempA = [];
  for (var i in wepShop.rifles) {
    _tempA.push(wepShop.rifles[i].un);
  }
  tSave += incodeArray(_tempA) + "z";
  _tempA = [];
  for (var i in wepShop.shotguns) {
    _tempA.push(wepShop.shotguns[i].un);
  }
  tSave += incodeArray(_tempA) + "z";
  _tempA = [];
  for (var i in wepShop.snipers) {
    _tempA.push(wepShop.snipers[i].un);
  }
  tSave += incodeArray(_tempA) + "z";

  _tempA = [];
  for (var i in wepShop.heavywep) {
    _tempA.push(wepShop.heavywep[i].un);
  }
  tSave += incodeArray(_tempA) + "z";

  _tempA = [];
  for (var i in wepShop.Special) {
    _tempA.push(wepShop.Special[i].un);
  }
  tSave += incodeArray(_tempA) + "z";

  tSave += incodeArray(unLockedModels) + "z";

  for (var i in shops.upgrades) {
    tSave += shops.upgrades[i].level.toString(32) + "z";
  }
  tSave += stats.bulletsShot.toString(32) + "z";
  tSave += stats.ZombiesKilled.toString(32) + "z";
  tSave += stats.moneyEarned.toString(32) + "z";
  tSave += stats.moneySpent.toString(32) + "z";
  tSave += stats.highestWave.toString(32) + "z";

  console.log(tSave);
};

//0wizgw5z0w6z0w5z0w6z0w6z0w4z800wez5z4z3z2z1z0z0z0z1kvz1z
var setSave = function (s) {
  s = s.split("z");
  var _tempA = decodeSave(s[0]);
  for (var i in achv) {
    achv[i].lock = _tempA[i];
  }

  var _tempA = decodeSave(s[1]);
  for (var i in wepShop.pistols) {
    wepShop.pistols[i].un = _tempA[i];
  }

  var _tempA = decodeSave(s[2]);
  for (var i in wepShop.smgs) {
    wepShop.smgs[i].un = _tempA[i];
  }
  var _tempA = decodeSave(s[3]);
  for (var i in wepShop.rifles) {
    wepShop.rifles[i].un = _tempA[i];
  }
  var _tempA = decodeSave(s[4]);
  for (var i in wepShop.shotguns) {
    wepShop.shotguns[i].un = _tempA[i];
  }
  var _tempA = decodeSave(s[5]);
  for (var i in wepShop.snipers) {
    wepShop.snipers[i].un = _tempA[i];
  }
  var _tempA = decodeSave(s[6]);
  for (var i in wepShop.heavywep) {
    wepShop.heavywep[i].un = _tempA[i];
  }
  var _tempA = decodeSave(s[7]);
  for (var i in wepShop.Special) {
    wepShop.Special[i].un = _tempA[i];
  }
  unLockedModels = decodeSave(s[8]);

  for (var i = 0; i < shops.upgrades.length; i++) {
    shops.upgrades[i].level = parseInt(s[i + 9], 32);
    if (shops.upgrades[i].level >= 1) {
      for (var j = 0; j < shops.upgrades[i].level; j++) {
        shops.upgrades[i].onBuy();
      }
    }
  }

  stats = {
    bulletsShot: parseInt(s[14], 32),
    ZombiesKilled: parseInt(s[15], 32),
    moneyEarned: parseInt(s[16], 32),
    moneySpent: parseInt(s[17], 32),
    highestWave: parseInt(s[18], 32),
  };

  // console.log(_tempA);
};
if (saveCode !== "") {
  setSave(saveCode);
}
//setSave("0wizvw5z1w6z1w5z0w6z0w6z0wiz5z4z3z2z9z0z0z0z4tvz1z");
//setSave("0wizgw5z0w6z0w5z0w6z0w6z800wez5z4z3z2z1z0z0z0z1kvz1z");
/*
    startGame
    Sets up game, resets values
*/
// ====================================
var startGame = function () {
  powerup = {
    delay: 5500,
    timer: 0,
  };
  g = {
    playerDie: false,
    gameTimer: 0,
    money: 0,
    gems: g.gems,
    wave: 0,
    waveTimer: 0,
    rumble: 0,
    hurt: 0,
    difMult: 1,
    waveTAdd: 1500,
    difIncr: 0.1,
  };
  entitys = [];
  bullets = [];
  otherEn = [];
  dropitm = [];
  particl = [];
  SceenPd = [];
  p.x = maps[selmap].size / 2;
  p.y = maps[selmap].size / 2;
  p.health = p.healthMax;
  p.stamina = p.staminaMax;
  p.equ = 0;
  subScene = "game";
  shopSubScene = "playerUpg";
  p.equWep = [1, 1];
  p.equWepMag = [0, 0];
  p.wepAcc = 0;
};

/*
    zombiespawnPoint
    returns spawn point for zombies
*/
var zombieSpawnPoint = function () {
  var zs = maps[selmap].size / 2;
  if (random() < 0.5) {
    return [
      zs + (zs + random(0, 200)) * (random() > 0.5 ? -1 : 1),
      random(0, zs * 2),
    ];
  } else {
    return [
      random(0, zs * 2),
      zs + (zs + random(0, 200)) * (random() > 0.5 ? -1 : 1),
    ];
  }
};
/* 
    Menu buttons
*/
// ====================================
var button = function (x, y, w, h, txt, ts) {
  noStroke();
  textAlign(CENTER, CENTER);
  if (ts !== undefined) {
    textSize(ts);
  } else {
    textSize(20);
  }
  if (
    !(MX >= x - w / 2 && MX <= x + w / 2 && MY >= y - h / 2 && MY <= y + h / 2)
  ) {
    //Display if mouse is NOT over button
    fill(219, 219, 219, 50);
    strokeWeight(5);
    stroke(0, 0, 0);
    rect(x, y, w, h);
    strokeWeight(2);
    stroke(140, 140, 140);
    rect(x, y, w - 5, h - 5);
    noFill();
    fill(0, 0, 0);
    fill(41, 41, 41);
    text(txt, x, y + ts / 10);
    fill(255, 255, 255);
    text(txt, x, y);
  } else {
    cursor("pointer"); //changes cursor display
    fill(173, 173, 173, 200);
    strokeWeight(5);
    stroke(0, 0, 0);
    rect(x, y, w, h);
    strokeWeight(2);
    stroke(140, 140, 140);
    rect(x, y, w - 5, h - 5);
    noFill();
    fill(0, 0, 0);
    fill(41, 41, 41);
    text(txt, x, y + ts / 10);
    fill(255, 255, 255);
    text(txt, x, y);
    noStroke();
    if (clicked) {
      return true;
    } else {
      return false;
    }
  }
  noStroke();
};
var slider = function (v, x, y, w, h, mi, mx, na) {
  fill(217, 217, 217);
  rect(x, y, w, h);
  fill(145, 145, 145);
  rect(
    constrain(+map(v, mi, mx, x - w / 2, x + w / 2), x - w / 2, x + w / 2),
    y,
    5,
    h
  );
  fill(0, 0, 0);
  text(na + ": " + v, x, y);
  if (
    mouseIsPressed &&
    MX >= x - w / 2 &&
    MY >= y - h / 2 &&
    MX <= x + w / 2 &&
    MY <= y + h / 2
  ) {
    return map(MX, x - w / 2, x + w / 2, mi, mx).toFixed(1);
  } else {
    return v;
  }
};

/* 
    Player function
    run & displays player
    handles playermath
*/
// ====================================
//Play movement function
var playerMovement = function () {
  //calcs the player speed
  var calcSpeed = p.speed - wep[p.equWep[p.equ]].wgh;

  //Sprinting
  if (
    input[16] &&
    p.stamina > 0 &&
    (input[65] || input[68] || input[83] || input[87])
  ) {
    p.stamina--;
    calcSpeed = p.speed * 2 - wep[p.equWep[p.equ]].wgh;
    p.staminaRegen = 0;
  } else {
    p.staminaRegen = constrain(p.staminaRegen + 0.01, 0, 5);
    if (p.staminaRegen > 1) {
      p.stamina = constrain(p.stamina + p.staminaRegen, 0, p.staminaMax);
    }
  }

  //WASD / Arrows movement

  if (input[UP] || input[87]) {
    p.y -= calcSpeed;
  } else if (input[DOWN] || input[83]) {
    p.y += calcSpeed;
  }
  if (input[RIGHT] || input[68]) {
    p.x += calcSpeed;
  } else if (input[LEFT] || input[65]) {
    p.x -= calcSpeed;
  }
};
//Displays the player ( xcord , ycord , angle )
var playerDisplay = function (x, y, a) {
  push();
  translate(x, y);
  rotate1(a);
  playerModel[equModel].display();
  pop();
};
var player = function () {
  p.health =
    g.hurt < 1
      ? constrain(p.health + p.healthRegen, -1, p.healthMax)
      : p.health;

  //keeps the player on the map
  p.x = constrain(p.x, 0, maps[selmap].size);
  p.y = constrain(p.y, 0, maps[selmap].size);

  p.angle = atan3(MY - 300, MX - 300) + 90; //gets angle

  //adjusts the cam
  cam.x += (p.x + (MX - 300) / 2 - cam.x) * camEasing;
  cam.y += (p.y + (MY - 300) / 2 - cam.y) * camEasing;

  playerMovement();
  push();
  translate(p.x, p.y);
  push();
  rotate1(p.angle);

  translate(0, g.rumble * 50);
  if (wepMath.reloadDelay > 0) {
    translate(0, 5);
    rotate1(18);
  }
  playerColor =
    playerModel[equModel].hc !== 0 ? playerModel[equModel].hc : playerColor;

  if (knife.timer === 0) {
    wep[p.equWep[p.equ]].dis();
  }
  pop();
  pop();

  playerDisplay(p.x, p.y, p.angle);
};

/* 
    Pointer/ weapon sights
*/
// ====================================
var rediDisplay = function () {
  noFill();
  push();
  translate(MX, MY);
  rotate1(p.angle);
  var ar = map(1 - p.wepAcc, 0, 1, 0, 72);
  strokeWeight(4);
  stroke(rediColorIvt);
  ellipse(0, 0, 5, 5);
  line(ar, 0, ar + 10, 0);
  line(0 - ar, 0, -ar - 10, 0);
  line(0, ar, 0, ar + 10);

  strokeWeight(2);
  stroke(rediColor);
  ellipse(0, 0, 5, 5);
  line(ar, 0, ar + 10, 0);
  line(0 - ar, 0, -ar - 10, 0);
  line(0, ar, 0, ar + 10);
  pop();

  strokeWeight(1);
  stroke(0, 0, 0);
};

/* 
    HUD / heads up display
    Displays useful info on screen
*/
// ====================================
var hud = function () {
  noStroke();
  textAlign(CENTER);
  rectMode(LEFT);
  textSize(15);

  if (p.equ === 0) {
    fill(201, 201, 201);
  } else {
    fill(200, 200, 200, 150);
  }

  var w = wep[p.equWep[0]];

  rect(10, 10, 50, 60);

  push();
  rectMode(CENTER);
  translate(35, 50);
  w.dis();
  playerDisplay(0, 0, 0);
  rectMode(LEFT);
  pop();

  if (p.equ === 1) {
    fill(201, 201, 201);
  } else {
    fill(200, 200, 200, 150);
  }

  w = wep[p.equWep[1]];

  rect(66, 10, 50, 60);

  push();
  rectMode(CENTER);
  translate(90, 50);
  w.dis();
  playerDisplay(0, 0, 0);
  rectMode(LEFT);
  pop();

  fill(201, 201, 201, 180);

  rect(122, 10, 50, 60);
  fill(214, 214, 214);
  rect(
    122,
    10,
    50,
    constrain(map(powerup.timer, 0, powerup.delay, 0, 60), 0, 60)
  );
  textSize(30);
  fill(74, 74, 74);
  // text(powerup.charg,145,50);
  textSize(15);

  fill(201, 201, 201, 150);

  rect(179, 10, 200, 25);

  //  stamina
  rect(390, 13, 200, 18);
  //  ammo
  rect(180, 48, 200, 18);

  //  sprint
  rect(390, 48, 200, 18);

  //Sprint

  fill(255, 0, 0, 200);
  rect(390, 10, constrain(map(p.health, 0, p.healthMax, 0, 200), 0, 200), 25);

  fill(0, 0, 0);
  text(~~p.health + "/" + p.healthMax, 490, 28);
  fill(255, 255, 255);
  text(~~p.health + "/" + p.healthMax, 490, 26);

  //Mag
  fill(217, 255, 0, 200);
  rect(
    180,
    45,
    map(p.equWepMag[p.equ], 0, wep[p.equWep[p.equ]].mag, 0, 200),
    25
  );

  textAlign(CENTER);
  fill(0, 0, 0);
  text(p.equWepMag[p.equ] === 0 ? "[r] to reload" : "", 280, 65);
  fill(255, 0, 0);
  text(p.equWepMag[p.equ] === 0 ? "[r] to reload" : "", 280, 63);

  stroke(0, 0, 0, 50);
  if (wep[p.equWep[p.equ]].mag < 100) {
    for (var i = 180; i < 380; i += 200 / wep[p.equWep[p.equ]].mag) {
      line(i, 45, i, 69);
    }
  }
  noStroke();
  if (wepMath.reloadDelay > 0) {
    w = wep[p.equWep[p.equ]];
    fill(168, 168, 168);
    rect(180, 70, map(wepMath.reloadDelay, w.rSp, 0, 0, 200), 5);
  }
  fill(21, 255, 0, 200);
  rect(390, 45, map(p.stamina, 0, p.staminaMax, 0, 200), 25);

  fill(0, 0, 0);
  text(~~p.stamina + "/" + p.staminaMax, 490, 64);
  fill(255, 255, 255);
  text(~~p.stamina + "/" + p.staminaMax, 490, 62);

  rectMode(CENTER);
  // stroke(0, 0, 0);
  textSize(12);
  textAlign(LEFT);
  fill(0, 0, 0);
  text(wep[p.equWep[p.equ]].nam, 186, 28);

  textAlign(RIGHT);
  fill(0, 0, 0);
  text(g.money + "$", 370, 28);

  textAlign(LEFT);
  fill(255, 255, 255);
  text(wep[p.equWep[p.equ]].nam, 186, 26);

  textAlign(RIGHT);
  fill(255, 255, 255);
  text(g.money + "$", 370, 26);

  textAlign(CENTER);
  /*
    ~~this.__frameRate+"\n"+
    wepMath.reloadDelay+"\n"+
    wepMath.fireDelay+"\n"+
    p.equWepMag[p.equ]+" / "+wep[p.equWep[p.equ]].mag+" \n"+
    entitys.length+" \n"+
    bullets.length+" \n"+
    p.wepAcc,
    */

  fill(255, 255, 255, 150);
  text("press [q] to open shop", 300, 540);
  textSize(10);
  text(
    "FPS:" +
      ~~this.__frameRate +
      " | particles:" +
      (particl.length + dropitm.length + SceenPd.length) +
      " | Entities:" +
      entitys.length +
      " | bullets:" +
      bullets.length,
    300,
    580
  );
  text("Wave:" + g.wave + " | waveTimer:" + g.waveTimer, 300, 560);

  for (var i in notif) {
    var ne = notif[i];
    var xm = ne.l;
    textSize(20);
    text(ne.m, 500, 575 + ne.l);
    textSize(15);
    text(ne.sm, 500, 590 + ne.l);
    ne.l += ne.l / 100;
    if (ne.l > 150) {
      notif.splice(i, 1);
    }
  }

  var tw_ = [
    wepShop.pistols,
    wepShop.smgs,
    wepShop.rifles,
    wepShop.shotguns,
    wepShop.snipers,
    wepShop.heavywep,
  ];
  for (var i in tw_) {
    var t_ = tw_[i];
    for (var j in t_) {
      var t__ = t_[j];
      if (!t__.un && t__.pr <= g.money) {
        shopcanbuy++;
      }
    }
  }
  if (shopcanbuy >= 1) {
    fill(255, 0, 0);
    ellipse(380, 12, 15, 15);
    textSize(10);
    fill(255, 255, 255);
    text(shopcanbuy, 380, 15);
  }
  shopcanbuy = 0;
  textAlign(LEFT);
};
/* 
    background display
*/
// ====================================

var mapDisplay = function () {
  maps[selmap].display();
};

/* 
    moving goo particle
    x,y : spawn cords
    a : angle
    s : speed
*/
// ====================================
var anGooParticle = function (x, y, a, s) {
  this.x = x;
  this.y = y;
  this.angle = a;
  this.s = s;
  this.angle = random(0, 180);
  this.dead = false;
  this.lifeTimer = 255;
  this.Size = random(3, 8);
};
anGooParticle.prototype.run = function () {
  this.x += this.s * cos1(this.angle);
  this.y += this.s * sin1(this.angle);

  this.lifeTimer -= 15.5 * particleDieTimer;
  if (this.lifeTimer < 0) {
    this.dead = true;
  }
};
anGooParticle.prototype.display = function () {
  push();
  translate(this.x, this.y);
  fill(113, 230, 55, this.lifeTimer);
  ellipse(0, 0, this.Size, this.Size);
  pop();
};
anGooParticle.prototype.isDead = function () {
  return this.dead;
};

/* 
    On ground goo particle
    x,y : spawn cords
*/
// ====================================
var gooParticle = function (x, y) {
  this.x = x;
  this.y = y;
  this.dead = false;
  this.lifeTimer = 355;
  this.Size = random(5, 10);
};
gooParticle.prototype.run = function () {
  this.lifeTimer -= 1 * particleDieTimer;
  if (this.lifeTimer < 0) {
    this.dead = true;
  }
  fill(113, 230, 55, this.lifeTimer);
  ellipse(this.x, this.y, this.Size, this.Size);
};

/* 
    On screen goo particle
    x,y : spawn cords
*/
// ====================================
var ScreenGooParticle = function (x, y) {
  this.x = x;
  this.y = y;
  this.dead = false;

  this.Size = random(70, 120);
  this.lifeTimer = 455 + this.Size;
};
ScreenGooParticle.prototype.run = function () {
  this.lifeTimer -= 1 * particleDieTimer;
  if (this.lifeTimer < 0) {
    this.dead = true;
  }
  this.abc = map(this.lifeTimer, 0, 455 + this.Size, 30, 0);
  fill(113, 230, 55, this.lifeTimer);
  ellipse(
    this.x,
    this.y + this.abc * 4,
    this.Size - this.abc * 1.5,
    this.Size + this.abc * 3
  );
};

/* 
    Boom particles
    cool particles
*/
// ====================================
var boomsparticle = function (x, y) {
  this.x = x;
  this.y = y;
  this.dead = false;
  this.timer = 0;
  this.t = 0;
  this.vx = random(-5, 5);
  this.vy = random(6, -6);
  this.s = random(10, 15);
};
boomsparticle.prototype.run = function () {
  this.y -= this.vy;
  this.x -= this.vx;
  this.vx *= 0.93;
  this.vy *= 0.93;
  this.timer += 2;
  if (this.timer > 255) {
    this.dead = true;
  }
  noStroke();
  fill(255, 119, 0, (255 - this.timer) / 2);
  ellipse(this.x, this.y, this.s, this.s);
};
var boomparticle = function (x, y) {
  this.x = x;
  this.y = y;
  this.dead = false;
  this.timer = 0;
  this.t = 0;
};
boomparticle.prototype.run = function () {
  this.timer += 2;
  if (this.timer > 100) {
    this.dead = true;
  }
  //fill(113, 230, 55,this.lifeTimer);

  if (this.timer < 45) {
    this.t += this.timer < 15 ? 20 : 0.1;
    stroke(158, 158, 158, 45 - this.timer);
    strokeWeight(8);
    noFill();
    ellipse(this.x, this.y, this.t, this.t);
  }
  if (this.timer > 15 && this.timer < 25) {
    noStroke();
    fill(158, 158, 158, 200);
    ellipse(this.x, this.y, 50, 50);
    particl.push(new boomsparticle(this.x, this.y));
    particl.push(new boomsparticle(this.x, this.y));
    particl.push(new boomsparticle(this.x, this.y));
  }
  if (this.timer > 25) {
    stroke(158, 158, 158, 60 - this.timer);
    strokeWeight(15);
    noFill();
    ellipse(this.x, this.y, (this.timer - 25) * 10, (this.timer - 25) * 10);
  }
  noStroke();
};

/* 
    crateParticle
    On ground wood particle
    x,y : spawn cords
*/
// ====================================
var crateParticle = function (x, y) {
  this.x = x;
  this.y = y;
  this.dead = false;
  this.angle = random(0, 180);
  this.lifeTimer = 355;
  this.Size = random(8, 20);
};
crateParticle.prototype.run = function () {
  this.lifeTimer -= 1 * particleDieTimer;
  if (this.lifeTimer < 0) {
    this.dead = true;
  }
  push();
  translate(this.x, this.y);
  rotate1(this.angle);
  fill(176, 106, 0, this.lifeTimer);
  rect(0, 0, 5, this.Size);
  pop();
};

/* 
 
 */
// ====================================
{
  var Grenade = function (x, y, tx, ty) {
    this.x = x;
    this.y = y;
    this.tx = tx;
    this.ty = ty;
    this.dead = false;
    this.fuse = 200;
    this.r = random(0, 180);
  };
  Grenade.prototype.run = function () {
    this.x += (this.tx - this.x) * 0.1;
    this.y += (this.ty - this.y) * 0.1;
    this.r += 0.1;
    this.fuse--;
    if (this.x < -100 || this.x > 900 || this.y < -100 || this.y > 900) {
      this.dead = true;
    }

    if (this.fuse <= 0) {
      this.dead = true;
      particl.push(new boomparticle(this.x, this.y));
      for (var i = entitys.length - 1; i >= 0; i--) {
        var te = entitys[i];
        if (dist(te.x, te.y, this.x, this.y) < 150) {
          te.life -= 80;
          particl.push(
            new gooParticle(te.x + random(-20, 20), te.y + random(-20, 20))
          );
          particl.push(
            new gooParticle(te.x + random(-20, 20), te.y + random(-20, 20))
          );
          particl.push(
            new gooParticle(te.x + random(-20, 20), te.y + random(-20, 20))
          );
          particl.push(
            new gooParticle(te.x + random(-20, 20), te.y + random(-20, 20))
          );
        }
      }
      g.rumble += 15;
      if (dist(this.x, this.y, p.x, p.y) < 150) {
        p.health -= 30;
        g.hurt = 100;
      }
    }
  };
  Grenade.prototype.display = function () {
    push();
    translate(this.x, this.y);
    rotate1(this.r);
    fill(9, 38, 4);
    rect(0, -7, 5, 7);
    fill(15, 69, 20);
    ellipse(0, 0, 12, 12);

    pop();
  };
  Grenade.prototype.isDead = function () {
    return this.dead;
  };
}

/* 
    Weapon bullet shell particle
    x,y : spawn x,y
    a : angle
*/
// ====================================
var shell = function (x, y, a) {
  this.x = x;
  this.y = y;
  this.angle = a;
  this.dead = false;
  this.lifeTimer = 255;
  this.Size = random(5, 10);
  this.velocity = random(1.5, 2.5);
  this.xx = 0;
  this.yy = 5;
};
shell.prototype.run = function () {
  this.lifeTimer -= 1 * particleDieTimer;
  this.xx += this.velocity;
  this.yy += random(-this.velocity / 2, this.velocity / 2);
  this.velocity *= 0.95;
  if (this.lifeTimer < 0) {
    this.dead = true;
  }
  fill(245, 202, 32, this.lifeTimer);
  push();
  translate(this.x, this.y);
  rotate1(this.angle);
  translate(this.xx, this.yy);
  rect(0, 0, 3, 8);
  pop();
};

/* 
    Zombie spit balls
    x,y : spawn x,y
    a : angle
*/
// ====================================
{
  var spit = function (x, y, a) {
    this.x = x;
    this.y = y;
    this.angle = a + 90;
    this.dead = false;
    this.dist = 0;
  };
  spit.prototype.run = function () {
    this.x += 5.5 * cos1(this.angle);
    this.y += 5.5 * sin1(this.angle);
    this.dist = dist(p.x, p.y, this.x, this.y);
    if (this.dist < 20) {
      this.dead = true;
      p.health -= 8 * (1 + d.difMult) * p.defense;
      g.hurt = 100;
      SceenPd.push(new ScreenGooParticle(random(0, 600), random(0, 600)));
      SceenPd.push(new ScreenGooParticle(random(0, 600), random(0, 600)));
      SceenPd.push(new ScreenGooParticle(random(0, 600), random(0, 600)));
      SceenPd.push(new ScreenGooParticle(random(0, 600), random(0, 600)));
    }
    if (this.x < -100 || this.x > 900 || this.y < -100 || this.y > 900) {
      this.dead = true;
    }
    if (~~this.dist % 2 === 0 && !laggy) {
      otherEn.push(
        new anGooParticle(
          this.x,
          this.y,
          this.angle - 90 + random(-2, 2),
          random(1, 2)
        )
      );
    }
  };
  spit.prototype.display = function () {
    push();
    translate(this.x, this.y);

    fill(47, 255, 0);
    ellipse(0, 0, 15, 15);
    fill(208, 255, 196);
    ellipse(0, 0, 10, 10);

    pop();
  };
  spit.prototype.isDead = function () {
    return this.dead;
  };
}
// ====================================
/*
    item -
    item entity, items are entitys that spawn on the ground
    items can be collect by a player to run a function
    x,y - spawn cords
    i - item id ( index in the items array )
    
*/
var item = function (x, y, i) {
  this.x = x + random(-20, 20);
  this.y = y + random(-20, 20);
  this.angle = random(0, 180);
  this.dead = false;
  this.lifeTimer = 1000;
  this.i = i;
};
item.prototype.run = function () {
  this.lifeTimer--;

  if (dist(p.x, p.y, this.x, this.y) < 30) {
    this.x -= (this.x - p.x) * 0.1;
    this.y -= (this.y - p.y) * 0.1;

    if (dist(p.x, p.y, this.x, this.y) < 10) {
      this.dead = true;
      items[this.i].onPickUp();
      return;
    }
  }
  if (this.lifeTimer < 0) {
    this.dead = true;
  }

  push();
  translate(this.x, this.y);
  rotate1(this.angle);
  items[this.i].display();
  pop();
};

/* 
    exlposive barrel entity
    explodes when damaged
    x,y : spawn x,y
*/
// ====================================
{
  var barrel = function (x, y, a) {
    this.x = x;
    this.y = y;
    this.v = 0;
    this.angle = 0;
    this.dead = false;
    this.life = 55;
  };
  barrel.prototype.run = function () {
    this.x += this.v * cos1(this.angle);
    this.y += this.v * sin1(this.angle);
    this.v *= 0.9;
    if (dist(this.x, this.y, p.x, p.y) < 20 && this.v < 0.5) {
      this.angle = atan3(this.y - p.y, this.x - p.x);

      this.v = 6;
    }
    if (this.life >= 50) {
      for (var i = bullets.length - 1; i >= 0; i--) {
        var tb = bullets[i];
        if (dist(tb.x, tb.y, this.x, this.y) <= 20) {
          this.life -= random(1, 7);
          this.v = 3;
          this.angle = tb.angle;
          return;
        }
      }
    } else {
      this.life--;
      if (this.life <= 0) {
        this.dead = true;
        particl.push(new boomparticle(this.x, this.y));
        for (var i = entitys.length - 1; i >= 0; i--) {
          var te = entitys[i];
          if (dist(te.x, te.y, this.x, this.y) < 150) {
            te.life -= 80;
            particl.push(
              new gooParticle(te.x + random(-20, 20), te.y + random(-20, 20))
            );
            particl.push(
              new gooParticle(te.x + random(-20, 20), te.y + random(-20, 20))
            );
            particl.push(
              new gooParticle(te.x + random(-20, 20), te.y + random(-20, 20))
            );
            particl.push(
              new gooParticle(te.x + random(-20, 20), te.y + random(-20, 20))
            );
          }
        }
        g.rumble += 15;
        if (dist(this.x, this.y, p.x, p.y) < 150) {
          p.health -= (150 - dist(this.x, this.y, p.x, p.y)) / 5;
          g.hurt = 100;
        }
        return;
      }
    }
  };
  barrel.prototype.display = function () {
    push();
    translate(this.x, this.y);
    if (this.life < 50) {
      translate(random(-5, 5), random(-5, 5));
    }
    fill(255, 79, 79);
    ellipse(0, 0, 25, 25);
    fill(255, 0, 0);
    ellipse(0, 0, 20, 20);

    pop();
  };
  barrel.prototype.isDead = function () {
    return this.dead;
  };
}
/* 
    Crate
    A crate that drops money when destoryied
    x,y : spawn x,y
*/
// ====================================
{
  var crate = function (x, y, a) {
    this.x = x;
    this.y = y;
    this.v = 0;
    this.angle = random(0, 180);
    this.dead = false;
    this.life = 50;
  };
  crate.prototype.run = function () {
    this.x += this.v * cos1(this.angle);
    this.y += this.v * sin1(this.angle);
    this.v *= 0.9;
    if (dist(this.x, this.y, p.x, p.y) < 20) {
      this.angle = atan3(this.y - p.y, this.x - p.x);
      this.v = 3;
    }
    if (knife.timer > 0 && dist(this.x, this.y, knife.x, knife.y) < 20) {
      this.life = 0;
    }
    if (this.life >= 50) {
      for (var i = bullets.length - 1; i >= 0; i--) {
        var tb = bullets[i];
        if (dist(tb.x, tb.y, this.x, this.y) <= 20) {
          this.life = 0;
          return;
        }
      }
    } else {
      this.life--;
      if (this.life <= 0) {
        this.dead = true;
        for (var i = 0; i < 15; i++) {
          particl.push(
            new crateParticle(
              this.x + random(-20, 20),
              this.y + random(-20, 20)
            )
          );
        }
        for (var j = 0; j <= round(random(5, 20)); j++) {
          dropitm.push(new item(this.x, this.y, 0));
        }
        return;
      }
    }
  };
  crate.prototype.display = function () {
    push();
    translate(this.x, this.y);
    rotate1(this.angle);
    fill(204, 173, 47);
    rect(0, 0, 20, 20);
    fill(214, 188, 83);
    rect(0, 0, 14, 14);

    fill(191, 172, 97);
    rect(-3, 0, 2, 14);
    rect(2, 0, 2, 14);

    pop();
  };
  crate.prototype.isDead = function () {
    return this.dead;
  };
}
/* 
    bullet entity
    runs/displays bullets the player has spawned
    x,y : spawn x,y
    a : angle
    s : speed
    d : damge
    p : pircing
*/
// ====================================
{
  var bullet = function (x, y, a, s, d, p) {
    this.x = x;
    this.y = y;
    this.damage = d;
    this.speed = s;
    this.angle = a + 90;
    this.pirc = p;
    this.dead = false;
  };
  bullet.prototype.run = function () {
    this.x += this.speed * cos1(this.angle);
    this.y += this.speed * sin1(this.angle);
    if (dist(p.x, p.y, this.x, this.y) > 600 || this.pirc <= 0) {
      this.dead = true;
    }
  };
  bullet.prototype.display = function () {
    push();
    translate(this.x, this.y);
    rotate1(this.angle - 90);
    fill(217, 200, 13);
    rect(0, 0, 6, 20, 4);
    fill(255, 255, 255);
    rect(0, 0, 3, 15, 1);
    pop();
  };
  bullet.prototype.isDead = function () {
    return this.dead;
  };

  {
    var bullet1 = function (x, y, a, s, d, p) {
      this.x = x;
      this.y = y;
      this.damage = d;
      this.speed = -s;
      this.angle = a + 90;
      this.pirc = p;
      this.dead = false;
    };
    bullet1.prototype.run = function () {
      this.speed += 1;
      this.x += this.speed * cos1(this.angle);
      this.y += this.speed * sin1(this.angle);
      if (dist(p.x, p.y, this.x, this.y) > 600 || this.pirc <= 0) {
        this.dead = true;
      }
    };
    bullet1.prototype.display = function () {
      push();
      translate(this.x, this.y);
      rotate1(this.angle - 90);
      fill(217, 13, 54);
      rect(0, 0, 6, 20, 4);
      fill(255, 255, 255);
      rect(0, 0, 3, 15, 1);
      pop();
    };
    bullet1.prototype.isDead = function () {
      return this.dead;
    };
  }

  {
    var bullet2 = function (x, y, a, s, d, p) {
      this.x = x;
      this.y = y;
      this.damage = d;
      this.speed = s;
      this.angle = a + 90;
      this.pirc = p;
      this.dead = false;
    };
    bullet2.prototype.run = function () {
      this.speed = constrain(this.speed - 2, 0, 100);
      this.x += this.speed * cos1(this.angle);
      this.y += this.speed * sin1(this.angle);
      if (
        dist(p.x, p.y, this.x, this.y) > 600 ||
        this.pirc <= 0 ||
        this.speed <= 0
      ) {
        this.dead = true;
      }
    };
    bullet2.prototype.display = function () {
      push();
      translate(this.x, this.y);
      rotate1(this.angle - 90);
      fill(40, 92, 27);
      ellipse(0, 0, 10, 30);
      fill(42, 138, 37);
      ellipse(0, 0, 5, 25);
      pop();
    };
    bullet2.prototype.isDead = function () {
      if (this.dead) {
        particl.push(new boomparticle(this.x, this.y));
        for (var i = entitys.length - 1; i >= 0; i--) {
          var te = entitys[i];
          if (dist(te.x, te.y, this.x, this.y) < 150) {
            te.life -= 80;
            particl.push(
              new gooParticle(te.x + random(-20, 20), te.y + random(-20, 20))
            );
            particl.push(
              new gooParticle(te.x + random(-20, 20), te.y + random(-20, 20))
            );
            particl.push(
              new gooParticle(te.x + random(-20, 20), te.y + random(-20, 20))
            );
            particl.push(
              new gooParticle(te.x + random(-20, 20), te.y + random(-20, 20))
            );
          }
        }
        g.rumble += 15;
      }
      return this.dead;
    };
  }

  var bullet3 = function (x, y, a, s, d, P) {
    this.x = x;
    this.y = y;
    this.damage = d;
    this.speed = s;
    this.angle = a + 90;
    this.pirc = P;
    this.dead = false;

    var u = entitys;
    u.sort(function (av, bv) {
      return dist(av.x, av.y, p.x, p.y) - dist(bv.x, bv.y, p.x, p.y);
    });
    this.a = u[0];
    this.angle = atan3(u[0].y - p.y, u[0].x - p.x);
  };
  bullet3.prototype.run = function () {
    //   this.anglea = atan3(this.a.y - this.y,  this.a.x - this.x);

    //    this.angle=this.anglea;
    //(this.anglea-this.angle)*0.5;

    this.x += this.speed * cos1(this.angle);
    this.y += this.speed * sin1(this.angle);
    if (dist(p.x, p.y, this.x, this.y) > 600 || this.pirc <= 0) {
      this.dead = true;
    }
  };
  bullet3.prototype.display = function () {
    push();
    translate(this.x, this.y);
    rotate1(this.angle - 90);
    fill(217, 200, 13);
    rect(0, 0, 6, 20, 4);
    fill(255, 255, 255);
    rect(0, 0, 3, 15, 1);
    pop();
  };
  bullet3.prototype.isDead = function () {
    return this.dead;
  };
}
// ====================================

/*
    Zombie entities
    zombies ai and display
*/
// ====================================
{
  //normal zombie
  {
    var normalZombie = function () {
      this.id = ~~random(0, 10000000); //gives the zombie a random id
      var spwn = zombieSpawnPoint();
      this.x = spwn[0];
      this.y = spwn[1];
      this.angle = random(0, 180);
      this.life = 50 * d.difMult;
      this.stun = 1;
      this.speed = 0.6;
      this.size = 20;
      this.moneyDrop = 1;
    };
    normalZombie.prototype.run = function () {
      if (dist(this.x, this.y, p.x, p.y) < this.size) {
        p.health -= 1 * p.defense;
        g.hurt = 100;
      }

      this.stun -= this.stun > 1 ? 1 : 0;

      var zspd = this.speed * (1 / this.stun);

      this.angle = atan3(p.y - this.y, p.x - this.x);
      this.x += zspd * cos1(this.angle);
      this.y += zspd * sin1(this.angle);

      for (var i = bullets.length - 1; i >= 0; i--) {
        var tb = bullets[i];
        if (dist(tb.x, tb.y, this.x, this.y) <= 30) {
          this.life -= tb.damage;

          for (var j = 0; j < 3; j++) {
            particl.push(
              new gooParticle(
                this.x + random(-20, 20),
                this.y + random(-20, 20)
              )
            );
            otherEn.push(
              new anGooParticle(
                this.x,
                this.y,
                tb.angle + random(-2, 2),
                random(1, 2)
              )
            );
          }

          tb.pirc--;
          this.stun = 10;
        }
      }

      if (g.gameTimer & 1) {
        for (var i = entitys.length - 1; i >= 0; i--) {
          var te = entitys[i];
          if (
            this.id !== te.id &&
            dist(te.x, te.y, this.x, this.y) < this.size / 2 + te.size / 2
          ) {
            var tzangle = atan3(this.y - te.y, this.x - te.x);
            this.x += zspd * 2 * cos1(tzangle);
            this.y += zspd * 2 * sin1(tzangle);
          }
        }
      }
    };
    normalZombie.prototype.display = function () {
      push();

      translate(this.x, this.y);
      rotate1(this.angle + 90);
      fill(58, 112, 49);
      ellipse(0, 0, 20, 20);
      ellipse(7, -13, 5, 5);
      ellipse(-7, -13, 5, 5);
      fill(255, 0, 0);
      rect(-3, -5, 2, 6);
      rect(3, -5, 2, 6);

      pop();
    };
  }

  //Spit zombie
  {
    var spitZombie = function () {
      this.id = ~~random(0, 10000000); //gives the zombie a random id
      var spwn = zombieSpawnPoint();
      this.x = spwn[0];
      this.y = spwn[1];
      this.angle = random(0, 180);
      this.life = 100 * d.difMult;
      this.stun = 1;
      this.speed = 0.8;
      this.size = 30;
      this.attackTimer = 0;
      this.moneyDrop = 4;
    };
    spitZombie.prototype.run = function () {
      if (dist(this.x, this.y, p.x, p.y) < this.size) {
        p.health--;
        g.hurt = 100;
      }
      this.stun -= this.stun > 1 ? 1 : 0;
      var zspd = this.speed * (1 / this.stun);
      if (dist(this.x, this.y, p.x, p.y) < 300 && this.stun < 5) {
        this.attackTimer++;
      } else {
        this.attackTimer = 0;
      }

      this.angle = atan3(p.y - this.y, p.x - this.x);
      if (dist(this.x, this.y, p.x, p.y) > 200) {
        this.x += zspd * cos1(this.angle);
        this.y += zspd * sin1(this.angle);
      }

      if (this.attackTimer === 180) {
        otherEn.push(new spit(this.x, this.y, this.angle - 90));
        this.attackTimer = 0;
      }
      for (var i = bullets.length - 1; i >= 0; i--) {
        var tb = bullets[i];
        if (dist(tb.x, tb.y, this.x, this.y) <= this.size) {
          this.life -= tb.damage;

          for (var j = 0; j < 3; j++) {
            particl.push(
              new gooParticle(
                this.x + random(-20, 20),
                this.y + random(-20, 20)
              )
            );
            otherEn.push(
              new anGooParticle(
                this.x,
                this.y,
                tb.angle + random(-2, 2),
                random(1, 2)
              )
            );
          }

          tb.pirc--;
          this.stun = 20;
        }
      }
      if (g.gameTimer & 1) {
        for (var i = entitys.length - 1; i >= 0; i--) {
          var te = entitys[i];
          if (
            this.id !== te.id &&
            dist(te.x, te.y, this.x, this.y) < this.size / 2 + te.size / 2
          ) {
            var tzangle = atan3(this.y - te.y, this.x - te.x);
            this.x += zspd * 2 * cos1(tzangle);
            this.y += zspd * 2 * sin1(tzangle);
          }
        }
      }
    };
    spitZombie.prototype.display = function () {
      push();

      translate(this.x, this.y);
      rotate1(this.angle + 90);
      fill(49, 255, 13);
      ellipse(
        0,
        0,
        25,
        20 + (this.attackTimer > 0 ? map(this.attackTimer, 0, 100, 0, 5) : 0)
      );
      ellipse(9, -14, 6, 6);
      ellipse(-9, -14, 6, 6);
      fill(255, 0, 0);
      rect(-4, -6, 2, 7);
      rect(4, -6, 2, 7);

      pop();
    };
  }

  //Alpha spitter zombie
  {
    var alphaspitZombie = function () {
      this.id = ~~random(0, 10000000); //gives the zombie a random id
      var spwn = zombieSpawnPoint();
      this.x = spwn[0];
      this.y = spwn[1];
      this.angle = random(0, 180);
      this.life = 200 * d.difMult;
      this.stun = 1;
      this.speed = 0.8;
      this.size = 30;
      this.attackTimer = 0;
      this.moneyDrop = 4;
    };
    alphaspitZombie.prototype.run = function () {
      if (dist(this.x, this.y, p.x, p.y) < this.size) {
        p.health--;
        g.hurt = 100;
      }

      this.stun -= this.stun > 1 ? 1 : 0;
      var zspd = this.speed * (1 / this.stun);

      if (dist(this.x, this.y, p.x, p.y) < 300 && this.stun < 5) {
        this.attackTimer++;
      } else {
        this.attackTimer = 0;
      }

      if (this.attackTimer < 80) {
        this.angle = atan3(p.y - this.y, p.x - this.x);
      }
      if (dist(this.x, this.y, p.x, p.y) > 150) {
        this.x += zspd * cos1(this.angle);
        this.y += zspd * sin1(this.angle);
      }

      if (this.attackTimer > 80 && this.attackTimer % 10 === 0) {
        otherEn.push(new spit(this.x, this.y, this.angle - 120));
        //otherEn.push(new spit(this.x,this.y,this.angle-90));
        otherEn.push(new spit(this.x, this.y, this.angle - 60));

        if (this.attackTimer > 100) {
          this.attackTimer = 0;
        }
      }
      for (var i = bullets.length - 1; i >= 0; i--) {
        var tb = bullets[i];
        if (dist(tb.x, tb.y, this.x, this.y) <= this.size) {
          this.life -= tb.damage;

          for (var j = 0; j < 3; j++) {
            particl.push(
              new gooParticle(
                this.x + random(-20, 20),
                this.y + random(-20, 20)
              )
            );
            otherEn.push(
              new anGooParticle(
                this.x,
                this.y,
                tb.angle + random(-2, 2),
                random(1, 2)
              )
            );
          }

          tb.pirc--;
          this.stun = 20;
        }
      }
      if (g.gameTimer & 1) {
        for (var i = entitys.length - 1; i >= 0; i--) {
          var te = entitys[i];
          if (
            this.id !== te.id &&
            dist(te.x, te.y, this.x, this.y) < this.size / 2 + te.size / 2
          ) {
            var tzangle = atan3(this.y - te.y, this.x - te.x);
            this.x += zspd * 2 * cos1(tzangle);
            this.y += zspd * 2 * sin1(tzangle);
          }
        }
      }
    };
    alphaspitZombie.prototype.display = function () {
      push();

      translate(this.x, this.y);
      rotate1(this.angle + 90);
      fill(49, 255, 13);
      ellipse(
        0,
        0,
        35,
        30 + (this.attackTimer > 0 ? map(this.attackTimer, 0, 100, 0, 5) : 0)
      );
      ellipse(9, -14, 6, 6);
      ellipse(-9, -14, 6, 6);
      fill(255, 0, 0);
      rect(-4, -6, 2, 7);
      rect(4, -6, 2, 7);

      pop();
    };
  }

  //baby zombie
  {
    var babyZombie = function (x, y) {
      this.id = ~~random(0, 10000000); //gives the zombie a random id
      this.x = x; //300 + 400*round(random(-1,1));
      this.y = y; //300 + 400*round(random(-1,1));
      this.angle = random(0, 180);
      this.life = 40 * d.difMult;
      this.stun = 1;
      this.speed = 0.9;
      this.size = 10;
      this.moneyDrop = 0;
    };
    babyZombie.prototype.run = function () {
      if (dist(this.x, this.y, p.x, p.y) < this.size) {
        p.health -= 1 * p.defense;
        g.hurt = 100;
      }

      this.stun -= this.stun > 1 ? 1 : 0;

      var zspd = this.speed * (1 / this.stun);

      this.angle = atan3(p.y - this.y, p.x - this.x);
      this.x += zspd * cos1(this.angle);
      this.y += zspd * sin1(this.angle);

      for (var i = bullets.length - 1; i >= 0; i--) {
        var tb = bullets[i];
        if (dist(tb.x, tb.y, this.x, this.y) <= 30) {
          this.life -= tb.damage;
          tb.pirc--;

          particl.push(
            new gooParticle(this.x + random(-20, 20), this.y + random(-20, 20))
          );

          this.stun = 10;
        }
      }

      if (g.gameTimer & 1) {
        for (var i = entitys.length - 1; i >= 0; i--) {
          var te = entitys[i];
          if (
            this.id !== te.id &&
            dist(te.x, te.y, this.x, this.y) < this.size / 2 + te.size / 2
          ) {
            var tzangle = atan3(this.y - te.y, this.x - te.x);
            this.x += zspd * 2 * cos1(tzangle);
            this.y += zspd * 2 * sin1(tzangle);
          }
        }
      }
    };
    babyZombie.prototype.display = function () {
      push();

      translate(this.x, this.y);
      rotate1(this.angle + 90);
      fill(101, 209, 65);
      ellipse(0, 0, 15, 15);
      ellipse(8, -14, 6, 6);
      ellipse(-8, -14, 6, 6);
      fill(255, 0, 0);
      rect(-3, -3, 2, 4);
      rect(3, -3, 2, 4);

      pop();
    };
  }

  //mother zombie
  {
    var momZombie = function () {
      this.id = ~~random(0, 10000000); //gives the zombie a random id
      var spwn = zombieSpawnPoint();
      this.x = spwn[0];
      this.y = spwn[1];
      this.angle = random(0, 180);
      this.life = 400 * d.difMult;
      this.stun = 1;
      this.speed = 0.8;
      this.size = 40;
      this.attackTimer = 0;
      this.moneyDrop = 10;
    };
    momZombie.prototype.run = function () {
      this.stun -= this.stun > 1 ? 1 : 0;
      var zspd = this.speed * (1 / this.stun);
      if (dist(this.x, this.y, p.x, p.y) < this.size) {
        p.health -= 1 * p.defense;
        g.hurt = 100;
      }

      if (
        entitys.length < 20 &&
        (dist(this.x, this.y, p.x, p.y) < 200 || this.attackTimer > 1)
      ) {
        this.attackTimer++;
      } else {
        this.attackTimer = 0;
      }

      this.angle = atan3(p.y - this.y, p.x - this.x);

      if (dist(this.x, this.y, p.x, p.y) > 200 && this.attackTimer < 1) {
        this.x += zspd * cos1(this.angle);
        this.y += zspd * sin1(this.angle);
      }

      if (this.attackTimer === 250) {
        entitys.push(new babyZombie(this.x, this.y));
        entitys.push(new babyZombie(this.x, this.y));
        entitys.push(new babyZombie(this.x, this.y));
        this.attackTimer = 0;
      }

      for (var i = bullets.length - 1; i >= 0; i--) {
        var tb = bullets[i];
        if (dist(tb.x, tb.y, this.x, this.y) <= this.size) {
          this.life -= tb.damage;

          for (var j = 0; j < 3; j++) {
            particl.push(
              new gooParticle(
                this.x + random(-20, 20),
                this.y + random(-20, 20)
              )
            );
            otherEn.push(
              new anGooParticle(
                this.x,
                this.y,
                tb.angle + random(-2, 2),
                random(1, 2)
              )
            );
          }
          tb.pirc--;
          this.stun = 10;
        }
      }
      if (g.gameTimer & 1) {
        for (var i = entitys.length - 1; i >= 0; i--) {
          var te = entitys[i];
          if (
            this.id !== te.id &&
            dist(te.x, te.y, this.x, this.y) < this.size / 2 + te.size / 2
          ) {
            var tzangle = atan3(this.y - te.y, this.x - te.x);
            this.x += zspd * 2 * cos1(tzangle);
            this.y += zspd * 2 * sin1(tzangle);
          }
        }
      }
    };
    momZombie.prototype.display = function () {
      push();

      translate(this.x, this.y);
      rotate1(this.angle + 90);
      fill(36, 61, 32);
      ellipse(
        0,
        0,
        30,
        30 +
          (this.attackTimer > 0
            ? map(this.attackTimer - 200, 0, 300, 0, 10)
            : 0)
      );
      ellipse(12, -18, 6, 6);
      ellipse(-12, -18, 6, 6);
      fill(255, 0, 0);
      rect(-5, -6, 2, 7);
      rect(5, -6, 2, 7);

      pop();
    };
  }

  //charger zombie
  {
    var chargeZombie = function () {
      this.id = ~~random(0, 10000000); //gives the zombie a random id
      var spwn = zombieSpawnPoint();
      this.x = spwn[0];
      this.y = spwn[1];
      this.angle = random(0, 180);
      this.life = 300 * d.difMult;
      this.stun = 1;
      this.speed = 1;
      this.size = 20;
      this.attackTimer = 0;
      this.moneyDrop = 6;
    };
    chargeZombie.prototype.run = function () {
      var zspd = this.speed;
      if (dist(this.x, this.y, p.x, p.y) < this.size) {
        p.health -= 1 * p.defense;
        g.hurt = 100;
      }
      if (this.attackTimer === 0) {
        this.angle = atan3(p.y - this.y, p.x - this.x);
        this.x += zspd * cos1(this.angle);
        this.y += zspd * sin1(this.angle);
      }

      if (dist(this.x, this.y, p.x, p.y) < 200 || this.attackTimer !== 0) {
        this.attackTimer++;
      }

      if (this.attackTimer > 20) {
        zspd =
          this.speed *
          map(120 - this.attackTimer, 0, 100, 0, 5) *
          (1 / this.stun);
        this.x += zspd * cos1(this.angle);
        this.y += zspd * sin1(this.angle);
      }

      if (this.attackTimer > 120) {
        this.attackTimer = 0;
      }

      for (var i = bullets.length - 1; i >= 0; i--) {
        var tb = bullets[i];
        if (dist(tb.x, tb.y, this.x, this.y) <= 30) {
          this.life -= tb.damage;
          tb.pirc--;

          for (var j = 0; j < 3; j++) {
            particl.push(
              new gooParticle(
                this.x + random(-20, 20),
                this.y + random(-20, 20)
              )
            );
            otherEn.push(
              new anGooParticle(
                this.x,
                this.y,
                tb.angle + random(-2, 2),
                random(1, 2)
              )
            );
          }
        }
      }

      if (g.gameTimer & 1 && this.attackTimer < 20) {
        for (var i = entitys.length - 1; i >= 0; i--) {
          var te = entitys[i];
          if (
            this.id !== te.id &&
            dist(te.x, te.y, this.x, this.y) < this.size / 2 + te.size / 2
          ) {
            var tzangle = atan3(this.y - te.y, this.x - te.x);
            this.x += zspd * 2 * cos1(tzangle);
            this.y += zspd * 2 * sin1(tzangle);
          }
        }
      }
    };
    chargeZombie.prototype.display = function () {
      push();

      translate(this.x, this.y);
      rotate1(this.angle + 90);
      fill(63, 138, 2);
      ellipse(0, 0, 30, 30);
      ellipse(12, -18, 6, 6);
      ellipse(-12, -18, 6, 6);
      fill(255, 0, 0);
      rect(-5, -6, 2, 7);
      rect(5, -6, 2, 7);
      pop();
    };
  }

  //vomit zombie
  {
    var vomitZombie = function () {
      this.id = ~~random(0, 10000000); //gives the zombie a random id
      var spwn = zombieSpawnPoint();
      this.x = spwn[0];
      this.y = spwn[1];
      this.angle = random(0, 180);
      this.life = 120 * d.difMult;
      this.stun = 1;
      this.speed = 0.8;
      this.size = 30;
      this.attackTimer = 0;
      this.moneyDrop = 5;
    };
    vomitZombie.prototype.run = function () {
      this.stun -= this.stun > 1 ? 1 : 0;
      var zspd = this.speed * (1 / this.stun);
      if (dist(this.x, this.y, p.x, p.y) < this.size) {
        p.health -= 1 * p.defense;
        g.hurt = 100;
      }

      if (dist(this.x, this.y, p.x, p.y) < 150 || this.attackTimer > 1) {
        this.attackTimer++;
      } else {
        this.attackTimer = 0;
      }
      if (this.attackTimer === 0) {
        this.angle = atan3(p.y - this.y, p.x - this.x);
      }

      if (dist(this.x, this.y, p.x, p.y) > 150 && this.attackTimer === 0) {
        this.x += zspd * cos1(this.angle);
        this.y += zspd * sin1(this.angle);
      }

      if (this.attackTimer > 80) {
        otherEn.push(
          new spit(this.x, this.y, this.angle - 90 + random(-20, 20))
        );
      }
      if (this.attackTimer > 90) {
        this.attackTimer = 0;
        this.life = 0;
        for (var j = 0; j < 30; j++) {
          particl.push(
            new gooParticle(this.x + random(-50, 50), this.y + random(-50, 50))
          );
        }
      }
      for (var i = bullets.length - 1; i >= 0; i--) {
        var tb = bullets[i];
        if (dist(tb.x, tb.y, this.x, this.y) <= this.size) {
          this.life -= tb.damage;
          tb.pirc--;
          for (var j = 0; j < 3; j++) {
            particl.push(
              new gooParticle(
                this.x + random(-20, 20),
                this.y + random(-20, 20)
              )
            );
            otherEn.push(
              new anGooParticle(
                this.x,
                this.y,
                tb.angle + random(-2, 2),
                random(1, 2)
              )
            );
          }
          this.stun = 10;
        }
      }
      if (g.gameTimer & 1) {
        for (var i = entitys.length - 1; i >= 0; i--) {
          var te = entitys[i];
          if (
            this.id !== te.id &&
            dist(te.x, te.y, this.x, this.y) < this.size / 2 + te.size / 2
          ) {
            var tzangle = atan3(this.y - te.y, this.x - te.x);
            this.x += zspd * 2 * cos1(tzangle);
            this.y += zspd * 2 * sin1(tzangle);
          }
        }
      }
    };
    vomitZombie.prototype.display = function () {
      push();

      translate(this.x, this.y);
      rotate1(this.angle + 90);
      fill(
        153,
        20 + (this.attackTimer > 0 ? map(this.attackTimer, 0, 90, 0, 100) : 0),
        142
      );
      ellipse(
        0,
        0,
        30 + (this.attackTimer > 0 ? map(this.attackTimer, 0, 90, 0, 10) : 0),
        30 + (this.attackTimer > 0 ? map(this.attackTimer, 0, 90, 0, 10) : 0)
      );
      ellipse(12, -18, 6, 6);
      ellipse(-12, -18, 6, 6);
      fill(255, 0, 0);
      rect(-5, -6, 2, 7);
      rect(5, -6, 2, 7);
      pop();
    };
  }

  {
    var splatterZombie = function () {
      this.id = ~~random(0, 10000000); //gives the zombie a random id
      var spwn = zombieSpawnPoint();
      this.x = spwn[0];
      this.y = spwn[1];
      this.angle = random(0, 180);
      this.life = 80 * d.difMult;
      this.stun = 1;
      this.speed = 1.3;
      this.size = 20;
      this.attackTimer = 0;
      this.moneyDrop = 5;
    };
    splatterZombie.prototype.run = function () {
      this.stun -= this.stun > 1 ? 1 : 0;
      var zspd = this.speed * (1 / this.stun);

      if (dist(this.x, this.y, p.x, p.y) < 50 || this.attackTimer > 1) {
        this.attackTimer += 3;
      } else {
        this.attackTimer = 0;
      }
      if (this.attackTimer === 0) {
        this.angle = atan3(p.y - this.y, p.x - this.x);
      }

      if (this.attackTimer === 0) {
        this.x += zspd * cos1(this.angle);
        this.y += zspd * sin1(this.angle);
      }

      if (dist(this.x, this.y, p.x, p.y) < this.size && this.attackTimer < 30) {
        p.health -= 1 * p.defense;
        g.hurt = 100;
      }

      if (this.attackTimer > 30 && this.attackTimer < 40) {
        this.size = 80;
        this.life = 1000;
      }
      if (this.attackTimer > 40) {
        this.attackTimer = 0;
        this.life = 0;
        for (var j = 0; j < 10; j++) {
          if (dist(this.x, this.y, p.x, p.y) < 110) {
            SceenPd.push(new ScreenGooParticle(random(0, 600), random(0, 600)));
            SceenPd.push(new ScreenGooParticle(random(0, 600), random(0, 600)));
            SceenPd.push(new ScreenGooParticle(random(0, 600), random(0, 600)));
          }
          particl.push(
            new gooParticle(this.x + random(-50, 50), this.y + random(-50, 50))
          );

          particl.push(
            new gooParticle(this.x + random(-50, 50), this.y + random(-50, 50))
          );
        }
      }
      for (var i = bullets.length - 1; i >= 0; i--) {
        var tb = bullets[i];
        if (dist(tb.x, tb.y, this.x, this.y) <= this.size) {
          this.life -= tb.damage;
          tb.pirc--;
          for (var j = 0; j < 3; j++) {
            particl.push(
              new gooParticle(
                this.x + random(-20, 20),
                this.y + random(-20, 20)
              )
            );
            otherEn.push(
              new anGooParticle(
                this.x,
                this.y,
                tb.angle + random(-2, 2),
                random(1, 2)
              )
            );
          }
          this.stun = 10;
        }
      }
      if (g.gameTimer & 1) {
        for (var i = entitys.length - 1; i >= 0; i--) {
          var te = entitys[i];
          if (
            this.id !== te.id &&
            dist(te.x, te.y, this.x, this.y) < this.size / 2 + te.size / 2
          ) {
            var tzangle = atan3(this.y - te.y, this.x - te.x);
            this.x += zspd * 2 * cos1(tzangle);
            this.y += zspd * 2 * sin1(tzangle);
          }
        }
      }
    };
    splatterZombie.prototype.display = function () {
      push();

      translate(this.x, this.y);
      rotate1(this.angle + 90);
      fill(
        123,
        20 + (this.attackTimer > 0 ? map(this.attackTimer, 0, 40, 0, 100) : 0),
        142
      );
      ellipse(
        0,
        0,
        20 + (this.attackTimer > 0 ? map(this.attackTimer, 0, 40, 0, 10) : 0),
        20 + (this.attackTimer > 0 ? map(this.attackTimer, 0, 40, 0, 10) : 0)
      );
      ellipse(7, -13, 5, 5);
      ellipse(-7, -13, 5, 5);
      fill(255, 0, 0);
      rect(-3, -5, 2, 6);
      rect(3, -5, 2, 6);
      pop();
    };
  }

  {
    var splatterSpawnZombie = function () {
      this.id = ~~random(0, 10000000); //gives the zombie a random id
      var spwn = zombieSpawnPoint();
      this.x = spwn[0];
      this.y = spwn[1];
      this.angle = random(0, 180);
      this.life = 80 * d.difMult;
      this.stun = 1;
      this.speed = 1.2;
      this.size = 20;
      this.attackTimer = 0;
      this.moneyDrop = 5;
    };
    splatterSpawnZombie.prototype.run = function () {
      this.stun -= this.stun > 1 ? 1 : 0;
      var zspd = this.speed * (1 / this.stun);

      if (dist(this.x, this.y, p.x, p.y) < 50 || this.attackTimer > 1) {
        this.attackTimer++;
      } else {
        this.attackTimer = 0;
      }
      if (this.attackTimer === 0) {
        this.angle = atan3(p.y - this.y, p.x - this.x);
      }

      if (this.attackTimer === 0) {
        this.x += zspd * cos1(this.angle);
        this.y += zspd * sin1(this.angle);
      }

      if (dist(this.x, this.y, p.x, p.y) < this.size && this.attackTimer < 30) {
        p.health -= 1 * p.defense;
        g.hurt = 100;
      }

      if (this.attackTimer > 30 && this.attackTimer < 40) {
        this.size = 80;
        this.life = 1000;
      }
      if (this.attackTimer > 40) {
        this.attackTimer = 0;
        this.life = 0;
        for (var j = 0; j < 10; j++) {
          entitys.push(
            new babyZombie(this.x + random(-50, 50), this.y + random(-50, 50))
          );
          particl.push(
            new gooParticle(this.x + random(-50, 50), this.y + random(-50, 50))
          );
          particl.push(
            new gooParticle(this.x + random(-50, 50), this.y + random(-50, 50))
          );
        }
      }
      for (var i = bullets.length - 1; i >= 0; i--) {
        var tb = bullets[i];
        if (dist(tb.x, tb.y, this.x, this.y) <= this.size) {
          this.life -= tb.damage;
          tb.pirc--;
          for (var j = 0; j < 3; j++) {
            particl.push(
              new gooParticle(
                this.x + random(-20, 20),
                this.y + random(-20, 20)
              )
            );
            otherEn.push(
              new anGooParticle(
                this.x,
                this.y,
                tb.angle + random(-2, 2),
                random(1, 2)
              )
            );
          }
          this.stun = 10;
        }
      }
      if (g.gameTimer & 1) {
        for (var i = entitys.length - 1; i >= 0; i--) {
          var te = entitys[i];
          if (
            this.id !== te.id &&
            dist(te.x, te.y, this.x, this.y) < this.size / 2 + te.size / 2
          ) {
            var tzangle = atan3(this.y - te.y, this.x - te.x);
            this.x += zspd * 2 * cos1(tzangle);
            this.y += zspd * 2 * sin1(tzangle);
          }
        }
      }
    };
    splatterSpawnZombie.prototype.display = function () {
      push();

      translate(this.x, this.y);
      rotate1(this.angle + 90);
      fill(
        120,
        84 + (this.attackTimer > 0 ? map(this.attackTimer, 0, 40, 0, 100) : 0),
        42
      );
      ellipse(
        0,
        0,
        20 + (this.attackTimer > 0 ? map(this.attackTimer, 0, 40, 0, 10) : 0),
        20 + (this.attackTimer > 0 ? map(this.attackTimer, 0, 40, 0, 10) : 0)
      );
      ellipse(7, -13, 5, 5);
      ellipse(-7, -13, 5, 5);
      fill(255, 0, 0);
      rect(-3, -5, 2, 6);
      rect(3, -5, 2, 6);
      pop();
    };
  }

  {
    var blingZombie = function () {
      this.id = ~~random(0, 10000000); //gives the zombie a random id
      var spwn = zombieSpawnPoint();
      this.x = spwn[0];
      this.y = spwn[1];
      this.angle = random(0, 180);
      this.life = 20 * d.difMult;
      this.stun = 1;
      this.speed = 1.2;
      this.size = 20;
      this.attackTimer = 0;
      this.moneyDrop = 0;
    };
    blingZombie.prototype.run = function () {
      this.stun -= this.stun > 1 ? 1 : 0;
      var zspd = this.speed * (1 / this.stun);

      if (dist(this.x, this.y, p.x, p.y) < 50 || this.attackTimer > 1) {
        this.attackTimer++;
      } else {
        this.attackTimer = 0;
      }
      if (this.attackTimer === 0) {
        this.angle = atan3(p.y - this.y, p.x - this.x);
      }

      if (this.attackTimer === 0) {
        this.x += zspd * cos1(this.angle);
        this.y += zspd * sin1(this.angle);
      }

      if (this.attackTimer > 30 && this.attackTimer < 40) {
        this.size = 80;
        this.life = 1000;
      }
      if (this.attackTimer > 40) {
        this.attackTimer = 0;
        this.life = 0;
        for (var j = 0; j < 10; j++) {
          dropitm.push(
            new item(this.x + random(-50, 50), this.y + random(-50, 50), 0)
          );
          dropitm.push(
            new item(this.x + random(-50, 50), this.y + random(-50, 50), 0)
          );
          dropitm.push(
            new item(this.x + random(-50, 50), this.y + random(-50, 50), 0)
          );
          particl.push(
            new gooParticle(this.x + random(-50, 50), this.y + random(-50, 50))
          );
          particl.push(
            new gooParticle(this.x + random(-50, 50), this.y + random(-50, 50))
          );
        }
      }
      for (var i = bullets.length - 1; i >= 0; i--) {
        var tb = bullets[i];
        if (dist(tb.x, tb.y, this.x, this.y) <= this.size) {
          this.life -= tb.damage;
          tb.pirc--;
          for (var j = 0; j < 3; j++) {
            particl.push(
              new gooParticle(
                this.x + random(-20, 20),
                this.y + random(-20, 20)
              )
            );
            otherEn.push(
              new anGooParticle(
                this.x,
                this.y,
                tb.angle + random(-2, 2),
                random(1, 2)
              )
            );
          }
          this.stun = 10;
        }
      }
      if (g.gameTimer & 1) {
        for (var i = entitys.length - 1; i >= 0; i--) {
          var te = entitys[i];
          if (
            this.id !== te.id &&
            dist(te.x, te.y, this.x, this.y) < this.size / 2 + te.size / 2
          ) {
            var tzangle = atan3(this.y - te.y, this.x - te.x);
            this.x += zspd * 2 * cos1(tzangle);
            this.y += zspd * 2 * sin1(tzangle);
          }
        }
      }
    };
    blingZombie.prototype.display = function () {
      push();

      translate(this.x, this.y);
      rotate1(this.angle + 90);
      fill(
        168,
        161 + (this.attackTimer > 0 ? map(this.attackTimer, 0, 40, 0, 100) : 0),
        20
      );
      ellipse(
        0,
        0,
        20 + (this.attackTimer > 0 ? map(this.attackTimer, 0, 40, 0, 10) : 0),
        20 + (this.attackTimer > 0 ? map(this.attackTimer, 0, 40, 0, 10) : 0)
      );
      ellipse(7, -13, 5, 5);
      ellipse(-7, -13, 5, 5);
      fill(255, 0, 0);
      rect(-3, -5, 2, 6);
      rect(3, -5, 2, 6);
      pop();
    };
  }

  {
    var metalZombie = function () {
      this.id = ~~random(0, 10000000); //gives the zombie a random id
      var spwn = zombieSpawnPoint();
      this.x = spwn[0];
      this.y = spwn[1];
      this.angle = random(0, 180);
      this.life = 800 * d.difMult;
      this.stun = 1;
      this.speed = 0.6;
      this.size = 30;
      this.moneyDrop = 1;
    };
    metalZombie.prototype.run = function () {
      if (dist(this.x, this.y, p.x, p.y) < this.size) {
        p.health -= 1 * p.defense;
        g.hurt = 100;
      }

      this.stun -= this.stun > 1 ? 1 : 0;

      var zspd = this.speed * (1 / this.stun);

      this.angle = atan3(p.y - this.y, p.x - this.x);
      this.x += zspd * cos1(this.angle);
      this.y += zspd * sin1(this.angle);

      for (var i = bullets.length - 1; i >= 0; i--) {
        var tb = bullets[i];
        if (dist(tb.x, tb.y, this.x, this.y) <= 30) {
          this.life -= tb.damage;

          particl.push(
            new gooParticle(this.x + random(-20, 20), this.y + random(-20, 20))
          );

          if (random(0, 100) > 10) {
            tb.speed *= 0.7;
            tb.angle = atan3(this.y - tb.y, this.x - tb.x) + 180;
          } else {
            tb.pirc--;
          }
          this.stun = 10;
        }
      }

      if (g.gameTimer & 1) {
        for (var i = entitys.length - 1; i >= 0; i--) {
          var te = entitys[i];
          if (
            this.id !== te.id &&
            dist(te.x, te.y, this.x, this.y) < this.size / 2 + te.size / 2
          ) {
            var tzangle = atan3(this.y - te.y, this.x - te.x);
            this.x += zspd * 2 * cos1(tzangle);
            this.y += zspd * 2 * sin1(tzangle);
          }
        }
      }
    };
    metalZombie.prototype.display = function () {
      push();

      translate(this.x, this.y);
      rotate1(this.angle + 90);
      fill(177, 194, 174);
      ellipse(0, 0, 30, 30);
      ellipse(7, -13, 10, 5);
      ellipse(-7, -13, 10, 5);
      fill(255, 0, 0);
      rect(-3, -5, 2, 6);
      rect(3, -5, 2, 6);

      pop();
    };
  }

  {
    var theZombie = function () {
      this.id = ~~random(0, 10000000); //gives the zombie a random id
      var spwn = zombieSpawnPoint();
      this.x = spwn[0];
      this.y = spwn[1];
      this.angle = random(0, 180);
      this.life = 2000 * d.difMult;
      this.stun = 1;
      this.speed = 1.0;
      this.size = 20;
      this.moneyDrop = 1;
      this.dies = stats.ZombiesKilled;
      this.attackTimer = 0;
    };
    theZombie.prototype.run = function () {
      if (stats.ZombiesKilled - this.dies > 2) {
        this.dies = stats.ZombiesKilled;
        //this.life = this.lifeo;
        for (var i = 0; i < 5; i++) {
          otherEn.push(new spit(this.x, this.y, random(0, 360)));
        }
      }
      var zspd = this.speed;
      if (dist(this.x, this.y, p.x, p.y) < this.size) {
        p.health -= 1 * p.defense;
        g.hurt = 100;
      }
      if (this.attackTimer === 0) {
        this.angle = atan3(p.y - this.y, p.x - this.x);
        this.x += zspd * cos1(this.angle);
        this.y += zspd * sin1(this.angle);
      }

      if (dist(this.x, this.y, p.x, p.y) < 150 || this.attackTimer !== 0) {
        this.attackTimer++;
      }

      if (this.attackTimer > 20) {
        zspd =
          this.speed *
          map(120 - this.attackTimer, 0, 100, 0, 8) *
          (1 / this.stun);
        this.x += zspd * cos1(this.angle);
        this.y += zspd * sin1(this.angle);
        if (dist(this.x, this.y, p.x, p.y) < this.size) {
          p.health -= 10 * p.defense;
          g.hurt = 100;
        }
      }

      if (this.attackTimer > 80) {
        entitys.push(new babyZombie(this.x, this.y));
        entitys.push(new babyZombie(this.x, this.y));
        this.attackTimer = 0;
      }

      for (var i = bullets.length - 1; i >= 0; i--) {
        var tb = bullets[i];
        if (dist(tb.x, tb.y, this.x, this.y) <= 30) {
          this.life -= tb.damage;
          tb.pirc--;

          for (var j = 0; j < 3; j++) {
            particl.push(
              new gooParticle(
                this.x + random(-20, 20),
                this.y + random(-20, 20)
              )
            );
            otherEn.push(
              new anGooParticle(
                this.x,
                this.y,
                tb.angle + random(-2, 2),
                random(1, 2)
              )
            );
          }
        }
      }

      if (g.gameTimer & 1 && this.attackTimer < 20) {
        for (var i = entitys.length - 1; i >= 0; i--) {
          var te = entitys[i];
          if (
            this.id !== te.id &&
            dist(te.x, te.y, this.x, this.y) < this.size / 2 + te.size / 2
          ) {
            var tzangle = atan3(this.y - te.y, this.x - te.x);
            this.x += zspd * 2 * cos1(tzangle);
            this.y += zspd * 2 * sin1(tzangle);
          }
        }
      }
    };
    theZombie.prototype.display = function () {
      push();

      translate(this.x, this.y);
      rotate1(this.angle + 90);

      fill(224, 160, 92);
      ellipse(7, -13, 5, 5);
      ellipse(-7, -13, 5, 5);
      ellipse(0, 0, 20, 20);
      fill(54, 53, 54);
      arc(0, 0, 20, 20, 180, 360);
      fill(138, 135, 138);
      rect(0, 0 + 5, 3, 10);
      fill(133, 48, 48);
      rect(0, 0 - 6, 8, 3);
      push();
      rotate1(40);
      fill(82, 82, 82);
      rect(0, 0 - 14, 7, 5);
      rect(0, 0 - 12, 3, 5);
      pop();

      pop();
    };
  }
}
// ====================================

/*
    waves - 
    zombie/entity spawn patterns and delays
*/
var waves = function () {
  g.waveTimer--;
  if ((g.waveTimer <= 0 && entitys.length < 5) || entitys.length <= 1) {
    for (var i = 0; i < ~~random(6, 15); i++) {
      entitys.push(new normalZombie());
    }

    otherEn.push(
      new barrel(
        random(50, maps[selmap].size - 50),
        random(50, maps[selmap].size - 50)
      )
    );
    otherEn.push(
      new crate(
        random(50, maps[selmap].size - 50),
        random(50, maps[selmap].size - 50)
      )
    );

    var r = ~~random(0, 100);
    if (g.wave >= 2) {
      if (r > 50) {
        entitys.push(new spitZombie());
        entitys.push(new spitZombie());
        entitys.push(new spitZombie());
      }
    }
    if (g.wave > 6) {
      if (r > 90) {
        entitys.push(new vomitZombie());
        entitys.push(new vomitZombie());
        entitys.push(new vomitZombie());
      }
      if (r % 4 === 0) {
        entitys.push(new splatterZombie());
        entitys.push(new splatterZombie());
      }

      if (r < 70 && r > 40) {
        entitys.push(new splatterSpawnZombie());
        entitys.push(new splatterSpawnZombie());
        entitys.push(new splatterSpawnZombie());
      }

      if (r < 20) {
        entitys.push(new chargeZombie());
        if (r < 10) {
          entitys.push(new chargeZombie());
          if (r < 5) {
            entitys.push(new chargeZombie());
          }
        }
      }
    }
    if (random() > 0.95) {
      entitys.push(new blingZombie());
    }
    if (g.wave >= 10) {
      if (r % 10 === 0 || g.wave === 10) {
        entitys.push(new momZombie());
        entitys.push(new momZombie());
        entitys.push(new momZombie());
      }
      if (r < 50) {
        entitys.push(new spitZombie());
        entitys.push(new spitZombie());
      } else if (random() < 0.2) {
        entitys.push(new metalZombie());
        entitys.push(new metalZombie());
      }
    }
    if (g.wave >= 20) {
      if (random() > 0.9) {
        entitys.push(new alphaspitZombie());
        entitys.push(new alphaspitZombie());
      }
    }

    if (g.wave >= 25) {
      for (var i = 0; i < ~~random(6, 15); i++) {
        entitys.push(new normalZombie());
      }
    }

    if (g.wave >= 65 && (random > 0.95 || g.wave === 65)) {
      entitys.push(new theZombie());
      entitys.push(new theZombie());
      entitys.push(new theZombie());
    }
    /*
        entitys.push(new spitZombie());
        - large green 
        entitys.push(new momZombie());
        entitys.push(new chargeZombie());
        entitys.push(new vomitZombie());
        entitys.push(new splatterZombie());
        entitys.push(new splatterSpawnZombie());
        entitys.push(new alphaspitZombie());
        entitys.push(new blingZombie());
        entitys.push(new babyZombie(300,300));
        entitys.push(new theZombie());
        entitys.push(new metalZombie());

        */

    g.wave++;

    g.waveTimer = d.waveTAdd;

    //increase diffiuclty
    if (g.wave % 5 === 0) {
      d.difMult += d.difIncr;
    }

    if (stats.highestWave < g.wave) {
      stats.highestWave = g.wave;
    }
  }
};

/*
    fireMath -
    handles the weapon firing, reloading and delay timers
*/
var fireMath = function () {
  var w = wep[p.equWep[p.equ]];
  /*
    if(clicked&&wepMath.clickedTwice<2){
        wepMath.clickedTwice++;
        
    }
    else
    if(wepMath.clickedTwice>=2)
    {
        wepMath.clickedTwice=0;
        
    }  
    */
  //rcl: 0, stb: 0,
  if (!wepMath.reloading) {
    wepMath.fireDelay--;
    if (
      wepMath.fireDelay <= 0 &&
      p.equWepMag[p.equ] > 0 &&
      (w.frM === "auto"
        ? mouseIsPressed || input[32]
        : w.frM === "simi"
        ? clicked
        : clicked /*(wepMath.clickedTwice>=2)*/ && knife.timer >= 0)
    ) {
      var rotX = sin1(p.angle - 12) * 26.7;
      var rotY = -cos1(p.angle - 12) * 26.7;

      p.equWepMag[p.equ]--;
      wepMath.fireDelay = w.frt;
      //console.log("Bang!");

      g.rumble += w.rcl;
      particl.push(new shell(p.x + rotX, p.y + rotY, p.angle));

      for (var i = 0; i < w.bpS; i++) {
        stats.bulletsShot++;
        if (w.Typ === "Lazer") {
          bullets.push(
            new bullet1(
              p.x + rotX,
              p.y + rotY,
              p.angle - 180 + random(15, -15) * (1 - p.wepAcc),
              w.spd,
              w.dam,
              w.prc
            )
          );
        } else if (w.Typ === "rocket") {
          bullets.push(
            new bullet2(
              p.x + rotX,
              p.y + rotY,
              p.angle - 180 + random(15, -15) * (1 - p.wepAcc),
              w.spd,
              w.dam,
              w.prc
            )
          );
        } else if (w.Typ === "aimbot") {
          bullets.push(
            new bullet3(
              p.x + rotX,
              p.y + rotY,
              p.angle - 180 + random(15, -15) * (1 - p.wepAcc),
              w.spd,
              w.dam,
              w.prc
            )
          );
        } else {
          bullets.push(
            new bullet(
              p.x + rotX,
              p.y + rotY,
              p.angle - 180 + random(15, -15) * (1 - p.wepAcc),
              w.spd,
              w.dam,
              w.prc
            )
          );
        }
      }
      p.wepAcc -= w.rcl;
    } else if (p.wepAcc <= w.acc) {
      p.wepAcc += w.stb;
    }

    if (
      input[82] ||
      mouseButton === RIGHT ||
      //Auto reloading function
      ((mouseIsPressed || input[32]) &&
        (w.frM === "simi" || w.frM === "auto") &&
        p.equWepMag[p.equ] === 0)
    ) {
      wepMath.reloading = true;
      wepMath.reloadDelay = w.rSp;
    }
  } else {
    wepMath.reloadDelay--;

    if (wepMath.reloadDelay <= 0 && !input[82] && mouseButton !== RIGHT) {
      if (w.frM === "simi" || w.frM === "auto") {
        p.equWepMag[p.equ] = w.mag;
        wepMath.reloading = false;
      }
      if (w.frM === "manl") {
        p.equWepMag[p.equ] = constrain(p.equWepMag[p.equ] + 1, 0, w.mag);
        wepMath.reloading = false;
      }
    }
  }

  if (p.equ === 1 && input[49]) {
    p.equ = 0;
    w = wep[p.equWep[p.equ]];
    p.wepAcc = w.acc;
    wepMath.reloading = false;
    wepMath.reloadDelay = 0;
  }
  if (p.equ === 0 && input[50]) {
    p.equ = 1;
    w = wep[p.equWep[p.equ]];
    p.wepAcc = w.acc;
    wepMath.reloading = false;
    wepMath.reloadDelay = 0;
  }

  p.wepAcc = constrain(p.wepAcc, w.acc / 2, 1);
};

/*
    game -
    Runs / displays the game.
*/
var knifeAngle = -130;
var game = function () {
  //cam.x+=((p.x+(pMX-width/2)/2)-cam.x)*camEasing;
  //cam.y+=((p.y+(pMY-height/2)/2)-cam.y)*camEasing;
  powerup.timer--;
  if (input[70] && powerup.timer <= 0) {
    powerup.timer = powerup.delay;
    otherEn.push(new Grenade(p.x, p.y, cam.x + (MX - 300), cam.y + (MY - 300)));
  }

  cursor("none");
  noStroke();
  waves();

  background(0, 0, 0);

  g.gameTimer = g.gameTimer >= 1000 ? 0 : g.gameTimer + 1;

  push(); //START CAM TRANLATIONS

  translate(300 - cam.x, 300 - cam.y);
  g.rumble *= 0.92;
  g.rumble = constrain(g.rumble, 0, 1);
  translate(g.rumble * random(-15, 15), g.rumble * random(-15, 15));

  mapDisplay();

  fireMath(); //gun firing math
  for (var i = particl.length - 1; i >= 0; i--) {
    var pb = particl[i];
    pb.run();
    if (pb.dead) {
      particl.splice(i, 1);
    }
  }

  for (var i = dropitm.length - 1; i >= 0; i--) {
    var db = dropitm[i];
    db.run();
    if (db.dead) {
      dropitm.splice(i, 1);
    }
  }

  if (input[86] && knife.delay <= 0) {
    knife.angle = -150;
    knife.timer = 30;
    knife.delay = 50;
  }
  if (knife.timer > 0) {
    knife.timer--;
    knife.angle += map(knife.angle, -150, -30, 10, 3);
    if (knife.angle >= -30) {
      knife.timer = 0;
    }
    var kx = p.x + cos1(p.angle + knife.angle) * 15;
    var ky = p.y + sin1(p.angle + knife.angle) * 15;
    knife.x = kx;
    knife.y = ky;
    push();
    translate(p.x, p.y);
    rotate1(p.angle + knife.angle - 90);
    fill(163, 163, 163);
    rect(15, 18, 3, 9);

    fill(255, 255, 255);
    ellipse(15, 15, 5, 5);
    pop();

    for (var i = entitys.length - 1; i >= 0; i--) {
      var te = entitys[i];
      if (dist(te.x, te.y, kx, ky) < 20) {
        te.life -= 5;
        particl.push(
          new gooParticle(kx + random(-15, 15), ky + random(-15, 15))
        );
      }
    }
  }
  knife.delay--;

  player(); //runs/ renders the player

  //Other entitys
  for (var i = otherEn.length - 1; i >= 0; i--) {
    var ob = otherEn[i];
    ob.run();
    ob.display();
    if (ob.isDead()) {
      otherEn.splice(i, 1);
    }
  }

  //Loop through each entity and runs them
  for (var i = entitys.length - 1; i >= 0; i--) {
    var te = entitys[i];
    te.run();
    te.display();
    if (te.life <= 0) {
      for (var j = 0; j <= ~~random(0, te.moneyDrop); j++) {
        if (random(0, 100) > 99) {
          dropitm.push(new item(te.x, te.y, 2));
        } else {
          dropitm.push(new item(te.x, te.y, 0));
        }
      }
      entitys.splice(i, 1);
      stats.ZombiesKilled++;
    }
  }

  noStroke();

  //loop through each bullet and runs them
  for (var i = bullets.length - 1; i >= 0; i--) {
    var tb = bullets[i];
    tb.run();
    tb.display();
    if (tb.isDead()) {
      bullets.splice(i, 1);
    }
  }

  // Border shadow and darkness
  noFill();
  var mapS_ = maps[selmap].size;
  strokeWeight(15);
  for (var i = 0; i < 5; i++) {
    var a_ = map(i, 0, 5, 0, 255);
    stroke(0, 0, 0, a_);
    rect(mapS_ / 2, mapS_ / 2, mapS_ - 50 + i * 15, mapS_ - 50 + i * 15);
  }
  noStroke();
  fill(0, 0, 0);
  rect(mapS_ / 2, -400, 1600, 800);
  rect(mapS_ / 2, mapS_ + 400, 1600, 800);
  rect(-400, mapS_ / 2, 800, 1600);
  rect(mapS_ + 400, mapS_ / 2, 800, 1600);

  //stroke(0, 0, 0);

  pop();
  // END OF CAM TRANSLATIONS

  for (var i = SceenPd.length - 1; i >= 0; i--) {
    var sb = SceenPd[i];
    sb.run();
    if (sb.dead) {
      SceenPd.splice(i, 1);
    }
  }

  // Turns screen red if player is damaged
  if (g.hurt >= 1 || p.health < 20) {
    g.hurt = constrain(g.hurt - 1, 0, 100);
    fill(255, 0, 0, g.hurt - (frameCount % 10));
    if (p.health < 20) {
      fill(255, 0, 0, 100 - (frameCount % 50));
    }

    rect(300, 300, 700, 700);
  }

  if (input[81]) {
    subScene = "shopMain";
    shopBackGround = get(0, 0, width, height);
  }

  if (p.health <= 0) {
    g.playerDie = true;
    shopBackGround = get(0, 0, width, height);
  }

  rediDisplay(); //Displays gun pointer

  //Checks if player has gotten an achievement
  if (g.gameTimer % 100 || g.playerDie) {
    for (var i in achv) {
      if (achv[i].chek() && !achv[i].lock) {
        notif.push({
          m: "new acheivement",
          sm: '"' + achv[i].name + '"',
          l: 1,
        });
        achv[i].lock = true;
        achv[i].rewd();
      }
    }
  }
  /*
    fill(255, 0, 0);
    text(
        ~~this.__frameRate+"\n"+
        wepMath.reloadDelay+"\n"+
        wepMath.fireDelay+"\n"+
        p.equWepMag[p.equ]+" / "+wep[p.equWep[p.equ]].mag+" \n"+
        entitys.length+" \n"+
        bullets.length+" \n"+
        p.wepAcc,
    20,120);
    
    fill(255, 0, 0);
    text(g.wave+" "+g.waveTimer,150,580);
    */
};

/*
    ShopWepDisplay - 
    Displays the shop buttons and handles the buying
    a : the weapon type
    
*/
var shopWepDisplay = function (a, b) {
  strokeWeight(3);
  stroke(5, 5, 5);
  fill(138, 136, 136, 50);

  rect(300, 450, 350, 150);

  this.a = a;
  var ind = 0;
  for (var j = 0; j < 2 && ind < a.length; j++) {
    for (var i = 0; i < 4 && ind < a.length; i++) {
      var wa = wep[this.a[ind].id];
      var x = 120 + i * 120;
      var y = 220 + j * 100;

      if (button(x, y, 100, 80, "", 1)) {
        if (b !== 1) {
          //Normal money
          if (!this.a[ind].un && g.money >= this.a[ind].pr) {
            g.money -= this.a[ind].pr;
            stats.moneySpent += this.a[ind].pr;
            this.a[ind].un = true;
            p.wepAcc = 0;
          }
        } else {
          //gems
          if (!this.a[ind].un && g.gems >= this.a[ind].pr) {
            g.gems -= this.a[ind].pr;
            stats.moneySpent += this.a[ind].pr;
            this.a[ind].un = true;
            p.wepAcc = 0;
          }
        }
        if (this.a[ind].un) {
          p.equWepMag[p.equ] = 0;
          p.equWep[p.equ] = this.a[ind].id;
          wepMath.reloading = false;
          wepMath.reloadDelay = wep[p.equWep[p.equ]].rSp;
          p.wepAcc = wep[p.equWep[p.equ]].acc;
        }
      }

      strokeWeight(3);
      stroke(5, 5, 5);
      fill(138, 136, 136, 50);
      //rect(x,y,100,80);
      textSize(15);
      if (b !== 1 || this.a[ind].un) {
        fill(0, 0, 0);
        text(this.a[ind].un ? "unlocked" : this.a[ind].pr + "$", x, y + 32);

        fill(255, 255, 255);
        text(this.a[ind].un ? "unlocked" : this.a[ind].pr + "$", x, y + 30);
      } else {
        fill(0, 0, 0);
        text(this.a[ind].un ? "unlocked" : this.a[ind].pr + "g", x, y + 32);

        fill(0, 255, 238);
        text(this.a[ind].un ? "unlocked" : this.a[ind].pr + "g", x, y + 30);
      }

      if (MX >= x - 50 && MX <= x + 50 && MY >= y - 40 && MY <= y + 40) {
        fill(138, 136, 136, 150);
        rect(x, y, 100, 80);
        textSize(12);
        textAlign(LEFT, LEFT);
        fill(0, 0, 0);
        text(
          "[ " +
            wa.nam +
            " ]\n" +
            "Firing mode : " +
            wa.frM +
            "\n" +
            "Damage : " +
            wa.dam +
            (wa.bpS > 1 ? " x " + wa.bpS : "") +
            "\n" +
            "Piercing : " +
            wa.prc +
            "x \n" +
            "Accuracy : " +
            wa.acc * 100 +
            "%\n" +
            "Ammo : " +
            wa.mag +
            "\n" +
            "FireRate : " +
            ~~((60 / wa.frt) * 60) +
            " rpm\n" +
            "Reload speed : " +
            (wa.rSp / 60).toPrecision(2) +
            " seconds\n" +
            "Weight : " +
            ["paper weight", "Light", "Normal", "Heavy", "cumbersome"][
              round(wa.wgh)
            ] +
            "\n" +
            "" +
            '"' +
            wa.FlT +
            '"',
          140,
          392
        );

        fill(255, 255, 255);
        text(
          "[ " +
            wa.nam +
            " ]\n" +
            "Firing mode : " +
            wa.frM +
            "\n" +
            "Damage : " +
            wa.dam +
            (wa.bpS > 1 ? " x " + wa.bpS : "") +
            "\n" +
            "Piercing : " +
            wa.prc +
            "x \n" +
            "Accuracy : " +
            wa.acc * 100 +
            "%\n" +
            "Ammo : " +
            wa.mag +
            "\n" +
            "FireRate : " +
            ~~((60 / wa.frt) * 60) +
            " rpm\n" +
            "Reload speed : " +
            (wa.rSp / 60).toPrecision(2) +
            " seconds\n" +
            "Weight : " +
            ["paper weight", "Light", "Normal", "Heavy", "cumbersome"][
              round(wa.wgh)
            ] +
            "\n" +
            "" +
            '"' +
            wa.FlT +
            '"',
          140,
          390
        );
        noStroke();
        textAlign(CENTER, CENTER);
        strokeWeight(1);
        push();
        translate(400, 450);
        scale(2);
        rotate1(frameCount % 360);

        wa.dis();
        playerDisplay(0, 0, 0);
        pop();
      }

      strokeWeight(1);
      noStroke();

      push();
      translate(x, y);
      rotate1(90);
      wa.dis();
      pop();
      ind++;
      playerDisplay(x, y, 90);
    }
  }
};

/*
    deadScreen - 
    Screen if player died
*/
var deadScreen = function () {
  cursor();
  image(shopBackGround, 0, 0, 600, 600);
  fill(158, 158, 158, 80);
  rect(300, 300, 600, 600);

  textSize(80);

  fill(0, 0, 0);
  text("You were\ncontaminated", 300, 105);

  fill(255, 255, 255);
  text("You were\ncontaminated", 300, 100);

  if (button(200, 550, 150, 50, "Main Menu", 20)) {
    scene = "main";
    subScene = "main";
  }
  if (button(400, 550, 150, 50, "Retry", 20)) {
    scene = "main";
    subScene = "start";
  }
};

/*
    shop - 
    displays the shop and runs the shop items code
*/
/**  TODO CLEAN UP */

var shop = function () {
  cursor();
  image(shopBackGround, 0, 0, 600, 600);
  fill(158, 158, 158, 80);
  rect(300, 300, 600, 600);

  textAlign(CENTER, CENTER);
  fill(255, 255, 255);
  textSize(80);
  text("SHOP", 300, 40);
  cursor("Arrow");
  if (button(90, 40, 150, 50, "Return to game", 20) || input[69] || input[27]) {
    subScene = "game";
  }
  if (button(510, 40, 150, 50, "exit game", 20)) {
    shopSubScene = "LeaveConfirm";
  }

  if (shopSubScene === "LeaveConfirm") {
    text(
      "if you exit the game you will\n loses current wave progress and money\n\n are you sure you want to exit?",
      300,
      300
    );
    if (button(200, 410, 150, 50, "YES", 30)) {
      scene = "main";
      subScene = "main";
    }
    if (button(400, 410, 150, 50, "NO", 30)) {
      shopSubScene = "playerUpg";
    }
  } else if (shopSubScene === "playerUpg") {
    if (button(510, 560, 150, 50, "Weapons", 25)) {
      shopSubScene = "pistols";
    }
    if (button(90, 560, 150, 50, "Stats", 25)) {
      shopSubScene = "stats";
    }

    for (var i = 0; i < shops.upgrades.length; i++) {
      if (
        button(
          130,
          150 + i * 70,
          100,
          50,
          shops.upgrades[i].name +
            "\n" +
            (shops.upgrades[i].level < shops.upgrades[i].maxLevel
              ? shops.upgrades[i].cost +
                shops.upgrades[i].addCost * shops.upgrades[i].level +
                "$"
              : "- MAX -"),
          14
        )
      ) {
        if (
          shops.upgrades[i].level < shops.upgrades[i].maxLevel &&
          g.money >=
            shops.upgrades[i].cost +
              shops.upgrades[i].addCost * shops.upgrades[i].level
        ) {
          g.money -=
            shops.upgrades[i].cost +
            shops.upgrades[i].addCost * shops.upgrades[i].level;
          stats.moneySpent +=
            shops.upgrades[i].cost +
            shops.upgrades[i].addCost * shops.upgrades[i].level;
          shops.upgrades[i].level++;
          //shops.upgrades[i].cost+=shops.upgrades[i].addCost;
          shops.upgrades[i].onBuy();
        }
      }

      stroke(0, 0, 0);
      fill(207, 207, 207, 150);
      for (var j = 0; j < shops.upgrades[i].maxLevel; j++) {
        rect(220 + j * 30, 150 + i * 70, 25, 40, 5);
      }
      fill(19, 209, 28, 250);
      for (var j = 0; j < shops.upgrades[i].level; j++) {
        rect(220 + j * 30, 150 + i * 70, 25, 40, 5);
      }
    }
  } else if (shopSubScene === "stats") {
    if (button(510, 560, 150, 50, "Player upgrades", 18)) {
      shopSubScene = "playerUpg";
    }
    if (button(90, 560, 150, 50, "Weapons", 25)) {
      shopSubScene = "pistols";
    }

    textAlign(CENTER, CENTER);

    var i = 0;
    var k = 0;
    while (i < achv.length) {
      var j = 0;
      while (j < 3 && i < achv.length) {
        var ag = achv[i];
        push();
        translate(j * 160, 30 + k * 60);

        noFill();
        if (ag.lock) {
          stroke(0, 255, 9);
        } else {
          stroke(255, 0, 0);
        }
        rect(140, 150, 155, 54);

        fill(158, 158, 158, 80);
        strokeWeight(3);
        stroke(20, 20, 20);
        rect(140, 150, 160, 60);

        fill(0, 0, 0);
        textSize(17);
        text(ag.name, 140, 143);
        textSize(10);
        text(ag.info, 140, 162);
        fill(255, 255, 255);
        textSize(17);
        text(ag.name, 140, 140);
        textSize(10);
        text(ag.info, 140, 160);

        i++;
        j++;
        pop();
      }
      k++;
    }

    textSize(12);
    fill(255);
    text(
      "Bullets shot: " +
        stats.bulletsShot +
        " | Zombies killed: " +
        stats.ZombiesKilled +
        "\nMoney earned: " +
        stats.moneyEarned +
        " | Money spent: " +
        stats.moneySpent +
        " | Highest wave: " +
        stats.highestWave,
      300,
      130
    );

    /*
	bulletsShot  : 0,
    ZombiesKilled: 0,
    moneyEarned  : 0,
    moneySpent   : 0,
    highestWave  : 0,
	*/
  } else if (shopSubScene !== "playerUpg" || shopSubScene !== "stats") {
    if (button(90, 560, 150, 50, "Player upgrades", 18)) {
      shopSubScene = "playerUpg";
    }
    if (button(510, 560, 150, 50, "Stats", 25)) {
      shopSubScene = "stats";
    }

    //pistols,smgs,rifles,shotguns,snipers,heavys
    if (shopSubScene === "pistols") {
      textSize(50);
      text("Pistols", 300, 115);
      if (button(450, 115, 100, 50, "SMGS", 15)) {
        shopSubScene = "smgs";
      }
      if (button(150, 115, 100, 50, "Special", 15)) {
        shopSubScene = "Special";
      }
      shopWepDisplay(wepShop.pistols);
    } else if (shopSubScene === "smgs") {
      textSize(50);
      text("smgs", 300, 115);
      if (button(450, 115, 100, 50, "Rifles", 15)) {
        shopSubScene = "rifles";
      }
      if (button(150, 115, 100, 50, "Pistols", 15)) {
        shopSubScene = "pistols";
      }
      shopWepDisplay(wepShop.smgs);
    } else if (shopSubScene === "rifles") {
      textSize(50);
      text("Rifles", 300, 115);
      if (button(450, 115, 100, 50, "Shot guns", 15)) {
        shopSubScene = "shotguns";
      }
      if (button(150, 115, 100, 50, "Smgs", 15)) {
        shopSubScene = "smgs";
      }
      shopWepDisplay(wepShop.rifles);
    } else if (shopSubScene === "shotguns") {
      textSize(40);
      text("Shotguns", 300, 115);
      if (button(450, 115, 100, 50, "Snipers", 15)) {
        shopSubScene = "snipers";
      }
      if (button(150, 115, 100, 50, "Rifles", 15)) {
        shopSubScene = "rifles";
      }
      shopWepDisplay(wepShop.shotguns);
    } else if (shopSubScene === "snipers") {
      textSize(50);
      text("Snipers", 300, 115);
      if (button(450, 115, 100, 50, "Heavy\nweapons", 15)) {
        shopSubScene = "heavys";
      }
      if (button(150, 115, 100, 50, "Shot guns", 15)) {
        shopSubScene = "shotguns";
      }
      shopWepDisplay(wepShop.snipers);
    } else if (shopSubScene === "heavys") {
      textSize(30);
      text("Heavy\nWeapons", 300, 115);
      if (button(450, 115, 100, 50, "Special", 15)) {
        shopSubScene = "Special";
      }
      if (button(150, 115, 100, 50, "Snipers", 15)) {
        shopSubScene = "snipers";
      }
      shopWepDisplay(wepShop.heavywep);
    } else if (shopSubScene === "Special") {
      textSize(30);
      text("Special\nWeapons", 300, 115);
      fill(173, 173, 173);
      textSize(15);
      text(
        "These are extremely powerful weapons, they require gems to purchase ",
        300,
        165
      );

      if (button(450, 115, 100, 50, "Pistols", 15)) {
        shopSubScene = "pistols";
      }
      if (button(150, 115, 100, 50, "Heavy\nweapons", 15)) {
        shopSubScene = "heavys";
      }
      shopWepDisplay(wepShop.Special, 1);
    }
  }

  strokeWeight(3);
  stroke(5, 5, 5);
  fill(138, 136, 136, 50);
  rect(300, 560, 150, 50);
  fill(255, 255, 255);
  textSize(20);
  text("Money:" + g.money, 300, 555);
  textSize(15);
  text("gems:" + g.gems, 300, 570);
};

/* 
    draw function-
    runs everything
    
*/
draw = function () {
  scale(width / 600, height / 600);
  MX = map(mouseX, 0, width, 0, 600);
  MY = map(mouseY, 0, height, 0, 600);

  if (scene === "main") {
    background(54, 54, 54);
    fill(3, 3, 3);
    textSize(60);

    clogo(54, 54, 54, 43, 43, 43, 300, 320, 1.5);

    cursor();
    if (subScene === "main") {
      textSize(220);

      fill(10, 10, 10);
      text("V", 300, 190);
      fill(255, 68, 0);
      text("V", 300, 180);

      textSize(60);
      fill(26, 26, 26);
      text("CONTAMINATION\nBREACH", 300, 185);
      fill(255, 191, 0);
      text("CONTAMINATION\nBREACH", 300, 180);

      if (button(90, 40, 150, 50, "save", 30)) {
        getSave();
      }

      if (button(300, 490, 200, 50, "Help", 30)) {
        subScene = "Help";
      }
      if (button(300, 550, 200, 50, "Start game", 30)) {
        subScene = "select";
        rHint = round(random(0, hints.length));
      }
    } else if (subScene === "Help") {
      if (button(90, 40, 150, 50, "Back", 30)) {
        subScene = "main";
      }
      if (button(300, 300, 300, 50, "Controls", 30)) {
        subScene = "controls";
      }
      if (button(300, 350, 300, 50, "Weapon types", 28)) {
        subScene = "Weapontypes";
      }
      if (button(300, 400, 300, 50, "Weapon info", 28)) {
        subScene = "Weaponinfo";
      }
    } else if (subScene === "controls") {
      if (button(90, 40, 150, 50, "Back", 30)) {
        subScene = "Help";
      }
      textAlign(LEFT);
      text(
        "[w][a][s][d]/arrow keys  -  move\n[space]/[rmb]  -  Fire weapon\n[shift]  -  sprint\n[r]  -  reload weapon\n[f]  -  use powerup\n[v]  -  use knife\n[q]  -  open shop\n[e]  -  close shop",
        100,
        150
      );
    } else if (subScene === "Weapontypes") {
      if (button(90, 40, 150, 50, "Back", 30)) {
        subScene = "Help";
      }
      textSize(18);
      textAlign(LEFT);
      text(
        "Pistols       - \nultra lightweight, small magazine size, fast reload\n\nSMGs          - \nlightweight, large magazine size, rapid firing\n\nRifles        - \nheavy, large magazine, rapid firing, piercing bullets  \n\nShotguns      - \nheavy, small magazine, slow firing, multiple bullets per shot\n\nSnipers       - \nheavy, small magazine, slow firing, powerful, piercing bullets\n\nHeavy Weapons - \nextremely heavy, huge magazine, rapid firing",
        50,
        150
      );
    } else if (subScene === "Weaponinfo") {
      if (button(90, 40, 150, 50, "Back", 30)) {
        subScene = "Help";
      }
      textSize(18);
      textAlign(LEFT);
      text(
        "Firing mode :\n     “Auto” - fires automatically when the mouse is pressed \n     “Simi” - fires once per click\n     “Manl” - fires once per click, reloads one bullet at a time\n\nDamage : the amount of damage each bullet deals\n\nPiercing : how many enemies the bullet can go through\n\nAccuracy : How close the bullets are to where you aim\n\nAmmo : number of bullets the gun holds\n\nFirerate : how fast the bullets can be fired\n\nReload speed: how fast the weapon can be reloaded\n\nWeight : how slow the player is when holding the weapon",
        50,
        100
      );
    } else if (subScene === "select") {
      if (button(90, 40, 150, 50, "Back", 30)) {
        subScene = "main";
      }

      text("Selected map : " + maps[selmap].name, 300, 100);
      if (button(300, 160, 180, 50, "Map", 30)) {
        subScene = "selectMap";
      }

      text("Selected skin : " + playerModel[equModel].name, 300, 220);
      if (button(300, 270, 180, 50, "Skin", 30)) {
        subScene = "selectSkin";
      }

      //text("Selected skin : "+playerModel[equModel].name,300,220);
      if (button(300, 380, 180, 50, "Settings", 30)) {
        subScene = "selectSettings";
      }

      if (button(300, 550, 250, 60, "Start", 40)) {
        subScene = "start";
      }

      textSize(20);
      fill(31, 31, 31);
      text("HINT:\n" + hints[rHint], 300, 472);

      fill(255, 255, 255);
      text("HINT:\n" + hints[rHint], 300, 470);
    } else if (subScene === "selectMap") {
      if (button(90, 40, 150, 50, "Back", 30)) {
        subScene = "select";
      }
      for (var i in maps) {
        var m = maps[i];
        if (button(300, 150 + i * 60, 300, 50, m.name, 30)) {
          selmap = i;
          subScene = "select";
        }
      }
    } else if (subScene === "selectSkin") {
      if (button(90, 40, 150, 50, "Back", 30)) {
        subScene = "select";
      }

      text("Complete challanges to unlock skins", 300, 120);
      var k = 0,
        i = 0;
      while (k < playerModel.length) {
        var j = 0;
        while (j < 4 && k < playerModel.length) {
          if (button(150 + j * 100, 210 + i * 100, 100, 100, "", 0)) {
            if (unLockedModels[k]) {
              equModel = k;
              subScene = "select";
            }
          }

          push();
          translate(150 + j * 100, 210 + i * 100);
          push();
          rotate1(180);
          scale(1.6);
          playerModel[k].display();
          fill(playerModel[k].hc !== 0 ? playerModel[k].hc : playerColor);
          ellipse(7, -13, 5, 5);
          ellipse(-7, -13, 5, 5);
          pop();

          if (!unLockedModels[k]) {
            noStroke();
            fill(38, 38, 38, 150);
            rect(0, 0, 100, 100);
            fill(237, 237, 237, 200);
            textSize(20);
            text("LOCKED", 0, 0);
          }
          pop();

          k++;
          j++;
        }
        i++;
      }
    } else if (subScene === "selectSettings") {
      if (button(90, 40, 150, 50, "Back", 30)) {
        subScene = "select";
      }

      text("Pointer color", 300, 220);
      text("Player color", 300, 400);

      textSize(20);

      var _h = ~~slider(~~hue(rediColor), 200, 320, 200, 20, 0, 255, "color");
      colorMode(HSB);
      var _c = color(_h, 255, 255);
      fill(_c);
      ellipse(450, 320, 80, 80);

      colorMode(RGB);

      rediColor = color(red(_c), green(_c), blue(_c));

      fill(rediColor);
      ellipse(450, 320, 10, 10);

      noStroke();

      var _r = ~~slider(red(playerColor), 200, 450, 200, 20, 50, 255, "Red");
      var _g = ~~slider(
        green(playerColor),
        200,
        480,
        200,
        20,
        50,
        255,
        "Green"
      );
      var _b = ~~slider(blue(playerColor), 200, 510, 200, 20, 50, 255, "Blue");
      playerColor = color(_r, _g, _b);

      push();
      translate(450, 480);
      rotate1(180);
      scale(1.6);
      playerModel[equModel].display();
      fill(
        playerModel[equModel].hc !== 0 ? playerModel[equModel].hc : playerColor
      );

      ellipse(7, -13, 5, 5);
      ellipse(-7, -13, 5, 5);
      pop();
    } else if (subScene === "start") {
      startGame();
      scene = "game";
    }
  } else if (scene === "game") {
    if (!g.playerDie) {
      if (subScene === "game") {
        game();
        hud();
      } else {
        shop();
      }
    } else {
      deadScreen();
    }
  }

  clicked = false; //reset click
  if (this.__frameRate < 50) {
    laggy = true;
    particleDieTimer = ~~((62 - this.__frameRate) / 10) * 2;
  } else {
    laggy = false;
    particleDieTimer = 1;
  }
};

function mouseClicked() {
  clicked = true;
}
function mouseReleased() {
  mouseButton = LEFT;
}
function keyPressed() {
  input[keyCode] = true;
}
function keyReleased() {
  if (input[27]) {
    console.log(1);
  }
  if (input[32]) {
    clicked = true;
  }
  input[keyCode] = false;
  if (input[79]) {
    getSave();
    console.log(1);
  }
}
