var encophys = encophys || {};

encophys.world = function () {
    "use strict";
    //Default timestep set to 50 frame per second
    this.timestep = 20;
    this.points = [];
    this.forcesgravitydir = [];

    //Callback to load json config file
    this.loadJson = function (error, data) {
        this.timestep = data.timestep;
        this.materials = data.materials;
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
        this.points.slice (this.points.indexOf(point),1);
    };

    this.removeForcesgravitydir = function (point) {
        this.forcesgravitydir.slice (this.forcesgravitydir.indexOf(point),1);
    };

    this.update = function () {
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
