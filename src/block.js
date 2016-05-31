var blockLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.offsetblock = 0;
        this.space = 0;
        this.minspace = 5;
        this.layer = [["stone"],["wood","wood","grass","wood","grass"]];
        this.lenghtx1 = 0 ;
        this.lenghtx2 = 0;
        this.minlenght = 20 ;
        this.maxlenght = 30 ;
        this.spawnproba = 0.5;
        this.burn = 0;
        this.frameburn = 0;
        this.frameburnmax = 5 ;

        this.setAnchorPoint(0,0);
        this.setPosition(0,0);
    },

    init:function () {
        this._super();

        var i = 0;
        var j = 0;
        var k = 0;
        var l = 0;

        //Création des sprites
        for (i = 0 ; i <= g_enp.size.x-1 ; i++) {
            for (j = 0 ; j <= g_enp.size.y-1 ; j++) {
                var block = new cc.Sprite(res.stone_png);
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

        //Création du block personnage
        for (i = -3 ; i <= 3 ; i++) {
            for (j = -2 ; j <= 2 ; j++) {
                k = Math.round(this.getParent().getChildByTag(TagOfLayer.player).playerposition.x/g_blocksize)+i;
                l = Math.round(this.getParent().getChildByTag(TagOfLayer.player).playerposition.y/g_blocksize)+j;
                g_enp.addPoint(k,l,"playermonster",10, BlockIndex.player);
            }
        }
    },

    onUpdate:function () {
        var i = 0;
        var j = 0;
        var k = 0;
        var l = 0;

        //Scrolldown
        if(g_enp.state == encophys.RUN) {
            this.offsetblock -= g_blocksize * g_enp.framestep * g_blockspeed ;
            if(this.offsetblock < -g_blocksize) {this.offsetblock = 0; this.shiftdown (); this.populate ();}
            this.setPosition(0,this.offsetblock);
        }

        //Détruit les blocs personnage et repositionne les blocs personnages
        for (i = 0 ; i < g_enp.size.x ; i++) {
            for (j = 0 ; j < g_enp.size.y ; j++) {
                if(g_enp.map[i][j]!=null && g_enp.map[i][j].index == BlockIndex.player) {
                    g_enp.map[i][j]=null;
                    g_enp.mapIddle[i][j]=false;
                }
            }
        }
        for (i = -3 ; i <= 3 ; i++) {
            for (j = -2 ; j <= 2 ; j++) {
                k = Math.round(this.getParent().getChildByTag(TagOfLayer.player).playerposition.x/g_blocksize)+i;
                l = Math.round(this.getParent().getChildByTag(TagOfLayer.player).playerposition.y/g_blocksize)+j;
                //ajouter dégats et mettre une animation
                k = g_enp.addPoint(k,l,"playermonster",0, BlockIndex.player);
                if(k>0) {
                    this.getParent().getChildByTag(TagOfLayer.player).damage = this.getParent().getChildByTag(TagOfLayer.player).damageduration;
                }
            }
        }

        //Modification de l'état burn
        this.frameburn++;
        if(this.frameburnmax < this.frameburn) {this.frameburn=0; this.burn=1-this.burn;}

        //Affichage des blocks
        if(g_gamestate == 1){
            for (i = 0 ; i < g_enp.size.x ; i++) {
                for (j = 0 ; j < g_enp.size.y ; j++) {
                    if(!g_enp.mapIddle[i][j]) {
                        if(g_enp.map[i][j]!=null) {
                            if(g_enp.map[i][j].index==BlockIndex.standard) {
                                this.getChildByTag(1000+i+j*1000).visible=true;
                                this.getChildByTag(1000+i+j*1000).setPosition(i*g_blocksize+g_enp.map[i][j].smoothposition.x*g_blocksize, j*g_blocksize+g_enp.map[i][j].smoothposition.y*g_blocksize);

                                if(g_enp.map[i][j].heat >= g_enp.materials[g_enp.map[i][j].material].burnheat && g_enp.materials[g_enp.map[i][j].material].burnheat < g_enp.materials[g_enp.map[i][j].material].meltheat) {
                                    this.getChildByTag(1000+i+j*1000).setTexture(res[g_enp.map[i][j].material+"burn"+this.burn+"_png"]);
                                } else {
                                    this.getChildByTag(1000+i+j*1000).setTexture(res[g_enp.map[i][j].material+"_png"]);
                                }
                            } else this.getChildByTag(1000+i+j*1000).visible=false;
                        } else this.getChildByTag(1000+i+j*1000).visible=false;
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
                if(material !="void") g_enp.addPoint(i,g_enp.size.y-1,material,1,BlockIndex.standard);
            }
            for(i = g_enp.size.x-1 ; i > this.lenghtx2 ; i--) {
                material = this.layer[this.space][Math.round(this.layer[this.space].length * Math.random() - 0.5)];
                if(material !="void") g_enp.addPoint(i,g_enp.size.y-1,material,1,BlockIndex.standard);
            }
        }

        //Incrémente et décide de créer une nouvelle couche
        this.space += 1 ;
        if(this.space > this.minspace && Math.random() < this.spawnproba) this.space = 0;
    }
});
