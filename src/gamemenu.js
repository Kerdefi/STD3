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
            spriteCoeur.setPosition(30+i*30,30);
            spriteCoeur.texture.setAliasTexParameters(true);
            this.addChild(spriteCoeur,0,i);
        }
        //Création de l'indicateur de mana
        for(var i = 0 ; i < 10 ; i++) {
            var spriteMana = new cc.Sprite(res.heart_png);
            spriteMana.setAnchorPoint(0.5, 0.5);
            spriteMana.setPosition(30+i*30,60);
            spriteMana.texture.setAliasTexParameters(true);
            this.addChild(spriteMana,0,100+i);
        }
        //Création de l'indicateur de niveau
        for(var i = 0 ; i < 3 ; i++) {
            var spriteLevel = new cc.Sprite(res.heart_png);
            spriteLevel.setAnchorPoint(0.5, 0.5);
            spriteLevel.setPosition(30+i*30,90);
            spriteLevel.texture.setAliasTexParameters(true);
            this.addChild(spriteLevel,0,1000+i);
        }

        //affichage du score
        this.labelScore = new cc.LabelTTF("Score : "+g_score, "Helvetica", 30);
        this.labelScore.setColor(cc.color(255,215,0));//black color
        this.labelScore.setAnchorPoint(cc.p(0, 0));
        this.labelScore.setPosition(cc.p(10, 980));
        this.addChild(this.labelScore,99,10000);
    },

    onUpdate:function () {
        //Change le score

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
        var loading = !this.getParent().getChildByTag(TagOfLayer.player).isShooting && this.getParent().getChildByTag(TagOfLayer.player).shootcountdown == 0 ? 1 : 0.5 ;
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
                    this.getChildByTag(1000+i).setColor(cc.color(100,100,0));
                } else this.getChildByTag(1000+i).visible = false;
            }
        }
    }
});

//Layer de pause
var pauseLayer = cc.Layer.extend({

    ctor:function () {
        this._super();
    },

    init:function () {
        this._super();
    },

    onUpdate:function () {
    }
});


//Layer de fin
var endLayer = cc.Layer.extend({

    ctor:function () {
        this._super();
    },

    init:function () {
        this._super();
    },

    onUpdate:function () {
    }
});
