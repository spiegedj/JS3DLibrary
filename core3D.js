function Core3D(canvas, drawingMode, fullScreenMode) {
  this.__canvas = canvas;
  this.__ctx = this.__canvas.getContext("2d");
  this.__vertices = [];
  this.__indices = [];
  this.__faces = [];
  this.__objects = [];
  this.__drawingMode = drawingMode;
  
  if (fullScreenMode) {
    window.addEventListener('resize', (function(self) { return function() { self.__resizeCanvas(); }}) (this) , false);
    this.__resizeCanvas();
  }
}

Core3D.DrawingMode = {
  Point: "Point",
  Wire: "Wire",
  Triangle: "Triangle",
  Quad: "Quad"
}

Core3D.prototype = {
  __canvas: null,
  __ctx: null,
  __objects: null,
  __vertices: null,
  __indices: null,
  __faces: null,
  __pid: null,
  __drawingMode: null,
  
  start: function() {
    this.__update();
   // this.__pid = setInterval(
   //   (function(self) {
   //     return function() {
   //       self.__update();
   //     }
   //   })(this),
   //   1
   // );
  },
  
  __update: function() {
    this.__ctx.clearRect(0, 0, this.__canvas.width, this.__canvas.height);
    
    // Apply matrix transformations
    var index;
    for (index = 0; index < this.__vertices.length; index++) {
      var v = this.__vertices[index];
      this.__rotateX(v, .01);
      this.__rotateZ(v, .01);
    }
    
    for (var i = 0; i < this.__objects.length; i++) {
      var obj = this.__objects[i];
      this.__indices = obj.indices;
      this.__vertices = obj.vertices;
      this.__faces = obj.faces;
      
      if (this.__drawingMode === Core3D.DrawingMode.Wire) {
      
        for (index = 0; index < this.__indices.length; index++) {
          var v = this.__vertices[this.__indices[index]];
          var cp = this.__toCP(v);
          
          //this.__drawPoint(cx, cy, 5, 5);
          this.__ctx.lineTo(cp.x, cp.y, 2);
        //  this.__ctx.fill();
        }
        this.__ctx.stroke();
        
      } else if (this.__drawingMode === Core3D.DrawingMode.Triangle) {
        
        // Painter's Algorithm
        this.__faces.sort(this.__sortFacesTriangle);
      
        for (index = 0; index < this.__faces.length; index++) {
         var v0 = this.__toCP(this.__faces[index].v0);
         var v1 = this.__toCP(this.__faces[index].v1);
         var v2 = this.__toCP(this.__faces[index].v2);
         
         this.__ctx.beginPath();
         this.__ctx.lineTo(v0.x, v0.y);
         this.__ctx.lineTo(v1.x, v1.y);
         this.__ctx.lineTo(v2.x, v2.y);
         this.__ctx.closePath();
         
         
         this.__ctx.fillStyle = "rgba(255, 0, 0, .8)";
         this.__ctx.fill();
         this.__ctx.strokeStyle = 'green';
         this.__ctx.stroke();
         // this.__drawPoint(cx, cy, 5, 5);
         //this.__ctx.lineTo(cx, cy);
        }
      
      
      } else if (this.__drawingMode === Core3D.DrawingMode.Quad) {
        
        // Painter's Algorithm
        this.__faces.sort(this.__sortFacesQuad);
      
        for (index = 0; index < this.__faces.length; index++) {
         var v0 = this.__toCP(this.__faces[index].v0);
         var v1 = this.__toCP(this.__faces[index].v1);
         var v2 = this.__toCP(this.__faces[index].v2);
         var v3 = this.__toCP(this.__faces[index].v3);
         
         this.__ctx.beginPath();
         this.__ctx.lineTo(v0.x, v0.y);
         this.__ctx.lineTo(v1.x, v1.y);
         this.__ctx.lineTo(v2.x, v2.y);
         this.__ctx.lineTo(v3.x, v3.y);
         this.__ctx.closePath();
         
         
         this.__ctx.fillStyle = "rgba(255, 0, 0, 1)";
         this.__ctx.fill();
         this.__ctx.strokeStyle = 'blue';
         this.__ctx.stroke();
         // this.__drawPoint(cx, cy, 5, 5);
         //this.__ctx.lineTo(cx, cy);
        }
      }
    }

    this.__pid = setTimeout(
      (function(self) {
        return function() {
          self.__update();
        }
      })(this),
      1
    );

  },
  
  __sortFacesQuad(f0, f1) {
    var maxZ0 = Math.max(f0.v0.z, f0.v1.z, f0.v2.z, f0.v3.z);
    var maxZ1 = Math.max(f1.v0.z, f1.v1.z, f1.v2.z, f1.v3.z);
    return maxZ0 - maxZ1;
  },
  
  __sortFacesTriangle(f0, f1) {
    var a = f0.v0.z + f0.v1.z + f0.v2.z;
    var b = f1.v0.z + f1.v1.z + f1.v2.z;
    
    //var a = Math.max(f0.v0.z, f0.v1.z, f0.v2.z);
    //var b = Math.max(f1.v0.z, f1.v1.z, f1.v2.z);
    return a - b;
  },
  
  __toCP(v) {
    var cx = ((v.x + 2) * this.__canvas.width) / 4;
    var cy = ((v.y + 2) * this.__canvas.height) / 4;
    return {x : cx, y : cy };
  },
  
  __resizeCanvas() {
    this.__canvas.width = window.innerHeight;
    this.__canvas.height = window.innerHeight;
  },
  
  __drawRect(index) {
    var p1 = this.__vertices[this.__indices[index]];
    var p2 = this.__vertices[this.__indices[index + 1]];
    var p3 = this.__vertices[this.__indices[index + 2]];
    var p4 = this.__vertices[this.__indices[index + 3]];
    
    this.__ctx.fillRect(p1, p2, p3 - p1, p4 - p1);
    
  },
  
  __drawPoint(x, y, w, h) {
    this.__ctx.fillRect(x, y, 3, 3);
  },
  
  __rotateX(v, t) {
    var z = v.z;
    var y = v.y;
    v.y = Math.cos(t) * y - Math.sin(t) * z;
    v.z = Math.sin(t) * y + Math.cos(t) * z;
  },
  
  __rotateZ(v, t) {
    var x = v.x;
    var y = v.y;
    v.x = Math.cos(t) * x - Math.sin(t) * y;
    v.y = Math.sin(t) * x + Math.cos(t) * y;
  },

  addObject(obj) {
    this.__objects.push(obj);
    obj.faces = [];
    if (this.__drawingMode === Core3D.DrawingMode.Triangle) {
      for (index = 0; index < obj.indices.length; index += 3) {
        var v0 = obj.vertices[obj.indices[index]];
        var v1 = obj.vertices[obj.indices[index + 1]];
        var v2 = obj.vertices[obj.indices[index + 2]];
        
        var face = {v0 : v0, v1 : v1, v2 : v2};
        obj.faces.push(face);
      }
      
    } else if (this.__drawingMode === Core3D.DrawingMode.Quad) {
      for (index = 0; index < obj.indices.length; index += 4) {
        var v0 = obj.vertices[obj.indices[index]];
        var v1 = obj.vertices[obj.indices[index + 1]];
        var v2 = obj.vertices[obj.indices[index + 2]];
        var v3 = obj.vertices[obj.indices[index + 3]];
        
        var face = {v0 : v0, v1 : v1, v2 : v2, v3: v3};
        obj.faces.push(face);
      }
    }
  }
}
