//TODO move the init to loader
//TODO ajouter un mapisiddle pour optimiser
//TODO utiliser le material

var encophys = encophys || {};

encophys.PAUSE = 0;
encophys.RUN = 1;

encophys.world = function () {
    "use strict";
    //pause = 0 ; run = 1
    this.state = encophys.PAUSE;
    this.maxspeed = 0;
    this.framestep = 0;
    this.gravity = 0;

    //Callback to load json config file
    this.loadJson = function (error, data) {
        this.materials = data.materials;
        this.maxspeed = data.maxspeed;
        this.size = data.size;
        this.framestep = data.framestep;
        this.gravity = data.gravity;

        var i = 0;
        var j = 0;
        this.map = new Array(this.size.x);
        this.mapIddle = new Array(this.size.x);
        this.linkV = new Array(this.size.x);
        this.linkH = new Array(this.size.x + 1);
        for (i = 0; i < this.size.x; i++) {
            this.map[i] = new Array(this.size.y);
            this.mapIddle[i] = new Array(this.size.y);
            this.linkV[i] = new Array(this.size.y + 1);
            this.linkH[i] = new Array(this.size.y);
        }
        this.linkH[this.size.x] = new Array(this.size.y);

        for (i = 0 ; i < this.size.x + 1 ; i++) {
            for (j = 0 ; j < this.size.y ; j++) {
                this.linkH[i][j]=0;
            }
        }
        for (i = 0 ; i < this.size.x ; i++) {
            for (j = 0 ; j < this.size.y + 1 ; j++) {
                this.linkV[i][j]=0;
            }
        }

        cc.director.getScheduler().scheduleUpdateForTarget(this,-100,false);
        cc.director.getScheduler().pauseTarget(this);
    }.bind(this);

    //configpath = string
    this.init = function (configpath) {
        cc.loader.loadJson(configpath, this.loadJson);
    };

    this.changeState = function (state) {
        if (this.state == encophys.PAUSE && (state == encophys.RUN)) {
            this.state = state;
            cc.director.getScheduler().resumeTarget(this);
        } else {
            cc.director.getScheduler().pauseTarget(this);
            this.state = state;
        }
    };

    this.update = function () {
        var i = 0;
        var j = 0;
        var calc = new cc.math.Vec2(0, 0);

        //Update les forces d'explosion

        //Reset le statut des points et les passe en iddle
        for (i = 0 ; i < this.size.x ; i++) {
            for (j = 0 ; j < this.size.y ; j++) {
                this.mapIddle[i][j]=true;
                if(this.map[i][j]!=null) {
                    this.map[i][j].isUpdated=false;
                }
            }
        }

        //Applique les forces hors collision
        for (i = 0 ; i < this.size.x ; i++) {
            for (j = 0 ; j < this.size.y ; j++) {
                if(this.map[i][j]!=null) {
                    if(this.linkH[i][j]<=0 && this.linkH[i + 1][j]<=0 && this.linkV[i][j]<=0 && this.linkV[i][j+1]<=0) {
                        //Pour un point libre
                        //ajoute la gravité
                        this.map[i][j].speed.y -= this.gravity*this.framestep ;
                        //ajoute les forces d'explosion et la chaleur d'explosion

                        //ajoute le frottement
                        calc.x = -this.map[i][j].speed.x*this.materials[this.map[i][j].material].friction ;
                        calc.y = -this.map[i][j].speed.y*this.materials[this.map[i][j].material].friction ;
                        this.map[i][j].speed.add (calc);

                        //limite la vitesse
                        if((this.map[i][j].speed.x + this.map[i][j].speed.y)>this.maxspeed) {
                            this.map[i][j].speed.scale(this.maxspeed/(this.map[i][j].speed.x + this.map[i][j].speed.y));
                        }
                    } else {
                        //Pour un point lié
                        //ajoute les forces d'explosion (sur les link) et la chaleur d'explosion
                    }
                }
            }
        }

        //Modifie la position et détecte les collisions
        for (i = 0 ; i < this.size.x ; i++) {
            for (j = 0 ; j < this.size.y ; j++) {
                this.moveblock (i,j);
            }
        }

        //Réalise les échanges de chaleur

        //Toutes les X frames descend tout le tableau

    };

    this.populate = function () {
        //remplit le tableau par le haut
        this.map[5][15] = new encophys.point
        ("stone",this.materials["stone"].baseheat,this.materials["stone"].basehealth,0);
        this.mapIddle[5][15]=false;
        this.map[2][15] = new encophys.point
        ("stone",this.materials["stone"].baseheat,this.materials["stone"].basehealth,0);
        this.mapIddle[2][15]=false;
        this.map[0][15] = new encophys.point
        ("stone",this.materials["stone"].baseheat,this.materials["stone"].basehealth,0);
        this.mapIddle[0][15]=false;
        this.linkH[0][15]=50;
    };

    this.isConnected = function (x,y) {
        //test si un point est encore connecté

        //Détruit tous les liens non connectés

        //Retourne le résultat
    };

    this.moveblock = function(i,j) {
        //Analyse et déplace un élément
        if(this.map[i][j]!=null) {
            if(!this.map[i][j].isUpdated) {
                this.map[i][j].isUpdated=true;
                var k = 0;
                var l = 0;
                var calc = new cc.math.Vec2(0, 0);
                var calcS = new cc.math.Vec2(0, 0);
                calcS.x = (this.map[i][j].unusedSpeed.x+this.map[i][j].speed.x)*this.framestep;
                calcS.y = (this.map[i][j].unusedSpeed.y+this.map[i][j].speed.y)*this.framestep;

                //Calcul du sens de déplacement
                if(calcS.x >= 0) {
                    calc.x = 1 ;
                } else {
                    calc.x = -1 ;
                }
                if(calcS.y >= 0) {
                    calc.y = 1 ;
                } else {
                    calc.y = -1 ;
                }

                while ((calc.x*calcS.x>=1) || (calc.y*calcS.y>=1)) {
                    this.mapIddle[i][j]=false;
                    if(calc.x*calcS.x>=1) {

                        //vérification du respect des limites x
                        if (i+k+calc.x < 0 || i+k+calc.x >= this.size.x) {
                            this.map[i+k][j+l] = null;
                            break;
                        }
                        //test de collision x
                        if(this.map[i+k+calc.x][j+l]==null){
                            this.map[i+k+calc.x][j+l] = this.map[i+k][j+l];
                            this.map[i+k][j+l]=null;
                            calcS.x-=calc.x;
                            k+=calc.x;
                        } else {
                            //collision
                            this.collision (i+k,j+l,i+k+calc.x,j+l);
                            //si le point n'a pas survécu, fin de la boucle A UPDATER
                            if (this.map[i][j] == null) {
                                break;
                            }
                        }
                    }
                    if(calc.y*calcS.y>=1) {

                        //vérification du respect des limites y
                        if (j+l+calc.y < 0 || j+l+calc.y >= this.size.y) {
                            this.map[i+k][j+l] = null;
                            break;
                        }
                        //test de collision y
                        if(this.map[i+k][j+l+calc.y]==null){
                            this.map[i+k][j+l+calc.y] = this.map[i+k][j+l];
                            this.map[i+k][j+l]=null;
                            calcS.y-=calc.y;
                            l+=calc.y;
                        } else {
                            //collision
                            this.collision (i+k,j+l,i+k,j+l+calc.y);
                            //si le point n'a pas survécu, fin de la boucle A UPDATER
                            if (this.map[i][j] == null) {
                                break;
                            }
                        }
                    }
                }
                if(this.map[i+k][j+l]!=null) {
                    this.map[i+k][j+l].unusedSpeed.x = calcS.x/this.framestep;
                    this.map[i+k][j+l].unusedSpeed.y = calcS.y/this.framestep;
                    this.mapIddle[i+k][j+l]=false;
                }
            }
        }
    };

    this.collision = function (x1,y1,x2,y2) {
        //Brule la vitesse sur les link et les détruits

        //Transfère la vitesse à l'autre point

        //Réalise les dégats

        //Détruit les points
    };
};

//material = string ; mass = number ; position = Vec2 ; heat = number
encophys.point = function (material, heat, health, damage) {
    "use strict";
    this.material = material;
    this.heat = heat ;
    this.health = health ;
    this.speed = new cc.math.Vec2(0, 0);
    this.unusedSpeed = new cc.math.Vec2(0, 0);
    this.position = new cc.math.Vec2(0, 0);
    this.damage = damage ;
    this.isUpdated = false ;
};

encophys.force = function (position, diameter, strenght, heat, duration, damage) {
    this.position = position ;
    this.diameter = diameter ;
    this.strenght = strenght ;
    this.heat = heat ;
    this.damage = damage ;
    this.duration = duration ;
};

