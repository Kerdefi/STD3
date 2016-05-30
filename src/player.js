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
        var k = 0;
        var l = 0;
        var frame ;
        var self = this;
        this.joannasFlyText = [];
        this.joannasFlyAnim = [];
        this.joannasFlyAction = [];
        this.joannasShootText = [];
        this.joannasShootAnim = [];
        this.joannasShootAction = [];

        cc.spriteFrameCache.addSpriteFrames(res.joanna_plist);
        this.createAnimationChara (this.joannasFlyText,this.joannasFlyAnim,this.joannasFlyAction,"joanna/fly/",TagOfAction.fly,"forever");
        this.createAnimationChara (this.joannasShootText,this.joannasShootAnim,this.joannasShootAction,"joanna/shoot/",TagOfAction.shoot,"once");

        var joanna = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("joanna/fly/sword1/0.png"));
        joanna.setAnchorPoint(0, 0);
        joanna.setPosition(100, 300);
        joanna.texture.setAliasTexParameters(true);
        joanna.visible=true;

        this.addChild(joanna,1,TagOfPlayer.joanna);
        this.getChildByTag(TagOfPlayer.joanna).runAction (this.joannasFlyAction[this.weapon][this.levels[this.weapon]]);

        //Add keyboard stroke listener
        if( 'keyboard' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyReleased:function(key, event) {
                    switch(key) {
                    case cc.KEY.a:
                            self.weapon = self.weapon == 2 ? 0 : self.weapon + 1;
                            self.getChildByTag(TagOfPlayer.joanna).stopAllActions();
                            self.getChildByTag(TagOfPlayer.joanna).runAction (self.joannasFlyAction[self.weapon][self.levels[self.weapon]]);
                        break;
                    case cc.KEY.z:
                            self.levels [0] = self.levels [0] == 2 ? 0 : self.levels [0] + 1;
                            self.levels [1] = self.levels [1] == 2 ? 0 : self.levels [1] + 1;
                            self.levels [2] = self.levels [2] == 2 ? 0 : self.levels [2] + 1;
                            self.getChildByTag(TagOfPlayer.joanna).stopAllActions();
                            self.getChildByTag(TagOfPlayer.joanna).runAction (self.joannasFlyAction[self.weapon][self.levels[self.weapon]]);
                        break;
                    case cc.KEY.e:
                        self.getChildByTag(TagOfPlayer.joanna).stopAllActions();
                        self.getChildByTag(TagOfPlayer.joanna).runAction (new cc.Sequence(self.joannasShootAction[self.weapon][self.levels[self.weapon]],new cc.RepeatForever(self.getChildByTag(TagOfPlayer.joanna).runAction (self.joannasFlyAction[self.weapon][self.levels[self.weapon]]))));
                        break;
                    }
                }
            }, this);
        }
    },

    createAnimationChara:function (text,anim,action,target,tag,repeat) {
        var i = 0;
        var j = 0;
        var k = 0;
        var l = 0;
        var frame ;

        //Création du pack de texture/animation joanna
        for(i = 0 ; i < 3 ; i++) {
            text.push([]);
            anim.push([]);
            action.push([]);

            for(j = 0 ; j < 3 ; j++) {
                k = 0 ;
                text[i].push([]);
                frame = "emptyframe";
                while (frame!=null) {
                    l = j+1;
                    str = target+this.weapons[i]+""+l+"/" + k + ".png";
                    frame = cc.spriteFrameCache.getSpriteFrame(str);
                    if(frame!=null) text[i][j].push(frame);
                    k++;
                }
                anim[i].push (new cc.Animation(text[i][j], 0.25));
                if(repeat=="forever") action[i].push (new cc.RepeatForever(new cc.Animate(anim[i][j])));
                else action[i].push (new cc.Animate(anim[i][j]));
                action[i][j].setTag(tag+i*10+j);
            }
        }
    }
});
