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

        g_score = 0;
        g_monsterdamagereduction = g_monsterdamagereductionorigin;

        g_enp.reset();

        this.level = 0;

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
                        self.pauseme(self);
                    } else {
                        if(g_gamestate==TagOfState.pause) {
                            if(key == cc.KEY.z || key == cc.KEY.s) {
                                self.arrow(self);
                            }
                            if(key == cc.KEY.a) {
                                self.pauseme(self);
                            }
                        }
                    }
                }
            }, this);
        }

        //add controler
        this.gp = new gp_check (null,this.pauseme,null,null,null,null,null,null,null,null,null,null,this.arrow,this.arrow);

        this.scheduleUpdate();
    },

    arrow:function(self) {
        if(g_gamestate==TagOfState.pause) {self.getChildByTag(TagOfLayer.pause).Toggle ()};
    },

    pauseme:function(self) {
        if(g_gamestate==TagOfState.run) {
            g_gamestate=TagOfState.pause;
            g_enp.changeState (encophys.PAUSE);
            self.getChildByTag(TagOfLayer.pause).visible=true;
        } else if(g_gamestate==TagOfState.pause) {
            self.getChildByTag(TagOfLayer.pause).Click ();
            self.getChildByTag(TagOfLayer.pause).visible=false;
            g_enp.changeState (encophys.RUN);
        }
    },

    update:function () {
        this.gp.update(this);

        if (g_gamestate == TagOfState.run) {
            this.getChildByTag(TagOfLayer.block).onUpdate();
            this.getChildByTag(TagOfLayer.bullets).onUpdate();
            this.getChildByTag(TagOfLayer.booms).onUpdate();
            this.getChildByTag(TagOfLayer.monsters).onUpdate();
            this.getChildByTag(TagOfLayer.monstersbullet).onUpdate();
            this.getChildByTag(TagOfLayer.bonus).onUpdate();
            this.getChildByTag(TagOfLayer.info).onUpdate();
            this.level = Math.min (9,Math.round(g_score/g_levellength));

            if(g_score > 1100) {
                g_monsterdamagereduction = g_monsterdamagereductionorigin * ((g_score - 1100)/ 500);
                this.getChildByTag(TagOfLayer.background).setColor(cc.color(255,255*100/(g_score - 1000),255*100/(g_score - 1000)));
            }
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
