var MainLayer = cc.Layer.extend({
    ctor : function(){
        //1. call super class's ctor function
        this._super();
    },
    init:function(){
        //call super class's super function
        this._super();

        //EncoPhys
        g_enp = new encophys.world () ;
        g_enp.init ("src/encophys/encophys.json");

        //2. get the screen size of your game canvas et construit les variables
        var winsize = cc.director.getWinSize();

        //3. create a background image and set it's position at the center of the screen
        this.addChild(new BackgroundLayer(),-100,TagOfLayer.background);
        this.addChild(new animationLayer(),0,TagOfLayer.animation);
        this.addChild(new groundLayer(),1,TagOfLayer.ground);
        this.addChild(new decorationLayer(),2,TagOfLayer.decoration);
        this.addChild(new bonusLayer(),3,TagOfLayer.bonus);
        this.addChild(new frameLayer(),100,TagOfLayer.frame);

        //4.
        cc.MenuItemFont.setFontSize(60);

        //3. calculate the center point
        var buttonpos = cc.p(winsize.width / 2, winsize.height / 8);

        //6.create a menu and assign onPlay event callback to it
        var menuItemPlay = new cc.MenuItemSprite(
            new cc.Sprite(res.start_n_png), // normal state image
            new cc.Sprite(res.start_s_png), // select state image
            this.onClick, this);


        var menu = new cc.Menu(menuItemPlay);  //7. create the menu
        menu.setAnchorPoint(0,0);
        menu.setPosition(0,0);
        menuItemPlay.setScale(0.75,0.75);
        menuItemPlay.setAnchorPoint(0.5,0.5);
        menuItemPlay.setPosition(buttonpos);

        this.addChild(menu,98,200);

        var menuSound = new cc.MenuItemSprite(new cc.Sprite(res.soundon_png), new cc.Sprite(res.soundon_png),this.onClickSound,this);

        var menu2 = new cc.Menu(menuSound);  //7. create the menu sound
        menu2.setAnchorPoint(0,0);
        menu2.setPosition(0,0);

        menuSound.setAnchorPoint (0,0);
        menuSound.setPosition(10,10);

        this.addChild(menu2,98,205);

        this.labelBonus = new cc.LabelTTF("Score : " + g_bonusCount, "Helvetica", 12);
        this.labelBonus.setColor(cc.color(0,0,0));//black color
        this.labelBonus.setAnchorPoint(cc.p(0, 0));
        this.labelBonus.setPosition(cc.p(20, 330));
        this.addChild(this.labelBonus,99,100);

        cc.audioEngine.playMusic(res.music_mp3, true);
        cc.audioEngine.setEffectsVolume(0.1);

        this.scheduleUpdate();
    },

    onClickSound : function () {
        if (g_sound == 0) {
            cc.audioEngine.resumeMusic();
            g_sound = 1;
        }else {
            cc.audioEngine.pauseMusic();
            g_sound = 0;
        }
    },

    onClick : function(){
        if(g_gamestate==1) {
            this.getChildByTag(TagOfLayer.animation).onJump();
        }
        if(g_gamestate==0){
            cc.log("==game started");
            this.getChildByTag(TagOfLayer.background).onPlay();
            this.getChildByTag(TagOfLayer.ground).onPlay();
            this.getChildByTag(TagOfLayer.decoration).onPlay();
            this.getChildByTag(TagOfLayer.bonus).onPlay();
            this.getChildByTag(TagOfLayer.animation).onPlay();

            this.labelLevel = new cc.LabelTTF("Niveau : Amis Mineurs", "Helvetica", 12);
            this.labelLevel.setColor(cc.color(0,0,0));//black color
            this.labelLevel.setAnchorPoint(cc.p(1, 0));
            this.labelLevel.setPosition(cc.p(460, 330));
            this.addChild(this.labelLevel,99,101);

            //Changement du menu
            this.removeChildByTag(200);

            var winsize = cc.director.getWinSize();
            var buttonpos = cc.p(winsize.width / 2, winsize.height / 8);
            var menuItemPlay = new cc.MenuItemSprite(
                new cc.Sprite(res.jump_n_png), // normal state image
                new cc.Sprite(res.jump_s_png), // select state image
            this.onClick, this);
            var menu = new cc.Menu(menuItemPlay);  //7. create the menu
            menu.setAnchorPoint(0,0);
            menu.setPosition(0,0);
            menuItemPlay.setScale(0.75,0.75);
            menuItemPlay.setAnchorPoint(0.5,0.5);
            menuItemPlay.setPosition(buttonpos);
            this.addChild(menu,98,200);

            g_gamestate = 1 ;
        }
    },

    update:function () {

        //Test fin de jeu
        if(this.getChildByTag(TagOfLayer.background).getChildByTag(0).getPositionX() < -3119 && g_gamestate == 1){
            g_gamestate = 2 ;
            this.removeChildByTag(200);

            //Save the Date
            var STD = new cc.Sprite(res.STD_png);
            STD.texture.setAliasTexParameters(false);
            STD.setAnchorPoint(0.5,0.5);
            STD.setPosition(240,45);
            this.addChild(STD);

            /**var labelSTD = new cc.LabelTTF("SAVE THE DATE - 23/07/2016", "Helvetica", 20);
            labelSTD.setColor(cc.color(255,255,255));//white color
            labelSTD.setAnchorPoint(cc.p(0.5, 0.5));
            labelSTD.setPosition(cc.p(230, 45));
            this.addChild(labelSTD,99,105);*/

            //Animation coeur
            this.getChildByTag(TagOfLayer.bonus).onEnd ();
        }

        if (g_gamestate == 2) {
            this.getChildByTag(TagOfLayer.animation).onUpdate();
        }

        //Gestion en cours de jeu
        if (g_gamestate == 1) {
            //Update Animation
            this.getChildByTag(TagOfLayer.animation).onUpdate();

            //Nom niveau
            if (this.getChildByTag(TagOfLayer.background).getChildByTag(0).getPositionX() > -720) {
                this.getChildByTag(101).setString("Level 1 : Amis Mineurs");
            } else {
                if (this.getChildByTag(TagOfLayer.background).getChildByTag(0).getPositionX() > -1440) {
                    this.getChildByTag(101).setString("Level 2 : Nihon ni Ikimashou");
                } else {
                    if (this.getChildByTag(TagOfLayer.background).getChildByTag(0).getPositionX() > -2160) {
                        this.getChildByTag(101).setString("Level 3 : Objectif 6a");
                    } else {
                        if (this.getChildByTag(TagOfLayer.background).getChildByTag(0).getPositionX() > -2880) {
                            this.getChildByTag(101).setString("Level 4 : L'alliance");
                        } else {
                            this.getChildByTag(101).setString("Level 5 : Le mariage       ");
                        }
                    }
                }
            }

            //Detect collision
            var bonus;
            var hero;
            var hero2;

            hero = new cc.Rect(this.getChildByTag(TagOfLayer.animation).getChildByTag(1).getPositionX(),
                this.getChildByTag(TagOfLayer.animation).getChildByTag(1).getPositionY(),
                this.getChildByTag(TagOfLayer.animation).getChildByTag(1).getContentSize().width/2,
                this.getChildByTag(TagOfLayer.animation).getChildByTag(1).getContentSize().height/2);

            hero2 = new cc.Rect(this.getChildByTag(TagOfLayer.animation).getChildByTag(2).getPositionX(),
                this.getChildByTag(TagOfLayer.animation).getChildByTag(2).getPositionY(),
                this.getChildByTag(TagOfLayer.animation).getChildByTag(2).getContentSize().width/2,
                this.getChildByTag(TagOfLayer.animation).getChildByTag(2).getContentSize().height/2);

            for (var i = 0; i < 20; i++) {
                bonus = new cc.Rect(this.getChildByTag(TagOfLayer.bonus).getChildByTag(i).getPositionX(),
                    this.getChildByTag(TagOfLayer.bonus).getChildByTag(i).getPositionY(),
                    this.getChildByTag(TagOfLayer.bonus).getChildByTag(i).getContentSize().width,
                    this.getChildByTag(TagOfLayer.bonus).getChildByTag(i).getContentSize().height);

                if ((cc.rectIntersectsRect(hero, bonus) || cc.rectIntersectsRect(hero2, bonus)) && this.getChildByTag(TagOfLayer.bonus).bonusEtat [i]==1) {

                    if (i==19) {
                        g_bonusCount=g_bonusCount+810;
                    }else {
                        g_bonusCount=g_bonusCount+10;
                    }
                    if (g_sound == 1) {
                        cc.audioEngine.playEffect(res.pick_mp3);
                    }
                    this.getChildByTag(TagOfLayer.bonus).bonusEtat [i]=0;
                    this.getChildByTag(TagOfLayer.bonus).getChildByTag(i).runAction(this.getChildByTag(TagOfLayer.bonus).coeurActionTouche[i]);
                    this.getChildByTag(100).setString("Score : " + g_bonusCount + " test " + g_enp.timestep);
                }
            }


            //Lance et arr�te la neige
            if (this.getChildByTag(TagOfLayer.background).getChildByTag(0).getPositionX() < -2000 && this.getChildByTag(TagOfLayer.decoration).isSnowing==0) {
                this.getChildByTag(TagOfLayer.decoration).onSnow ();
            }
            if (this.getChildByTag(TagOfLayer.background).getChildByTag(0).getPositionX() < -2700 && this.getChildByTag(TagOfLayer.decoration).isSnowing==1) {
                this.getChildByTag(TagOfLayer.decoration).onEndSnow ();
            }
        }
    }
});

var MainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MainLayer();
        layer.init();
        this.addChild(layer,0,TagOfLayer.Menu);
    }
});
