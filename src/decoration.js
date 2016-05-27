/**
 * Created by Nicolas on 20/06/2015.
 */
var decorationLayer = cc.Layer.extend({
    //snowActionTombe:null,
    isSnowing:null,

    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();

        /**
        //SNOW
        //1.load spritesheet
        cc.spriteFrameCache.addSpriteFrames(res.snow_plist);

        var frameSnow = [];
        for (var i = 0; i < 5; i++) {
            var str = "snow_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            frameSnow.push(frame);
        }
        //3.create a animation with the spriteframe array along with a period time
        var animSnowTombe = new cc.Animation(frameSnow, 0.2);

        //4.wrap the animate action with a repeat forever action
        this.snowActionTombe = new cc.RepeatForever(new cc.Animate(animSnowTombe));
        this.snowActionTombe.setTag(10);*/

        this.isSnowing=0;

        //create the ground layer
        var spriteDECO = [];

        for (i = 0; i < 10; i++) {
            if (i<1) {
                spriteDECO [i] = new cc.Sprite(res.right_png);
                spriteDECO [i].setAnchorPoint(0, 0);
                spriteDECO [i].setPosition(300, 135);
                spriteDECO [i].setScale(30 / spriteDECO [i].getContentSize().width, 30 / spriteDECO [i].getContentSize().height);
            }else {
                if (i<3) {
                    spriteDECO [i] = new cc.Sprite(res.grass_png);
                    spriteDECO [i].setAnchorPoint(0, 0);
                    spriteDECO [i].setPosition(1280+(i-1)*300, 135);
                    spriteDECO [i].setScale(45 / spriteDECO [i].getContentSize().width, 45 / spriteDECO [i].getContentSize().height);
                }else {
                    if (i<5) {
                        spriteDECO [i] = new cc.Sprite(res.bush_png);
                        spriteDECO [i].setAnchorPoint(0, 0);
                        spriteDECO [i].setPosition(2360+(i-3)*300, 135);
                        spriteDECO [i].setScale(45 / spriteDECO [i].getContentSize().width, 45 / spriteDECO [i].getContentSize().height);
                    }else {
                        if (i<8) {
                            spriteDECO [i] = new cc.Sprite(res.snowhill_png);
                            spriteDECO [i].setAnchorPoint(0, 0);
                            spriteDECO [i].setPosition(3440+(i-5)*200, 135);
                            spriteDECO [i].setScale(45 / spriteDECO [i].getContentSize().width, 45 / spriteDECO [i].getContentSize().height);
                        }else {
                            spriteDECO [i] = new cc.Sprite(res.grass_png);
                            spriteDECO [i].setAnchorPoint(0, 0);
                            spriteDECO [i].setPosition(4900+(i-8)*300, 135);
                            spriteDECO [i].setScale(45 / spriteDECO [i].getContentSize().width, 45 / spriteDECO [i].getContentSize().height);
                        }
                    }
                }

            }
            spriteDECO [i].texture.setAliasTexParameters(false);
            this.addChild(spriteDECO [i],0,i);
        }
    },

    onPlay:function () {
        for (var i = 0; i < 10; i++) {
            this.getChildByTag(i).runAction(new cc.Sequence(new cc.MoveTo(g_duration, cc.p(-4900 + this.getChildByTag(i).getPositionX(), 135))));
        }
    },

    onSnow:function () {
        var sprite ;

        var i = 0;
        var j = 0;

        for (i = 0; i < g_snowcount; i++) {
            for (j = 0; j < g_snowcount; j++) {
                sprite = new cc.Sprite(res.snow_png);
                sprite.texture.setAliasTexParameters(false);
                sprite.setAnchorPoint(0, 0);
                sprite.setPosition(i * 1200/g_snowcount + Math.random()* 1200/g_snowcount, 220 + j*300/g_snowcount+ Math.random()*300/g_snowcount);
                sprite.setScale(10 / sprite.getContentSize().width, 10 / sprite.getContentSize().height);
                sprite.setOpacity(0);
                this.addChild(sprite, 0, 100 + i*g_snowcount+j);

                this.getChildByTag(100 + i*g_snowcount+j).runAction(new cc.FadeIn(3));
                this.getChildByTag(100 + i*g_snowcount+j).runAction(new cc.MoveTo(g_duration / 3, cc.p(this.getChildByTag(100 + i*g_snowcount+j).getPositionX() - 1080, this.getChildByTag(100 + i*g_snowcount+j).getPositionY()-150)));
            }
        }

        this.isSnowing=1;
    },

     onEndSnow:function () {

         for (var i = 0; i < g_snowcount*g_snowcount; i++) {
             this.getChildByTag(100+i).runAction(new cc.FadeOut (1));
         }

        this.isSnowing=2;
    }

    /**onSnow:function () {
        var sprite = new cc.Sprite(res.snowhill_png);
        sprite.setAnchorPoint(0, 0);
        sprite.setPosition(0, 90);
        this.addChild(sprite,10,50);

        this.getChildByTag(50).runAction(new cc.fadeIn (5));
        this.getChildByTag(50).runAction(this.snowActionTombe);
        sprite.setScale(1080 / sprite.getContentSize().width, 270 / sprite.getContentSize().height);
        sprite.texture.setAliasTexParameters(false);
        this.getChildByTag(50).runAction(new cc.MoveTo (g_duration/5,cc.p(-1080,135)));

        this.isSnowing=1;
    },

    onEndSnow:function () {
        this.getChildByTag(50).runAction(new cc.fadeOut (1));
        this.removeChildByTag(50);

        this.isSnowing=0;
    }*/
});

var bonusLayer = cc.Layer.extend({
    coeurActionBattre:[],
    coeurActionTouche:[],
    coeurActionEnd:[],
    bonusEtat:[],

    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();
        //create l'action battre
        for (var i = 0; i < 20; i++) {
            this.coeurActionBattre.push(new cc.Sequence(new cc.scaleBy(1.5, 1.3, 1.3), new cc.scaleBy(1.5, 1 / 1.3, 1 / 1.3)));
            this.coeurActionBattre[i].repeatForever();
            this.coeurActionBattre[i].setTag(20);
        }

        //create l'action touche
        for (i = 0; i < 20; i++) {
            this.coeurActionTouche.push(new cc.Spawn(new cc.scaleBy(0.5, 3, 3), new cc.FadeOut(0.5)));
            this.coeurActionTouche[i].setTag(21);
        }

        //create l'action end
        for (i = 0; i < 19; i++) {
            this.coeurActionEnd.push(new cc.Sequence(new cc.scaleBy(0.01, 1/10, 1/10),
                new cc.FadeIn(0.01),
                new cc.delayTime(0.7*(i+1)),
                new cc.MoveTo (0.01,cc.p((g_joannaStartX+g_nicolasStartX)/2,200)),
                new cc.Spawn (new cc.MoveTo(1.5,cc.p((g_joannaStartX+g_nicolasStartX)/2+100,500)).easing(cc.easeIn(2)),
                    new cc.scaleBy(1.5, 1.5, 1.5).easing(cc.easeIn(2)),
                    new cc.FadeOut(1.5).easing(cc.easeIn(2))
                )
            ));
        }

        //create the ground layer
        var spriteBONUS = [];

        var BONUSx = [500,550,700,750,800,850,1050,1450,1550,1900,2000,2050,2500,2550,3000,3500,3550,3750,3800,4200];
        var BONUSy = [0,0,90,90,0,0,90,90,0,90,0,90,90,90,0,90,0,0,90,35];
        this.bonusEtat = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];

        for (i = 0; i < 19; i++) {
            spriteBONUS [i] = new cc.Sprite(res.heart_png);
            spriteBONUS [i].setAnchorPoint(0, 0);
            spriteBONUS [i].setPosition(BONUSx[i], 135+BONUSy[i]);
            spriteBONUS [i].texture.setAliasTexParameters(false);
            this.addChild(spriteBONUS [i],0,i);
            this.getChildByTag(i).runAction(this.coeurActionBattre[i]);
        }
        spriteBONUS [19] = new cc.Sprite(res.gem_png);
        spriteBONUS [19].setAnchorPoint(0, 0);
        spriteBONUS [19].setPosition(BONUSx[19], 135+BONUSy[19]);
        spriteBONUS [19].texture.setAliasTexParameters(false);
        this.addChild(spriteBONUS [19],0,19);
        this.getChildByTag(19).runAction(this.coeurActionBattre[19]);
    },

    onPlay:function () {
        for (var i = 0; i < 20; i++) {
            this.getChildByTag(i).runAction(new cc.Sequence(new cc.MoveTo(g_duration, cc.p(-4900 + this.getChildByTag(i).getPositionX(), this.getChildByTag(i).getPositionY()))));
        }
    },

    onEnd:function () {
        for (var i = 0; i < 19; i++) {
            if(this.bonusEtat[i]==0){
                this.getChildByTag(i).runAction(this.coeurActionEnd[i]);
            }
        }
    }
});
