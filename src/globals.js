var g_gamestate = 0;
var g_enp ;
var g_blocksize = 30;
var g_textureblocksize = 20;
var g_blockspeed = 7;
var g_animtime = 0.15;
var g_maxbullets = 40 ;
var g_maxbooms = 30 ;
var g_maxmonsters = 15 ;
var g_monstersmaxspeed = 125 ;
var g_monsterbulletspeed = 200 ;
var g_bonusproba = 0.4 ;
var g_monsterxpgain = 8 ;
var g_bonusxpgain = 15 ;
var g_bonushealthgain = 30 ;
var g_bonusmana = 30 ;
var g_score = 0 ;
var g_blockplayer = 9 ;
var g_highscore = {} ;
g_highscore.player = ["NIC","NIC","JOA","JOA","BOB"];
g_highscore.score = [1300,1000,500,200,10];
var g_levellength = 100 ;
var g_blockdamage = 2 ;
//Juste toucher les monstres
var g_monsterdamagemultiplier = 1.4;
//Tous les dégats
var g_monsterdamagereductionorigin = 0.7;
var g_monsterdamagereduction = g_monsterdamagereductionorigin;
var g_bowshield = 0.2;
var g_scalebullet = 1.4 ;
var g_scalemonsterbullet = 1.4 ;
var g_scaleboom = 2 ;
var g_scalemonster = 1.2 ;
var g_scalebonus = 1.7 ;
var g_swordhealth = [20,35,50];
var g_firstshoot = 0.2;
var g_level = 1.7;
var g_maxframe = 8;

if(typeof TagOfState == "undefined") {
    var TagOfState = {};
    TagOfState.start = 0;
    TagOfState.help = 1;
    TagOfState.run = 2;
    TagOfState.pause = 3;
    TagOfState.endanim = 4;
    TagOfState.end = 5;
}


if(typeof TagOfLayer == "undefined") {
    var TagOfLayer = {};
    TagOfLayer.background = 0;
    TagOfLayer.frame = 1;
    TagOfLayer.animation = 2;
    TagOfLayer.ground = 3;
    TagOfLayer.decoration = 4;
    TagOfLayer.bonus = 5;
    TagOfLayer.block = 6;
    TagOfLayer.player = 7;
    TagOfLayer.bullets = 8;
    TagOfLayer.booms = 9;
    TagOfLayer.monsters = 10;
    TagOfLayer.monstersbullet = 11;
    TagOfLayer.info = 12;
    TagOfLayer.pause = 13;
    TagOfLayer.end = 14;
    TagOfLayer.frames = 15;
};

if(typeof TagOfAction == "undefined") {
    var TagOfAction = {};
    TagOfAction.fly = 0;
    TagOfAction.shoot = 100;
    TagOfAction.die = 200;
};

if(typeof TagOfPlayer== "undefined") {
    var TagOfPlayer = {};
    TagOfPlayer.player = 0;
    TagOfPlayer.anim = 1;
    TagOfPlayer.damage = 2;
    TagOfPlayer.swordshoot = 3;
    TagOfPlayer.jshield = 4;
    TagOfPlayer.nshield = 5;
    TagOfPlayer.reloading = 6;
};

if(typeof BlockIndex== "undefined") {
    var BlockIndex = {};
    BlockIndex.player = 1;
    BlockIndex.standard = 0;
    BlockIndex.bullets = 100;
    BlockIndex.monsters = 1000;
};
