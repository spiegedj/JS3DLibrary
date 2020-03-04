function Cube(w) {
  
   this.vertices = [
     new Vector4(-w, -w, -w, 1),
     new Vector4(w, -w, -w, 1),
     new Vector4(w, w, -w, 1),
     new Vector4(-w, w, -w, 1),
     
     new Vector4(-w, -w, w, 1),
     new Vector4(w, -w, w, 1),
     new Vector4(w, w, w, 1),
     new Vector4(-w, w, w, 1),
   ];
    
   this.indices = [
     0, 1, 2, 3, 
     3, 0, 4, 7,
     7, 6, 5, 4, 
     4, 0, 1, 5,
     5, 1, 2, 6,
     6, 7, 3, 2,
   ];
   
   this.base();
}

Cube.prototype = {
  vertices: null,
  indices: null,
  
  update: function() {

    // this.__thetaX += .001;
    // this.__thetaY += .001;
    // this.__thetaZ += .001;
    
    // this.setRotation(this.__thetaX, 0, 0);

    
    this.base.prototype.update.apply(this);
  }
}

inherit(Object, Cube);