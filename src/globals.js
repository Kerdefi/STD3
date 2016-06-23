var g_gamestate = 0;
var g_enp ;
var g_blocksize = 30;
var g_textureblocksize = 20;
var g_blockspeed = 6;
var g_animtime = 0.15;
var g_maxbullets = 20 ;
var g_maxbooms = 20 ;
var g_maxmonsters = 15 ;
var g_monstersmaxspeed = 125 ;
var g_monsterbulletspeed = 200 ;
var g_bonusproba = 0.5 ;
var g_monsterxpgain = 5 ;
var g_bonusxpgain = 40 ;
var g_bonushealthgain = 40 ;
var g_score = 0 ;
var g_blockplayer = 9 ;
var g_highscore = {} ;
g_highscore.player = ["ABC","ABC","ABC","ABC","ABC"];
g_highscore.score = [100,20,10,5,1];
var g_levellength = 200 ;
var g_blockdamage = 2 ;

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
