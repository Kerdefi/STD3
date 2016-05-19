var encophys = encophys || {};

encophys.PAUSE = 0;
encophys.RUN = 1;
encophys.REVERSE = 2;

encophys.world = function () {
    "use strict";
    //Default timestep set to 50 frame per second
    this.timestep = 0.05;
    this.points = [];
    this.forcesgravitydir = [];
    //pause = 0 ; run = 1 ; reverse = 2
    this.state = encophys.PAUSE;
    //stepcounter
    this.step = 0;
    //time
    this.t = new Date().getTime();

    //Callback to load json config file
    this.loadJson = function (error, data) {
        this.timestep = data.timestep;
        this.materials = data.materials;
        this.maxspeed = data.maxspeed;
        this.minspeed = data.minspeed;
        this.limits = data.limits;
        cc.director.getScheduler().unscheduleAllCallbacksForTarget(this);
        cc.director.getScheduler().scheduleCallbackForTarget(this,this.update,this.timestep,cc.REPEAT_FOREVER,false);
        cc.director.getScheduler().pauseTarget(this);
    }.bind(this);

    //configpath = string
    this.init = function (configpath) {
        cc.loader.loadJson(configpath, this.loadJson);
    };

    this.addPoint = function (point) {
        this.points.push (point);
    };

    this.addForcesgravitydir = function (force) {
        this.forcesgravitydir.push (force);
    };

    this.removePoint = function (point) {
        this.points.slice (this.points.indexOf(point), 1);
    };

    this.removeForcesgravitydir = function (point) {
        this.forcesgravitydir.slice(this.forcesgravitydir.indexOf(point), 1);
    };

    this.changeState = function (state) {
        if (this.state == encophys.PAUSE && (state == encophys.RUN || state == encophys.REVERSE)) {
            this.state = state;
            cc.director.getScheduler().resumeTarget(this);
        } else {
            cc.director.getScheduler().pauseTarget(this);
            this.state = state;
        }
    };

    this.update = function () {
        this.step = this.step + 1;
        this.actualTimestep = new Date().getTime() - this.t;
        this.t = new Date().getTime();
        cc.log("Step : " + this.step + " Interval : " + this.actualTimestep);

        var i = 0;
        var j = 0;
        var vectemp = new cc.math.Vec2(0, 0) ;

        //Reset forces
        for (i = 0 ; i < this.points.length; i++) {
            this.points[i].force.x = 0;
            this.points[i].force.y = 0;
        }
        //Apply forces
        //gravity
        for (i = 0 ; i < this.forcesgravitydir.length ; i++) {
            for (j = 0 ; j < this.points.length; j++) {
                vectemp.x = this.forcesgravitydir[i].dir.x ;
                vectemp.y = this.forcesgravitydir[i].dir.y ;
                vectemp.scale(this.points[j].mass);
                this.points[j].force.add(vectemp);
            }
        }

        //UpdateSpeed
        for (i = 0 ; i < this.points.length; i++) {
            vectemp.x = this.points[i].force.x ;
            vectemp.y = this.points[i].force.y ;
            vectemp.scale(1/this.points[i].mass*this.timestep);
            this.points[i].speed.add(vectemp);
        }

        //UpdatePosition
        for (i = 0 ; i < this.points.length; i++) {
            vectemp.x = this.points[i].speed.x ;
            vectemp.y = this.points[i].speed.y ;
            vectemp.scale(this.timestep);
            this.points[i].position.add(vectemp);
        }

        //Detect collision & reposition objects
    };
};

//material = string ; mass = number ; position = Vec2 ; heat = number
encophys.point = function (material, mass, position, heat) {
    "use strict";
    this.force = new cc.math.Vec2(0, 0);
    this.material = material;
    this.position = position;
    this.mass = mass;
    if (mass==0) {
        this.mass = 1;
    }
    this.heat = heat;
    this.energy = new cc.math.Vec2(0, 0);
    this.speed = new cc.math.Vec2(0, 0);
};

//type : gravitydir, gravitypoint, friction
//g = number ; dir = Vec2
encophys.forcegravitydir = function (g, dir) {
    "use strict";
    this.dir = dir;
    this.dir.normalize ();
    this.dir.scale(g);
};
