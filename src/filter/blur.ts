import { Filter } from "../filter";
import { Screen } from "../webgl2/screen";
import { Shader } from "../shader";

export class blur extends Filter {
    constructor(screen: Screen, dx = 1, dy = 0) {
        let {width, height} = screen;

        super(screen, blur.getShader(width, dx, dy), 512, 512);

    }

    static getShader(size, dx, dy) {
        let define = [
            `#define OFFSET (vec2(${dx / size}, ${dy / size}))`,
        ].join('/n');
        return new Shader(blurvs, define + blurfs);
    }


}

let blurvs = `
attribute vec3 POSITION;
attribute vec2 TEXCOORD_0;

varying vec2 uv;
varying vec4 pos;

void main() {
  uv = TEXCOORD_0;
  vec4 position = vec4(POSITION, 1);
  pos = position;
  gl_Position = position;
}
`;

let blurfs = `
#define PI 3.1415926535898
precision mediump float;
uniform sampler2D base;

varying vec2 uv;
varying vec4 pos;



vec4 avrgBlur() {
    vec4 color = vec4(0);
    color += texture2D(base, uv + OFFSET * 0.0 ) / 5.0;
    color += texture2D(base, uv + OFFSET * -1.0 ) / 5.0;
    color += texture2D(base, uv + OFFSET * -2.0 ) / 5.0;
    color += texture2D(base, uv + OFFSET * 1.0 ) / 5.0;
    color += texture2D(base, uv + OFFSET * 2.0 ) / 5.0;
    return color;
}

void main() {
    vec2 offset = uv * 2.0 - 1.0;
    float mask = dot(offset, offset);
    vec4 color = texture2D(base, uv);
    // gl_FragColor = avrgBlur();
    // gl_FragColor = vec4(0);
    // gl_FragColor = vec4(0);
    // gl_FragColor = vec4(0);
    // gl_FragColor = vec4(0);
    gl_FragColor = mix(color, vec4(0,0,0,1), mask * 0.45);
}
`;
