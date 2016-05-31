//TODO corriger arborescence sprites (commencer à 0, évietr arrow12)
//TODO Menu (main - explication et loading - pause - endgame et highscore)
//Test sprites
//TODO Mécanique de jeu (call-back destruction, AI monster, projectiles, scores, levels, player management)
//TODO Hightscore
//TODO move the init to loader


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
        this.heatTransferRate = data.heatTransferRate;
        this.burnrate = data.burnrate;
        this.maxheat = data.maxheat;
        this.minspeed = data.gravity/2*data.framestep/2;
        this.roundlimit = data.roundlimit;
        this.collisionfriction = data.collisionfriction;

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

        cc.director.getScheduler().scheduleUpdateForTarget(this,10,false);
        cc.director.getScheduler().pauseTarget(this);
    }.bind(this);

    //configpath = string
    this.init = function (configpath) {
        cc.loader.loadJson(configpath, this.loadJson);
    };

    //remets le moteur en état initial
    this.reset = function () {
        this.changeState(encophys.PAUSE);
        //Efface tous les tableaux
        var i = 0;
        var j = 0;
        for (i = 0; i < this.size.x; i++) {
            for (j = 0 ; j < this.size.y ; j++) {
                this.map[i][j]=null;
                this.mapConnected[i][j]=false;
                this.mapIddle[i][j]=true;
            }
        }
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
        for (i = 0; i < this.forces.length ; i++) {
            this.removeForce (this.forces[i]);
        }
    };

    //Modification de l'état du moteur
    this.changeState = function (state) {
        if (this.state == encophys.PAUSE && (state == encophys.RUN)) {
            this.state = state;
            cc.director.getScheduler().resumeTarget(this);
        } else {
            cc.director.getScheduler().pauseTarget(this);
            this.state = state;
        }
    };

    //Ajoute une nouvelle force
    this.addForce = function (force) {
        this.forces.push (force);
    };

    //Enlève une force
    this.removeForce = function (force) {
        this.forces.splice(this.forces.indexOf(force), 1);
    };

    //Mise à jour du moteur chaque frame
    this.update = function () {
        var i = 0;
        var j = 0;
        var k = 0;
        var calc = new cc.math.Vec2(0, 0);
        var calcB = new cc.math.Vec2(0, 0);

        //Update les forces d'explosion
        for (i = 0 ; i < this.forces.length ; i++) {
            if(this.forces[i].diameter<=this.booms[this.forces[i].type].maxdiameter) {
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
                            //if(this.map[i][j-1]==null || Math.abs(this.map[i][j].speed.y) >= 1 || Math.abs(this.map[i][j-1].speed.y) != 0) {
                            if(this.map[i][j-1]==null) {
                                if(this.materials[this.map[i][j].material].gravity) this.map[i][j].speed.y -= this.gravity*this.framestep ;
                            }
                        }

                        //ajoute les forces d'explosion et la chaleur d'explosion
                        for (k = 0 ; k < this.forces.length ; k++) {
                            //force
                            calcB.x=calc.x=i-this.forces[k].position.x;
                            calc.x=Math.abs(calc.x);
                            calcB.y=calc.y=j-this.forces[k].position.y;
                            calc.y=Math.abs(calc.y);
                            if(calc.x<this.forces[k].diameter && calc.y<this.forces[k].diameter) {
                                //heat
                                this.map[i][j].heat+=this.booms[this.forces[k].type].heat*this.framestep;
                                //damage
                                this.map[i][j].health-=this.booms[this.forces[k].type].damage*this.framestep;
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
                            //force
                            calcB.x=calc.x=i-this.forces[k].position.x;
                            calc.x=Math.abs(calc.x);
                            calcB.y=calc.y=j-this.forces[k].position.y;
                            calc.y=Math.abs(calc.y);
                            if(calc.x<this.forces[k].diameter && calc.y<this.forces[k].diameter) {
                                //heat
                                this.map[i][j].heat+=this.booms[this.forces[k].type].heat*this.framestep;
                                //damage
                                this.map[i][j].health-=this.booms[this.forces[k].type].damage*this.framestep;
                                if ((calcB.x+calcB.y)==0) {
                                    calcB.x=1;
                                }
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
                    if(Math.abs(this.map[i][j].speed.x + this.map[i][j].speed.y)>this.maxspeed) {
                        this.map[i][j].speed.scale(this.maxspeed/(this.map[i][j].speed.x + this.map[i][j].speed.y));
                        this.map[i][j].unusedSpeed.scale(this.maxspeed/(this.map[i][j].unusedSpeed.x + this.map[i][j].unusedSpeed.y));
                    }
                    //limite la vitesse (min) à 0,25 * g * timestep
                    if(Math.abs(this.map[i][j].speed.x + this.map[i][j].speed.y)<this.minspeed) {
                        this.map[i][j].speed.x = 0;
                        this.map[i][j].speed.y = 0;
                    }
                }
            }
        }

        this.checkFix ();
        //Modifie la position et détecte les collisions
        for (i = 0 ; i < this.size.x ; i++) {
            for (j = 0 ; j < this.size.y ; j++) {
                this.moveblock (i,j);
            }
        }
        this.checkFix ();
        //Réalise un nouveau balayage pour les "fausses collisions" / ou les destructions de lien
        for (i = 0 ; i < this.size.x ; i++) {
            for (j = 0 ; j < this.size.y ; j++) {
                this.moveblock (i,j);
            }
        }

        //Smoothmove (ralenti le décalae discret d'une position)
        for (i = 0 ; i < this.size.x ; i++) {
            for (j = 0 ; j < this.size.y ; j++) {
                if(this.map[i][j]!=null) {
                    //smoothmove à zéro si un point est à côté
                    if(i==0 && this.map[i][j].smoothposition.x<0 || i>0 && this.map[i-1][j]!=null && this.map[i][j].smoothposition.x<0)this.map[i][j].smoothposition.x= (i==0 ? 0 : Math.min(0,this.map[i-1][j].smoothposition.x));

                    if(i==this.size.x-1 && this.map[i][j].smoothposition.x>0 || i < this.size.x-1 && this.map[i+1][j]!=null && this.map[i][j].smoothposition.x>0)this.map[i][j].smoothposition.x= (i==this.size.x-1 ? 0 : Math.min(0,this.map[i+1][j].smoothposition.x));

                    //smoothmove à 1 au max
                    if(Math.abs(this.map[i][j].smoothposition.x)>1)this.map[i][j].smoothposition.x = this.map[i][j].smoothposition.x/Math.abs(this.map[i][j].smoothposition.x);

                    //évol de smooth move
                    if(this.map[i][j].smoothposition.x != 0) {
                        k = (Math.abs(this.map[i][j].speed.x)+this.materials[this.map[i][j].material].automove)*this.framestep;
                        if(Math.abs(this.map[i][j].smoothposition.x) > k) {
                            this.map[i][j].smoothposition.x *= 1-k/Math.abs(this.map[i][j].smoothposition.x);
                        } else this.map[i][j].smoothposition.x = 0;
                        this.mapIddle[i][j]=false;
                    }

                     //smoothmove à zéro si un point est à côté
                    if(j==0 && this.map[i][j].smoothposition.y<0 || j>0 && this.map[i][j-1]!=null && this.map[i][j].smoothposition.y<0)this.map[i][j].smoothposition.y= (j==0 ? 0 : Math.min(0,this.map[i][j-1].smoothposition.y));

                    if(j==this.size.y-1 && this.map[i][j].smoothposition.y>0 || j < this.size.y-1 && this.map[i][j+1]!=null && this.map[i][j].smoothposition.y>0)this.map[i][j].smoothposition.y = (j==this.size.y-1 ? 0 : Math.min(0,this.map[i][j+1].smoothposition.y));

                    //smoothmove à 1 au max
                    if(Math.abs(this.map[i][j].smoothposition.y)>1)this.map[i][j].smoothposition.y = this.map[i][j].smoothposition.y/Math.abs(this.map[i][j].smoothposition.y);

                    //évol de smooth move
                    if(this.map[i][j].smoothposition.y != 0) {
                        k = (Math.abs(this.map[i][j].speed.y)+this.gravity*this.framestep)*this.framestep;
                        if(Math.abs(this.map[i][j].smoothposition.y) > k) {
                            this.map[i][j].smoothposition.y *= 1-k/Math.abs(this.map[i][j].smoothposition.y);
                        } else this.map[i][j].smoothposition.flipY = 0;
                        this.mapIddle[i][j]=false;
                    }
                    //this.map[i][j].smoothposition.x = 0;
                    //this.map[i][j].smoothposition.y = 0;
                }
            }
        }

        //Réalise les échanges de chaleur et étend le feu
        for (i = 0 ; i < this.size.x ; i++) {
            for (j = 0 ; j < this.size.y ; j++) {
                if(this.map[i][j]!=null) {
                    //Transfert de chaleur
                    if(i-1 >= 0 && this.map[i-1][j]!=null && Math.abs(this.map[i-1][j].heat-this.map[i][j].heat)>0) {
                        k = (this.map[i][j].heat - this.map[i-1][j].heat)*this.heatTransferRate*this.framestep/2 ;
                        this.map[i][j].heat-=k;
                        this.map[i-1][j].heat+=k;
                    }
                    if(i+1 < this.size.x && this.map[i+1][j]!=null && Math.abs(this.map[i+1][j].heat-this.map[i][j].heat)>0) {
                        k = (this.map[i][j].heat - this.map[i+1][j].heat)*this.heatTransferRate*this.framestep/2 ;
                        this.map[i][j].heat-=k;
                        this.map[i+1][j].heat+=k;
                    }
                    if(j-1 >= 0 && this.map[i][j-1]!=null && Math.abs(this.map[i][j-1].heat-this.map[i][j].heat)>0) {
                        k = (this.map[i][j].heat - this.map[i][j-1].heat)*this.heatTransferRate*this.framestep/2 ;
                        this.map[i][j].heat-=k;
                        this.map[i][j-1].heat+=k;
                    }
                    if(j+1 < this.size.y && this.map[i][j+1]!=null && Math.abs(this.map[i][j+1].heat-this.map[i][j].heat)>0) {
                        k = (this.map[i][j].heat - this.map[i][j+1].heat)*this.heatTransferRate*this.framestep/2 ;
                        this.map[i][j].heat-=k;
                        this.map[i][j+1].heat+=k;
                    }

                    //Changement d'état (uniquement dans un sens par matériaux)
                    if(this.materials[this.map[i][j].material].meltheat > this.materials[this.map[i][j].material].baseheat && this.materials[this.map[i][j].material].burnheat > this.materials[this.map[i][j].material].meltheat && this.materials[this.map[i][j].material].meltheat < this.map[i][j].heat) {
                        //Fusion
                        this.map[i][j].material = this.materials[this.map[i][j].material].meltmatter;
                        this.isConnectedInit (i,j);
                        this.mapIddle[i][j]=false;
                    }
                    if(this.materials[this.map[i][j].material].meltheat < this.materials[this.map[i][j].material].baseheat && this.materials[this.map[i][j].material].meltheat > this.map[i][j].heat) {
                        //Solidification
                        this.map[i][j].material = this.materials[this.map[i][j].material].meltmatter;
                        this.map[i][j].smoothposition.x=0;
                        this.mapIddle[i][j]=false;
                    }

                    //Développement du feu (uniquement si le matériaux peut bruler melt>burn)
                    if(this.map[i][j].heat >= this.materials[this.map[i][j].material].burnheat && this.materials[this.map[i][j].material].burnheat < this.materials[this.map[i][j].material].meltheat) {
                        //Transfert du feu
                        if(i-1>=0 && this.map[i-1][j]!=null && this.materials[this.map[i-1][j].material].burnheat < this.materials[this.map[i-1][j].material].meltheat && Math.random () < this.burnrate*this.framestep) {
                            this.map[i-1][j].heat = this.materials[this.map[i-1][j].material].burnheat + 50 ;
                            this.mapIddle[i-1][j]=false;
                        }
                        if(i+1<this.size.x && this.map[i+1][j]!=null && this.materials[this.map[i+1][j].material].burnheat < this.materials[this.map[i+1][j].material].meltheat && Math.random () < this.burnrate*this.framestep) {
                            this.map[i+1][j].heat = this.materials[this.map[i+1][j].material].burnheat  + 50  ;
                            this.mapIddle[i+1][j]=false;
                        }
                        if(j-1>=0 && this.map[i][j-1]!=null && this.materials[this.map[i][j-1].material].burnheat < this.materials[this.map[i][j-1].material].meltheat && Math.random () < this.burnrate*this.framestep) {
                            this.map[i][j-1].heat = this.materials[this.map[i][j-1].material].burnheat  + 50  ;
                            this.mapIddle[i][j-1]=false;
                        }
                        if(j+1<this.size.y && this.map[i][j+1]!=null && this.materials[this.map[i][j+1].material].burnheat < this.materials[this.map[i][j+1].material].meltheat && Math.random () < this.burnrate*this.framestep) {
                            this.map[i][j+1].heat = this.materials[this.map[i][j+1].material].burnheat  + 50  ;
                            this.mapIddle[i][j+1]=false;
                        }

                        this.mapIddle[i][j]=false;

                        //Augentation de la chaleur
                        this.map[i][j].heat+=(this.materials[this.map[i][j].material].meltheat-this.materials[this.map[i][j].material].burnheat)*this.burnrate*this.framestep;

                        //Destruction si la chaleur dépasse le niveau admis
                        if(this.map[i][j].heat >= this.materials[this.map[i][j].material].meltheat) {
                            this.destroy (i,j);
                        }
                    } else {
                        if(this.map[i][j].heat >= this.materials[this.map[i][j].material].burnheat) {
                            this.destroy (i,j);
                        }
                    }
                }
            }
        }

        //Limite la chaleur
        for (i = 0 ; i < this.size.x ; i++) {
            for (j = 0 ; j < this.size.y ; j++) {
                if(this.map[i][j]!=null) {
                    this.map[i][j].heat = Math.min(this.map[i][j].heat,this.maxheat);
                }
            }
        }

        //Détruit les points (et leurs link) avec une vie négative
        for (i = 0 ; i < this.size.x ; i++) {
            for (j = 0 ; j < this.size.y ; j++) {
                if(this.map[i][j]!=null) {
                    if(this.map[i][j].health <= 0) {
                        this.destroy (i,j);
                    }
                }
            }
        }
    };

    //Détruit un point
    this.destroy = function (i,j) {
        this.map[i][j]=null;
        this.isConnectedInit (i,j);
        this.mapIddle[i][j]=false;
    };

    //Ajoute un point et créée les link adéquats
    this.addPoint = function (x,y,material, damage, index) {
        var damagedone = 0;
        if(this.map[x][y]!=null && this.map[x][y].index != index) {
            damagedone = this.map[x][y].damage;
            this.isConnectedInit(x,y);
        }

        //remplit le tableau par le haut
        this.map[x][y] = new encophys.point (material,this.materials[material].baseheat,this.materials[material].basehealth,damage);
        this.map[x][y].index = index;

        if(this.materials[this.map[x][y].material].fix == false) {
            if(x-1 >= 0 && this.map[x-1][y] != null && this.materials[this.map[x-1][y].material].linkstrenght != 0) {this.linkH[x][y]=1}
            if(x-1 >= 0 && this.map[x-1][y] != null && this.map[x-1][y].material == material || x==0) {this.linkH[x][y]=this.materials[material].linkstrenght;}

            if(x+1 < this.size.x && this.map[x+1][y] != null  && this.materials[this.map[x+1][y].material].linkstrenght != 0) {this.linkH[x+1][y]=1}
            if(x+1 < this.size.x && this.map[x+1][y] != null && this.map[x+1][y].material == material || x==this.size.x-1) {this.linkH[x+1][y]=this.materials[material].linkstrenght;}

            if(y-1 >= 0 && this.map[x][y-1] != null && this.materials[this.map[x][y-1].material].linkstrenght != 0) {this.linkV[x][y]=1}
            if(y-1 >= 0 && this.map[x][y-1] != null && this.map[x][y-1].material == material || y==0) {this.linkV[x][y]=this.materials[material].linkstrenght;}

            if(!this.isConnected (x,y)) this.destroyLinks(x,y);
        }

        this.mapIddle[x][y]=false;

        return damagedone;
    };

    //Applique les dégats (collisions ou force)
    this.applyDamage = function (i,j,force,residual) {
        residual.normalize();
        var sumlink = this.linkH[i][j] + this.linkH[i+1][j] + this.linkV[i][j] + this.linkV[i][j+1] ;
        if(force-sumlink>0) {
            residual.scale(force-sumlink);
            this.isConnectedInit (i,j);
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

    //Vérifie si un point et connecté - si ce n'est pas le cas détruit les links
    this.isConnectedInit = function (i,j) {
        if (i-1>=0 && this.linkH[i][j]>0) {if (this.map[i-1][j]!=null) {this.linkH[i][j]=0; if(!this.isConnected (i-1,j,0)) {this.destroyLinks(i-1,j,0);}}}

        if (i+1<this.size.x && this.linkH[i+1][j]>0) {if (this.map[i+1][j]!=null) {this.linkH[i+1][j]=0; if(!this.isConnected (i+1,j,0)) {this.destroyLinks(i+1,j,0);}}}

        if (j-1>=0 && this.linkV[i][j]>0) {if (this.map[i][j-1]!=null) {this.linkV[i][j]=0; if(!this.isConnected (i,j-1,0)) {this.destroyLinks(i,j-1,0);}}}

        if (j+1<this.size.y && this.linkV[i][j+1]>0) {if (this.map[i][j+1]!=null) {this.linkV[i][j+1]=0; if(!this.isConnected (i,j+1,0)) {this.destroyLinks(i,j+1,0);}}}

        this.linkH[i][j]=0;
        this.linkH[i+1][j]=0;
        this.linkV[i][j]=0;
        this.linkV[i][j+1]=0;
    };

    //Récursif : avance petit à petit pour chercher une connexion au bord
    this.isConnected = function (i,j,round) {
        //Suite à une déconnexion de point, test si ses voisins sont encore connectés (récursif jusqu'à 20)
        if(round>this.roundlimit) return false;
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

        if(i>0 && this.linkH[i][j]>0 && !this.mapConnected[i-1][j]) {this.connected = this.connected || this.isConnected (i-1,j,round+1);} else {if (i==0 && this.linkH[i][j]>0){this.connected = true;}}

        if (i<this.size.x-1 && this.linkH[i+1][j]>0 && !this.mapConnected[i+1][j]) {this.connected = this.connected || this.isConnected (i+1,j,round+1);} else {if (i==this.size.x-1 && this.linkH[i+1][j]>0){this.connected = true;}}

        if(j>0 && this.linkV[i][j]>0 && !this.mapConnected[i][j-1]) {this.connected = this.connected || this.isConnected (i,j-1,round+1);} else {if (j==0 && this.linkV[i][j]>0){this.connected = true;}}

        if(j<this.size.y-1 && this.linkV[i][j+1]>0 && !this.mapConnected[i][j+1]) {this.connected = this.connected || this.isConnected (i,j+1,round+1);} else {if (j==this.size.y-1 && this.linkV[i][j+1]>0){this.connected = true;}}

        //Retourne le résultat
        return this.connected;
    };

    //Détruit tous les links d'un ensemble non connecté
    this.destroyLinks = function (i,j, round) {
        if(round>this.roundlimit) return true;

        if (this.linkH[i][j]>0) {
            this.linkH[i][j]=0;
            if(i-1>=0) this.destroyLinks (i-1,j,round+1);
        } else this.linkH[i][j]=0;

        if (this.linkH[i+1][j]>0) {
            this.linkH[i+1][j]=0;
            if(i<this.size.x+1) this.destroyLinks (i+1,j,round+1);
        } else this.linkH[i+1][j]=0;

        if (this.linkV[i][j]>0) {
            this.linkV[i][j]=0;
            if(j-1>=0) this.destroyLinks (i,j-1,round+1);
        } else this.linkV[i][j]=0;

        if (this.linkV[i][j+1]>0) {
            this.linkV[i][j+1]=0;
            if (j+1<this.size.y+1) this.destroyLinks (i,j+1,round+1);
        } else this.linkV[i][j+1]=0;
    };

    //Brule la vitesse sur les links puis équilibre les vitesses
    this.collision = function (x1,y1,x2,y2,unused) {
        var residual = new cc.math.Vec2(x2-x1, y2-y1);
        var unused2 = new cc.math.Vec2(0, 0);

        //Détecte si le deuxième point est connecté
        if(this.linkH[x2][y2]<=0 && this.linkH[x2 + 1][y2]<=0 && this.linkV[x2][y2]<=0 && this.linkV[x2][y2+1]<=0) {
            //Détecte s'il s'agit d'une fausse collision (v1<v2)
            if (this.map[x1][y1].speed.x*(x2-x1)-this.map[x2][y2].speed.x*(x2-x1)<=0 && (x2-x1)!=0 || this.map[x1][y1].speed.y*(y2-y1)-this.map[x2][y2].speed.y*(y2-y1)<=0 && (y2-y1) != 0) {
                //Marque le point bougé en isUpdate = false pour la deuxième passe
                this.map[x1][y1].isUpdated=false;
                return unused ;
            }
            if(x2-x1!=0) {
                residual.x = this.collisionfriction*(this.map[x1][y1].speed.x*this.materials[this.map[x1][y1].material].mass+this.map[x2][y2].speed.x*this.materials[this.map[x2][y2].material].mass)/(this.materials[this.map[x1][y1].material].mass+this.materials[this.map[x2][y2].material].mass);
                unused.x = this.collisionfriction*(unused.x*this.materials[this.map[x1][y1].material].mass+this.map[x2][y2].unusedSpeed.x*this.materials[this.map[x2][y2].material].mass)/(this.materials[this.map[x1][y1].material].mass+this.materials[this.map[x2][y2].material].mass);
            } else {
                residual.y = this.collisionfriction*(this.map[x1][y1].speed.y*this.materials[this.map[x1][y1].material].mass+this.map[x2][y2].speed.y*this.materials[this.map[x2][y2].material].mass)/(this.materials[this.map[x1][y1].material].mass+this.materials[this.map[x2][y2].material].mass);
                unused.y = this.collisionfriction*(unused.y*this.materials[this.map[x1][y1].material].mass+this.map[x2][y2].unusedSpeed.y*this.materials[this.map[x2][y2].material].mass)/(this.materials[this.map[x1][y1].material].mass+this.materials[this.map[x2][y2].material].mass);
            }
        } else {
            //Brule la vitesse sur les link et les détruits
            //N*s = m/s*kg = V * kg
            var force = (this.map[x1][y1].speed.x*(x2-x1)+this.map[x1][y1].speed.y*(y2-y1))*this.materials[this.map[x1][y1].material].mass;
            this.applyDamage (x2,y2,force,residual);
            residual.scale(this.collisionfriction/(this.materials[this.map[x1][y1].material].mass+this.materials[this.map[x2][y2].material].mass));
            //Transfert le unused speed
            if(x2-x1!=0 && this.map[x1][y1].speed.x > this.minspeed) {
                unused.x = unused.x * (residual.x / this.map[x1][y1].speed.x);
                unused2.x = unused.x;
            }
            if(y2-y1!=0 && this.map[x1][y1].speed.y > this.minspeed) {
                unused.y = unused.y * (residual.y / this.map[x1][y1].speed.y);
                unused2.y = unused.y;
            }
        }

        //Reprogramme pour le move si les points sont en mvt
        if(Math.abs(residual.x) > 0 || Math.abs(residual.y) > 0) {
            this.map[x1][y1].isUpdated=false;
            this.map[x2][y2].isUpdated=false;
        }

        //Transfère la vitesse entre les points
        if(x2-x1==0) {this.map[x1][y1].speed.y=0; this.map[x2][y2].speed.y=0; this.map[x2][y2].unusedSpeed.y=0;}
        else {this.map[x1][y1].speed.x=0; this.map[x2][y2].speed.x=0; this.map[x2][y2].unusedSpeed.x=0;}

        this.map[x2][y2].speed.add(residual);
        this.map[x1][y1].speed.add(residual);

        //Réalise les dégats
        this.map[x2][y2].health-=this.map[x1][y1].damage;
        this.map[x1][y1].health-=this.map[x2][y2].damage;

        //Marque le point touché en isnotiddle
        this.mapIddle[x2][y2]=false;

        //Applique la modification des unusedspeed
        this.map[x2][y2].unusedSpeed.add(unused2);
        unused.scale(this.framestep);
        return unused;
    };

    //Déplace un block
    this.moveblock = function(i,j) {
        //Analyse et déplace un élément
        if(this.map[i][j]!=null) {

            //limite la vitesse (max)
            if(Math.abs(this.map[i][j].speed.x + this.map[i][j].speed.y)>this.maxspeed) {
                this.map[i][j].speed.scale(this.maxspeed/(this.map[i][j].speed.x + this.map[i][j].speed.y));
                this.map[i][j].unusedSpeed.scale(this.maxspeed/(this.map[i][j].unusedSpeed.x + this.map[i][j].unusedSpeed.y));
            }

            if(!this.map[i][j].isUpdated) {
                this.map[i][j].isUpdated=true;
                var k = 0;
                var l = 0;
                var calc = new cc.math.Vec2(0, 0);
                var calcS = new cc.math.Vec2(0, 0);
                var calcSS = new cc.math.Vec2(0, 0);
                calcS.x = (this.map[i][j].unusedSpeed.x+this.map[i][j].speed.x)*this.framestep;
                calcS.y = (this.map[i][j].unusedSpeed.y+this.map[i][j].speed.y)*this.framestep;

                //Automove
                if(calcS.x == 0 && calcS.y == 0 && this.materials[this.map[i][j].material].automove > 0 && this.map[i][j].smoothposition.x==0) {
                    if(i-1 >= 0 && this.map[i-1][j]==null && Math.random () < this.materials[this.map[i][j].material].automove*this.framestep) {
                        calcS.x = -1;
                    } else {
                        if(i+1 < this.size.x && this.map[i+1][j]==null && Math.random () < this.materials[this.map[i][j].material].automove*this.framestep) {
                            calcS.x = 1;
                        }
                    }
                }

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
                calcSS.x = calcS.x;
                calcSS.y = calcS.y;

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
                            //safeuard links
                            this.linkH[i+k][j+l]=this.linkH[i+k+1][j+l]=this.linkV[i+k][j+l]=this.linkV[i+k][j+l+1]=0;
                            calcS.x-=calc.x;
                            k+=calc.x;
                        } else {
                            //collision
                            calcS = this.collision (i+k,j+l,i+k+calc.x,j+l,calcS.scale(1/this.framestep)).scale(this.framestep);
                            //Intègre le mouvement déjà réalisé dans unusedspeed (pour le deuxième passage) et arrête le calcul sur x
                            calc.x=0;
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
                            //safeuard links
                            this.linkH[i+k][j+l]=this.linkH[i+k+1][j+l]=this.linkV[i+k][j+l]=this.linkV[i+k][j+l+1]=0;
                            calcS.y-=calc.y;
                            l+=calc.y;
                        } else {
                            //collision
                            calcS = this.collision (i+k,j+l,i+k,j+l+calc.y,calcS.scale(1/this.framestep)).scale(this.framestep);
                            //Intègre le mouvement déjà réalisé dans unusedspeed (pour le deuxième passage) et arrête le calcul sur y
                            calc.y=0;
                        }
                    }
                }

                if(this.map[i+k][j+l]!=null) {
                    this.map[i+k][j+l].unusedSpeed.x = calcS.x/this.framestep;
                    this.map[i+k][j+l].unusedSpeed.y = calcS.y/this.framestep;

                    //Smoothmove
                    if(calcS.x != calcSS.x) this.map[i+k][j+l].smoothposition.x = calcS.x - calcSS.x;
                    if(calcS.y != calcSS.y) this.map[i+k][j+l].smoothposition.y = calcS.y - calcSS.y;

                    this.mapIddle[i+k][j+l]=false;
                }
            }
        }
    };

    this.checkFix = function () {
        for (var i = 0 ; i < this.size.x ; i++) {
            for (var j = 0 ; j < this.size.y ; j++) {
                if(this.map[i][j]!=null && this.materials[this.map[i][j].material].fix == true) {
                    this.map[i][j].speed.scale(0);
                    this.map[i][j].unusedSpeed.scale(0);
                    this.map[i][j].smoothposition.scale(0);
                }
            }
        }
    };

    this.checkInert = function () {
        //A compléter
    };
};

encophys.point = function (material, heat, health, damage) {
    "use strict";
    this.material = material;
    this.heat = heat ;
    this.health = health ;
    this.speed = new cc.math.Vec2(0, 0);
    this.unusedSpeed = new cc.math.Vec2(0, 0);
    this.smoothposition = new cc.math.Vec2(0, 0);
    this.damage = damage ;
    //Sert à savoir si le point a bougé
    this.isUpdated = false ;
    //Détonne des points spécifiques (0 indique un point standard)
    this.index = 0;
};

encophys.force = function (type, position) {
    this.type = type ;
    this.position = position ;
    this.diameter = 1 ;
    this.life = 0;
};

