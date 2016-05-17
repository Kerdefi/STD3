/**
 * Created by Nicolas on 20/06/2015.
 */
var groundLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();
        //create the ground layer
        var spriteGD = [];

        for (var i = 0; i < 120; i++) {
            if (i<24) {
                spriteGD [i] = new cc.Sprite(res.mineMid_png);
            }else {
                if (i<48) {
                    spriteGD [i] = new cc.Sprite(res.grassMid_png);
                }else {
                    if (i<72) {
                        spriteGD [i] = new cc.Sprite(res.dirtMid_png);
                    }else {
                        if (i<105) {
                            spriteGD [i] = new cc.Sprite(res.snowMid_png);
                        }else {
                            spriteGD [i] = new cc.Sprite(res.grassMid_png);
                        }
                    }
                }

            }
            spriteGD [i].texture.setAliasTexParameters(false);
            spriteGD [i].setAnchorPoint(0, 0);
            spriteGD [i].setPosition(i*45, 90);
            spriteGD [i].setScale(45 / spriteGD [i].getContentSize().width, 45 / spriteGD [i].getContentSize().height);
            this.addChild(spriteGD [i],0,i);
        }
    },

    onPlay:function () {
        //très sale, à optimiser
        for (var i = 0; i < 120; i++) {
            this.getChildByTag(i).runAction(new cc.Sequence(new cc.MoveTo(g_duration, cc.p(-4900+i*45, 90))));
        }
    }
});