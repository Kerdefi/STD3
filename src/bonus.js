/**
 * Created by Nicolas on 20/06/2015.
 */
var bonusLayer = cc.Layer.extend({

    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();
        this.coeurAlive = false;
        this.bonusAlive = false;
        var self = this;

        //Création du coeur qui bas
        this.coeurActionBattre = new cc.Sequence(new cc.scaleBy(1.5, 1.3, 1.3), new cc.scaleBy(1.5, 1 / 1.3, 1 / 1.3));
        this.coeurActionBattre.repeatForever();
        this.coeurActionBattre.setTag(1);
        this.coeurActionTouche = new cc.Sequence(new cc.Spawn(new cc.scaleBy(0.5, 3, 3), new cc.FadeOut(0.5)),cc.callFunc(function() {self.deathCoeur(self)}));
        this.coeurActionTouche.setTag(2);

        var spriteCoeur = new cc.Sprite(res.heart_png);
        spriteCoeur.setAnchorPoint(0.5, 0.5);
        spriteCoeur.setPosition(0,0);
        spriteCoeur.visible = false;
        spriteCoeur.texture.setAliasTexParameters(true);
        this.addChild(spriteCoeur,0,0);
        this.getChildByTag(0).runAction(this.coeurActionBattre);

        //Création du bonus
        cc.spriteFrameCache.addSpriteFrames(res.divers_plist);
        var frameBonus = [];
        var frame = "emptyframe";
        var i = 0 ;
        while (frame!=null) {
            str = "divers/bonus/" + i + ".png";
            frame = cc.spriteFrameCache.getSpriteFrame(str);
            if(frame!=null) frameBonus.push(frame);
            i++;
        }
        var animBonus = new cc.Animation(frameBonus, 0.3);
        this.bonusAction = new cc.RepeatForever(new cc.Animate(animBonus));
        this.bonusAction.setTag(3);
        this.bonusActionTouche = new cc.Sequence(new cc.Spawn(new cc.scaleBy(0.5, 3, 3), new cc.FadeOut(0.5)),cc.callFunc(function() {self.deathBonus(self)}));
        this.bonusActionTouche.setTag(4);

        var spriteBonus = new cc.Sprite(res.heart_png);
        spriteBonus.setAnchorPoint(0.5, 0.5);
        spriteBonus.setPosition(0,0);
        spriteBonus.visible = false;
        spriteBonus.texture.setAliasTexParameters(true);
        this.addChild(spriteBonus,0,1);
        this.getChildByTag(1).runAction(this.bonusAction);
    },

    onUpdate:function () {
        if(this.coeurAlive) {
            this.getChildByTag (0).setPosition(this.getChildByTag (0).getPositionX(),this.getChildByTag (0).getPositionY() - (g_blocksize * g_enp.framestep * g_blockspeed));

            //Vérifie si colision avec le joueur
            var player = new cc.Rect(this.getParent().getChildByTag(TagOfLayer.player).getChildByTag(TagOfPlayer.player).getPositionX(),
                this.getParent().getChildByTag(TagOfLayer.player).getChildByTag(TagOfPlayer.player).getPositionY(),
                this.getParent().getChildByTag(TagOfLayer.player).getChildByTag(TagOfPlayer.player).width/2,
                this.getParent().getChildByTag(TagOfLayer.player).getChildByTag(TagOfPlayer.player).height/2);
            var bonusrect = new cc.Rect(this.getChildByTag(0).getPositionX(),
                this.getChildByTag(0).getPositionY(),
                this.getChildByTag(0).width/2,
                this.getChildByTag(0).height/2);

            if(cc.rectIntersectsRect(player, bonusrect)) {
                this.getChildByTag(0).runAction(this.coeurActionTouche);
                this.coeurAlive = false;
                //ajouter gain vie
                this.getParent().getChildByTag(TagOfLayer.player).addHealth(g_bonushealthgain);
            }
            //Vérifie si le point est toujours dans le cadre
            if(this.getParent().getChildByTag(TagOfLayer.player).getChildByTag(TagOfPlayer.player).getPositionY()<-g_blocksize) {
                this.deathCoeur(this);
                this.coeurAlive = false;
            }
        }
        if(this.bonusAlive) {
            this.getChildByTag (1).setPosition(this.getChildByTag (1).getPositionX(),this.getChildByTag (1).getPositionY() - (g_blocksize * g_enp.framestep * g_blockspeed));

            //Vérifie si colision avec le joueur
            var player = new cc.Rect(this.getParent().getChildByTag(TagOfLayer.player).getChildByTag(TagOfPlayer.player).getPositionX(),
                this.getParent().getChildByTag(TagOfLayer.player).getChildByTag(TagOfPlayer.player).getPositionY(),
                this.getParent().getChildByTag(TagOfLayer.player).getChildByTag(TagOfPlayer.player).width/2,
                this.getParent().getChildByTag(TagOfLayer.player).getChildByTag(TagOfPlayer.player).height/2);
            var bonusrect = new cc.Rect(this.getChildByTag(1).getPositionX(),
                this.getChildByTag(1).getPositionY(),
                this.getChildByTag(1).width/2,
                this.getChildByTag(1).height/2);

            if(cc.rectIntersectsRect(player, bonusrect)) {
                this.getChildByTag(1).runAction(this.bonusActionTouche);
                this.bonusAlive = false;
                //ajouter gain XP
                this.getParent().getChildByTag(TagOfLayer.player).addXP(g_bonusxpgain);
            }
            //Vérifie si le point est toujours dans le cadre
            if(this.getParent().getChildByTag(TagOfLayer.player).getChildByTag(TagOfPlayer.player).getPositionY()<-g_blocksize) {
                this.deathBonus(this);
                this.bonusAlive = false;
            }
        }
    },

    createCoeur:function(position) {
        if(!this.coeurAlive) {
            this.getChildByTag(0).visible = true;
            this.getChildByTag(0).opacity = 255;
            this.getChildByTag (0).setPosition(position.x,position.y);
            this.getChildByTag(0).runAction(this.coeurActionBattre);
            this.coeurAlive = true;
        }
    },

    createBonus:function(position) {
        if(!this.bonusAlive) {
            this.getChildByTag(1).visible = true;
            this.getChildByTag(1).opacity = 255;
            this.getChildByTag (1).setPosition(position.x,position.y);
            this.getChildByTag(1).runAction(this.bonusAction);
            this.bonusAlive = true;
        }
    },

    deathCoeur:function (self) {
        self.getChildByTag(0).stopAllActions();
        self.getChildByTag(0).setScale(1,1);
        self.getChildByTag(0).visible = false;
    },

    deathBonus:function (self) {
        self.getChildByTag(1).stopAllActions();
        self.getChildByTag(1).setScale(1,1);
        self.getChildByTag(1).visible = false;
    }
});
