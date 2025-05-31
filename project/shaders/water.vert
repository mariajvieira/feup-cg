precision mediump float;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform float time;

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;
varying vec2 vMaskCoord;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    float wave = sin(time + aPosition.x*0.1)*cos(time + aPosition.z*0.1)*0.1;
    vec3 pos = aPosition; pos.y += wave;

    gl_Position = uPMatrix * uMVMatrix * vec4(pos,1.0);
    
    vTexCoord   = aTexCoord;        // repetimos no fragment
    vMaskCoord  = aTexCoord;        // só [0,1]
    vNormal     = normalize(vec3(uNMatrix * vec4(aNormal,1.0)));
    vPosition   = vec3(uMVMatrix * vec4(pos,1.0));
}