function Core3D(canvas, drawingMode, fullScreenMode, camera) {
  this.__canvas = canvas;
  this.__ctx = this.__canvas.getContext("2d");
  this.__camera = camera;
  this.__vertices = [];
  this.__indices = [];
  this.__faces = [];
  this.__objects = [];
  this.__drawingMode = drawingMode;
  this.__projection = Matrix4x4.GetPerspective(45.0, 1, 1, 10);
  
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
  __projection: null,
  __canvas: null,
  __ctx: null,
  __camera: null,
  __objects: null,
  __vertices: null,
  __indices: null,
  __faces: null,
  __pid: null,
  __drawingMode: null,
  __faces: null,
  
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
    var index, obj, indices, vertices, faces, v, cp, v0, v1, v2, v3, transform, modelView;
    
    this.__ctx.clearRect(0, 0, this.__canvas.width, this.__canvas.height);
    
    for (var objectIndex = 0; objectIndex < this.__objects.length; objectIndex++) {
      obj = this.__objects[objectIndex];
      indices = obj.indices;
      vertices = obj.vertices;
      
      // Call Objects Update Function
      obj.update();
      
      // Apply matrix transformations
      for (index = 0; index < vertices.length; index++) {
        transform = obj.getTransform();
        modelView = this.__camera.viewMatrix;
        
        var vertex = vertices[index];
        var transformV = transform.multV(vertex);
        var modelViewV = modelView.multV(transformV);
        var v = this.__projection.multV(modelViewV);
        
        //v = this.__projection.multV(modelView.multV(transform.multV(vertices[index])));
        //console.log("----------");
        //console.log("From: " + this.__camera.from.toString());
        //console.log("To: " + this.__camera.to.toString());
        //console.log("Vertex: " + vertex.toString());
        //console.log("Transformed Vertex: " + transform.multV(vertex).toString());
        //console.log("Model View Vertex: " + modelView.multV(transform.multV(vertex)).toString());
        //console.log("Projection Vertex: " + v.toString());
        
        
        v.x /= v.w;
        v.y /= v.w;
        //v.z /= v.w;
        v.w /= v.w;
        
        //console.log("Final Vertex: " + v.toString());
       
        cp = this.__toCP(v);
        vertices[index].cx = cp.x;
        vertices[index].cy = cp.y;
        // Just use the modelView Z for the sorting because it is more accurate anyway
        vertices[index].cz = modelViewV.z;
      }
      
      
      if (this.__drawingMode === Core3D.DrawingMode.Wire) {
        this.__ctx.beginPath();
        for (index = 0; index < indices.length; index++) {
          v = vertices[indices[index]];
          
          //this.__drawPoint(cx, cy, 5, 5);
          this.__ctx.lineTo(v.cx, v.cy, 2);
        //  this.__ctx.fill();
        }
        this.__ctx.stroke();
      }
    }
        
    if (this.__drawingMode === Core3D.DrawingMode.Triangle) {
        
      faces = this.__faces;
      
      // Painter's Algorithm
      faces.sort(this.__sortFacesTriangle);
    
      for (index = 0; index < this.__faces.length; index++) {
       v0 = faces[index].v0;
       v1 = faces[index].v1;
       v2 = faces[index].v2;
       
       this.__ctx.beginPath();
       this.__ctx.lineTo(v0.cx, v0.cy);
       this.__ctx.lineTo(v1.cx, v1.cy);
       this.__ctx.lineTo(v2.cx, v2.cy);
       this.__ctx.closePath();
       
       
       this.__ctx.fillStyle = "rgba(255, 0, 0, .8)";
       this.__ctx.fill();
       this.__ctx.strokeStyle = 'green';
       this.__ctx.stroke();
      }
    } else if (this.__drawingMode === Core3D.DrawingMode.Quad) {
      
      faces = this.__faces;
      
      // Painter's Algorithm
      faces.sort(this.__sortFacesQuad);
    
      for (index = 0; index < faces.length; index++) {
       v0 = faces[index].v0;
       v1 = faces[index].v1;
       v2 = faces[index].v2;
       v3 = faces[index].v3;
       
       // Clip z space to -1 to 10
       if (Math.abs(v0.cz > 1) || Math.abs(v1.cz > 1) || Math.abs(v2.cz > 1) || Math.abs(v3.cz > 1)) 
         continue;
       
       this.__ctx.beginPath();
       this.__ctx.lineTo(v0.cx, v0.cy);
       this.__ctx.lineTo(v1.cx, v1.cy);
       this.__ctx.lineTo(v2.cx, v2.cy);
       this.__ctx.lineTo(v3.cx, v3.cy);
       this.__ctx.closePath();
       
       
       this.__ctx.fillStyle = "rgba(255, 0, 0, 1)";
       this.__ctx.fill();
       this.__ctx.strokeStyle = 'black';
       this.__ctx.stroke();
      }
    }

    this.__pid = setTimeout(
      (function(self) {
        return function() {
          self.__update();
        }
      })(this),
      5
    );
  },
  
  __sortFacesQuad(f0, f1) {
    var a = f0.v0.cz + f0.v1.cz + f0.v2.cz + f0.v3.cz;
    var b = f1.v0.cz + f1.v1.cz + f1.v2.cz + f0.v3.cz;
    //var maxZ0 = Math.max(f0.v0.cz, f0.v1.cz, f0.v2.cz, f0.v3.cz);
    //var maxZ1 = Math.max(f1.v0.cz, f1.v1.cz, f1.v2.cz, f1.v3.cz);
    //return maxZ0 - maxZ1;
    return a - b;
  },
  
  __sortFacesTriangle(f0, f1) {
    var a = f0.v0.cz + f0.v1.cz + f0.v2.cz;
    var b = f1.v0.cz + f1.v1.cz + f1.v2.cz;
    
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
    var index, v0, v1, v2, v3, face;
    
    this.__objects.push(obj);
    if (this.__drawingMode === Core3D.DrawingMode.Triangle) {
      for (index = 0; index < obj.indices.length; index += 3) {
        v0 = obj.vertices[obj.indices[index]];
        v1 = obj.vertices[obj.indices[index + 1]];
        v2 = obj.vertices[obj.indices[index + 2]];
        
        var face = {v0 : v0, v1 : v1, v2 : v2};
        this.__faces.push(face);
      }
      
    } else if (this.__drawingMode === Core3D.DrawingMode.Quad) {
      for (index = 0; index < obj.indices.length; index += 4) {
        v0 = obj.vertices[obj.indices[index]];
        v1 = obj.vertices[obj.indices[index + 1]];
        v2 = obj.vertices[obj.indices[index + 2]];
        v3 = obj.vertices[obj.indices[index + 3]];
        
        var face = {v0 : v0, v1 : v1, v2 : v2, v3: v3};
        this.__faces.push(face);
      }
    }
  }
}
