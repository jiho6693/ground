import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { GLTFLoader } from 'GLTFLoader';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from './Skysource.js';
import { DeviceOrientationControls } from './DeviceOrientationControls1.js';

const apiKey = "2fcd83828c7a6dd5b3be29bc0b6fdd9c"
let lat = "41.825226"; 
let lon = "-71.418884";

const url = 'https://api.openweathermap.org/data/2.5/weather?lat='+ lat + '&lon=' + lon +'&units=imperial&appid='+ apiKey +'';


let camera, scene, renderer, controls ;
// + 

let sky, sun;


const startButton = document.getElementById( 'startButton' );
startButton.addEventListener( 'click', function () {

    
    init();
    animate();
    onWindowResize();
    rainy();

    

    
    }, false );

    

function rainy() {
    
    let cloudPartices = [];

    const starGeo = new THREE.BufferGeometry ()
    const vertices = [];
    for (let i = 0; i < 15000; i++) {
    const x = Math.random() * 400 - 300;
    const y = Math.random() * 700 - 250;
    const z = Math.random() * 400 - 200;
    vertices.push(x, y, z);
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    let starMaterial = new THREE.PointsMaterial({
        color:0xffffff,
        size:0.1,
        transparent: true
    })
    const stars = new THREE.Points(starGeo,starMaterial)
    scene.add(stars)
    
    
    //Cloud
    const loader = new THREE.TextureLoader();
    const cloudVertices = [];
    loader.load("./smoke.png", function(texture){

        const cloudGeo = new THREE.PlaneGeometry(800,800);
        const cloudMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true
        });

        for(let p=0; p<25; p++) {
        let cloud = new THREE.Mesh(cloudGeo,cloudMaterial);
        cloud.position.set(
            Math.random()*800 -400,
            500,
            Math.random()*1000 - 450
        );
        cloud.rotation.x = 1.16;
        cloud.rotation.y = -0.12;
        cloud.rotation.z = Math.random()*360;
        cloud.material.opacity = 0.6;
        cloudVertices.push(cloud);
        scene.add(cloud);
        }})
    
    //flash
    const flash = new THREE.PointLight(0x062d89, 20, 500 ,1.7);
    flash.position.set(200,700,100);
    scene.add(flash);
    
    // animation
    function animate() {
        requestAnimationFrame(animate);
        cloudVertices.forEach(p => {
            p.rotation.z -=0.002;
          });
        const positions = starGeo.attributes.position.array;
        for (let i = 1; i < positions.length; i += 3) {
            if (positions[i] < -200) {
            positions[i] = 200;
            }
            positions[i] -= 4;
        }
        starGeo.attributes.position.needsUpdate = true;
        stars.rotation.y +=0.002;
        
        renderer.render(scene, camera); 
        if(Math.random() > 0.96 || flash.power > 100) {
            if(flash.power < 100) 
              flash.position.set(
                Math.random()*400,
                300 + Math.random() *200,
                100
              );
            flash.power = 50 + Math.random() * 500;
          }
      }

    animate();

}




function init() {

    const overlay = document.getElementById( 'overlay' );
    overlay.remove();

    

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 0, 1, 2 );

    camera.rotation.x = 1.16;
			camera.rotation.y = -0.12;
			camera.rotation.z = 0.27;

    // deviceorientation

    // const controls = new OrbitControls( camera, renderer.domElement );
    // controls.addEventListener( 'change', render );
    // // //controls.maxPolarAngle = Math.PI / 2;
    // controls.enableZoom = false;
    // controls.enablePan = false;
    controls = new DeviceOrientationControls( camera );

    scene = new THREE.Scene();

    const textureLoader = new THREE.TextureLoader();
			const textureBasecolor = textureLoader.load('1.jpeg')
			const ground = new THREE.PlaneGeometry(1, 1);
			const groundtexture = new THREE.MeshStandardMaterial({
				side: THREE.DoubleSide,
				map : textureBasecolor
			});
			const groundplane = new THREE.Mesh(ground, groundtexture);
			groundplane.scale.set(500,500,500);
			groundplane.position.set(0,-7,0)
			groundplane.rotation.x = Math.PI / 2;
			scene.add(groundplane);

            const groundplane0 = new THREE.Mesh(ground, groundtexture);
			groundplane0.scale.set(30,30,30);
			groundplane0.position.set(0,-5.2,0)
			groundplane0.rotation.x = Math.PI / 2;
			scene.add(groundplane0);

			const groundplane1 = new THREE.Mesh(ground, groundtexture);
			groundplane1.scale.set(15,15,15);
			groundplane1.position.set(0,-5,0)
			groundplane1.rotation.x = Math.PI / 2;
			scene.add(groundplane1);

			const groundplane2 = new THREE.Mesh(ground, groundtexture);
			groundplane2.scale.set(100,100,100);
			groundplane2.position.set(0,-6,0)
			groundplane2.rotation.x = Math.PI / 2;
			scene.add(groundplane2);


            const light = new THREE.PointLight( 0xffffff, 0.07, 20 );
            light.position.set( 0, 0, 0 );
            scene.add( light );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;
    // renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // // renderer.toneMappingExposure = 0.18;
    document.body.appendChild( renderer.domElement );


    
    
    

    window.addEventListener( 'resize', onWindowResize );

}

function animate() {

    window.requestAnimationFrame( animate );	
    

    controls.update();
    renderer.render( scene, camera );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}




