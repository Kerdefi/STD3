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
var g_blockspeed = 1;

if(typeof TagOfLayer == "undefined") {
    var TagOfLayer = {};
    TagOfLayer.background = 0;
    TagOfLayer.frame = 1;
    TagOfLayer.animation = 2;
    TagOfLayer.ground = 3;
    TagOfLayer.decoration = 4;
    TagOfLayer.bonus = 5;
    TagOfLayer.block = 6;
};
