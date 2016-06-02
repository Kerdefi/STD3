var g_joannaStartX = 100;
var g_nicolasStartX = 170;
var g_duration = 40;
var g_duration_jump = 0.4;
var g_bonusCount = 0;
var g_gamestate = 0;
var g_snowcount = 5;
var g_sound = 1;
var g_enp ;
var g_blocksize = 20;
var g_blockspeed = 5;
var g_animtime = 0.15;
var g_maxbullets = 10 ;
var g_maxbooms = 20 ;

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
};
