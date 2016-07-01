/**
 * Created by Nicolas on 20/06/2015.
 */
//Layer d'info
var infoLayer = cc.Layer.extend({

    ctor:function () {
        this._super();
    },

    init:function () {
        this._super();

        //Création de l'indicateur vie
        for(var i = 0 ; i < 10 ; i++) {
            var spriteCoeur = new cc.Sprite(res.heart_png);
            spriteCoeur.setAnchorPoint(0.5, 0.5);
            spriteCoeur.setPosition(90+i*30,20);
            spriteCoeur.texture.setAliasTexParameters(true);
            this.addChild(spriteCoeur,0,i);
        }
        //Création de l'indicateur de mana
        for(var i = 0 ; i < 10 ; i++) {
            var spriteMana = new cc.Sprite(res.mana_png);
            spriteMana.setAnchorPoint(0.5, 0.5);
            spriteMana.setPosition(90+i*30,50);
            spriteMana.texture.setAliasTexParameters(true);
            this.addChild(spriteMana,0,100+i);
        }
        //Création de l'indicateur de niveau
        for(var i = 0 ; i < 3 ; i++) {
            var spriteLevel = new cc.Sprite(res.level_png);
            spriteLevel.setAnchorPoint(0.5, 0.5);
            spriteLevel.setPosition(90+i*30,80);
            spriteLevel.texture.setAliasTexParameters(true);
            this.addChild(spriteLevel,0,1000+i);
        }

        //affichage du score
        g_score = 0;
        this.labelScore = new cc.LabelTTF("Score : "+g_score, "Helvetica", 20);
        this.labelScore.setColor(cc.color(255,215,0));//black color
        this.labelScore.setAnchorPoint(cc.p(0, 0));
        this.labelScore.setPosition(cc.p(10, 980));
        this.addChild(this.labelScore,99,10000);

        //Affiche player
        var label = new cc.LabelTTF("The Bride - Joanna", "Helvetica", 20);
        label.setColor(cc.color(255,215,0));//black color
        label.setAnchorPoint(cc.p(0, 0));
        label.setPosition(cc.p(10, 950));
        this.addChild(label,99,10001);

        //Affiche weapon
        var label2 = new cc.LabelTTF("Sword", "Helvetica", 20);
        label2.setColor(cc.color(255,215,0));//black color
        label2.setAnchorPoint(cc.p(0, 0));
        label2.setPosition(cc.p(10, 920));
        this.addChild(label2,99,10003);

        //Affiche reloading
        var label1 = new cc.LabelTTF("Reloading", "Helvetica", 20);
        label1.setColor(cc.color(255,215,0));//black color
        label1.setAnchorPoint(cc.p(0, 0));
        label1.setPosition(cc.p(10, 100));
        label1.visible = false;
        this.addChild(label1,99,10002);

        //Texte fixe level
        var label3 = new cc.LabelTTF("Level : ", "Helvetica", 20);
        label3.setColor(cc.color(255,215,0));//black color
        label3.setAnchorPoint(cc.p(0, 0));
        label3.setPosition(cc.p(10, 70));
        this.addChild(label3,99,10004);

        //Texte fixe mana
        var label4 = new cc.LabelTTF("Mana : ", "Helvetica", 20);
        label4.setColor(cc.color(255,215,0));//black color
        label4.setAnchorPoint(cc.p(0, 0));
        label4.setPosition(cc.p(10, 40));
        this.addChild(label4,99,10005);

        //Texte fixe life
        var label5 = new cc.LabelTTF("Life : ", "Helvetica", 20);
        label5.setColor(cc.color(255,215,0));//black color
        label5.setAnchorPoint(cc.p(0, 0));
        label5.setPosition(cc.p(10, 10));
        this.addChild(label5,99,10006);

    },

    onUpdate:function () {
        //Change le score
        g_score += g_enp.framestep*g_blockspeed;
        //this.getChildByTag(10000).setString ("Score : " + Math.round(g_score) + " fps : "+ Math.round(cc.director._frameRate));
        this.getChildByTag(10000).setString ("Score : " + Math.round(g_score));

        //Change le player
        if(this.getParent().getChildByTag(TagOfLayer.player).player == 0) this.getChildByTag(10001).setString ("The Bride - Joanna");
        else this.getChildByTag(10001).setString ("The groom - Nicolas");

        //Change le reloading
        if(this.getParent().getChildByTag(TagOfLayer.player).isShooting || this.getParent().getChildByTag(TagOfLayer.player).shootcountdown[this.getParent().getChildByTag(TagOfLayer.player).weapon]!=0) this.getChildByTag(10002).visible = true ;
        else this.getChildByTag(10002).visible = false ;

        //Change le weapon
        if(this.getParent().getChildByTag(TagOfLayer.player).weapon == 0) this.getChildByTag(10003).setString ("Sword");
        if(this.getParent().getChildByTag(TagOfLayer.player).weapon == 1) this.getChildByTag(10003).setString ("Bow");
        if(this.getParent().getChildByTag(TagOfLayer.player).weapon == 2) this.getChildByTag(10003).setString ("Spell");


        //Recalibre l'indicateur de vie
        var healthlimit = Math.min(this.getParent().getChildByTag(TagOfLayer.player).health,this.getParent().getChildByTag(TagOfLayer.player).maxhealth) % 10 ;
        var fullheart = Math.floor(Math.min(this.getParent().getChildByTag(TagOfLayer.player).health,this.getParent().getChildByTag(TagOfLayer.player).maxhealth)/10);
        for(var i = 0 ; i < 10 ; i++) {
            if(i < fullheart){
                this.getChildByTag(i).visible = true;
                this.getChildByTag(i).opacity = 255;
            } else {
                if (i == fullheart) {
                    this.getChildByTag(i).visible = true;
                    this.getChildByTag(i).opacity = Math.floor(healthlimit*25.5);
                } else {
                    this.getChildByTag(i).visible = false;
                }
            }
        }
        //Recalibre l'indicateur de mana
        var manalimit = Math.min(this.getParent().getChildByTag(TagOfLayer.player).mana,this.getParent().getChildByTag(TagOfLayer.player).maxmana) % 10 ;
        var fullmana = Math.floor(Math.min(this.getParent().getChildByTag(TagOfLayer.player).mana,this.getParent().getChildByTag(TagOfLayer.player).maxmana)/10);
        for(var i = 0 ; i < 10 ; i++) {
            if(i < fullmana){
                this.getChildByTag(100+i).visible = true;
                this.getChildByTag(100+i).opacity = 255;
            } else {
                if (i == fullmana) {
                    this.getChildByTag(100+i).visible = true;
                    this.getChildByTag(100+i).opacity = Math.floor(manalimit*25.5);
                } else {
                    this.getChildByTag(100+i).visible = false;
                }
            }
        }
        //Recalibre l'indicateur d'XP
        var xplimit = this.getParent().getChildByTag(TagOfLayer.player).levelgrowth[this.getParent().getChildByTag(TagOfLayer.player).weapon];
        var xp = this.getParent().getChildByTag(TagOfLayer.player).levels[this.getParent().getChildByTag(TagOfLayer.player).weapon];
        var loading = !this.getParent().getChildByTag(TagOfLayer.player).isShooting && this.getParent().getChildByTag(TagOfLayer.player).shootcountdown[this.getParent().getChildByTag(TagOfLayer.player).weapon] == 0 ? 1 : 0.5 ;
        this.getChildByTag(1000).opacity = Math.floor(255*loading);
        for(var i = 1 ; i < 3 ; i++) {
            if(i <= xp){
                this.getChildByTag(1000+i).visible = true;
                this.getChildByTag(1000+i).setColor(cc.color(255,255,255));
                this.getChildByTag(1000+i).opacity = Math.floor(255*loading);
            } else {
                if (i == xp+1) {
                    this.getChildByTag(1000+i).visible = true;
                    this.getChildByTag(1000+i).opacity = Math.floor(xplimit*2.55*loading);
                    this.getChildByTag(1000+i).setColor(cc.color(148,197,197));
                } else this.getChildByTag(1000+i).visible = false;
            }
        }
    }
});

//Layer de pause
var pauseLayer = cc.Layer.extend({

    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();

        this.selected = 0;

        //create the blur layer
        var spriteBG = new cc.Sprite(res.bkgnd_png);
        //spriteBG.texture.setAliasTexParameters(false);
        spriteBG.setAnchorPoint(0,0);
        spriteBG.setPosition(0,0);
        spriteBG.setScale(4,4);
        spriteBG.opacity = 200;
        this.addChild(spriteBG,0,2);

        var winsize = cc.director.getWinSize();

        var pos = cc.p(winsize.width / 2, winsize.height * 1.2 / 3);
        this.labelBonus = new cc.LabelTTF("Continue", "Helvetica", 30);
        this.labelBonus.setColor(cc.color(255,215,0));//black color
        this.labelBonus.setAnchorPoint(cc.p(0.5, 0.5));
        this.labelBonus.setPosition(pos);
        this.addChild(this.labelBonus,99,0);

        var pos = cc.p(winsize.width / 2, winsize.height / 3);
        this.labelBonus = new cc.LabelTTF("Quit", "Helvetica", 30);
        this.labelBonus.setColor(cc.color(255,215,0));//black color
        this.labelBonus.setAnchorPoint(cc.p(0.5, 0.5));
        this.labelBonus.setPosition(pos);
        this.addChild(this.labelBonus,99,1);

        this.textAction = new cc.Sequence(new cc.scaleBy(0.5, 1.1, 1.1), new cc.scaleBy(0.5, 1 / 1.1, 1 / 1.1));
        this.textAction.repeatForever();
        this.textAction.setTag(1);

        this.getChildByTag(0).runAction(this.textAction);
    },

    Toggle:function () {
        if(this.selected == 0) {
            this.getChildByTag(0).stopAllActions ();
            this.getChildByTag(1).runAction(this.textAction);
        } else {
            this.getChildByTag(1).stopAllActions ();
            this.getChildByTag(0).runAction(this.textAction);
        }
        this.selected = 1 - this.selected;
    },

    Click:function () {
        if(this.selected == 0) {
            g_gamestate = TagOfState.run;
        } else {
            g_gamestate = TagOfState.run;
            this.getParent().getChildByTag(TagOfLayer.player).health = 0;
        }
    }
});


//Layer de fin
var endLayer = cc.Layer.extend({

    ctor:function () {
        this._super();
    },

    init:function () {
        this._super();

        this.selected = 0;
        this.letter = [0,1,2];
        this.alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

        //create the blur layer
        var spriteBG = new cc.Sprite(res.bkgnd_png);
        //spriteBG.texture.setAliasTexParameters(false);
        spriteBG.setAnchorPoint(0,0);
        spriteBG.setPosition(0,0);
        spriteBG.setScale(4,4);
        spriteBG.opacity = 200;
        this.addChild(spriteBG,0,10);

        var winsize = cc.director.getWinSize();

        //Titre (à remplacer par un sprite)
        var pos = cc.p(winsize.width / 2, winsize.height * 1.5 / 3);
        var label = new cc.LabelTTF("Game Over", "Helvetica", 30);
        label.setColor(cc.color(255,215,0));//black color
        label.setAnchorPoint(cc.p(0.5, 0.5));
        label.setPosition(pos);
        this.addChild(label,99,0);

        //Label score
        pos = cc.p(winsize.width / 2, winsize.height * 1.4 / 3);
        label = new cc.LabelTTF("Score : " + Math.round(g_score), "Helvetica", 30);
        label.setColor(cc.color(255,215,0));//black color
        label.setAnchorPoint(cc.p(0.5, 0.5));
        label.setPosition(pos);
        this.addChild(label,99,1);

        //Label enter your name
        pos = cc.p(winsize.width / 2, winsize.height * 1.3 / 3);
        label = new cc.LabelTTF("Enter your name", "Helvetica", 30);
        label.setColor(cc.color(255,215,0));//black color
        label.setAnchorPoint(cc.p(0.5, 0.5));
        label.setPosition(pos);
        this.addChild(label,99,2);

        //Lettres
        pos = cc.p(winsize.width * 0.5 / 2, winsize.height * 1 / 3);
        label = new cc.LabelTTF("A", "Helvetica", 100);
        label.setColor(cc.color(255,215,0));//black color
        label.setAnchorPoint(cc.p(0.5, 0.5));
        label.setPosition(pos);
        this.addChild(label,99,3);

        pos = cc.p(winsize.width / 2, winsize.height * 1 / 3);
        label = new cc.LabelTTF("B", "Helvetica", 100);
        label.setColor(cc.color(255,215,0));//black color
        label.setAnchorPoint(cc.p(0.5, 0.5));
        label.setPosition(pos);
        this.addChild(label,99,4);

        pos = cc.p(winsize.width * 1.5 / 2, winsize.height * 1 / 3);
        label = new cc.LabelTTF("C", "Helvetica", 100);
        label.setColor(cc.color(255,215,0));//black color
        label.setAnchorPoint(cc.p(0.5, 0.5));
        label.setPosition(pos);
        this.addChild(label,99,5);

        this.textAction = new cc.Sequence(new cc.scaleBy(0.5, 1.1, 1.1), new cc.scaleBy(0.5, 1 / 1.1, 1 / 1.1));
        this.textAction.repeatForever();
        this.textAction.setTag(1);

        this.getChildByTag(3).runAction(this.textAction);

        //Add controler
        this.gp = new gp_check (null,this.start,null,this.start,null,this.start,null,this.start,null,null,null,null,this.down,this.up);

        var self = this;

        //Add keyboard stroke listener
        if('keyboard' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyReleased:function(key, event) {
                    //Si on est en help lance le jeu
                    if(key == cc.KEY.z) {self.up(self);}
                    if(key == cc.KEY.s) {self.down(self);}
                    if(key == cc.KEY.a) {
                        self.start(self);
                    }
                }
            }, this);
        }

        this.scheduleUpdate();
    },

    update:function() {
        this.gp.update(this);
    },

    up:function(self) {
        self.letter[self.selected] = (self.letter[self.selected] + 1) % 26;
        self.getChildByTag(self.selected+3).setString(self.alphabet[self.letter[self.selected]]);
    },

    down:function(self) {
        self.letter[self.selected] = self.letter[self.selected] - 1 == -1 ? 25 : self.letter[self.selected] - 1;
        self.getChildByTag(self.selected+3).setString(self.alphabet[self.letter[self.selected]]);
    },

    start:function(self) {
        //fin complète du jeu
        if(self.selected < 2) {
            self.selected++;
            self.getChildByTag(2+self.selected).stopAllActions();
            self.getChildByTag(2+self.selected).runAction(self.textAction);
            self.getChildByTag(3+self.selected).runAction(self.textAction);
        }
        else {
            for (var i = 4 ; i >= 0 ; i--) {
                if(g_score > g_highscore.score[i] && (i==0 || g_highscore.score[i-1] > g_score)) {
                    g_highscore.score.splice(i,0,Math.round(g_score));
                    g_highscore.player.splice(i,0,self.alphabet[self.letter[0]]+self.alphabet[self.letter[1]]+self.alphabet[self.letter[2]]);
                    g_highscore.score.pop();
                    g_highscore.player.pop();
                    i = -5;
                }
            }
            cc.sys.localStorage.setItem("HighScore", JSON.stringify(g_highscore));

            cc.director.runScene(new MenuScene());
        }
    }
});
