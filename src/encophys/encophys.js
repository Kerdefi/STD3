//TODO move the init to loader
//TODO automove
//TODO populate
//TODO AI Monster
//TODO Heat management

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
    this.forces = [];
    this.connected = false;

    //Callback to load json config file
    this.loadJson = function (error, data) {
        this.materials = data.materials;
        this.booms = data.booms;
        this.maxspeed = data.maxspeed;
        this.size = data.size;
        this.framestep = data.framestep;
        this.gravity = data.gravity;
        this.minspeed = data.gravity/2*data.framestep/2;

        var i = 0;
        var j = 0;
        this.map = new Array(this.size.x);
        this.mapConnected = new Array(this.size.x);
        this.mapIddle = new Array(this.size.x);
        this.linkV = new Array(this.size.x);
        this.linkH = new Array(this.size.x + 1);
        for (i = 0; i < this.size.x; i++) {
            this.map[i] = new Array(this.size.y);
            this.mapConnected[i] = new Array(this.size.y);
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

    this.addForce = function (force) {
        this.forces.push (force);
    };

    this.removeForce = function (force) {
        cc.log(this.forces.indexOf(force));
        this.forces.splice(this.forces.indexOf(force), 1);
    };

    this.update = function () {
        var i = 0;
        var j = 0;
        var k = 0;
        var calc = new cc.math.Vec2(0, 0);
        var calcB = new cc.math.Vec2(0, 0);

        //Update les forces d'explosion
        for (i = 0 ; i < this.forces.length ; i++) {
            if(this.forces[i].life<=this.booms[this.forces[i].type].maxdiameter) {
                this.forces[i].diameter+=this.booms[this.forces[i].type].growth*this.framestep;
            }
            this.forces[i].life+=this.framestep;
            if(this.forces[i].life>=this.booms[this.forces[i].type].duration) {
                this.removeForce(this.forces[i]);
                if(i==0) { break; } else {i--;}
            }
        }

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
                        //ajoute la gravité (uniquement s'il n'y a pas de point fixe en dessous)
                        if(j-1>0) {
                            if(this.map[i][j-1]==null || Math.abs(this.map[i][j].speed.y) >= 1 || Math.abs(this.map[i][j-1].speed.y) != 0) {
                                this.map[i][j].speed.y -= this.gravity*this.framestep ;
                            }
                        }

                        //ajoute les forces d'explosion et la chaleur d'explosion
                        for (k = 0 ; k < this.forces.length ; k++) {
                            calcB.x=calc.x=i-this.forces[k].position.x;
                            calc.x=Math.abs(calc.x);
                            calcB.y=calc.y=j-this.forces[k].position.y;
                            calc.y=Math.abs(calc.y);
                            if(calc.x<this.forces[k].diameter && calc.y<this.forces[k].diameter) {
                                if ((calcB.x+calcB.y)==0) {
                                    calcB.x=1;
                                }
                                calcB.normalize();
                                calcB.scale(this.booms[this.forces[k].type].force*this.framestep);
                                this.map[i][j].speed.add(calcB);
                            }
                        }
                    } else {
                        //Pour un point lié
                        //ajoute les forces d'explosion (sur les link) et la chaleur d'explosion
                        for (k = 0 ; k < this.forces.length ; k++) {
                            calcB.x=calc.x=i-this.forces[k].position.x;
                            calc.x=Math.abs(calc.x);
                            calcB.y=calc.y=j-this.forces[k].position.y;
                            calc.y=Math.abs(calc.y);
                            if(calc.x<this.forces[k].diameter && calc.y<this.forces[k].diameter) {
                                calcB.normalize();
                                calcB = this.applyDamage (i,j,this.booms[this.forces[k].type].force*this.framestep,calcB);
                                this.map[i][j].speed.add(calcB);
                            }
                        }
                    }

                    //ajoute le frottement
                    calc.x = -this.map[i][j].speed.x*this.materials[this.map[i][j].material].friction ;
                    calc.y = -this.map[i][j].speed.y*this.materials[this.map[i][j].material].friction ;
                    this.map[i][j].speed.add (calc);

                    //limite la vitesse (max)
                    if((this.map[i][j].speed.x + this.map[i][j].speed.y)>this.maxspeed) {
                        this.map[i][j].speed.scale(this.maxspeed/(this.map[i][j].speed.x + this.map[i][j].speed.y));
                    }
                    //limite la vitesse (min) à 0,25 * g * timestep
                    if(Math.abs(this.map[i][j].speed.x + this.map[i][j].speed.y)<this.minspeed) {
                        this.map[i][j].speed.x = 0;
                        this.map[i][j].speed.y = 0;
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
        //Réalise un nouveau balayage pour les "fausses collisions"
        for (i = 0 ; i < this.size.x ; i++) {
            for (j = 0 ; j < this.size.y ; j++) {
                this.moveblock (i,j);
            }
        }

        //Réalise les échanges de chaleur

        //Détruit les points (et leurs link) avec une vie négative

        //Toutes les X frames descend tout le tableau

    };

    this.populate = function () {
        //remplit le tableau par le haut
        this.map[5][15] = new encophys.point
        ("stone",this.materials["stone"].baseheat,this.materials["stone"].basehealth,0);
        this.mapIddle[5][15]=false;

        this.map[3][22] = new encophys.point
        ("stone",this.materials["stone"].baseheat,this.materials["stone"].basehealth,0);
        this.mapIddle[3][29]=false;

        this.map[4][15] = new encophys.point
        ("stone",this.materials["stone"].baseheat,this.materials["stone"].basehealth,0);
        this.mapIddle[4][15]=false;
        this.linkH[4][15]=20;

        this.map[3][15] = new encophys.point
        ("wood",this.materials["wood"].baseheat,this.materials["wood"].basehealth,0);
        this.mapIddle[3][15]=false;
        this.linkH[3][15]=20;

        this.map[2][15] = new encophys.point
        ("wood",this.materials["wood"].baseheat,this.materials["wood"].basehealth,0);
        this.mapIddle[2][15]=false;
        this.linkH[2][15]=5;

        this.map[1][15] = new encophys.point
        ("stone",this.materials["stone"].baseheat,this.materials["stone"].basehealth,0);
        this.mapIddle[1][15]=false;
        this.linkH[1][15]=5;

        this.map[0][15] = new encophys.point
        ("stone",this.materials["stone"].baseheat,this.materials["stone"].basehealth,0);
        this.mapIddle[0][15]=false;
        this.linkH[0][15]=50;

        //forcetest
        //this.addForce (new encophys.force("standard",new cc.math.Vec2(0, 14)));
    };

    this.applyDamage = function (i,j,force,residual) {
        residual.normalize();
        var sumlink = this.linkH[i][j] + this.linkH[i+1][j] + this.linkV[i][j] + this.linkV[i][j+1] ;
        if(force-sumlink>0) {
            residual.scale(force-sumlink);

            if (i-1>=0 && this.linkH[i][j]>0) {if (this.map[i-1][j]!=null) {if(this.isConnected (i-1,j,0)) {this.destroyLinks(i-1,j,0);}}}
            if (i+1<this.size.x && this.linkH[i+1][j]>0) {if (this.map[i+1][j]!=null) {if(this.isConnected (i+1,j,0)) {this.destroyLinks(i+1,j,0);}}}
            if (j-1>=0 && this.linkV[i][j]) {if (this.map[i][j-1]!=null) {if(this.isConnected (i,j-1,0)) {this.destroyLinks(i,j-1,0);}}}
            if (j+1<this.size.y && this.linkV[i][j+1]) {if (this.map[i][j+1]!=null) {if(this.isConnected (i,j+1,0)) {this.destroyLinks(i,j+1,0);}}}

            this.linkH[i][j]=0;
            this.linkH[i+1][j]=0;
            this.linkV[i][j]=0;
            this.linkV[i][j+1]=0;

        } else {
            residual.scale(0);
            this.linkH[i][j]-=force*this.linkH[i][j]/sumlink;
            this.linkH[i+1][j]-=force*this.linkH[i+1][j]/sumlink;
            this.linkV[i][j]-=force*this.linkV[i][j]/sumlink;
            this.linkV[i][j+1]-=force*this.linkV[i][j+1]/sumlink;
        }
        //Retourne un vecteur avec la force non répartie
        return residual;
    };

    this.isConnected = function (i,j,round) {
        //Suite à une déconnexion de point, test si ses voisins sont encore connectés (récursif jusqu'à 20)
        if(round>20) return false;
        if(round==0) {
            this.connected = false;
            //Reseting la table de passage
            for (var k = 0 ; k < this.size.x ; k++) {
                for (var l = 0 ; l < this.size.y ; l++) {
                    this.mapConnected[k][l]=false;
                }
            }
        }
        if(this.connected) return true;

        this.mapConnected[i][j] = true;

        if (i-1>=0) {
            if(this.linkH[i][j]>0 && !this.mapConnected[i-1][j]) {this.connected = this.connected || this.isConnected (i-1,j,round+1);}
        }
        else {if (i-1=0 && this.linkH[i][j]>0){this.connected = true;}}

        if (i+1<this.size.x && this.linkH[i+1][j]>0 && !this.mapConnected[i+1][j]) {this.connected = this.connected || this.isConnected (i+1,j,round+1);}
        else {if (i+1>=0 && this.linkH[i+1][j]>0){this.connected = true;}}

        if (j-1>=0 && this.linkV[i][j]>0 && !this.mapConnected[i][j-1]) {this.connected = this.connected || this.isConnected (i,j-1,round+1);}
        else {if (j-1>=0 && this.linkV[i][j]>0){this.connected = true;}}

        if (j+1<this.size.y && this.linkV[i][j+1]>0 && !this.mapConnected[i][j+1]) {this.connected = this.connected || this.isConnected (i,j+1,round+1);}
        else {if (j+1>=0 && this.linkV[i][j+1]>0){this.connected = true;}}

        //Retourne le résultat
        return this.connected;
    };

    this.destroyLinks = function (i,j, round) {
        if(round>20) return true;
        if (i-1>=0 && this.linkH[i][j]>0) {
            this.linkH[i][j]=0;
            this.destroyLinks (i-1,j,round+1);
        }
        if (i+1<this.size.x && this.linkH[i+1][j]>0) {
            this.linkH[i+1][j]=0;
            this.destroyLinks (i+1,j,round+1);
        }
        if (j-1>=0 && this.linkV[i][j]>0) {
            this.linkV[i][j]=0;
            this.destroyLinks (i,j-1,round+1);
        }
        if (j+1<this.size.y && this.linkV[i][j+1]>0) {
            this.linkV[i][j+1]=0;
            this.destroyLinks (i,j+1,round+1);
        }
    };

    this.collision = function (x1,y1,x2,y2) {
<<<<<<< HEAD
        //BUG tout part en fausse collision (c'est nul au moins d'un côté)
        //Détecte s'il s'agit d'une fausse collision (v1<v2) (fait perdre un tour de mvt au point en mvt)
        if (this.map[x1][y1].speed.x*(x2-x1)-this.map[x2][y2].speed.x*(x2-x1)<=0 || this.map[x1][y1].speed.y*(y2-y1)-this.map[x2][y2].speed.y*(y2-y1)<=0) {
            //Marque le point bougé en isUpdate = false pour la deuxième passe
            this.map[x1][y1].isUpdated=false;
            return false ;
        }

        //BUG la force est à réduire si le point avance
        //Brule la vitesse sur les link et les détruits
        //N*s = m/s*kg = V * kg
        var force = (this.map[x1][y1].speed.x*(x2-x1)+this.map[x1][y1].speed.y*(y2-y1))*this.materials[this.map[x1][y1].material].mass;
=======

>>>>>>> STD3/master
        var residual = new cc.math.Vec2(x2-x1, y2-y1);

        //Détecte si le deuxième point est connecté
        if(this.linkH[x2][y2]<=0 && this.linkH[x2 + 1][y2]<=0 && this.linkV[x2][y2]<=0 && this.linkV[x2][y2+1]<=0) {
            //Détecte s'il s'agit d'une fausse collision (v1<v2)
            if (this.map[x1][y1].speed.x*(x2-x1)-this.map[x2][y2].speed.x*(x2-x1)<=0 && (x2-x1)!=0 || this.map[x1][y1].speed.y*(y2-y1)-this.map[x2][y2].speed.y*(y2-y1)<=0 && (y2-y1) != 0) {
                //Marque le point bougé en isUpdate = false pour la deuxième passe
                this.map[x1][y1].isUpdated=false;
                return false ;
            }
            if(x2-x1!=0) {
                residual.x = (this.map[x1][y1].speed.x*this.materials[this.map[x1][y1].material].mass+this.map[x2][y2].speed.x*this.materials[this.map[x2][y2].material].mass)/(this.materials[this.map[x1][y1].material].mass+this.materials[this.map[x2][y2].material].mass);
            } else {
                residual.y = (this.map[x1][y1].speed.y*this.materials[this.map[x1][y1].material].mass+this.map[x2][y2].speed.y*this.materials[this.map[x2][y2].material].mass)/(this.materials[this.map[x1][y1].material].mass+this.materials[this.map[x2][y2].material].mass);
            }
        } else {
            //Brule la vitesse sur les link et les détruits
            //N*s = m/s*kg = V * kg
            var force = (this.map[x1][y1].speed.x*(x2-x1)+this.map[x1][y1].speed.y*(y2-y1))*this.materials[this.map[x1][y1].material].mass;
            this.applyDamage (x2,y2,force,residual);
            residual.scale(1/(this.materials[this.map[x1][y1].material].mass+this.materials[this.map[x2][y2].material].mass));
        }

        //Reprogramme pour le move si les points sonten mvt
        if(Math.abs(residual.x) >= 0 || Math.abs(residual.y) != 0) {
            this.map[x1][y1].isUpdated=false;
            this.map[x2][y2].isUpdated=false;
        }

        //BUG l'idée c'est que la vitesse sur l'axe soit égal à residual
        //Transfère la vitesse entre les points
        if(x2-x1==0) {this.map[x1][y1].speed.y=0; this.map[x2][y2].speed.y=0;}
        else {this.map[x1][y1].speed.x=0; this.map[x2][y2].speed.x=0;}

        this.map[x2][y2].speed.add(residual);
        this.map[x1][y1].speed.add(residual);

        //Réalise les dégats
        this.map[x2][y2].health-=this.map[x1][y1].damage;
        this.map[x1][y1].health-=this.map[x2][y2].damage;

        //Marque le point touché en isnotiddle
        this.mapIddle[x2][y2]=false;
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
                            //Intègre le mouvement déjà réalisé dans unusedspeed (pour le deuxième passage) et arrête le calcul sur x
<<<<<<< HEAD
                            //Quid BUG ?
                            calcS.x=calcS.x-this.map[i+k][j+l].unusedSpeed.x-this.map[i+k][j+l].speed.x;
=======
                            calc.x=0;
>>>>>>> STD3/master
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
                            //Intègre le mouvement déjà réalisé dans unusedspeed (pour le deuxième passage) et arrête le calcul sur y
<<<<<<< HEAD
                            //Quid BUG ?
                            calcS.y=calcS.y-this.map[i+k][j+l].unusedSpeed.y-this.map[i+k][j+l].speed.y;
=======
                            calc.y=0;
>>>>>>> STD3/master
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
    //Sert à savoir si le point a bougé
    this.isUpdated = false ;
};

encophys.force = function (type, position) {
    this.type = type ;
    this.position = position ;
    this.diameter = 1 ;
    this.life = 0;
};

