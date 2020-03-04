function CanvasTest() {
  this.__canvas = document.getElementById("canvas");
  
  window.addEventListener("keydown", this.__onkeyDown.bind(this));
  
  document.onkeydown = this.__onKeyDown;
  this.__test();
 
}

CanvasTest.prototype = {
    __canvas: null,
    __camera: null,

    __test: function () {
        this.__camera = new Camera(new Vector4(0, 0, -5, 1), new Vector4(0, 0, 5, 1), new Vector4(0, 1, 0, 0));
        var core = new Core3D(this.__canvas, Core3D.DrawingMode.Quad, true, this.__camera);



        var cube1 = new Cube(0.1);
        cube1.setPosition(new Vector4(0, 0, 0, 1));
        //cube1.setScale(new Vector4(5, 5, 5, 0));
        core.addObject(cube1);

        //var cube2 = new Cube(.1);
        //cube2.setPosition(new Vector4(0, 0, 0, 1));
        //core.addObject(cube2);


        core.start();

    },

    __onkeyDown: function (e) {
        e = e || window.event;
        var speed = 0.1;

        switch (e.keyCode) {
            // Forward Arrow or w
            case 38:
            case 87:
                this.__camera.advance(speed);
                break;
                // Down Arrow or s
            case 40:
            case 83:
                this.__camera.advance(-speed);
                break;
                // Left Arrow or a
            case 37:
            case 65:
                this.__camera.strafe(-speed);
                break;
                // Right Arrow or d
            case 39:
            case 68:
                this.__camera.strafe(speed);
                break;
                // q
            case 81:
                this.__camera.yaw(speed * 10);
                break;
                // e
            case 69:
                this.__camera.yaw(-speed * 10);
                break;
                // z
            case 90:
                this.__camera.pitch(-speed * 10);
                break;
                // c
            case 67:
                this.__camera.pitch(speed * 10);
                break;
        }
    }
};
