import {
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    MeshStandardMaterial,
    Mesh,
    Color,
    SphereBufferGeometry,
    HemisphereLight,
    DirectionalLight,
    DirectionalLightHelper,
    ShaderMaterial,
    Clock,
    Vector2
  } from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {lerp, params} from './helpers.js';
import anime from 'animejs/lib/anime.es.js';
import * as dat from 'dat.gui';
import {createSculpture} from 'shader-park-core';

import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";
import * as Stats from 'stats.js';

import * as THREE from 'three'; //REMOVE this in production
const DEBUG = true; // Set to false in production

if(DEBUG) {
    window.THREE = THREE;
}


let container, scene, camera, renderer, controls, gui;
let time, clock;
let stats;


let objectsToRaycast;
let mesh;

function uniformUpdateCallback() {
    return {
        time: time,
        _scale: params.sdfScale
    }
}

function init() {
    container = document.querySelector(".container");
    scene = new Scene();
    scene.background = new Color("white");
    clock = new Clock(true);
    time = 0;
    objectsToRaycast = [];


    let radius = params.boundingSphere;


    let spCode = `
    let mixShape1 = input(0);
    sphere(.5);
    mixGeo(mixShape1);
    box(.5, .5, .5);
    `;
    
    mesh = createSculpture(spCode, () => ({
        'time': time,
        mixShape1: params.mixShape
    }), {radius: 2});
    //mesh is a spherebuffer geometry

    scene.add(mesh);



    // mesh = createSculpture(spCode, uniformUpdateCallback, {radius});




    createCamera();
    // createLights();
    createRenderer();
    createGeometries();
    createControls();
    initGui();

    if(DEBUG) {
        window.scene = scene;
        window.camera = camera;
        window.controls = controls;
        stats = Stats.default();
        document.body.appendChild( stats.dom );
    }

    renderer.setAnimationLoop(() => {
        stats.begin();
        update();
        renderer.render(scene, camera);
        stats.end();
    });
}

function initGui() {
    gui = new dat.GUI();
    window.gui = gui;
    document.querySelector('.dg').style.zIndex = 99; //fix dat.gui hidden


    
    gui.add(params, 'mixShape', 0, 1.00001);
}

function createCamera() {
    const aspect = container.clientWidth / container.clientHeight;
    camera = new PerspectiveCamera(35, aspect, 0.1, 1000);
    camera.position.set(0, 0, 40);
}

function createLights() {
    const directionalLight = new DirectionalLight(0xffffff, 5);
    directionalLight.position.set(5, 5, 10);

    const directionalLightHelper = new DirectionalLightHelper(directionalLight, 5);
    const hemisphereLight = new HemisphereLight(0xddeeff, 0x202020, 3);
    scene.add(directionalLight, directionalLightHelper, hemisphereLight);
}

function createRenderer() {
    renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.physicallyCorrectLights = true;

    container.appendChild(renderer.domElement);
}

function createGeometries() {
    const geometry = new SphereBufferGeometry(1, 30, 30);
    const material = new ShaderMaterial({
        fragmentShader: fragmentShader,
        vertexShader: vertexShader
    });
    const mesh = new Mesh(geometry, material);
    mesh.name = 'sphere';
    // scene.add(mesh);
}

function createControls() {
    controls = new OrbitControls(camera, renderer.domElement);
}

function update() {
    // time = clock.getDelta();
    
    time = clock.getElapsedTime();

    // mesh.material.uniforms['time'].value = time;
}

function onWindowResize() {
    if(!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize, false);

init();