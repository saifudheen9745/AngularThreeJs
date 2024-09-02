import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true
})
export class AppComponent implements OnInit {
  @ViewChild('rendererContainer', { static: true })
  rendererContainer: ElementRef;

  ngOnInit(): void {
    this.initThreeJS();
  }

  initThreeJS(): void {
    const width = this.rendererContainer.nativeElement.clientWidth;
    const height = this.rendererContainer.nativeElement.clientHeight;

    // Camera
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
    camera.position.z = 1;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('white');

    // Enable shadow maps in the renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.rendererContainer.nativeElement.appendChild(renderer.domElement);

    // Directional light
    const light = new THREE.DirectionalLight(0xffffff, 4); // Increase intensity for better illumination
    light.position.set(3, 4, 5);  // Adjust position to light the entire book
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.left = -1;
    light.shadow.camera.right = 1;
    light.shadow.camera.top = 1;
    light.shadow.camera.bottom = -1;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 10;
    scene.add(light);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Provides uniform lighting
    scene.add(ambientLight);

    // Load textures
    const loader = new THREE.TextureLoader();
    const frontCover = loader.load('assets/images/frontCover.png');
    const backCover = loader.load('assets/images/backCover.png');
    const spine = loader.load('assets/images/spineCover.jpg');

    backCover.center.set(0.5, 0.5);

    // Book geometry and materials
    const geometry = new THREE.BoxGeometry(0.4, 0.6, 0.05);
    const materials = [
      new THREE.MeshStandardMaterial({ color: '#F9F6EE' }),  // Left side
      new THREE.MeshStandardMaterial({ map: spine }),         // Right side
      new THREE.MeshStandardMaterial({ color: '#F9F6EE' }),  // Top side
      new THREE.MeshStandardMaterial({ color: '#F9F6EE' }),  // Bottom side
      new THREE.MeshStandardMaterial({ map: frontCover }),   // Front side
      new THREE.MeshStandardMaterial({ map: backCover }),    // Back side
    ];

    const mesh = new THREE.Mesh(geometry, materials);
    mesh.castShadow = true;
    scene.add(mesh);

    // Ground plane to receive the shadow
    const planeGeometry = new THREE.PlaneGeometry(5, 5);
    const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.35;
    plane.receiveShadow = true;
    scene.add(plane);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;

    // Animation loop
    const animate = (time: number) => {
      mesh.rotation.x = time / 2000;
      mesh.rotation.y = time / 1000;

      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);
  }
}
