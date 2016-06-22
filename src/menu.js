var MenuLayer = cc.Layer.extend({
    ctor : function(){
        //1. call super class's ctor function
        this._super();
    },
    init:function(){

        this._super();
        //charge le score
        g_highscore = JSON.parse(cc.sys.localStorage.getItem("HighScore")) != null ? JSON.parse(cc.sys.localStorage.getItem("HighScore")) : g_highscore;

        g_gamestate = TagOfState.start;

        var self = this;
        var winsize = cc.director.getWinSize();

        //Menu anims and Bkgnd
        this.addChild(new MenuBack(),1,1);
        this.addChild(new MenuAnim(),1,2);

        //hight score
        var pos = cc.p(winsize.width / 2, winsize.height * (1 / 2 + 1/16));
        var label = new cc.LabelTTF("High score", "Helvetica", 30);
        label.setColor(cc.color(255,255,255));//black color
        label.setAnchorPoint(cc.p(0.5, 0.5));
        label.setPosition(pos);
        this.addChild(label,99,49);

        for (var i = 0 ; i < 5 ; i++) {
            var pos = cc.p(winsize.width / 2, winsize.height * (1 / 2 - i*1/16));
            var label = new cc.LabelTTF(g_highscore.player[i] + " ...... "+ g_highscore.score[i], "Helvetica", 30);
            label.setColor(cc.color(255,215+i*10,i*255/4));//black color
            label.setAnchorPoint(cc.p(0.5, 0.5));
            label.setPosition(pos);
            this.addChild(label,99,50+i);
        }

        var pos = cc.p(winsize.width / 2, winsize.height / 20);
        this.labelBonus = new cc.LabelTTF("Press any key to start", "Helvetica", 30);
        this.labelBonus.setColor(cc.color(255,215,0));//black color
        this.labelBonus.setAnchorPoint(cc.p(0.5, 0.5));
        this.labelBonus.setPosition(pos);
        this.addChild(this.labelBonus,99,100);

        this.textAction = new cc.Sequence(new cc.scaleBy(0.5, 1.1, 1.1), new cc.scaleBy(0.5, 1 / 1.1, 1 / 1.1));
        this.textAction.repeatForever();
        this.textAction.setTag(1);

        this.getChildByTag(100).runAction(this.textAction);

        //Init EncoPhys
        g_enp = new encophys.world ();
        g_enp.init ("src/encophys/encophys.json");

        //Add keyboard stroke listener
        if( 'keyboard' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyReleased:function(key, event) {
                    self.ap(self);
                }
            }, this);
        }

        this.gp = new gp_check (null,this.ap,null,this.ap,null,this.ap,this.ap,null,null,this.ap,null,null);

        this.scheduleUpdate();
    },
    update:function (){
        for (var i = 0 ; i < 5 ; i++) {
            this.getChildByTag(50+i).setString(g_highscore.player[i] + " ...... "+ g_highscore.score[i]);
        }
        this.gp.update(this);
    },
    ap:function (self){
        //Si on est en help lance le jeu
        if(g_gamestate==TagOfState.help) {
            g_gamestate=TagOfState.run;
            cc.director.runScene(new gameScene());
        }
        //Sinon affiche l'écran d'aide
        if(g_gamestate==TagOfState.start) {
            g_gamestate=TagOfState.help;
            self.addChild(new MenuHelp(),4,3);
        }
    }
});

var MenuBack = cc.Layer.extend({
    ctor : function(){
        //1. call super class's ctor function
        this._super();
        this.init();
    },
    init:function(){
        //create the background image and position it at the center of screen
        var spriteBG = new cc.Sprite(res.bkgnd_png);
        //spriteBG.texture.setAliasTexParameters(false);
        spriteBG.setAnchorPoint(0,0);
        spriteBG.setPosition(0,0);
        spriteBG.setScale(4,4);
        this.addChild(spriteBG,0,0);

        var winsize = cc.director.getWinSize();
        var buttonpos = cc.p(winsize.width / 2, winsize.height * 3/4);

        cc.spriteFrameCache.addSpriteFrames(res.menu_plist);
        var spriteTitle = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("menu/buttons/start_n.png"));
        spriteTitle.setAnchorPoint(0.5,0.5);
        spriteTitle.setPosition(buttonpos);
        spriteTitle.setScale(4,4);
        this.addChild(spriteTitle,1,1);
    }
});

var MenuHelp = cc.Layer.extend({
    ctor : function(){
        //1. call super class's ctor function
        this._super();
        this.init();
    },
    init:function(){
        //create the background image and position it at the center of screen
        var spriteBG = new cc.Sprite(res.bkgndhelp_png);
        spriteBG.setAnchorPoint(0,0);
        spriteBG.setPosition(0,0);
        spriteBG.setScale(4,4);
        this.addChild(spriteBG,0,0);
    }
});

var MenuAnim = cc.Layer.extend({
    ctor : function(){
        //1. call super class's ctor function
        this._super();
        this.init();
    },
    init:function(){
        this._super();

        //1.Load spreadsheet (joanna)
        cc.spriteFrameCache.addSpriteFrames(res.menu_plist);

        var frameJoanna = [];
        var frame = "emptyframe";
        var str = "menu/joanna/" + i + ".png";
        var i = 0 ;
        while (frame!=null) {
            str = "menu/joanna/" + i + ".png";
            frame = cc.spriteFrameCache.getSpriteFrame(str);
            if(frame!=null) frameJoanna.push(frame);
            i++;
        }
        var animJoanna = new cc.Animation(frameJoanna, 0.5);

        //4.wrap the animate action with a repeat forever action
        this.joannaAction = new cc.RepeatForever(new cc.Animate(animJoanna));
        this.joannaAction.setTag(10);

        var frameNicolas = [];
        frame = "emptyframe";
        str = "menu/nicolas/" + i + ".png";
        i = 0 ;
        while (frame!=null) {
            str = "menu/nicolas/" + i + ".png";
            frame = cc.spriteFrameCache.getSpriteFrame(str);
            if(frame!=null) frameNicolas.push(frame);
            i++;
        }
        var animNicolas = new cc.Animation(frameNicolas, 0.5);

        //4.wrap the animate action with a repeat forever action
        this.nicolasAction = new cc.RepeatForever(new cc.Animate(animNicolas));
        this.nicolasAction.setTag(20);


        cc.spriteFrameCache.addSpriteFrames(res.divers_plist);
        var frameStorm = [];
        frame = "emptyframe";
        str = "divers/storm/" + i + ".png";
        i = 3 ;
        while (frame!=null) {
            str = "divers/storm/" + i + ".png";
            frame = cc.spriteFrameCache.getSpriteFrame(str);
            if(frame!=null) frameStorm.push(frame);
            i++;
        }
        while (i>=3) {
            str = "divers/storm/" + i + ".png";
            frame = cc.spriteFrameCache.getSpriteFrame(str);
            if(frame!=null) frameStorm.push(frame);
            i--;
        }
        var animStorm = new cc.Animation(frameStorm, 0.15);

        //4.wrap the animate action with a repeat forever action
        this.stormAction = new cc.RepeatForever(new cc.Animate(animStorm));
        this.stormAction.setTag(20);


        //Créée les sprites

        var spriteJoanna = new cc.Sprite(res.heart_png);
        spriteJoanna.texture.setAliasTexParameters(false);
        spriteJoanna.flippedX = true;
        spriteJoanna.setAnchorPoint(0,0);
        spriteJoanna.setPosition(200,135);
        this.addChild(spriteJoanna,0,1);

        this.getChildByTag(1).runAction(this.joannaAction);

        var spriteNicolas = new cc.Sprite(res.heart_png);
        spriteNicolas.texture.setAliasTexParameters(false);
        spriteNicolas.setAnchorPoint(0,0);
        spriteNicolas.setPosition(300,135);
        this.addChild(spriteNicolas,0,2);

        this.getChildByTag(2).runAction(this.nicolasAction);

        var spriteStorm = new cc.Sprite(res.heart_png);
        spriteStorm.texture.setAliasTexParameters(false);
        spriteStorm.setAnchorPoint(0,0);
        spriteStorm.setScale(3,3);
        spriteStorm.setPosition(200,135);
        this.addChild(spriteStorm,0,3);

        this.getChildByTag(3).runAction(this.stormAction);
    }
});

var MenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MenuLayer();
        layer.init();
        this.addChild(layer,0,TagOfLayer.Menu);
    },
    onExit:function () {
        this._super();
    }
});
