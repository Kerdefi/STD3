//Mettre une animation damage

var bulletsLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.bullets = [];

        this.init();
    },

    init:function () {
        this._super();
        var i = 0;
        for(i = 0 ; i < g_maxbullets ; i++) {
            this.bullets.push(new bullet (this,i));
        }
    },

    onUpdate:function () {
        var i = 0;
        for(i = 0 ; i < g_maxbullets ; i++) {
            if(this.bullets[i].isAlive) this.bullets[i].onUpdate ();
        }
    },

    addBullet:function (type,position,speed,player,weapon,level) {
        for(i = 0 ; i < g_maxbullets ; i++) {
            if(this.bullets[i].isAlive == false) {
                this.bullets[i].create (type,position,speed,player,weapon,level);
                return true ;
            }
        }
        return false;
    }
});

bullet = function (layer,tag) {
    //A updater pour intégrer les projectiles monstres
    this.text = [] ;
    this.anim = [] ;
    this.action = [] ;
    this.layer = layer;
    this.tag = tag;
    this.isAlive = false;
    var players = ["joanna","nicolas"];
    var weapons = ["arrow","spell"];
    var i = 0; //Player
    var j = 0; //Weapon
    var k = 0; //Level
    var l = 0; //frame
    var frame ;

    for(i = 0 ; i < 2 ; i++) {
        this.text.push([]);
        this.anim.push([]);
        this.action.push([]);

        if(i==0) cc.spriteFrameCache.addSpriteFrames(res.joanna_plist);
        else cc.spriteFrameCache.addSpriteFrames(res.nicolas_plist);

        for(j = 0 ; j < 2 ; j++) {
            this.text[i].push([]);
            this.anim[i].push([]);
            this.action[i].push([]);
            for(k = 0 ; k < 3 ; k++) {
                this.text[i][j].push([]);
                frame = "emptyframe";
                l = 0;
                while (frame!=null) {
                    str = players[i]+"/bullets/"+ weapons[j] + (k+1) + "/" + l + ".png";
                    frame = cc.spriteFrameCache.getSpriteFrame(str);
                    if(frame!=null) this.text[i][j][k].push(frame);
                    l++;
                }
                this.anim[i][j].push(new cc.Animation(this.text[i][j][k], g_animtime));
                this.action[i][j].push(new cc.RepeatForever(new cc.Animate(this.anim[i][j][k])));
                this.action[i][j][k].setTag(i*100+j*10+k);
            }
        }
    }

    //spriteplayer
    var bullet = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("nicolas/fly/sword1/0.png"));
    bullet.setAnchorPoint(0.5, 0.5);
    bullet.setPosition(0,0);
    bullet.texture.setAliasTexParameters(true);
    bullet.visible=false;
    layer.addChild(bullet,1,this.tag);
    this.layer.getChildByTag(this.tag).runAction (this.action[0][1][0]);

    //Créée et lie à un point encophys
    this.create = function (type,position,speed,player,weapon,level) {
        this.position = position;
        i = Math.round(this.position.x/g_blocksize);
        j = Math.round(this.position.y/g_blocksize);

        if(g_enp.addPoint(i,j,type,0,BlockIndex.bullets+this.tag)!=g_enp.creationCancelled) {
            this.isAlive = true;
            g_enp.map[i][j].speed = speed;
            this.layer.getChildByTag (this.tag).visible=true;
            this.layer.getChildByTag (this.tag).setPosition(this.position);
            this.layer.getChildByTag(this.tag).stopAllActions();
            this.layer.getChildByTag(this.tag).runAction (this.action[player][weapon-1][level]);
            this.player = player;
            this.weapon = weapon;
            this.level = level;
        }
    };

    this.onUpdate = function () {
        k = Math.max(0,Math.min(g_enp.size.x,Math.round(this.position.x/g_blocksize)));
        l = Math.max(0,Math.min(g_enp.size.y,Math.round(this.position.y/g_blocksize)));

        //on cherche le point où il était
        if(g_enp.map[k][l] != null && g_enp.map[k][l].index == BlockIndex.bullets + this.tag) {
            this.position.x = g_blocksize*(k + g_enp.map[k][l].smoothposition.x);
            this.position.y = g_blocksize*(l + g_enp.map[k][l].smoothposition.y) + this.layer.getParent().getChildByTag(TagOfLayer.block).offsetblock;
            this.layer.getChildByTag (this.tag).setPosition(this.position);
            return true;
        }

        //trouve le point et vérifie que le point est en vie
        for(i = 0 ; i < g_enp.size.x ; i++) {
            for(j = 0 ; j < g_enp.size.y ; j++) {
                if(g_enp.map[i][j] != null && g_enp.map[i][j].index == BlockIndex.bullets + this.tag) {
                    this.position.x = g_blocksize*(i + g_enp.map[i][j].smoothposition.x);
                    this.position.y = g_blocksize*(j + g_enp.map[i][j].smoothposition.y) + this.layer.getParent().getChildByTag(TagOfLayer.block).offsetblock;
                    this.layer.getChildByTag (this.tag).setPosition(this.position);
                    return true;
                }
            }
        }
        this.death();
    };

    this.death = function () {
        //libère l'espace
        this.isAlive = false;
        this.layer.getChildByTag (this.tag).visible=false;
        //déclenche l'explosion
        this.layer.getParent().getChildByTag(TagOfLayer.booms).addBoom(this.position,this.player,this.weapon,this.level);
    };
};
