var gameLayer = cc.Layer.extend({
    ctor : function(){
        //1. call super class's ctor function
        this._super();
        this.init();
    },
    init:function(){
        //call super class's super function
        this._super();

        g_enp.reset();
        g_score = 0;

        this.addChild(new gameBack(),0,TagOfLayer.background);
        this.addChild(new playerLayer(),2,TagOfLayer.player);
        this.addChild(new blockLayer(),1,TagOfLayer.block);
        this.addChild(new bulletsLayer(),3,TagOfLayer.bullets);
        this.addChild(new boomsLayer(),10,TagOfLayer.booms);
        this.addChild(new monstersLayer(),8,TagOfLayer.monsters);
        this.addChild(new monstersbulletLayer(),6,TagOfLayer.monstersbullet);
        this.addChild(new bonusLayer(),7,TagOfLayer.bonus);
        this.addChild(new infoLayer(),50,TagOfLayer.info);

        this.getChildByTag(TagOfLayer.booms).init();
        this.getChildByTag(TagOfLayer.block).init ();
        this.getChildByTag(TagOfLayer.monsters).init ();
        this.getChildByTag(TagOfLayer.monstersbullet).init ();
        this.getChildByTag(TagOfLayer.info).init ();

        this.scheduleUpdate();
    },

    update:function () {
        this.getChildByTag(TagOfLayer.block).onUpdate();
        this.getChildByTag(TagOfLayer.player).onUpdate();
        this.getChildByTag(TagOfLayer.bullets).onUpdate();
        this.getChildByTag(TagOfLayer.booms).onUpdate();
        this.getChildByTag(TagOfLayer.monsters).onUpdate();
        this.getChildByTag(TagOfLayer.monstersbullet).onUpdate();
        this.getChildByTag(TagOfLayer.bonus).onUpdate();
        this.getChildByTag(TagOfLayer.info).onUpdate();
        g_gamestate = 1;
    }
});

var gameBack = cc.Layer.extend({
    ctor : function(){
        //1. call super class's ctor function
        this._super();
        this.init();
    },
    init:function(){
        //create the background image and position it at the center of screen
        var spriteBG = new cc.Sprite(res.bkgnd_png);
        //spriteBG.texture.setAliasTexParameters(false);
        spriteBG.setAnchorPoint(0,0);
        spriteBG.setPosition(0,0);
        spriteBG.setScale(4,4);
        this.addChild(spriteBG,0,0);
    },
});

var gameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new gameLayer();
        this.addChild(layer,0,0);
    }
});
