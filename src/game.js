var gameLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.offsetblock = 0;
        this.space = 0;
        this.minspace = 5;
        this.layer = [["stone"],["void","stone","lava"]] ;
        this.lenghtx1 = 0 ;
        this.lenghtx2 = 0;
        this.maxlenght = 15 ;
        this.spawnproba = 0.5

        this.setAnchorPoint(0,0);
        this.setPosition(0,0);
    },

    init:function () {
        this._super();

        var i = 0;
        var j = 0;

        for (i = 0 ; i <= g_enp.size.x-1 ; i++) {
            cc.log(i);
            for (j = 0 ; j <= g_enp.size.y-1 ; j++) {
                var testheart = new cc.Sprite(res.dirtMid_png);
                testheart.setAnchorPoint(0, 0);
                testheart.setPosition(200+i*g_blocksize, 50+j*g_blocksize);
                testheart.setScale(0.05,0.05);
                testheart.texture.setAliasTexParameters(false);
                if(g_enp.map[i][j]==null) {
                    testheart.visible=true;
                }
                this.addChild(testheart,1,i+j*1000);
            }
        }

        cc.log("cocoswork");
    },

    onUpdate:function () {
        //Scrolldown
        if(g_enp.state == encophys.RUN) {
            this.offsetblock -= g_blocksize * g_enp.framestep * g_blockspeed ;
            if(this.offsetblock < -g_blocksize) {this.offsetblock = 0; this.shiftdown (); this.populate ();}
            this.setPosition(0,this.offsetblock);
        }

        //Test Physic
        if(g_gamestate == 1){
            var i = 0;
            var j = 0;

            for (i = 0 ; i < g_enp.size.x ; i++) {
                for (j = 0 ; j < g_enp.size.y ; j++) {
                    if(!g_enp.mapIddle[i][j]) {
                        if(g_enp.map[i][j]==null) {
                            this.getChildByTag(i+j*1000).visible=false;
                        } else {
                            this.getChildByTag(i+j*1000).visible=true;
                            if(g_enp.map[i][j].material=="lava") this.getChildByTag(i+j*1000).setTexture (res.snowMid_png);
                            else this.getChildByTag(i+j*1000).setTexture (res.dirtMid_png);
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
        g_enp.linkH[g_enp.size.x].splice(0);
        g_enp.linkH[g_enp.size.x].push(0);

        /*for (i = 0 ; i < g_enp.size.x ; i++) {
            for (j = 0 ; j < g_enp.size.y-1 ; j++) {
                g_enp.map[i][j] = g_enp.map[i][j+1];
                g_enp.mapIddle[i][j] = false;
            }
            g_enp.map[i][g_enp.size.y-1] = null;
            g_enp.mapIddle[i][g_enp.size.y-1] = false;
        }
        for (i = 0 ; i < g_enp.size.x+1 ; i++) {
            for (j = 0 ; j < g_enp.size.y-1 ; j++) {
                g_enp.linkH[i][j] = g_enp.linkH[i][j+1];
            }
            g_enp.linkH[i][g_enp.size.y-1] = 0;
        }
        for (i = 0 ; i < g_enp.size.x ; i++) {
            for (j = 0 ; j < g_enp.size.y ; j++) {
                g_enp.linkV[i][j] = g_enp.linkV[i][j+1];
            }
            g_enp.linkV[i][g_enp.size.y] = 0;
        }*/
    },

    populate:function() {
        var material ;
        var i = 0;

        //Fixe la forme de la couche
        if(this.space == 0) {
            this.lenghtx1 = Math.round(Math.random()*this.maxlenght + 1);
            this.lenghtx2 = Math.round(g_enp.size.x - (Math.random()*this.maxlenght-this.lenghtx1 + 1));
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
