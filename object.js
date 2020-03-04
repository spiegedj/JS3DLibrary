function isIE()
{
    return (document.all != null);
}

function inherit(base, derived)
{
  var combined,m;
  combined = new base();
  
  for (m in derived.prototype)
  {
    combined[m] = derived.prototype[m];
  }
  
  if (isIE())
  {
      if (derived.prototype.toString !== Object.prototype.toString)
      {
          combined.toString = derived.prototype.toString;
      }
      if (derived.prototype.valueOf !== Object.prototype.valueOf)
      {
          combined.valueOf = derived.prototype.valueOf;
      }
  }
  
  combined.base = base;
  combined.constructor = derived;
  
  derived.prototype = combined;
}

function Object() {
   this.__transform = {};
   
   this.__transformationMatrix = new Matrix4x4();
   this.__positionMatrix = new Matrix4x4();
   this.__rotationMatrix = new Matrix4x4();
   this.__rotationXMatrix = new Matrix4x4();
   this.__rotationYMatrix = new Matrix4x4();
   this.__rotationZMatrix = new Matrix4x4();
   this.__scalingMatrix = new Matrix4x4();
   this.__thetaX = 0;
   this.__thetaY = 0;
   this.__thetaZ = 0;
}

Object.prototype = {
  constructor: Object,
  vertices: null,
  indices: null,
  __transformationMatrix: null,
  __positionMatrix : null,
  __scalingMatrix: null,
  __rotationMatrix: null,
  
  __rotationXMatrix: null,
  __rotationYMatrix: null,
  __rotationZMatrix: null,
  __thetaX: null,
  __thetaY: null,
  __thetaZ: null,
  
  update: function() {
    this.__transformationMatrix = this.__positionMatrix.multM(this.__rotationMatrix.multM(this.__scalingMatrix));
  },
  
  setPosition: function(v) {
    this.__positionMatrix.m03 = v.x;
    this.__positionMatrix.m13 = v.y;
    this.__positionMatrix.m23 = v.z;
    this.__positionMatrix.m33 = v.w;
  },
  
  setScale: function(v) {
    this.__scalingMatrix = Matrix4x4.GetScale(v);
  },
  
  setRotation: function(thetaX, thetaY, thetaZ) {
    this.__rotationXMatrix = Matrix4x4.GetRotateX(thetaX);
    
    this.__rotationYMatrix.m00 =  Math.cos(thetaY);
    this.__rotationYMatrix.m02 =  Math.sin(thetaY);
    this.__rotationYMatrix.m20 = -Math.sin(thetaY);
    this.__rotationYMatrix.m22 =  Math.cos(thetaY);
    
    this.__rotationZMatrix.m00 =  Math.cos(thetaZ);
    this.__rotationZMatrix.m01 = -Math.sin(thetaZ);
    this.__rotationZMatrix.m10 =  Math.sin(thetaZ);
    this.__rotationZMatrix.m11 =  Math.cos(thetaZ);
    
    this.__rotationMatrix = this.__rotationZMatrix.multM(this.__rotationYMatrix.multM(this.__rotationXMatrix));
  },
  
  getTransform: function() {
    return this.__transformationMatrix;
  }
}