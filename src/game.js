var gameLayer = cc.Layer.extend({
    ctor : function(){
        //1. call super class's ctor function
        this._super();
        this.init();
    },
    init:function(){
        //call super class's super function
        this._super();

        var self = this;

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
        this.addChild(new pauseLayer(),15,TagOfLayer.pause);
        this.addChild(new endLayer(),15,TagOfLayer.end);

        this.getChildByTag(TagOfLayer.pause).visible=false;

        this.getChildByTag(TagOfLayer.booms).init();
        this.getChildByTag(TagOfLayer.block).init ();
        this.getChildByTag(TagOfLayer.monsters).init ();
        this.getChildByTag(TagOfLayer.monstersbullet).init ();
        this.getChildByTag(TagOfLayer.info).init ();

        //Add keyboard stroke listener
        if('keyboard' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyReleased:function(key, event) {
                    //Si on est en help lance le jeu
                    if(key == cc.KEY.p && g_gamestate==TagOfState.run) {
                        g_gamestate=TagOfState.pause;
                        g_enp.changeState (encophys.PAUSE);
                        self.getChildByTag(TagOfLayer.pause).visible=true;
                    } else {
                        if(g_gamestate==TagOfState.pause) {
                            if(key == cc.KEY.z || key == cc.KEY.s) {
                                self.getChildByTag(TagOfLayer.pause).Toggle ();
                            }
                            if(key == cc.KEY.a) {
                                self.getChildByTag(TagOfLayer.pause).Click ();
                                self.getChildByTag(TagOfLayer.pause).visible=false;
                                g_enp.changeState (encophys.RUN);
                            }
                        }
                    }
                }
            }, this);
        }

        this.scheduleUpdate();
    },

    update:function () {
        if (g_gamestate == TagOfState.run) {
            this.getChildByTag(TagOfLayer.block).onUpdate();

            this.getChildByTag(TagOfLayer.bullets).onUpdate();
            this.getChildByTag(TagOfLayer.booms).onUpdate();
            this.getChildByTag(TagOfLayer.monsters).onUpdate();
            this.getChildByTag(TagOfLayer.monstersbullet).onUpdate();
            this.getChildByTag(TagOfLayer.bonus).onUpdate();
            this.getChildByTag(TagOfLayer.info).onUpdate();
        }
        if (g_gamestate == TagOfState.run || g_gamestate == TagOfState.endanim) this.getChildByTag(TagOfLayer.player).onUpdate();
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
    },
    onExit:function () {
        this._super();
    }
});
