var encophys = encophys||{};

encophys.world = function () {
    //Default timestep set to 50 frame per second
    this.timestep = 20 ;

    //Callback to load json config file
    this.loadJson = function (error, data) {
        this.timestep = data["timestep"];
    }.bind(this);

    //
    this.init = function (configpath) {
        cc.loader.loadJson(configpath, this.loadJson);
    };

    this.update = function () {
    };
};

encophys.point = function () {

    this.init = function (material, mass, heat) {
        this.material=material;
        this.position=2;
        this.mass=mass;
        this.heat=heat;
        this.energy=0;
    };
};
