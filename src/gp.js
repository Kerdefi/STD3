gp_check = function (startp,startu,shootp,shootu,changep,changeu,a0n,a0d,a0u,a1n,a1d,a1u) {
    this.button1 = false;
    this.button2 = false;
    this.button3 = false;

    this.axes0 = 0;
    this.axes1 = 0;

    this.startp = startp;
    this.startu = startu;
    this.shootp = shootp;
    this.shootu = shootu;
    this.changep = changep;
    this.changeu = changeu;
    this.a0n = a0n;
    this.a0d = a0d;
    this.a0u = a0u;
    this.a1n = a1n;
    this.a1d = a1d;
    this.a1u = a1u;

    //Utile ?
    window.addEventListener("gamepadconnected", function(e) {
          var gp = navigator.getGamepads()[e.gamepad.index];
          console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
          gp.index, gp.id,
          gp.buttons.length, gp.axes.length);
    });

    this.update = function(self) {
        var gp = navigator.getGamepads()[0];

        //Sale : ne rentre que si un gamepad existe
        if(gp != null) {
            //Bouton start
            if(gp.buttons[1].pressed == true && this.button1 == false) {
                this.button1 = true ;
                if(this.startp != null) this.startp(self);
            }
            if(gp.buttons[1].pressed == false && this.button1 == true) {
                this.button1 = false ;
                if(this.startu != null) this.startu(self);
            }
            //Bouton change perso
            if(gp.buttons[2].pressed == true && this.button2 == false) {
                this.button2 = true ;
                if(this.changep != null) this.changep(self);
            }
            if(gp.buttons[2].pressed == false && this.button2 == true) {
                this.button2 = false ;
                if(this.changeu != null) this.changeu(self);
            }
            //Bouton shoot
            if(gp.buttons[3].pressed == true && this.button3 == false) {
                this.button3 = true ;
                if(this.shootp != null) this.shootp(self);
            }
            if(gp.buttons[3].pressed == false && this.button3 == true) {
                this.button3 = false ;
                if(this.shootu != null) this.shootu(self);
            }
            //axes left - right
            if(Math.abs(gp.axes[0]) <= 0.5 && this.axes0 != 0) {
                this.axes0 = 0;
                if(this.a0n != null) this.a0n (self);
            }
            if(gp.axes[0] <= -0.5 && this.axes0 >= -0.5) {
                this.axes0 = -1;
                if(this.a0d != null) this.a0d (self);
            }
            if(gp.axes[0] >= 0.5 && this.axes0 <= 0.5) {
                this.axes0 = 1;
                if(this.a0u != null) this.a0u (self);
            }
            //axes down - up
            if(Math.abs(gp.axes[1]) <= 0.5 && this.axes1 != 0) {
                this.axes1 = 0;
                if(this.a1n != null) this.a1n (self);
            }
            if(gp.axes[1] <= -0.5 && this.axes1 >= -0.5) {
                this.axes1 = -1;
                if(this.a1d != null) this.a1d (self);
            }
            if(gp.axes[1] >= 0.5 && this.axes1 <= 0.5) {
                this.axes1 = 1;
                if(this.a1u != null)this.a1u (self);
            }
        }
    }
};
