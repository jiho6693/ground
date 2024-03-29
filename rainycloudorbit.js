import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { DeviceOrientationControls } from './DeviceOrientationControls1.js';

             


			let cloudPartices = [];


			//
		

			const scene = new THREE.Scene();
			scene.fog = new THREE.FogExp2(0x11111f, 0.002);
			scene.background = new THREE.Color(0x000000); 

			const camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight,1,1000);
			camera.position.z = 1;
			camera.position.y = -2;

			camera.rotation.x = 1.16;
			camera.rotation.y = -0.12;
			camera.rotation.z = 0.27;
			// camera.lookAt(new THREE.Vector3(10,1,10));

			const renderer = new THREE.WebGLRenderer({ antialias: true, alpha : true, });
			renderer.setSize(window.innerWidth, window.innerHeight);
			document.body.appendChild( renderer.domElement );

			//orbit추가 카메라 이후에 등장
			const orbitControls = new OrbitControls(camera, renderer.domElement);
			orbitControls.update();
			// orbitControls.minDistance = 0;
			// orbitControls.maxDistance = 3.0;
			// orbitControls.maxPolarAngle = 2.2;   //=3.14/2
			//orbitControls.maxPolarAngle = Math.PI / 2;   //=3.14/2

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

			
			//light
			// const light = new THREE.AmbientLight(0x555555);
			// scene.add(light);

			// const directionalLight1 = new THREE.DirectionalLight(0xffeedd);
			// directionalLight1.position.set(0,0,1);
			// scene.add(directionalLight1);


			


			//rain
			
			const starGeo = new THREE.BufferGeometry ()
            const vertices = [];
            for (let i = 0; i < 15000; i++) {
            const x = Math.random() * 400 - 300;
            const y = Math.random() * 500 - 250;
            const z = Math.random() * 400 - 200;
            vertices.push(x, y, z);
            }
            starGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            let starMaterial = new THREE.PointsMaterial({
                color:0xaaaaaa,
                size:0.1,
                transparent: true
            })
            const stars = new THREE.Points(starGeo,starMaterial)
            scene.add(stars)
            
			
			//Cloud
			const loader = new THREE.TextureLoader();
			const cloudVertices = [];
			loader.load("./smoke.png", function(texture){

				const cloudGeo = new THREE.PlaneGeometry(1000,1000);
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



			
			
			//
			const light = new THREE.PointLight( 0xffffff, 0.2, 50 );
			light.position.set( 0, 0, 0 );
			scene.add( light );


		
			  
			// const directionalLight = new THREE.DirectionalLight(0xffeedd);
			// directionalLight.position.set(0,0,1);
			// scene.add(directionalLight);  
			  
			  
			
			// const ambient = new THREE.AmbientLight(0x555555);
			// scene.add(ambient);
			


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
				stars.rotation.y +=0.01;
				
				renderer.render(scene, camera); 
				if(Math.random() > 0.98 || flash.power > 100) {
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