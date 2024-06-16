export default /*glsl*/`

varying vec3 vertexNormal;
uniform vec3 planetColor;

void main() {
    float intensity = pow(0.15 - dot(vertexNormal, vec3(0, 0, 1.0)), 2.0);
    //gl_FragColor = vec4(1.0, 0.2, 0.1, 1.0) * intensity;
    gl_FragColor = vec4(planetColor, 1.0) * intensity;
}
`;
