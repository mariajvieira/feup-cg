#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying vec4 vFinalPosition;

uniform sampler2D uSampler;

void main() {
    if (vFinalPosition.y >= 0.5) {
        gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
    }
}