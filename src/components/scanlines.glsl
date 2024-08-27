#version 300 es
precision highp float;

#include "@motion-canvas/core/shaders/common.glsl"

uniform float rowSize;
uniform float baseBrightness;
uniform float maxBrightness;
uniform float effectStrength;
uniform float scanSpeed;
uniform vec2 reflectionOffset;
uniform int aberrationPx;

float PI = radians(180.0);
float aberrationStrengthStart = 1.0;

void main() {
    vec2 size = vec2(textureSize(sourceTexture, 0));
    vec2 px = (screenUV * size);
    vec4 inColor = texture(sourceTexture, sourceUV);
    float pp = px.y / rowSize;
    outColor = inColor;

    vec2 pxSize = 1.0f / size;

    if (inColor.a == 0.0f && (reflectionOffset.x > 0.0 || reflectionOffset.y > 0.0)) {
        if (sourceUV.x - (reflectionOffset.x * pxSize.x) > 0.0
        && sourceUV.y - (reflectionOffset.y * pxSize.y) > 0.0
        && sourceUV.x - (reflectionOffset.x * pxSize.x) < 1.0
        && sourceUV.y - (reflectionOffset.y * pxSize.y) < 1.0) {
            vec4 refColor = texture(sourceTexture, vec2(sourceUV.x - (reflectionOffset.x * pxSize.x), sourceUV.y - (reflectionOffset.y * pxSize.y)));
            if (refColor.a != 0.0) {
                outColor += refColor * 0.25;
            }
        }
    }

    float offset = time * scanSpeed;
    float wave = sin(offset + (pp * PI));
    float deltaBrightness = (1.0 + wave) * (effectStrength / 2.0);

    outColor.rgb *= min(maxBrightness, baseBrightness + deltaBrightness);
}


