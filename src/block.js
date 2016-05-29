var blockLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.offsetblock = 0;
        this.space = 0;
        this.minspace = 10;
        this.materials = ["stone","wood","woodburn","grass","grassburn","steel","water","lava","bonus"];
        this.materialsText = new Array(g_enp.size.x);
        this.materialsAnim = new Array(g_enp.size.x);
        this.materialsAction = new Array(g_enp.size.x);
        this.futurVisible = new Array(g_enp.size.x);
        this.futurSmoothx = new Array(g_enp.size.x);
        this.futurSmoothy = new Array(g_enp.size.x);
        this.layer = [["stone"],["void","wood","wood","stone","lava"]];
        this.lenghtx1 = 0 ;
        this.lenghtx2 = 0;
        this.minlenght = 20 ;
        this.maxlenght = 30 ;
        this.spawnproba = 0.5

        this.setAnchorPoint(0,0);
        this.setPosition(0,0);

        this.init ();
    },

    init:function () {
        this._super();

        var i = 0;
        var j = 0;
        var k = 0;
        var l = 0;
        var frame ;

        cc.spriteFrameCache.addSpriteFrames(res.tiles_plist);

        //Création des sprites
        for (i = 0 ; i <= g_enp.size.x-1 ; i++) {
            this.materialsText[i] = new Array(g_enp.size.y);
            this.materialsAnim[i] = new Array(g_enp.size.y);
            this.materialsAction[i] = new Array(g_enp.size.y);
            this.futurVisible[i] = new Array(g_enp.size.y);
            this.futurSmoothx[i] = new Array(g_enp.size.y);
            this.futurSmoothy[i] = new Array(g_enp.size.y);

            for (j = 0 ; j <= g_enp.size.y-1 ; j++) {
                k = 0;
                l = 0;
                this.materialsText[i][j] = [];
                this.materialsAnim[i][j] = [];
                this.materialsAction[i][j] = [];
                this.futurVisible[i][j] = false;
                this.futurSmoothx[i][j] = 0;
                this.futurSmoothy[i][j] = 0;

                //Création du pack de texture
                for(k = 0 ; k < this.materials.length ; k++) {
                    l = 0 ;
                    this.materialsText[i][j].push([]);
                    frame = "emptyframe";
                    while (frame!=null) {
                        str = "tiles/"+this.materials[k]+"/" + l + ".png";
                        frame = cc.spriteFrameCache.getSpriteFrame(str);
                        if(frame!=null) this.materialsText[i][j][k].push(frame);
                        l++;
                    }
                    this.materialsAnim[i][j].push (new cc.Animation(this.materialsText[i][j][k], 0.5));
                    this.materialsAction[i][j].push (new cc.RepeatForever(new cc.Animate(this.materialsAnim[i][j][k])));
                    this.materialsAction[i][j][k].setTag(k);
                }

                var block = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("tiles/stone/0.png"));
                block.setAnchorPoint(0, 0);
                block.setPosition(i*g_blocksize, j*g_blocksize);
                block.texture.setAliasTexParameters(false);
                block.visible=false;
                if(g_enp.map[i][j]!=null) {
                    block.visible=true;
                }
                this.addChild(block,1,1000+i+j*1000);
            }
        }
        g_enp.changeState(encophys.RUN);
    },

    onUpdate:function () {
        //Scrolldown
        if(g_enp.state == encophys.RUN) {
            this.setPosition(0,this.offsetblock);
            this.offsetblock -= g_blocksize * g_enp.framestep * g_blockspeed ;
            if(this.offsetblock < -g_blocksize) {this.offsetblock = 0; this.shiftdown (); this.populate ();}
        }

        //Test Physic
        if(g_gamestate == 1){
            var i = 0;
            var j = 0;

            for (i = 0 ; i < g_enp.size.x ; i++) {
                for (j = 0 ; j < g_enp.size.y ; j++) {
                    this.getChildByTag(1000+i+j*1000).visible=this.futurVisible[i][j];
                    if(!g_enp.mapIddle[i][j]) {
                        if(g_enp.map[i][j]==null) {
                            this.futurVisible[i][j]=false;
                            this.getChildByTag(1000+i+j*1000).stopAllActions();
                        } else {
                            this.futurVisible[i][j]=true;

                            this.getChildByTag(1000+i+j*1000).setPosition(i*g_blocksize+this.futurSmoothx[i][j], j*g_blocksize+this.futurSmoothy[i][j]);

                            this.futurSmoothx[i][j] = g_enp.map[i][j].smoothposition.x*g_blocksize ;
                            this.futurSmoothy[i][j] = g_enp.map[i][j].smoothposition.y*g_blocksize ;

                            this.getChildByTag(1000+i+j*1000).stopAllActions();
                            this.getChildByTag(1000+i+j*1000).runAction(this.materialsAction[i][j][this.materials.indexOf(g_enp.map[i][j].material)]);
                        }
                    }
                }
            }
        }
    },

    shiftdown:function() {
        var i = 0;
        var j = 0;

        for (i = 0 ; i < g_enp.size.x ; i++) {
            for (j = 0 ; j < g_enp.size.y ; j++) {
                if(g_enp.map[i][j]!=null) { g_enp.mapIddle[i][j] = false; if(j>0) g_enp.mapIddle[i][j-1] = false; }
            }
        }

        for (i = 0 ; i < g_enp.size.x ; i++) {
            g_enp.map[i].splice(0,1);
            g_enp.map[i].push(null);
            g_enp.linkH[i].splice(0,1);
            g_enp.linkH[i].push(0);
            g_enp.linkV[i].splice(0,1);
            g_enp.linkV[i].push(0);
        }
        g_enp.linkH[g_enp.size.x].splice(0,1);
        g_enp.linkH[g_enp.size.x].push(0);
    },

    populate:function() {
        var material ;
        var i = 0;

        //Fixe la forme de la couche
        if(this.space == 0) {
            this.lenghtx1 = Math.round(Math.random()*(this.maxlenght-this.minlenght+1)) + this.minlenght;
            this.lenghtx2 = Math.round(Math.random()*this.lenghtx1);
            this.lenghtx1 -= this.lenghtx2;
            this.lenghtx2 = g_enp.size.x - this.lenghtx2;
        }
        //Créée la couche
        if(this.space < this.layer.length) {
            for(i = 0 ; i < this.lenghtx1 ; i++) {
                material = this.layer[this.space][Math.round(this.layer[this.space].length * Math.random() - 0.5)];
                if(material !="void") g_enp.addPoint(i,g_enp.size.y-1,material,0);
            }
            for(i = g_enp.size.x-1 ; i > this.lenghtx2 ; i--) {
                material = this.layer[this.space][Math.round(this.layer[this.space].length * Math.random() - 0.5)];
                if(material !="void") g_enp.addPoint(i,g_enp.size.y-1,material,0);
            }
        }

        //Incrémente et décide de créer une nouvelle couche
        this.space += 1 ;
        if(this.space > this.minspace && Math.random() < this.spawnproba) this.space = 0;
    }
});
