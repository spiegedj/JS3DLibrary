function Camera(from, to, up) {
  this.lookAt(from, to, up);
}

Camera.prototype = {
  to: null,
  from: null,
  forward: null,
  up: null,
  right: null,
  viewMatrix: null,
  
  lookAt: function(from, to, up) {
    this.to = to;
    this.from = from;
    
    this.viewMatrix = new Matrix4x4();
    
    // What direction are we looking?
    this.forward = to.sub(from);
    this.forward.norm();
    
    // Drop that direction in viewMatrix
    this.viewMatrix.m20 = -this.forward.x;
    this.viewMatrix.m21 = -this.forward.y;
    this.viewMatrix.m22 = -this.forward.z;
    
    // Find right axis as the vector perpendicular to both up and forward
    this.right = this.forward.cross(up);
    this.right.norm();
    
    // Drop the direction in viewMatrix
    this.viewMatrix.m00 = this.right.x;
    this.viewMatrix.m01 = this.right.y;
    this.viewMatrix.m02 = this.right.z;
    
    // Correct up to be truly orthogonal
    this.up = this.right.cross(this.forward);
    this.up.norm();
    
    // Drop that direction in viewMatrix
    this.viewMatrix.m10 = this.up.x;
    this.viewMatrix.m11 = this.up.y;
    this.viewMatrix.m12 = this.up.z;

    this.viewMatrix = this.viewMatrix.multM(Matrix4x4.GetTranslate(new Vector4(-this.from.x, -this.from.y, -this.from.z, 1)));
  },
  
  advance: function(offset) {
    this.from = this.from.add(this.forward.scale(offset));
    this.to = this.to.add(this.forward.scale(offset));
    this.lookAt(this.from, this.to, this.up);
  },
  
  strafe: function(offset) {
    this.from = this.from.add(this.right.scale(offset));
    this.to = this.to.add(this.right.scale(offset));
    this.lookAt(this.from, this.to, this.up);
  },
  
  yaw: function(degress) {
    var forwd = this.to.sub(this.from);
    forwd = Matrix4x4.GetRotate(degress, this.up).multV(forwd);
    this.to = this.from.add(forwd);
    this.lookAt(this.from, this.to, this.up);
  },
  
  pitch: function(degress) {
    this.forward = this.to.sub(this.from);
    this.to = Matrix4x4.GetRotate(degress, this.right).multV(this.forward);
    this.forward = this.to.sub(this.from);
    this.up = this.right.cross(this.forward);
    this.lookAt(this.from, this.to, this.up);
  }
}