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

        this.addChild(new gameBack(),-1,TagOfLayer.background);
        this.addChild(new frameBack(),1,TagOfLayer.frame);
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
            this.getChildByTag(TagOfLayer.background).onUpdate();
            this.getChildByTag(TagOfLayer.frame).onUpdate();
            this.getChildByTag(TagOfLayer.block).onUpdate();
            this.getChildByTag(TagOfLayer.bullets).onUpdate();
            this.getChildByTag(TagOfLayer.booms).onUpdate();
            this.getChildByTag(TagOfLayer.monsters).onUpdate();
            this.getChildByTag(TagOfLayer.monstersbullet).onUpdate();
            this.getChildByTag(TagOfLayer.bonus).onUpdate();
            this.getChildByTag(TagOfLayer.info).onUpdate();
            this.level = Math.min (9,Math.round(g_score/g_levellength));

            if(g_score > 1000) {
                g_monsterdamagereduction = g_monsterdamagereductionorigin * ((g_score - 1000)/ 300);
                this.getChildByTag(TagOfLayer.background).getChildByTag(0).setColor(cc.color(255,255*200/(g_score - 800),255*200/(g_score - 800)));
                this.getChildByTag(TagOfLayer.background).getChildByTag(1).setColor(cc.color(255,255*200/(g_score - 800),255*200/(g_score - 800)));
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
        this.posY = 0;

        //create the background image and position it at the center of screen
        var spriteBG = new cc.Sprite(res.bkgnd_png);
        //spriteBG.texture.setAliasTexParameters(false);
        spriteBG.setAnchorPoint(0,0);
        spriteBG.setPosition(0,0);
        spriteBG.setScale(4,4);
        this.addChild(spriteBG,0,0);

        //create the background image and position it at the center of screen
        var spriteBG1 = new cc.Sprite(res.bkgnd_png);
        //spriteBG.texture.setAliasTexParameters(false);
        spriteBG1.setAnchorPoint(0,0);
        spriteBG1.setPosition(0,1024);
        spriteBG1.setScale(4,4);
        this.addChild(spriteBG1,1,1);
    },
    onUpdate:function(){
        this.posY = Math.round(this.posY - g_enp.framestep * g_blockspeed * g_blocksize) ;
        if(this.posY < -1024) this.posY += 1024 ;
        this.getChildByTag(0).setPosition(0,this.posY);
        this.getChildByTag(1).setPosition(0,this.posY+1024);
    }
});

var frameBack = cc.Layer.extend({
    ctor : function(){
        //1. call super class's ctor function
        this._super();
        this.init();
    },
    init:function(){
        this.alive = [];
        this.posX = [];
        this.posY = [];
        this.scaleHere = [];
        this.test = 0;

        var frame = []

        for(var i = 0 ; i < g_maxframe ; i++) {
            this.alive.push(false);
            this.posX.push(300);
            this.posY.push(1024);
            this.scaleHere .push(0.5);

            frame.push(new cc.Sprite(res.frame0_png));
            frame[i].setAnchorPoint(0.5,0.5);
            frame[i].setPosition(0,0);
            frame[i].setScale(0.5,0.5);
            frame[i].visible = false;
            frame[i].opacity = 190;
            this.addChild(frame[i],0,i);
        }
    },
    onUpdate:function(){
        //apparition d'un ou deux cadres tous les X blocks
        if(this.test != -Math.round(this.getParent().getChildByTag(TagOfLayer.background).posY)){
            this.test = -Math.round(this.getParent().getChildByTag(TagOfLayer.background).posY);
            if(this.test % 40 == 0 && Math.random() < 0.5) this.addFrame();
        }

        for(var i = 0 ; i < g_maxframe ; i++) {
            if(this.alive[i]) {
                this.posY[i] = Math.round(this.posY[i] - g_enp.framestep * g_blockspeed * g_blocksize) ;
                this.getChildByTag(i).setPosition(this.posX[i],this.posY[i]);

                if(this.posY [i] < -100) {
                    this.getChildByTag(i).visible = false;
                    this.alive[i] = false;
                }
            }
        }
    },
    addFrame:function(){
        for(var i = 0 ; i < g_maxframe ; i++) {
            if(!this.alive[i]) {
                this.alive[i] = true;
                this.posX[i] = Math.round(Math.random()*768);
                this.posY[i] = 1100;

                this.getChildByTag(i).setScale(1/this.scaleHere [i],1/this.scaleHere[i]);
                this.scaleHere [i]=0.2+Math.random();

                this.getChildByTag(i).setTexture(res["frame"+Math.round(Math.random()*9)+"_png"]);
                this.getChildByTag(i).setScale(this.scaleHere[i],this.scaleHere[i]);
                this.getChildByTag(i).setPosition(this.posX[i],this.posY[i]);
                this.getChildByTag(i).visible = true;

                return true;
            }
        }
        return false;
    }
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
