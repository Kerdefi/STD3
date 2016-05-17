/**
 * Created by Nicolas on 20/06/2015.
 */
var animationLayer = cc.Layer.extend({
    heroSaute:0,
    joannaActionMarche:null,
    joannaActionDebout:null,
    joannaActionDebout2:null,
    joannaActionSaute:null,
    nicoActionMarche:null,
    nicoActionDebout:null,
    nicoActionDebout2:null,
    nicoActionSaute:null,
    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();

        //1.load spritesheet
        cc.spriteFrameCache.addSpriteFrames(res.joanna_plist);

        //WALK
        var frameJoanna = [];
        for (var i = 0; i < 4; i++) {
            var str = "walk1_Frame_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            frameJoanna.push(frame);
        }
        //3.create a animation with the spriteframe array along with a period time
        var animJoannaMarche = new cc.Animation(frameJoanna, 0.15);

        //4.wrap the animate action with a repeat forever action
        this.joannaActionMarche = new cc.RepeatForever(new cc.Animate(animJoannaMarche));
        this.joannaActionMarche.setTag(11);

        //STAND
        frameJoanna = [];
        for (i = 0; i < 3; i++) {
            str = "stand1_Frame_" + i + ".png";
            frame = cc.spriteFrameCache.getSpriteFrame(str);
            frameJoanna.push(frame);
        }
        //3.create a animation with the spriteframe array along with a period time
        var animJoannaDebout = new cc.Animation(frameJoanna, 0.5);

        //4.wrap the animate action with a repeat forever action
        this.joannaActionDebout = new cc.RepeatForever(new cc.Animate(animJoannaDebout));
        this.joannaActionDebout.setTag(10);

        //STAND2
        frameJoanna = [];
        for (i = 0; i < 3; i++) {
            str = "stand2_Frame_" + i + ".png";
            frame = cc.spriteFrameCache.getSpriteFrame(str);
            frameJoanna.push(frame);
        }
        //3.create a animation with the spriteframe array along with a period time
        var animJoannaDebout2 = new cc.Animation(frameJoanna, 0.5);

        //4.wrap the animate action with a repeat forever action
        this.joannaActionDebout2 = new cc.RepeatForever(new cc.Animate(animJoannaDebout2));
        this.joannaActionDebout2.setTag(10);

        //JUMP
        frameJoanna = [];
        str = "jump_Frame_0.png";
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        frameJoanna.push(frame);
        var animJoannaSaute = new cc.Animation(frameJoanna, 0.15);
        this.joannaActionSaute = new cc.RepeatForever(new cc.Animate(animJoannaSaute));
        this.joannaActionSaute.setTag(12);


        var spriteJoanna = new cc.Sprite(res.heart_png);
        spriteJoanna.texture.setAliasTexParameters(false);
        spriteJoanna.flippedX = true;
        spriteJoanna.setAnchorPoint(0,0);
        spriteJoanna.setPosition(g_joannaStartX,135);
        spriteJoanna.setScale(0.65,0.65);
        this.addChild(spriteJoanna,0,2);

        this.getChildByTag(2).runAction(this.joannaActionDebout);


        //1.load spritesheet
        //cc.SpriteFrameCache.purgeSharedSpriteFrameCache();
        cc.spriteFrameCache.addSpriteFrames(res.nico_plist);

        //WALK
        var frameNico = [];
        for (i = 0; i < 4; i++) {
            str = "n_walk1_Frame_" + i + ".png";
            frame = cc.spriteFrameCache.getSpriteFrame(str);
            frameNico.push(frame);
        }
        //3.create a animation with the spriteframe array along with a period time
        var animNicoMarche = new cc.Animation(frameNico, 0.15);

        //4.wrap the animate action with a repeat forever action
        this.nicoActionMarche = new cc.RepeatForever(new cc.Animate(animNicoMarche));
        this.nicoActionMarche.setTag(11);

        //STAND
        frameNico = [];
        for (i = 0; i < 3; i++) {
            str = "n_stand1_Frame_" + i + ".png";
            frame = cc.spriteFrameCache.getSpriteFrame(str);
            frameNico.push(frame);
        }
        //3.create a animation with the spriteframe array along with a period time
        var animNicoDebout = new cc.Animation(frameNico, 0.5);

        //4.wrap the animate action with a repeat forever action
        this.nicoActionDebout = new cc.RepeatForever(new cc.Animate(animNicoDebout));
        this.nicoActionDebout.setTag(10);

        //STAND2
        frameNico = [];
        for (i = 0; i < 3; i++) {
            str = "n_stand2_Frame_" + i + ".png";
            frame = cc.spriteFrameCache.getSpriteFrame(str);
            frameNico.push(frame);
        }
        //3.create a animation with the spriteframe array along with a period time
        var animNicoDebout2 = new cc.Animation(frameNico, 0.5);

        //4.wrap the animate action with a repeat forever action
        this.nicoActionDebout2 = new cc.RepeatForever(new cc.Animate(animNicoDebout2));
        this.nicoActionDebout2.setTag(10);

        //JUMP
        frameNico = [];
        str = "n_jump_Frame_0.png";
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        frameNico.push(frame);
        var animNicoSaute = new cc.Animation(frameNico, 0.15);
        this.nicoActionSaute = new cc.RepeatForever(new cc.Animate(animNicoSaute));
        this.nicoActionSaute.setTag(12);


        var spriteNico = new cc.Sprite(res.heart_png);
        spriteNico.texture.setAliasTexParameters(false);
        spriteNico.flippedX = true;
        spriteNico.setAnchorPoint(0,0);
        spriteNico.setPosition(g_nicolasStartX,135);
        spriteNico.setScale(0.65,0.65);
        this.addChild(spriteNico,0,1);

        this.getChildByTag(1).runAction(this.nicoActionDebout);
    },

    onPlay:function () {
        this.getChildByTag(2).stopAllActions();
        this.getChildByTag(2).runAction(this.joannaActionMarche);

        this.getChildByTag(1).stopAllActions();
        this.getChildByTag(1).runAction(this.nicoActionMarche);
    },

    onJump:function () {

        if (this.getChildByTag(2).getPositionY()<136 && this.heroSaute==0){

            this.getChildByTag(2).stopActionByTag(11);
            this.getChildByTag(1).stopActionByTag(11);
            this.getChildByTag(2).runAction(this.joannaActionSaute);
            this.getChildByTag(1).runAction(this.nicoActionSaute);

            this.getChildByTag(1).runAction(new cc.Sequence(new cc.MoveTo(g_duration_jump,cc.p(g_nicolasStartX,225)).easing(cc.easeOut(2)),new cc.MoveTo(g_duration_jump,cc.p(g_nicolasStartX,135)).easing(cc.easeIn(2))));
            this.getChildByTag(2).runAction(new cc.Sequence(new cc.delayTime(0.1),new cc.MoveTo(g_duration_jump,cc.p(g_joannaStartX,225)).easing(cc.easeOut(2)),new cc.MoveTo(g_duration_jump,cc.p(g_joannaStartX,135)).easing(cc.easeIn(2))));

            this.heroSaute=0.5;
        }
    },

    onUpdate:function () {
        if(g_gamestate==2){
            if ((this.getChildByTag(2).getPositionY()<136 && this.heroSaute>0) || this.heroSaute==0) {
                this.getChildByTag(2).stopAllActions();
                this.getChildByTag(1).stopAllActions();
                this.getChildByTag(2).runAction(this.joannaActionDebout2);
                this.getChildByTag(1).runAction(this.nicoActionDebout2);
                this.getChildByTag(1).flippedX = false ;
                g_gamestate=3;
            }
        }else {
            if (this.getChildByTag(2).getPositionY()>136 && this.heroSaute==0.5){
                this.heroSaute=1;
            }

            if (this.getChildByTag(2).getPositionY()<136 && this.heroSaute==1){
                this.getChildByTag(2).stopActionByTag(12);
                this.getChildByTag(1).stopActionByTag(12);
                this.getChildByTag(2).runAction(this.joannaActionMarche);
                this.getChildByTag(1).runAction(this.nicoActionMarche);
                this.heroSaute=0;
            }
        }
    }
});