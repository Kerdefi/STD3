gp_check = function (master) {
    this.button1 = false;
    this.button2 = false;
    this.button3 = false;

    this.axe0 = 0;
    this.axe1 = 0;

    this.master = master;

    window.addEventListener("gamepadconnected", function(e) {
          var gp = navigator.getGamepads()[e.gamepad.index];
          console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
          gp.index, gp.id,
          gp.buttons.length, gp.axes.length);
    });

    this.update = function() {
        var gp = navigator.getGamepads()[0];

        if(gp != null) {
            if(gp.buttons[1].pressed == true && this.button1 == false) {
                this.button1 = true ;
                cc.log("OKAY");
            }
            if(gp.buttons[1].pressed == false && this.button1 == true) {
                this.button1 = false ;
                cc.log("OKAY1");
            }
        }
    }
};
