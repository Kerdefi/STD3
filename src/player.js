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
        this.flyText = [[],[]];
        this.flyAnim = [[],[]];
        this.flyAction = [[],[]];
        this.shootText = [[],[]];
        this.shootAnim = [[],[]];
        this.shootAction = [[],[]];
        this.lvlupText = [[],[]];
        this.lvlupAnim = [];
        this.lvlupAction = [];
        this.summondeathText = [[],[]];
        this.summondeathAnim = [];
        this.summondeathAction = [];

        //Create les sprites players
        cc.spriteFrameCache.addSpriteFrames(res.joanna_plist);
        this.createAnimationChara (this.flyText[0],this.flyAnim[0],this.flyAction[0],"joanna/fly/",TagOfAction.fly,"forever");
        this.createAnimationChara (this.shootText[0],this.shootAnim[0],this.shootAction[0],"joanna/shoot/",TagOfAction.shoot,"once");
        this.createAnim(this.lvlupText[0],this.lvlupAnim,this.lvlupAction,"joanna/levelup/","once");
        this.createAnim(this.summondeathText[0],this.summondeathAnim,this.summondeathAction,"joanna/deathsummon/","once");


        cc.spriteFrameCache.addSpriteFrames(res.nicolas_plist);
        this.createAnimationChara (this.flyText[1],this.flyAnim[1],this.flyAction[1],"nicolas/fly/",TagOfAction.fly,"forever");
        this.createAnimationChara (this.shootText[1],this.shootAnim[1],this.shootAction[1],"nicolas/shoot/",TagOfAction.shoot,"once");
        this.createAnim(this.lvlupText[1],this.lvlupAnim,this.lvlupAction,"nicolas/levelup/","once");
        this.createAnim(this.summondeathText[1],this.summondeathAnim,this.summondeathAction,"nicolas/deathsummon/","once");

        //spriteplayer
        var player = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("joanna/fly/sword1/0.png"));
        player.setAnchorPoint(0.5, 0.5);
        player.setPosition(100, 300);
        player.texture.setAliasTexParameters(true);
        player.visible=true;
        this.addChild(player,1,TagOfPlayer.player);
        this.getChildByTag(TagOfPlayer.player).runAction (this.flyAction[this.player][this.weapon][this.levels[this.weapon]]);

        //spriteanim
        var anim = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("joanna/fly/sword1/0.png"));
        anim.setAnchorPoint(0.5, 0.5);
        anim.setPosition(100, 300);
        anim.texture.setAliasTexParameters(true);
        anim.visible=false;
        this.addChild(anim,1,TagOfPlayer.anim);

        //Add keyboard stroke listener
        if( 'keyboard' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyReleased:function(key, event) {
                    switch(key) {
                    case cc.KEY.a:
                            self.weapon = self.weapon == 2 ? 0 : self.weapon + 1;
                            self.getChildByTag(TagOfPlayer.player).stopAllActions();
                            self.getChildByTag(TagOfPlayer.player).runAction (self.flyAction[self.player][self.weapon][self.levels[self.weapon]]);
                        break;
                    case cc.KEY.z:
                            self.levels [0] = self.levels [0] == 2 ? 0 : self.levels [0] + 1;
                            self.levels [1] = self.levels [1] == 2 ? 0 : self.levels [1] + 1;
                            self.levels [2] = self.levels [2] == 2 ? 0 : self.levels [2] + 1;
                            self.getChildByTag(TagOfPlayer.player).stopAllActions();
                            self.getChildByTag(TagOfPlayer.player).runAction (self.flyAction[self.player][self.weapon][self.levels[self.weapon]]);

                            self.getChildByTag(TagOfPlayer.anim).visible=true;
                            self.getChildByTag(TagOfPlayer.anim).stopAllActions();
                            self.getChildByTag(TagOfPlayer.anim).runAction (new cc.Sequence(self.lvlupAction[self.player],cc.callFunc(function() {self.getChildByTag(TagOfPlayer.anim).visible=false},self)));
                        break;
                    case cc.KEY.e:
                            self.player = self.player == 1 ? 0 : self.player + 1;
                            self.getChildByTag(TagOfPlayer.player).stopAllActions();
                            self.getChildByTag(TagOfPlayer.player).runAction (self.flyAction[self.player][self.weapon][self.levels[self.weapon]]);

                            self.getChildByTag(TagOfPlayer.anim).visible=true;
                            self.getChildByTag(TagOfPlayer.anim).stopAllActions();
                            self.getChildByTag(TagOfPlayer.anim).runAction (new cc.Sequence(self.summondeathAction[self.player],cc.callFunc(function() {self.getChildByTag(TagOfPlayer.anim).visible=false},self)));
                        break;
                    case cc.KEY.s:
                        self.shoot(self);
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
                anim[i].push (new cc.Animation(text[i][j], g_animtime));
                if(repeat=="forever") action[i].push (new cc.RepeatForever(new cc.Animate(anim[i][j])));
                else action[i].push (new cc.Animate(anim[i][j]));
                action[i][j].setTag(tag+i*10+j);
            }
        }
    },

    createAnim:function (text,anim,action,target,tag,repeat) {
        var i = 0;
        var frame ;

        frame = "emptyframe";
        while (frame!=null) {
            str = target + i + ".png";
            frame = cc.spriteFrameCache.getSpriteFrame(str);
            if(frame!=null) text.push(frame);
            i++;
        }
        anim.push(new cc.Animation(text, g_animtime));
        if(repeat=="forever") action.push(new cc.RepeatForever(new cc.Animate(anim[anim.length-1])));
        else action.push(new cc.Animate(anim[anim.length-1]));
        action[action.length-1].setTag(tag);
    },

    shoot:function (self) {
        self.getChildByTag(TagOfPlayer.player).stopAllActions();
        self.getChildByTag(TagOfPlayer.player).runAction (new cc.Sequence(self.shootAction[self.player][self.weapon][self.levels[self.weapon]],cc.callFunc(function() {self.shootEnd(self)},self)));
    },

    shootEnd:function (self) {
        self.getChildByTag(TagOfPlayer.player).runAction (self.flyAction[self.player][self.weapon][self.levels[self.weapon]]);
    }
});
