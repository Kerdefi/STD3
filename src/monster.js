var monstersLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.monsters = [];
    },

    init:function () {
        this._super();
        var i = 0;
        for(i = 0 ; i < g_maxmonsters ; i++) {
            this.monsters.push(new monster (this,i));
        }
    },

    onUpdate:function () {
        var i = 0;
        for(i = 0 ; i < g_maxmonsters ; i++) {
            if(this.monsters[i].isAlive) this.monsters[i].onUpdate ();
        }
    },

    addMonster:function (position,level) {
        for(i = 0 ; i < g_maxmonsters ; i++) {
            if(this.monsters[i].isAlive == false) {
                this.monsters[i].create (position,level);
                return true ;
            }
        }
        return false;
    }
});

monster = function (layer,tag) {
    this.text = [] ;
    this.anim = [] ;
    this.action = [] ;
    this.layer = layer;
    this.tag = tag;
    this.isAlive = false;
    this.canShoot = [false,false,true,false,false,false,true,true,true,true] ;
    this.shootTime = [0,0,1.5,0,0,0,1.5,1.5,2.5,1.5] ;
    //Nombre de balles - doit être impair
    this.shootBullets = [0,0,3,0,0,0,9,5,0,9] ;
    this.shootAngle = [0,0,30,0,0,0,40,72,0,40] ;
    this.lifeArray = [5,10,10,15,5,25,20,25,30,35] ;
    this.sizeArray = [1,1,1,1,1,1,1,1,1,1] ;
    this.listOfActions = ["fly","die","shoot"];
    this.dying = false;
    var i = 0; //monster
    var j = 0; //actions
    var k = 0; //fame
    var frame ;
    var self = this;

    for(i = 0 ; i < 10 ; i++) {
        this.text.push([]);
        this.anim.push([]);
        this.action.push([]);

        cc.spriteFrameCache.addSpriteFrames(res.monsters_plist);

        for(j = 0 ; j < 3 ; j++) {
            if(this.canShoot[i] || j < 2) {
                this.text[i].push([]);
                frame = "emptyframe";
                k = 0;
                while (frame!=null) {
                    str = "monsters/m" + i + "/" + this.listOfActions[j] + "/" + k + ".png";
                    frame = cc.spriteFrameCache.getSpriteFrame(str);
                    if(frame!=null) this.text[i][j].push(frame);
                    k++;
                }
                this.anim[i].push(new cc.Animation(this.text[i][j], g_animtime/2));
                if(j==0) this.action[i].push(new cc.RepeatForever(new cc.Animate(this.anim[i][j])));
                else this.action[i].push(new cc.Animate(this.anim[i][j]));
                this.action[i][j].setTag(i*10+j);
            }
        }
    }

    //spriteplayer
    var monster = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("monsters/m0/fly/0.png"));
    monster.setAnchorPoint(0.5, 0.5);
    monster.setPosition(0,0);
    monster.setScale(g_scalemonster,g_scalemonster);
    monster.texture.setAliasTexParameters(true);
    monster.visible=false;
    layer.addChild(monster,1,this.tag);

    //Créée et lie à un point encophys
    this.create = function (position, level) {
        i = Math.round(position.x/g_blocksize);
        j = Math.round(position.y/g_blocksize);

        this.isAlive = true;
        this.layer.getChildByTag (this.tag).visible=true;
        this.layer.getChildByTag (this.tag).setPosition(position);
        this.layer.getChildByTag(this.tag).stopAllActions();
        this.layer.getChildByTag(this.tag).runAction (this.action[level][0]);
        this.level = level;
        this.speed = g_monstersmaxspeed * (1-2*Math.round(Math.random()));
        if (this.speed > 0) this.layer.getChildByTag (this.tag).flippedX = true;
        else this.layer.getChildByTag (this.tag).flippedX = false;
        this.life = this.lifeArray [level];
        this.shootCount = this.shootTime [level]*g_firstshoot;
        this.dying = false;
        this.shooting=false;
    };

    this.onUpdate = function () {
        if(!this.dying) {
            k = Math.max(0,Math.min(g_enp.size.x,Math.round(this.layer.getChildByTag (this.tag).getPositionX()/g_blocksize)));
            l = Math.min(g_enp.size.y,Math.round(this.layer.getChildByTag (this.tag).getPositionY()/g_blocksize));

            //TODO on vérifie que le monstre n'est pas complétement hors frame
            if(l<-this.sizeArray[this.level]) {
                this.death(this);
                return 0;
            } else l = Math.max(0,l);

            if((this.layer.getChildByTag (this.tag).getPositionX() + this.speed*g_enp.framestep)/g_blocksize < 1) {
                this.speed = g_monstersmaxspeed ;
                this.layer.getChildByTag (this.tag).flippedX = true;
            } else {
                if((this.layer.getChildByTag (this.tag).getPositionX() + this.speed*g_enp.framestep)/g_blocksize > g_enp.size.x - 1) {
                    this.speed = -g_monstersmaxspeed ;
                    this.layer.getChildByTag (this.tag).flippedX = false;
                }
            }
            this.layer.getChildByTag (this.tag).setPosition(this.layer.getChildByTag (this.tag).getPositionX() + this.speed*g_enp.framestep,this.layer.getChildByTag (this.tag).getPositionY() - (g_blocksize * g_enp.framestep * g_blockspeed));

            //Détruit les blocs personnage et repositionne les blocs personnages
            var k = 0;
            for (i = 0 ; i < g_enp.size.x ; i++) {
                for (j = 0 ; j < g_enp.size.y ; j++) {
                    if(g_enp.map[i][j]!=null && g_enp.map[i][j].index == BlockIndex.monsters+this.tag) {
                        k = Math.max(g_enp.destroy(i,j),k);
                        //g_enp.map[i][j]=null;
                        //g_enp.mapIddle[i][j]=false;
                    }
                }
            }
            this.life -= k;

            for (i = -this.sizeArray[this.level] ; i <= this.sizeArray[this.level] ; i++) {
                for (j = -this.sizeArray[this.level] ; j <= this.sizeArray[this.level] ; j++) {
                    k = Math.round(this.layer.getChildByTag (this.tag).getPositionX()/g_blocksize+i);
                    l = Math.round(this.layer.getChildByTag (this.tag).getPositionY()/g_blocksize+j);
                    if(g_enp.inLimits(k,l)) {
                        //ajouter dégats et mettre une animation
                        this.life -= g_enp.addPoint(k,l,"playermonster",this.lifeArray[this.level], BlockIndex.monsters+this.tag);
                    }
                }
            }

            //TODO on vérifie que le point est en vie si ce n'est pas le cas lance l'animation
            if(this.life <= 0) this.deathstart (true);

            //TODO shoot et update timer
            if(this.canShoot[this.level] && !this.shooting) this.shootCount = this.shootCount - g_enp.framestep > 0 ? this.shootCount - g_enp.framestep : this.shoot ();
        }
    };

    this.shoot = function () {
        if(!this.dying) {
            this.shooting=true;
            //Lance l'animation
            this.layer.getChildByTag(this.tag).stopAllActions();
            this.layer.getChildByTag(this.tag).runAction (new cc.Sequence(self.action[self.level][2],cc.callFunc(function() {self.shootend(self)},self)));
        }
        return this.shootTime [this.level];
    };

    this.shootend = function (self) {
        if(self.isAlive && !self.dying) {
            //Créée la bullet
            if (self.level != 8) {
                for (var i=-(self.shootBullets[self.level]-1)/2;i<=(self.shootBullets[self.level]-1)/2;i++) {
                    var position = new cc.math.Vec2(self.layer.getChildByTag (self.tag).getPositionX() + self.speed*0.5,self.layer.getChildByTag (self.tag).getPositionY());
                    var angle = (270+i*self.shootAngle[self.level])*3.14/180;
                    var speed = new cc.math.Vec2(g_monsterbulletspeed*Math.cos(angle),g_monsterbulletspeed*Math.sin(angle));
                    self.layer.getParent().getChildByTag(TagOfLayer.monstersbullet).addBullet(position,speed,self.level);
                }

            } else {
                //boom
                var boompos = new cc.math.Vec2(Math.round((this.layer.getChildByTag (this.tag).getPositionX() + self.speed*0.5)/g_blocksize),Math.round(this.layer.getChildByTag (this.tag).getPositionY()/g_blocksize-2));
                g_enp.addForce(new encophys.force("monstersarrow9",boompos));
            }

            self.shooting=false;
            self.layer.getChildByTag(self.tag).stopAllActions();
            self.layer.getChildByTag(self.tag).runAction (self.action[self.level][0]);
        }
    };

    this.deathstart = function (withhonor) {
        if(!this.dying) {
            if(!this.shooting) {
                //Détruit les blocs personnage et repositionne les blocs personnages
                for (i = 0 ; i < g_enp.size.x ; i++) {
                    for (j = 0 ; j < g_enp.size.y ; j++) {
                        if(g_enp.map[i][j]!=null && g_enp.map[i][j].index == BlockIndex.monsters+this.tag) {
                            g_enp.destroy(i,j);
                            //g_enp.map[i][j]=null;
                            //g_enp.mapIddle[i][j]=false;
                        }
                    }
                }
                this.layer.getChildByTag(this.tag).stopAllActions();
                this.layer.getChildByTag(this.tag).runAction (new cc.Sequence(self.action[self.level][1],cc.callFunc(function() {self.death(self)},self)));
                this.dying = true;
                //déclenche l'explosion si le monstre déclenche des explosions
                if(this.level == 4) {
                    //boom
                    var boompos = new cc.math.Vec2(Math.round(this.layer.getChildByTag (this.tag).getPositionX()/g_blocksize),Math.round(this.layer.getChildByTag (this.tag).getPositionY()/g_blocksize));
                    g_enp.addForce(new encophys.force("monstersarrow5",boompos));
                }
                //Créée un bonus (si la chance est du bon côté)
                if(Math.random()<g_bonusproba && withhonor) {
                    //Une chance sur deux d'avoir une vie par rapport à XP
                    if(Math.random()<0.5) {
                        this.layer.getParent().getChildByTag(TagOfLayer.bonus).createCoeur (new cc.math.Vec2 (this.layer.getChildByTag (this.tag).getPositionX(),this.layer.getChildByTag (this.tag).getPositionY()));
                    } else {
                        this.layer.getParent().getChildByTag(TagOfLayer.bonus).createBonus (new cc.math.Vec2 (this.layer.getChildByTag (this.tag).getPositionX(),this.layer.getChildByTag (this.tag).getPositionY()));
                    }
                    //Augmente l'expérience
                    this.layer.getParent().getChildByTag(TagOfLayer.player).addXP(g_monsterxpgain);
                }
                if (this.life == 0) return 0;
                else return this.lifeArray[this.level]*g_monsterdamagemultiplier;
            } else {
                this.life = 0;
                if (this.life == 0) return 0;
                else return this.lifeArray[this.level]*g_monsterdamagemultiplier;
            }
        }
    };

    this.death = function (self) {
        //libère l'espace
        //this.layer.getChildByTag(this.tag).stopAllActions();
        self.isAlive = false;
        self.layer.getChildByTag (self.tag).visible=false;
    };
};
