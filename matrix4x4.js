// m00 m01 m02 m03
// m10 m11 m12 m13
// m20 m21 m22 m23
// m30 m31 m32 m33

function Matrix4x4() {
  this.m00= 1;
  this.m10= 0;
  this.m20= 0;
  this.m30= 0;

  this.m01= 0;
  this.m11= 1;
  this.m21= 0;
  this.m31= 0;

  this.m02= 0;
  this.m12= 0;
  this.m22= 1;
  this.m32= 0;

  this.m03= 0;
  this.m13= 0;
  this.m23= 0;
  this.m33= 1;
}

Matrix4x4.GetScale = function(v) {
  var m = new Matrix4x4();
  m.m00 = v.x;
  m.m11 = v.y;
  m.m22 = v.z;
  return m;
}

Matrix4x4.GetRotateX = function(thetaX) {
  var m = new Matrix4x4();
  
  m.m11 =  Math.cos(thetaX);
  m.m12 = -Math.sin(thetaX);
  m.m21 =  Math.sin(thetaX);
  m.m22 =  Math.cos(thetaX);
  
  return m;
}

Matrix4x4.GetRotateY = function() {
  var m = new Matrix4x4();
  
  
  
  
  return m;
}

Matrix4x4.GetTranslate = function(p) {
  var m = new Matrix4x4();
  m.m03 = p.x;
  m.m13 = p.y;
  m.m23 = p.z;
  m.m33 = p.w;
  
  return m;
}

Matrix4x4.GetRotate = function(degrees, axis) {
  var radians = (degrees * Math.PI / 180.0);
  var sine = Math.sin(radians);
  var cosine = Math.cos(radians);
  var cosCompliment = 1.0 - cosine;
  
  var m = new Matrix4x4();
  m.m00 = cosCompliment * axis.x * axis.x + cosine;
  m.m01 = cosCompliment * axis.x * axis.y - sine * axis.z;
  m.m02 = cosCompliment * axis.x * axis.z + sine * axis.y;
  
  m.m10 = cosCompliment * axis.y * axis.x + sine * axis.z;
  m.m11 = cosCompliment * axis.y * axis.y + cosine;
  m.m12 = cosCompliment * axis.y * axis.z - sine * axis.x;
  
  m.m20 = cosCompliment * axis.z * axis.x - sine * axis.y;
  m.m21 = cosCompliment * axis.z * axis.y + sine * axis.x;
  m.m22 = cosCompliment * axis.z * axis.z + cosine;
  
  return m;
}

Matrix4x4.GetOrthographic = function(l, r, b, t, n, f) {
  var m = new Matrix4x4();
  
  m.m00 = 2.0 / (r - l);
  m.m03 = -(r + l) / (r - l);
  
  m.m11 = 2.0 / (t - b);
  m.m13 = -(t + b) / (t - b);
  
  m.m22 = 2.0 / (n - f);
  m.m23 = (n + f) / (n - f);
  
  m.m33 = 1.0;
  
  return m;
}

// Matrix4x4.GetPerspective = function(fovy, ar, n, f) {
  // var t = n * Math.tan(fovy / 2.0 * Math.PI / 180.0);
  // var r = ar * t;
  
  // var m = new Matrix4x4();
  // m.m00 = n / r;
  // m.m11 = n / t;
  
  // m.m22 = -(f + n) / (f - n);
  // m.m23 = -2.0 * f * n / (f - n);
  
  // m.m32 = -1.0;
  // m.m33 = 0.0;
  
  
  // console.log(m.toString());
  // return m;
// }

Matrix4x4.GetPerspective = function(fovy, ar, n, f) {
  var cot = 1 / Math.tan((fovy / 2));
  
  var m = new Matrix4x4();
  m.m00 = cot / ar;
  m.m11 = cot;
  
  //m.m22 = (n + f) / (n - f);
  //m.m23 = (2 * n * f) / (n - f);
  m.m22 = 2 / (f - n);
  m.m23 = -1;
  
  m.m32 = -1.0;
  m.m33 = 0.0;

  console.log(m.toString());
  return m;
}

Matrix4x4.prototype = {

  
// m00 m01 m02 m03      m00 m01 m02 m03
// m10 m11 m12 m13      m10 m11 m12 m13
// m20 m21 m22 m23      m20 m21 m22 m23
// m30 m31 m32 m33      m30 m31 m32 m33
  
  multM: function(o) {
    
    var nM = new Matrix4x4();
    nM.m00 = (this.m00 * o.m00) + (this.m01 * o.m10) + (this.m02 * o.m20) + (this.m03 * o.m30);
    nM.m01 = (this.m00 * o.m01) + (this.m01 * o.m11) + (this.m02 * o.m21) + (this.m03 * o.m31);
    nM.m02 = (this.m00 * o.m02) + (this.m01 * o.m12) + (this.m02 * o.m22) + (this.m03 * o.m32);
    nM.m03 = (this.m00 * o.m03) + (this.m01 * o.m13) + (this.m02 * o.m23) + (this.m03 * o.m33);

    nM.m10 = (this.m10 * o.m00) + (this.m11 * o.m10) + (this.m12 * o.m20) + (this.m13 * o.m30);
    nM.m11 = (this.m10 * o.m01) + (this.m11 * o.m11) + (this.m12 * o.m21) + (this.m13 * o.m31);
    nM.m12 = (this.m10 * o.m02) + (this.m11 * o.m12) + (this.m12 * o.m22) + (this.m13 * o.m32);
    nM.m13 = (this.m10 * o.m03) + (this.m11 * o.m13) + (this.m12 * o.m23) + (this.m13 * o.m33);

    nM.m20 = (this.m20 * o.m00) + (this.m21 * o.m10) + (this.m22 * o.m20) + (this.m23 * o.m30);
    nM.m21 = (this.m20 * o.m01) + (this.m21 * o.m11) + (this.m22 * o.m21) + (this.m23 * o.m31);
    nM.m22 = (this.m20 * o.m02) + (this.m21 * o.m12) + (this.m22 * o.m22) + (this.m23 * o.m32);
    nM.m23 = (this.m20 * o.m03) + (this.m21 * o.m13) + (this.m22 * o.m23) + (this.m23 * o.m33);

    nM.m30 = (this.m30 * o.m00) + (this.m31 * o.m10) + (this.m32 * o.m20) + (this.m33 * o.m30);
    nM.m31 = (this.m30 * o.m01) + (this.m31 * o.m11) + (this.m32 * o.m21) + (this.m33 * o.m31);
    nM.m32 = (this.m30 * o.m02) + (this.m31 * o.m12) + (this.m32 * o.m22) + (this.m33 * o.m32);
    nM.m33 = (this.m30 * o.m03) + (this.m31 * o.m13) + (this.m32 * o.m23) + (this.m33 * o.m33);
    
    return nM;
  },
  
// m00 m01 m02 m03    v.x
// m10 m11 m12 m13    v.y
// m20 m21 m22 m23    v.z
// m30 m31 m32 m33    v.w
  
  multV :function(v) {
    var v0 = this.m00 * v.x + this.m01 * v.y + this.m02 * v.z + this.m03 * v.w;
    var v1 = this.m10 * v.x + this.m11 * v.y + this.m12 * v.z + this.m13 * v.w;
    var v2 = this.m20 * v.x + this.m21 * v.y + this.m22 * v.z + this.m23 * v.w;
    var v3 = this.m30 * v.x + this.m31 * v.y + this.m32 * v.z + this.m33 * v.w;
    //var v3 = 1;
    return new Vector4(v0, v1, v2, v3);
  },
  
  toString: function() {
    var s = "";
    s = "[" + this.m00 + " " + this.m01 + " " + this.m02 + " " + this.m03 + "]\n";
    s += "[" + this.m10 + " " + this.m11 + " " + this.m12 + " " + this.m13 + "]\n";
    s += "[" + this.m20 + " " + this.m21 + " " + this.m22 + " " + this.m23 + "]\n";
    s += "[" + this.m30 + " " + this.m31 + " " + this.m32 + " " + this.m33 + "]\n";
    return s;
  }
}