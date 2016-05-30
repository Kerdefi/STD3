var playerLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        //Variable clé du joueur
        this.levels = [0,0,0];
        this.levelmax = 300;
        this.levelsgrowth = [1,1,1];
        this.weapons = ["sword","bow","spell"];
        this.mana = 100;
        this.managrowth = 3;
        this.health = 100;
        this.movingright = true;
        this.weapon = 0;
        this.isAttacking = 0;
        this.player = 0;

        this.init();
    },

    init:function () {
        this._super();

        var i = 0;
        var j = 0;
        var frame ;
        var self = this;
        this.joannasFlyText = [];
        this.joannasFlyAnim = [];
        this.joannasFlyAction = [];
        this.joannasShootText = [];
        this.joannasShootAnim = [];
        this.joannasShootAction = [];

        cc.spriteFrameCache.addSpriteFrames(res.joanna_plist);

        //Création du pack de texture/animation joanna
        for(i = 0 ; i < 3 ; i++) {
            j = 0 ;
            this.joannasFlyText.push([]);
            frame = "emptyframe";
            while (frame!=null) {
                str = "joanna/fly/"+this.weapons[i]+"1/" + j + ".png";
                frame = cc.spriteFrameCache.getSpriteFrame(str);
                if(frame!=null) this.joannasFlyText[i].push(frame);
                j++;
            }
            this.joannasFlyAnim.push (new cc.Animation(this.joannasFlyText[i], 0.5));
            this.joannasFlyAction.push (new cc.RepeatForever(new cc.Animate(this.joannasFlyAnim[i])));
            this.joannasFlyAction[i].setTag(TagOfAction.fly+i);
        }
        for(i = 0 ; i < 3 ; i++) {
            j = 0 ;
            this.joannasShootText.push([]);
            frame = "emptyframe";
            while (frame!=null) {
                str = "joanna/shoot/"+this.weapons[i]+"1/" + j + ".png";
                frame = cc.spriteFrameCache.getSpriteFrame(str);
                if(frame!=null) this.joannasShootText[i].push(frame);
                j++;
            }
            this.joannasShootAnim.push (new cc.Animation(this.joannasShootText[i], 0.5));
            this.joannasShootAction.push (new cc.RepeatForever(new cc.Animate(this.joannasShootAnim[i])));
            this.joannasShootAction[i].setTag(TagOfAction.shoot+i);
        }

        var joanna = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("joanna/fly/sword1/0.png"));
        joanna.setAnchorPoint(0, 0);
        joanna.setPosition(100, 300);
        joanna.texture.setAliasTexParameters(true);
        joanna.visible=true;

        this.addChild(joanna,1,TagOfPlayer.joanna);
        this.getChildByTag(TagOfPlayer.joanna).runAction (this.joannasFlyAction[0]);

        //Add keyboard stroke listener
        if( 'keyboard' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyReleased:function(key, event) {
                    switch(key) {
                    case cc.KEY.backspace:
                            self.getChildByTag(TagOfPlayer.joanna).stopAllActions();
                            self.getChildByTag(TagOfPlayer.joanna).runAction (self.joannasShootAction[1]);
                        break;
                    case cc.KEY.a:
                            self.getChildByTag(TagOfPlayer.joanna).stopAllActions();
                            self.getChildByTag(TagOfPlayer.joanna).runAction (self.joannasShootAction[2]);
                        break;
                    case cc.KEY.b:
                            self.getChildByTag(TagOfPlayer.joanna).stopAllActions();
                            self.getChildByTag(TagOfPlayer.joanna).runAction (self.joannasFlyAction[1]);
                        break;
                    case cc.KEY.c:
                            self.getChildByTag(TagOfPlayer.joanna).stopAllActions();
                            self.getChildByTag(TagOfPlayer.joanna).runAction (self.joannasFlyAction[2]);
                        break;
                    }
                }
            }, this);
        }
    }
});
