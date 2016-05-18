var encophys = encophys || {};

encophys.PAUSE = 0;
encophys.RUN = 1;
encophys.REVERSE = 2;

encophys.world = function () {
    "use strict";
    //Default timestep set to 50 frame per second
    this.timestep = 0.02;
    this.points = [];
    this.forcesgravitydir = [];
    //pause = 0 ; run = 1 ; reverse = 2
    this.state = encophys.PAUSE;
    //stepcounter
    this.step = 0;

    //Callback to load json config file
    this.loadJson = function (error, data) {
        this.timestep = data.timestep;
        this.materials = data.materials;
        this.maxspeed = data.maxspeed;
        this.minspeed = data.minspeed;
        this.limits = data.limits;
    }.bind(this);

    //configpath = string
    this.init = function (configpath) {
        cc.loader.loadJson(configpath, this.loadJson);
        //trouver une autre fonction !
        cc.director.getScheduler().scheduleCallbackForTarget(this,this.update,this.timestep,10,true);
        cc.director.getScheduler().pauseTarget(this);
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
        this.state = state;
        if (this.state == encophys.RUN || this.state == encophys.REVERSE) {
            //cc.director.getScheduler().resumeTarget(this);
        } else {
            //cc.director.getScheduler().pauseTarget(this);
        }
    };

    this.update = function () {
        //time check
        cc.log("update is comming");
    };
};

//material = string ; mass = number ; position = Vec2 ; heat = number
encophys.point = function (material, mass, position, heat) {
    "use strict";

    this.material = material;
    this.position = position;
    this.mass = mass;
    this.heat = heat;
    this.energy = cc.math.Vec2(0, 0);
    this.speed = cc.math.Vec2(0, 0);
};

//type : gravitydir, gravitypoint, friction
//g = number ; dir = Vec2
encophys.forcegravitydir = function (g, dir) {
    "use strict";

    this.g = g;
    this.dir = dir;
};
