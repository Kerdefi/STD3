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

        this.addChild(new gameBack(),0,TagOfLayer.background);
        this.addChild(new blockLayer(),1,TagOfLayer.block);
        this.scheduleUpdate();
    },

    update:function () {
        this.getChildByTag(TagOfLayer.block).onUpdate();
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
    }
});

var gameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new gameLayer();
        layer.init();
        this.addChild(layer,0,0);
    }
});
