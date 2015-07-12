function CanvasTest() {
  this.__canvas = document.getElementById("canvas");
  this.__test();
}

CanvasTest.prototype = {
  __canvas: null,
  
  __test: function() {
    var core = new Core3D(this.__canvas, Core3D.DrawingMode.Quad, true);
    
    var w = .2;
    
    // var vertices = [
      // {x: -w, y: -w, z: -w},  //0
      // {x: w, y: -w, z: -w},   //1
      // {x: w, y: w, z: -w},   //2
      // {x: -w, y: w, z: -w},    //3
      
      // {x: -w, y: -w, z: w},   //4
      // {x: w, y: -w, z: w},    //5
      // {x: w, y: w, z: w},    //6
      // {x: -w, y: w, z: w},     //7
    // ];
    
    // var indices = [
      // 0, 1, 2, 3, 
      // 3, 0, 4, 7,
      // 7, 6, 5, 4, 
      // 4, 0, 1, 5,
      // 5, 1, 2, 6,
      // 6, 7, 3, 2,
    // ];

    var cube = new Cube(w);
    core.addObject(cube);
    
    
    core.start();
    
  }
}
