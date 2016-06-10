var monstersbulletLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.monsterbullets = [];

        this.init();
    },

    init:function () {
        this._super();
        var i = 0;
        for(i = 0 ; i < g_maxbullets ; i++) {
            this.monsterbullets.push(new monsterbullet (this,i));
        }
    },

    onUpdate:function () {
        var i = 0;
        var player = new cc.Rect(this.getParent().getChildByTag(TagOfLayer.player).getChildByTag(TagOfPlayer.player).getPositionX(),
                this.getParent().getChildByTag(TagOfLayer.player).getChildByTag(TagOfPlayer.player).getPositionY(),
                this.getParent().getChildByTag(TagOfLayer.player).getChildByTag(TagOfPlayer.player).width/2,
                this.getParent().getChildByTag(TagOfLayer.player).getChildByTag(TagOfPlayer.player).height/2);
        for(i = 0 ; i < g_maxbullets ; i++) {
            if(this.monsterbullets[i].isAlive) this.monsterbullets[i].onUpdate (player);
        }
    },

    addBullet:function (position,speed,level) {
        for(i = 0 ; i < g_maxbullets ; i++) {
            if(this.monsterbullets[i].isAlive == false) {
                this.monsterbullets[i].create (position,speed,level);
                return true ;
            }
        }
        return false;
    }
});

monsterbullet = function (layer,tag) {
    //A updater pour intégrer les projectiles monstres
    this.text = [] ;
    this.anim = [] ;
    this.action = [] ;
    this.layer = layer;
    this.tag = tag;
    this.isAlive = false;
    this.canShoot = [false,false,true,false,false,false,true,true,false,true] ;
    var i = 0; //Level
    var j = 0; //frame
    var frame ;

    cc.spriteFrameCache.addSpriteFrames(res.monsters_plist);

    for(i = 0 ; i < 10 ; i++) {
        this.text.push([]);
        frame = "emptyframe";
        j = 0;
        while (frame!=null) {
            str = "monsters/m" + i + "/bullet/" + j + ".png";
            frame = cc.spriteFrameCache.getSpriteFrame(str);
            if(frame!=null) this.text[i].push(frame);
            j++;
        }
        this.anim.push(new cc.Animation(this.text[i], g_animtime));
        this.action.push(new cc.RepeatForever(new cc.Animate(this.anim[i])));
        this.action[i].setTag(i);
    }

    //spriteplayer
    var bullet = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("monsters/m9/bullet/0.png"));
    bullet.setAnchorPoint(0.5, 0.5);
    bullet.setPosition(0,0);
    bullet.texture.setAliasTexParameters(true);
    bullet.visible=false;
    layer.addChild(bullet,1,this.tag);

    //Créée et lie à un point encophys
    this.create = function (position,speed,level) {
        this.position = position;
        this.speed = speed;
        this.speed.scale (g_enp.framestep);
        this.isAlive = true;
        this.layer.getChildByTag (this.tag).visible=true;
        this.layer.getChildByTag (this.tag).setPosition(this.position);
        //Rotate
        var angle = Math.acos(speed.x*1/speed.length())*180/3.14;
        if (level != 7 && level !=6) this.layer.getChildByTag (this.tag).setRotation(angle);
        else this.layer.getChildByTag (this.tag).setRotation(0);
        this.layer.getChildByTag(this.tag).stopAllActions();
        this.layer.getChildByTag(this.tag).runAction (this.action[level]);
        this.level = level;
    };

    this.onUpdate = function (player) {
        //On déplace le point
        this.position.add(this.speed);
        this.position.y -= g_blocksize * g_enp.framestep * g_blockspeed;
        this.layer.getChildByTag (this.tag).setPosition(this.position);
        //On check s'il est dans le cadre
        if(this.position.x < -g_blocksize || this.position.x > 768+g_blocksize || this.position.y < -g_blocksize || this.position.y > 1024+g_blocksize) this.death (false) ;
        //On check s'il est en colision avec le joueur
        var bulletrect = new cc.Rect(this.layer.getChildByTag(this.tag).getPositionX(),
                this.layer.getChildByTag(this.tag).getPositionY(),
                this.layer.getChildByTag(this.tag).width/2,
                this.layer.getChildByTag(this.tag).height/2);

        if(cc.rectIntersectsRect(player, bulletrect)) {
            this.death (true);
            //On applique les dégats
            this.layer.getParent().getChildByTag(TagOfLayer.player).damage = this.layer.getParent().getChildByTag(TagOfLayer.player).damageduration;
        }
    };

    this.death = function (withboom) {
        //libère l'espace
        this.isAlive = false;
        this.layer.getChildByTag (this.tag).visible=false;
        //déclenche l'explosion
        if(withboom) this.layer.getParent().getChildByTag(TagOfLayer.booms).addBoom(this.position,2,1,this.level);
    };
};
