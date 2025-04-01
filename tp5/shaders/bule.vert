attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
varying vec4 vFinalPosition;

void main() {
    vec4 position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vFinalPosition = position;
    vTextureCoord = aTextureCoord;
    gl_Position = position;
}