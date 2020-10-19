varying vec3 N;
varying vec2 vUv;
const vec3 L = vec3(.5, .5, 1.);

void main() {
  gl_FragColor = vec4(vec3(dot(L, N)), 1.);
}