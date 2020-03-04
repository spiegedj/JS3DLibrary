function Vector4(x, y, z, w) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
}

Vector4.prototype = {
  sub: function(other) {
    return new Vector4(this.x - other.x, this.y - other.y, this.z - other.z, this.w - other.w);
  },
  
  norm: function() {
    var length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    this.x /= length;
    this.y /= length;
    this.z /= length;
  },
  
  cross: function(other) {
    var x = this.y * other.z - this.z * other.y
    var y = this.z * other.x - this.x * other.z;
    var z = this.x * other.y - this.y * other.x;
    var w = 0;
    return new Vector4(x, y, z, w);
  },
  
  add: function(other) {
    var x = this.x + other.x;
    var y = this.y + other.y;
    var z = this.z + other.z;
    var w = this.w + other.w;
    return new Vector4(x, y, z, w);
  },
  
  scale: function(scalar) {
    var x = this.x * scalar;
    var y = this.y * scalar;
    var z = this.z * scalar;
    var w = this.w * scalar;
    return new Vector4(x, y, z, w);
  },
  
  toString: function() {
    return "<" + this.x + ", " + this.y + ", " + this.z + ", " + this.w + ">";
  } 
}