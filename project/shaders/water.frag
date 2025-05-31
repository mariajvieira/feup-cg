precision mediump float;

varying vec2 vTexCoord;     // coords para o relvado/água (repetido)
varying vec2 vMaskCoord;    // coords [0,1] para a máscara
varying vec3 vNormal;
varying vec3 vPosition;

uniform sampler2D uSampler1;    // relvado
uniform sampler2D uSampler2;    // água
uniform sampler2D uSamplerMask; // máscara P&B
uniform float      time;

void main() {
    // distorção leve das coords da água
    vec2 wuv = vTexCoord + vec2(
        sin(time + vPosition.x * 0.1) * 0.02,
        cos(time + vPosition.z * 0.1) * 0.02
    );

    float m = texture2D(uSamplerMask, vMaskCoord).r;
    vec4 grass = texture2D(uSampler1, vTexCoord * 20.0);
    vec4 water = texture2D(uSampler2, wuv     * 20.0);

    vec4 color = mix(water, grass, m);

    // iluminação simples
    vec3 L = normalize(vec3(0.0,1.0,0.5));
    float diff = max(dot(normalize(vNormal), L), 0.0);

    gl_FragColor = vec4(color.rgb * diff, 1.0);
}