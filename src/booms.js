var boomsLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.booms = [];
    },

    init:function () {
        this._super();
        var i = 0;
        for(i = 0 ; i < g_maxbooms ; i++) {
            this.booms.push(new boom (this,i));
        }
    },

    onUpdate:function () {
        var i = 0;
        for(i = 0 ; i < g_maxbooms ; i++) {
            if(this.booms[i].isAlive) this.booms[i].onUpdate ();
        }
    },

    addBoom:function (position,player,weapon,level) {
        for(i = 0 ; i < g_maxbooms ; i++) {
            if(this.booms[i].isAlive == false) {
                this.booms[i].create (position,player,weapon,level);
                return true ;
            }
        }
        return false;
    }
});

boom = function (layer,tag) {
    //A updater pour intégrer les projectiles monstres
    this.text = [] ;
    this.anim = [] ;
    this.action = [] ;
    this.layer = layer;
    this.tag = tag;
    this.isAlive = false;
    var players = ["joanna","nicolas","monsters"];
    var weapons = ["arrow","spell"];
    this.levelmap = [2,6,7,9];
    var i = 0; //Player
    var j = 0; //Weapon
    var k = 0; //Level
    var l = 0; //frame
    var m = 0; //max weapon
    var n = 0; //max level
    var frame ;
    var self = this;

    for(i = 0 ; i < 3 ; i++) {
        this.text.push([]);
        this.anim.push([]);
        this.action.push([]);

        m = 2;
        n = 3;
        if(i==0) cc.spriteFrameCache.addSpriteFrames(res.joanna_plist);
        else {
            if(i==1) cc.spriteFrameCache.addSpriteFrames(res.nicolas_plist);
            else  {
                cc.spriteFrameCache.addSpriteFrames(res.monsters_plist);
                m = 1;
                n = 4;
            }
        }

        for(j = 0 ; j < m ; j++) {
            this.text[i].push([]);
            this.anim[i].push([]);
            this.action[i].push([]);
            for(k = 0 ; k < n ; k++) {
                this.text[i][j].push([]);
                frame = "emptyframe";
                l = 0;
                while (frame!=null) {
                    //vérifie si on est en monstre ou player
                    if(m==2) str = players[i]+"/booms/"+ weapons[j] + (k+1) + "/" + l + ".png";
                    else str = "monsters/m"+this.levelmap[k]+"/boom/"+ l + ".png";
                    frame = cc.spriteFrameCache.getSpriteFrame(str);
                    if(frame!=null) this.text[i][j][k].push(frame);
                    l++;
                }
                this.anim[i][j].push(new cc.Animation(this.text[i][j][k], g_animtime*0.75));
                this.action[i][j].push(new cc.Animate(this.anim[i][j][k]));
                this.action[i][j][k].setTag(i*100+j*10+k);
            }
        }
    }

    //spriteplayer
    var boom = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("monsters/m0/fly/0.png"));
    boom.setAnchorPoint(0.5, 0.5);
    boom.setPosition(0,0);
    boom.setScale(g_scaleboom,g_scaleboom);
    boom.texture.setAliasTexParameters(true);
    boom.visible=false;
    this.layer.addChild(boom,1,this.tag+100);
    this.layer.getChildByTag(this.tag+100).runAction (this.action[0][1][0]);

    //Créée et lie à un point encophys
    this.create = function (position,player,weapon,level) {
        i = Math.round(position.x/g_blocksize);
        j = Math.round(position.y/g_blocksize);

        g_enp.addForce(new encophys.force(players[player]+weapons[weapon-1]+(level+1),new cc.math.Vec2(i,j)));

        this.isAlive = true;

        var truelevel = player==2 ? this.levelmap.indexOf(level) : level;

        this.layer.getChildByTag (this.tag+100).visible=true;
        this.layer.getChildByTag (this.tag+100).setPosition(position);
        this.layer.getChildByTag(this.tag+100).stopAllActions();
        this.layer.getChildByTag(this.tag+100).runAction (new cc.Sequence(this.action[player][weapon-1][truelevel],cc.callFunc(this.death)));
    };

    this.onUpdate = function () {
        this.layer.getChildByTag (this.tag+100).setPosition(this.layer.getChildByTag (this.tag+100).getPositionX(),this.layer.getChildByTag (this.tag+100).getPositionY() - (g_blocksize * g_enp.framestep * g_blockspeed));
    };

    this.death = function () {
        //libère l'espace
        self.isAlive = false;
        self.layer.getChildByTag(self.tag+100).visible=false;
    };
};
