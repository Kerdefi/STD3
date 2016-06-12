var g_gamestate = 0;
var g_enp ;
var g_blocksize = 30;
var g_textureblocksize = 20;
var g_blockspeed = 5;
var g_animtime = 0.15;
var g_maxbullets = 20 ;
var g_maxbooms = 20 ;
var g_maxmonsters = 15 ;
var g_monstersmaxspeed = 125 ;
var g_monsterbulletspeed = 200 ;
var g_bonusproba = 0.5 ;
var g_monsterxpgain = 5 ;
var g_bonusxpgain = 30 ;
var g_bonushealthgain = 10 ;
var g_score = 0 ;
var g_blockplayer = 9 ;

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
};

if(typeof BlockIndex== "undefined") {
    var BlockIndex = {};
    BlockIndex.player = 1;
    BlockIndex.standard = 0;
    BlockIndex.bullets = 100;
    BlockIndex.monsters = 1000;
};
