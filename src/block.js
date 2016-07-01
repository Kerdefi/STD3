var blockLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.offsetblock = 0;
        this.space = 0;

        //level des monsters
        this.monster = [
            [0,1],
            [0,1,2],
            [0,1,2,3],
            [1,2,3,4],
            [1,2,3,4],
            [2,3,4,5],
            [3,4,5,6],
            [4,5,6,7],
            [4,5,6,7,8],
            [4,6,7,8,9]
        ];
        //level des maxmonsters
        this.probamonster = [1.5,2.3,2.5,3.3,3.3,2.5,2.5,1.8,1.8,1.8];
        //level des min et maxlength
        this.minlenght = [10,11,11,12,12,13,13,14,14,14];
        this.maxlenght = [15,15,16,16,17,17,18,18,19,19];
        //level des minspace
        this.minspace = [14,13,13,12,12,12,12,12,12,12];
        //level des layers
        this.layer = [
            [["wood"],["grass"]],
            [["wood"],["wood","grass"]],
            [["ice"],["ice","water"]],
            [["ice"],["ice","water","water","void"]],
            [["stone"],["stone","wood"]],
            [["stone"],["stone","wood","wood","wood","wood","wood","lava","void","void","void"]],
            [["stone"],["ice"],["water","ice","ice","void","void","void"]],
            [["stone"],["ice"],["ice","ice","ice","ice","lava","void","void","void","void","void"]],
            [["stone"],["stone","lava"],["lava","lava","void"]],
            [["stone"],["stone"],["lava","lava","lava"],["lava","void","void"]]
        ];
        this.spawnproba = 0.8;

        this.lenghtx1 = 0;
        this.lenghtx2 = 0;
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
                block.setScale (g_blocksize/g_textureblocksize,g_blocksize/g_textureblocksize);
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
        for (i = -1 ; i <= 1 ; i++) {
            for (j = -1 ; j <= 1 ; j++) {
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
        var m = 0;

        //Scrolldown
        if(g_enp.state == encophys.RUN) {
            this.offsetblock -= g_blocksize * g_enp.framestep * g_blockspeed ;
            if(this.offsetblock < -g_blocksize) {this.offsetblock = 0; this.shiftdown (); this.populate ();}
            this.setPosition(0,this.offsetblock);
        }

        //Détruit les blocs personnage et repositionne les blocs personnages
        k = 0;
        for (i = 0 ; i < g_enp.size.x ; i++) {
            for (j = 0 ; j < g_enp.size.y ; j++) {
                if(g_enp.map[i][j]!=null && g_enp.map[i][j].index == BlockIndex.player) {
                    k = Math.max(g_enp.destroy(i,j),k);
                    //g_enp.map[i][j]=null;
                    //g_enp.mapIddle[i][j]=false;
                }
            }
        }
        this.getParent().getChildByTag(TagOfLayer.player).health -= k*g_monsterdamagereduction*(this.getParent().getChildByTag(TagOfLayer.player).shield > 0 ? g_bowshield : 1);

        for (i = -1 ; i <= 1 ; i++) {
            for (j = -1 ; j <= 1 ; j++) {
                k = Math.round(this.getParent().getChildByTag(TagOfLayer.player).playerposition.x/g_blocksize+i);
                l = Math.round(this.getParent().getChildByTag(TagOfLayer.player).playerposition.y/g_blocksize+j);
                //Vérifie si le point est un monstre
                if(g_enp.inLimits(k,l) && g_enp.map[k][l]!=null && g_enp.map[k][l].index >= BlockIndex.monsters) {
                    m = this.getParent().getChildByTag(TagOfLayer.monsters).monsters[g_enp.map[k][l].index-BlockIndex.monsters].deathstart(false);
                    g_enp.addPoint(k,l,"playermonster",0, BlockIndex.player);
                    //Dégat à appliquer
                    if(m>0) {
                        this.getParent().getChildByTag(TagOfLayer.player).damage = this.getParent().getChildByTag(TagOfLayer.player).damageduration;
                        this.getParent().getChildByTag(TagOfLayer.player).health -= m*g_monsterdamagereduction*(this.getParent().getChildByTag(TagOfLayer.player).shield > 0 ? g_bowshield : 1);
                    }
                } else {
                    //ajouter dégats et mettre une animation
                    m = g_enp.addPoint(k,l,"playermonster",0, BlockIndex.player);
                    //Dégat à appliquer
                    if(m>0) {
                        this.getParent().getChildByTag(TagOfLayer.player).damage = this.getParent().getChildByTag(TagOfLayer.player).damageduration;
                        this.getParent().getChildByTag(TagOfLayer.player).health -= m*g_monsterdamagereduction*(this.getParent().getChildByTag(TagOfLayer.player).shield > 0 ? g_bowshield : 1);
                    }
                }
            }
        }

        //Modification de l'état burn
        this.frameburn++;
        if(this.frameburnmax < this.frameburn) {this.frameburn=0; this.burn=1-this.burn;}

        //Affichage des blocks
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
                g_enp.mapIddle[i][j]=true;
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

        //descend toutes les forces
        for (i = 0 ; i < g_enp.forces.length ; i++) {
            g_enp.forces[i].position.y--;
            if(g_enp.forces[i].position.y<0) {
                g_enp.removeForce(i);
            }
        }
    },

    populate:function() {
        var material ;
        var i = 0;
        var l = this.getParent().level;

        //Fixe la forme de la couche
        if(this.space == 0) {
            this.lenghtx1 = Math.round(Math.random()*(this.maxlenght[l]-this.minlenght[l]+1)) + this.minlenght[l];
            this.lenghtx2 = Math.round(Math.random()*this.lenghtx1);
            this.lenghtx1 -= this.lenghtx2;
            this.lenghtx2 = g_enp.size.x - this.lenghtx2;
        }
        //Créée la couche tant que l'on est dans l'épaisseur admise (caractérisée par la taille du tableau layer)
        if(this.space < this.layer[l].length) {
            for(i = 0 ; i < this.lenghtx1 ; i++) {
                material = this.layer[l][this.space][Math.round(this.layer[l][this.space].length * Math.random() - 0.5)];
                if(material !="void") g_enp.addPoint(i,g_enp.size.y-1,material,g_blockdamage,BlockIndex.standard);
            }
            for(i = g_enp.size.x-1 ; i > this.lenghtx2 ; i--) {
                material = this.layer[l][this.space][Math.round(this.layer[l][this.space].length * Math.random() - 0.5)];
                if(material !="void") g_enp.addPoint(i,g_enp.size.y-1,material,g_blockdamage,BlockIndex.standard);
            }
        }

        //Incrémente et décide de créer une nouvelle couche
        this.space += 1 ;
        if(this.space > this.minspace[l] && Math.random() < this.spawnproba) this.space = 0;

        //zone de création de monstres
        if (this.space == Math.round(this.minspace[l]/2)+1) {
            i = this.probamonster[l];
            while (i > 2) {
                material = this.monster[l][Math.round(this.monster[l].length * Math.random() - 0.5)];
                this.getParent().getChildByTag(TagOfLayer.monsters).addMonster(new cc.math.Vec2 (200+(Math.random()*100-50),1100+(Math.random()*100-50)),material);
                i--;
            }
            if(Math.random()<=i-1) {
                //monstre 1
                material = this.monster[l][Math.round(this.monster[l].length * Math.random() - 0.5)];
                this.getParent().getChildByTag(TagOfLayer.monsters).addMonster(new cc.math.Vec2 (200+(Math.random()*100-50),1100+(Math.random()*100-50)),material);
                //monstre 2
                material = this.monster[l][Math.round(this.monster[l].length * Math.random() - 0.5)];
                this.getParent().getChildByTag(TagOfLayer.monsters).addMonster(new cc.math.Vec2 (400+(Math.random()*100-50),1100+(Math.random()*100-50)),material);
            } else {
                material = this.monster[l][Math.round(this.monster[l].length * Math.random() - 0.5)];
                this.getParent().getChildByTag(TagOfLayer.monsters).addMonster(new cc.math.Vec2 (300+(Math.random()*100-50),1100+(Math.random()*100-50)),material);
            }
        }
    }
});
