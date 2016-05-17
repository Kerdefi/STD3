var encophys = encophys || {} ;

encophys.world = function () {
    this.timestep = 5 ;

    this.setTimestep = function (timestep) {
        this.timestep = timestep ;
        cc.log("Timestep set");
    };

    this.getTimestep = function () {
        return this.timestep ;
    };

    this.loadJson = function (error, data) {
        cc.log(data); //data is the json object
        cc.log(data["timestep"]);
        cc.log("Hello");
        this.setTimestep (data["timestep"]);
    }.bind(this);

    this.init = function () {
        cc.loader.loadJson("src/encophys/encophys.json", this.loadJson);
    };
};