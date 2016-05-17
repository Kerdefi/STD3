/**
 * Created by Nicolas on 20/06/2015.
 */
var BackgroundLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();
        //create the background image and position it at the center of screen
        var spriteBG = new cc.Sprite(res.STD_Back_png);
        //spriteBG.texture.setAliasTexParameters(false);
        spriteBG.setAnchorPoint(0,0);
        spriteBG.setPosition(0,0);
        spriteBG.setScale(3600/spriteBG.getContentSize().width,360/spriteBG.getContentSize().height);
        this.addChild(spriteBG,0,0);

        var spriteBandeau = new cc.Sprite(res.bandeau_png);
        spriteBandeau.texture.setAliasTexParameters(false);
        spriteBandeau.setAnchorPoint(0,0);
        spriteBandeau.setPosition(0,0);
        spriteBandeau.setScale(480/spriteBandeau.getContentSize().width,130/spriteBandeau.getContentSize().height);
        this.addChild(spriteBandeau,1,5);
    },

    onPlay:function () {
        this.getChildByTag(0).runAction(new cc.Sequence(new cc.MoveTo(g_duration,cc.p(-3120,0))));
    }
});

var frameLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();

        var backFrame = new cc.Sprite(res.backframe_png);
        backFrame.texture.setAliasTexParameters(false);
        backFrame.setAnchorPoint(0,0);
        backFrame.setPosition(0,0);
        backFrame.setScale(480/backFrame.getContentSize().width,360/backFrame.getContentSize().height);
        this.addChild(backFrame);

        var backFrame2 = new cc.Sprite(res.backframe2_png);
        backFrame2.texture.setAliasTexParameters(false);
        backFrame2.setAnchorPoint(0,0.5);
        backFrame2.setPosition(0,90);
        backFrame2.setScale(480/backFrame2.getContentSize().width,40/backFrame2.getContentSize().height);
        this.addChild(backFrame2);
    }
});