#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D uSampler2; // WaterMap
uniform float timeFactor;

void main() {
    vec2 offset = vec2(timeFactor * 0.005);
    vec4 baseColor = texture2D(uSampler, vTextureCoord + offset);
    vec4 mapColor = texture2D(uSampler2, vTextureCoord);

    gl_FragColor = mix(baseColor, mapColor, 0.3);
}