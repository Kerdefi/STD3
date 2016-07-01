var playerLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        //Variable clé du joueur
        this.levels = [0,0,0];
        this.levelgrowth = [0,0,0];
        this.levelmax = 2;
        this.levelgrowthmax = 100;
        this.weapons = ["sword","bow","spell"];
        this.mana = 100;
        this.managrowth = 3;
        this.maxmana = 100;
        this.manacost = 17;
        this.health = 100;
        this.maxhealth = 100;
        this.weapon = 1;
        this.isShooting = false;
        this.shootcountdown = [0,0,0];
        this.shootduration = [[7,0.2,0.05],[7,0.2,0.05]];
        this.player = Math.round(Math.random());
        this.playerposition = new cc.math.Vec2(100, 300);
        this.playerspeed = new cc.math.Vec2(0, 0);
        this.playerspeedmax = 600;
        this.damage = 0;
        this.damageduration = 0.1;
        this.shield = 0;
        this.shieldduration = 1;
        this.reloading = 0;
        this.reloadingduration = 0.2;

        this.init();
    },

    init:function () {
        this._super();

        var i = 0;
        var j = 0;
        var k = 0;
        var l = 0;
        var frame ;
        var self = this;
        this.flyText = [[],[]];
        this.flyAnim = [[],[]];
        this.flyAction = [[],[]];
        this.shootText = [[],[]];
        this.shootAnim = [[],[]];
        this.shootAction = [[],[]];
        this.lvlupText = [[],[]];
        this.lvlupAnim = [];
        this.lvlupAction = [];
        this.summondeathText = [[],[]];
        this.summondeathAnim = [];
        this.summondeathAction = [];

        //Create les sprites players
        cc.spriteFrameCache.addSpriteFrames(res.joanna_plist);
        this.createAnimationChara (this.flyText[0],this.flyAnim[0],this.flyAction[0],"joanna/fly/",TagOfAction.fly,"forever");
        this.createAnimationChara (this.shootText[0],this.shootAnim[0],this.shootAction[0],"joanna/shoot/",TagOfAction.shoot,"once");
        this.createAnim(this.lvlupText[0],this.lvlupAnim,this.lvlupAction,"joanna/levelup/","once");
        this.createAnim(this.summondeathText[0],this.summondeathAnim,this.summondeathAction,"joanna/deathsummon/","once");

        cc.spriteFrameCache.addSpriteFrames(res.nicolas_plist);
        this.createAnimationChara (this.flyText[1],this.flyAnim[1],this.flyAction[1],"nicolas/fly/",TagOfAction.fly,"forever");
        this.createAnimationChara (this.shootText[1],this.shootAnim[1],this.shootAction[1],"nicolas/shoot/",TagOfAction.shoot,"once");
        this.createAnim(this.lvlupText[1],this.lvlupAnim,this.lvlupAction,"nicolas/levelup/","once");
        this.createAnim(this.summondeathText[1],this.summondeathAnim,this.summondeathAction,"nicolas/deathsummon/","once");

        //spriteplayer
        var player = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("joanna/fly/sword1/0.png"));
        player.setAnchorPoint(0.5, 0.5);
        player.setPosition(this.playerposition);
        player.texture.setAliasTexParameters(true);
        player.visible=true;
        this.addChild(player,1,TagOfPlayer.player);
        this.getChildByTag(TagOfPlayer.player).runAction (this.flyAction[this.player][this.weapon][this.levels[this.weapon]]);

        //spriteanim
        var anim = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("joanna/fly/sword1/0.png"));
        anim.setAnchorPoint(0.5, 0.5);
        anim.setPosition(this.playerposition);
        anim.setScale(2,2);
        anim.texture.setAliasTexParameters(true);
        anim.visible=false;
        this.addChild(anim,2,TagOfPlayer.anim);

        //spritedamage
        var damage = new cc.Sprite(res.damage_png);
        damage.setAnchorPoint(0.5, 0.5);
        damage.setScale(2,2);
        damage.setPosition(this.playerposition);
        damage.texture.setAliasTexParameters(true);
        damage.visible=false;
        this.addChild(damage,2,TagOfPlayer.damage);

        //spritereloading
        var sreloading = new cc.Sprite(res.reloading_png);
        sreloading.setAnchorPoint(0.5, 0.5);
        sreloading.setPosition(this.playerposition);
        sreloading.texture.setAliasTexParameters(true);
        sreloading.visible=false;
        this.addChild(sreloading,2,TagOfPlayer.reloading);

        //sprite sword shoot
        var swordshoot = new cc.Sprite(res.swordshoot_png);
        swordshoot.setAnchorPoint(0.5, 0.5);
        swordshoot.setScale(3,3);
        swordshoot.setPosition(this.playerposition);
        swordshoot.texture.setAliasTexParameters(true);
        swordshoot.visible=false;
        this.addChild(swordshoot,2,TagOfPlayer.swordshoot);

        var swordaction = new cc.Sequence(new cc.FadeOut(0.25), new cc.FadeIn(0.25));
        swordaction.repeatForever();

        this.getChildByTag(TagOfPlayer.swordshoot).runAction(swordaction);

        //sprite joannashield
        var jshield = new cc.Sprite(res.jshield_png);
        jshield.setAnchorPoint(0.5, 0.5);
        jshield.setScale(3,3);
        jshield.setPosition(this.playerposition);
        jshield.texture.setAliasTexParameters(true);
        jshield.visible=false;
        this.addChild(jshield,2,TagOfPlayer.jshield);

        var jshieldaction = new cc.Sequence(new cc.FadeOut(0.5), new cc.FadeIn(0.5));
        jshieldaction.repeatForever();

        this.getChildByTag(TagOfPlayer.jshield).runAction(jshieldaction);

        //sprite nicolasshield
        var nshield = new cc.Sprite(res.nshield_png);
        nshield.setAnchorPoint(0.5, 0.5);
        nshield.setScale(3,3);
        nshield.setPosition(this.playerposition);
        nshield.texture.setAliasTexParameters(true);
        nshield.visible=false;
        this.addChild(nshield,2,TagOfPlayer.nshield);

        var nshieldaction = new cc.Sequence(new cc.FadeOut(0.5), new cc.FadeIn(0.5));
        nshieldaction.repeatForever();

        this.getChildByTag(TagOfPlayer.nshield).runAction(nshieldaction);


        //Add controler
        this.gp = new gp_check (null,null,this.shoot,null,this.changeweapon,null,this.change,null,this.centerlr,this.left,this.right,this.centerud,this.down,this.up);

        //Add keyboard stroke listener
        if( 'keyboard' in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyReleased:function(key, event) {
                    if(g_gamestate == TagOfState.run) { switch(key) {
                    case cc.KEY.q:
                        self.playerspeed.x=self.playerspeed.x < 0 ? 0 : self.playerspeed.x;
                        break;
                    case cc.KEY.d:
                        self.playerspeed.x=self.playerspeed.x > 0 ? 0 : self.playerspeed.x;
                        break;
                    case cc.KEY.s:
                        self.playerspeed.y=self.playerspeed.y < 0 ? 0 : self.playerspeed.y;
                        break;
                    case cc.KEY.z:
                        self.playerspeed.y=self.playerspeed.y > 0 ? 0 : self.playerspeed.y;
                        break;
                    case cc.KEY.j:
                        self.changeweapon(self);
                        break;
                    case cc.KEY.k:
                            if(!self.isShooting) {
                                self.levels [0] = self.levels [0] == self.levelmax ? 0 : self.levels [0] + 1;
                                self.levels [1] = self.levels [1] == self.levelmax ? 0 : self.levels [1] + 1;
                                self.levels [2] = self.levels [2] == self.levelmax ? 0 : self.levels [2] + 1;
                                self.getChildByTag(TagOfPlayer.player).stopAllActions();
                                self.getChildByTag(TagOfPlayer.player).runAction (self.flyAction[self.player][self.weapon][self.levels[self.weapon]]);

                                self.getChildByTag(TagOfPlayer.anim).visible=true;
                                self.getChildByTag(TagOfPlayer.anim).stopAllActions();
                                self.getChildByTag(TagOfPlayer.anim).runAction (new cc.Sequence(self.lvlupAction[self.player],cc.callFunc(function() {self.getChildByTag(TagOfPlayer.anim).visible=false},self)));
                                self.adjustPosition (self);
                            }
                        break;
                    case cc.KEY.l:
                            self.change(self);
                        break;
                    case cc.KEY.a:
                        self.shoot(self);
                        break;
                    }}
                }
            }, this);

            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed:function(key, event) {
                    if(g_gamestate == TagOfState.run) { switch(key) {
                    case cc.KEY.q:
                        self.left(self);
                        break;
                    case cc.KEY.d:
                        self.right(self);
                        break;
                    case cc.KEY.s:
                        self.up(self);
                        break;
                    case cc.KEY.z:
                        self.down(self);
                        break;
                    }}
                }
            }, this);
        }
    },

    change:function(self) {
        if(g_gamestate == TagOfState.run) {
            if(!self.isShooting) {
                self.player = self.player == 1 ? 0 : self.player + 1;
                self.getChildByTag(TagOfPlayer.player).stopAllActions();
                self.getChildByTag(TagOfPlayer.player).runAction (self.flyAction[self.player][self.weapon][self.levels[self.weapon]]);

                self.getChildByTag(TagOfPlayer.anim).visible=true;
                self.getChildByTag(TagOfPlayer.anim).stopAllActions();
                self.getChildByTag(TagOfPlayer.anim).runAction (new cc.Sequence(self.summondeathAction[self.player],cc.callFunc(function() {self.getChildByTag(TagOfPlayer.anim).visible=false},self)));
                self.adjustPosition (self);
            }
        }
    },

    changeweapon:function(self) {
        if(g_gamestate == TagOfState.run) {
            if(!self.isShooting) {
                self.weapon = self.weapon == 2 ? 0 : self.weapon + 1;
                self.getChildByTag(TagOfPlayer.player).stopAllActions();
                self.getChildByTag(TagOfPlayer.player).runAction (self.flyAction[self.player][self.weapon][self.levels[self.weapon]]);
                self.adjustPosition (self);
            }
        }
    },

    up:function(self) {
        if(g_gamestate == TagOfState.run) self.playerspeed.y=-self.playerspeedmax;
    },

    down:function(self) {
        if(g_gamestate == TagOfState.run) self.playerspeed.y=self.playerspeedmax;
    },

    left:function(self) {
        if(g_gamestate == TagOfState.run) {
            self.playerspeed.x=-self.playerspeedmax;
            self.getChildByTag(TagOfPlayer.player).flippedX = true;
        }
    },

    right:function(self) {
        if(g_gamestate == TagOfState.run) {
            self.playerspeed.x=self.playerspeedmax;
            self.getChildByTag(TagOfPlayer.player).flippedX = false;
        }
    },

    centerud:function(self) {
        if(g_gamestate == TagOfState.run) self.playerspeed.y = 0;
    },

    centerlr:function(self) {
        if(g_gamestate == TagOfState.run) self.playerspeed.x = 0;
    },

    createAnimationChara:function (text,anim,action,target,tag,repeat) {
        var i = 0;
        var j = 0;
        var k = 0;
        var l = 0;
        var frame ;

        //Création du pack de texture/animation player
        for(i = 0 ; i < 3 ; i++) {
            text.push([]);
            anim.push([]);
            action.push([]);

            for(j = 0 ; j < 3 ; j++) {
                k = 0 ;
                text[i].push([]);
                frame = "emptyframe";
                while (frame!=null) {
                    l = j+1;
                    str = target+this.weapons[i]+""+l+"/" + k + ".png";
                    frame = cc.spriteFrameCache.getSpriteFrame(str);
                    if(frame!=null) text[i][j].push(frame);
                    k++;
                }
                anim[i].push (new cc.Animation(text[i][j], g_animtime));
                if(repeat=="forever") action[i].push (new cc.RepeatForever(new cc.Animate(anim[i][j])));
                else action[i].push (new cc.Animate(anim[i][j]));
                action[i][j].setTag(tag+i*10+j);
            }
        }
    },

    createAnim:function (text,anim,action,target,tag,repeat) {
        var i = 0;
        var frame ;

        frame = "emptyframe";
        while (frame!=null) {
            str = target + i + ".png";
            frame = cc.spriteFrameCache.getSpriteFrame(str);
            if(frame!=null) text.push(frame);
            i++;
        }
        anim.push(new cc.Animation(text, g_animtime));
        if(repeat=="forever") action.push(new cc.RepeatForever(new cc.Animate(anim[anim.length-1])));
        else action.push(new cc.Animate(anim[anim.length-1]));
        action[action.length-1].setTag(tag);
    },

    shoot:function (self) {
         if(g_gamestate == TagOfState.run) {
            if (!self.isShooting && self.shootcountdown[self.weapon]==0 && (self.weapon!=2 || self.mana >= self.manacost)) {
                if(self.weapon == 0) {
                    var pos = new cc.math.Vec2(Math.round(self.playerposition.x/g_blocksize),Math.round((self.playerposition.y)/g_blocksize+3));
                    if(self.player == 0) g_enp.addForce (new encophys.force ("joannasword"+(self.levels[self.weapon]+1), pos));
                    else g_enp.addForce (new encophys.force ("nicolassword"+(self.levels[self.weapon]+1), pos));
                    //Ajoute de la vie
                    self.addHealth(g_swordhealth[self.levels[self.weapon]]);
                } else {
                    //crée le projectile
                    var projectilepos = new cc.math.Vec2(self.playerposition.x, self.playerposition.y+g_blocksize*3);

                    if(self.weapon==1) {
                        //créée plusieurs projectiles
                        if(self.levels[1]==1) {
                            if (!self.getParent().getChildByTag(TagOfLayer.bullets).addBullet(new cc.math.Vec2(self.playerposition.x-2*g_blocksize, self.playerposition.y+g_blocksize*3),new cc.math.Vec2(0,20),self.player,self.weapon,self.levels[self.weapon])) return false;

                            self.getParent().getChildByTag(TagOfLayer.bullets).addBullet(new cc.math.Vec2(self.playerposition.x+2*g_blocksize, self.playerposition.y+g_blocksize*3),new cc.math.Vec2(0,20),self.player,self.weapon,self.levels[self.weapon]);
                        } else {
                            if (!self.getParent().getChildByTag(TagOfLayer.bullets).addBullet(new cc.math.Vec2(self.playerposition.x, self.playerposition.y+g_blocksize*3),new cc.math.Vec2(0,20),self.player,self.weapon,self.levels[self.weapon])) return false;

                            if(self.levels[1]==2) {
                                self.getParent().getChildByTag(TagOfLayer.bullets).addBullet(new cc.math.Vec2(self.playerposition.x-3*g_blocksize, self.playerposition.y+g_blocksize*3),new cc.math.Vec2(0,20),self.player,self.weapon,self.levels[self.weapon]);

                                self.getParent().getChildByTag(TagOfLayer.bullets).addBullet(new cc.math.Vec2(self.playerposition.x+3*g_blocksize, self.playerposition.y+g_blocksize*3),new cc.math.Vec2(0,20),self.player,self.weapon,self.levels[self.weapon]);
                            }
                        }

                    } else {
                        if (!self.getParent().getChildByTag(TagOfLayer.bullets).addBullet(new cc.math.Vec2(self.playerposition.x, self.playerposition.y+g_blocksize*3),new cc.math.Vec2(0,20),self.player,self.weapon,self.levels[self.weapon])) return false;
                    }
                }
                if(self.weapon==2) {
                    self.mana = Math.max(self.mana-self.manacost,0);
                    self.shield = self.shieldduration;
                }

                self.isShooting=true;
                self.getChildByTag(TagOfPlayer.player).stopAllActions();
                self.getChildByTag(TagOfPlayer.player).runAction (new cc.Sequence(self.shootAction[self.player][self.weapon][self.levels[self.weapon]],cc.callFunc(function() {self.shootEnd(self)},self)));
                //self.getChildByTag(TagOfPlayer.player).runAction (new cc.Sequence(new cc.Spawn (new cc.Sequence(new cc.scaleBy(0.2, 2.0, 2.0), new cc.scaleBy(0.2, 0.5, 0.5)),new cc.Sequence(self.shootAction[self.player][self.weapon][self.levels[self.weapon]])),cc.callFunc(function() {self.shootEnd(self)},self)));
            } else {
                if (self.weapon == 0 || (self.weapon == 2 && self.mana < self.manacost)) self.reloading = self.reloadingduration;
            }
        }
    },

    shootEnd:function (self) {
        self.getChildByTag(TagOfPlayer.player).runAction (self.flyAction[self.player][self.weapon][self.levels[self.weapon]]);
        self.shootcountdown[self.weapon] = self.shootduration[self.player][self.weapon];
        self.isShooting=false;
    },

    onUpdate:function () {
        this.gp.update(this);

        //Détecte si la partie est finie
        if(this.health <= 0 && g_gamestate == TagOfState.run) {
            g_gamestate = TagOfState.endanim ;
            var self = this;
            this.playerspeed.x = 0;
            this.playerspeed.y = 0;

            this.getChildByTag(TagOfPlayer.player).runAction(new cc.FadeOut(0.5));

            this.getChildByTag(TagOfPlayer.anim).visible=true;
            this.getChildByTag(TagOfPlayer.anim).stopAllActions();
            this.getChildByTag(TagOfPlayer.anim).runAction (new cc.Sequence(self.summondeathAction[self.player],cc.callFunc(function() {
                g_gamestate = TagOfState.end;
                g_enp.changeState(encophys.PAUSE);
                self.getParent().getChildByTag(TagOfLayer.end).init();
            },this)));
        }

        //mise à jour de la position
        if(this.playerspeed.x != 0 || this.playerspeed.y != 0) {
            this.playerposition.x+=this.playerspeed.x*g_enp.framestep;
            this.playerposition.y+=this.playerspeed.y*g_enp.framestep;
            this.adjustPosition (this);
        }

        //affiche les dégats
        if(this.reloading > 0) {
            this.getChildByTag(TagOfPlayer.reloading).visible = true;
            this.reloading -= g_enp.framestep;
        }
        else {
            this.getChildByTag(TagOfPlayer.reloading).visible = false;
            this.reloading = 0;
        }

        //affiche les dégats
        if(this.damage > 0) {
            this.getChildByTag(TagOfPlayer.damage).visible = true;
            this.damage -= g_enp.framestep;
        }
        else {
            this.getChildByTag(TagOfPlayer.damage).visible = false;
            this.damage = 0;
        }

        //affiche le shield
        if(this.shield > 0) {
            if(this.player == 0) {
                this.getChildByTag(TagOfPlayer.jshield).visible = true;
                this.getChildByTag(TagOfPlayer.nshield).visible = false;
            }
            else {
                this.getChildByTag(TagOfPlayer.nshield).visible = true;
                this.getChildByTag(TagOfPlayer.jshield).visible = false;
            }
            this.shield -= g_enp.framestep;
        }
        else {
            this.getChildByTag(TagOfPlayer.nshield).visible = false;
            this.getChildByTag(TagOfPlayer.jshield).visible = false;
            this.shield = 0;
        }

        //Rempli la jauge de mana
        this.mana = this.mana + this.managrowth*g_enp.framestep > this.maxmana ? this.maxmana : this.mana + this.managrowth*g_enp.framestep;

        //Réduit le shootcountdown
        this.shootcountdown[0] = this.shootcountdown[0] - g_enp.framestep < 0 ? 0 : this.shootcountdown[0] - g_enp.framestep;
        this.shootcountdown[1] = this.shootcountdown[1] - g_enp.framestep < 0 ? 0 : this.shootcountdown[1] - g_enp.framestep;
        this.shootcountdown[2] = this.shootcountdown[2] - g_enp.framestep < 0 ? 0 : this.shootcountdown[2] - g_enp.framestep;

        //Affiche le swordshoot
        if(this.weapon == 0 && this.isShooting) {
            this.getChildByTag(TagOfPlayer.swordshoot).visible=true;
        } else this.getChildByTag(TagOfPlayer.swordshoot).visible=false;

        //Ajuste le niveau d'XP
        for (var i = 0 ; i < 3 ; i++) {
            if(!this.isShooting && this.levelgrowth[i] >= this.levelgrowthmax && this.levels [i] != this.levelmax) {
                this.levels [i] +=1;
                this.levelgrowth[i] = this.levelgrowth[i]-this.levelgrowthmax;
                this.getChildByTag(TagOfPlayer.player).stopAllActions();
                this.shootEnd(this);
                this.getChildByTag(TagOfPlayer.anim).visible=true;
                this.getChildByTag(TagOfPlayer.anim).stopAllActions();
                var self = this;
                this.getChildByTag(TagOfPlayer.anim).runAction (new cc.Sequence(this.lvlupAction[this.player],cc.callFunc(function() {self.getChildByTag(TagOfPlayer.anim).visible=false},self)));
                this.adjustPosition (this);
            }
        }
    },

    addXP:function (xp) {
        //this.levelgrowth[this.weapon]+=xp;
        this.levelgrowth[0]+=xp;
        this.levelgrowth[1]+=xp;
        this.levelgrowth[2]+=xp;
    },

    addHealth:function (heal) {
        this.health = Math.min(this.health+heal,this.maxhealth);
    },

    //Contrôle si le joueur ne sort pas du cadre
    adjustPosition:function (self){
        var winsize = cc.director.getWinSize();

        if(self.getChildByTag(TagOfPlayer.player).getPosition().x - self.getChildByTag(TagOfPlayer.player).getContentSize().width/2 < 0) { self.playerposition.x = self.getChildByTag(TagOfPlayer.player).getContentSize().width/2; } else {
            if(self.getChildByTag(TagOfPlayer.player).getPosition().x + self.getChildByTag(TagOfPlayer.player).getContentSize().width/2 > winsize.width) self.playerposition.x = winsize.width-self.getChildByTag(TagOfPlayer.player).getContentSize().width/2;
        }
        if(self.getChildByTag(TagOfPlayer.player).getPosition().y - self.getChildByTag(TagOfPlayer.player).getContentSize().height/2 < 0) { self.playerposition.y = self.getChildByTag(TagOfPlayer.player).getContentSize().height/2; } else {
            if(self.getChildByTag(TagOfPlayer.player).getPosition().y + self.getChildByTag(TagOfPlayer.player).getContentSize().height/2 > winsize.height - 10*g_blocksize) self.playerposition.y = winsize.height-10*g_blocksize-self.getChildByTag(TagOfPlayer.player).getContentSize().height/2;
        }

        self.getChildByTag(TagOfPlayer.player).setPosition(self.playerposition);
        self.getChildByTag(TagOfPlayer.anim).setPosition(self.playerposition);
        self.getChildByTag(TagOfPlayer.damage).setPosition(self.playerposition);
        self.getChildByTag(TagOfPlayer.swordshoot).setPosition(self.playerposition);
        self.getChildByTag(TagOfPlayer.jshield).setPosition(self.playerposition);
        self.getChildByTag(TagOfPlayer.nshield).setPosition(self.playerposition);
        self.getChildByTag(TagOfPlayer.reloading).setPosition(self.playerposition);
    }
});
