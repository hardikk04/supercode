import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

gsap.registerPlugin(ScrollTrigger);

const three = () => {
  /**
   * Scene
   */
  const scene = new THREE.Scene();

  /**
   * GLTF Loader
   */

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");

  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);

  const texture = new THREE.TextureLoader().load("/astro/A_C_02.jpg");
  texture.colorSpace = THREE.SRGBColorSpace;

  texture.flipY = false;
  const textureNormal = new THREE.TextureLoader().load("/astro/A_N_02.jpg");
  textureNormal.colorSpace = THREE.SRGBColorSpace;
  let model = null;
  gltfLoader.load("/astro/astro.gltf", (gltf) => {
    model = gltf.scene;

    model.traverse((child) => {
      if (child.isMesh && child.material.isMeshStandardMaterial) {
        child.material.roughness = 0;
        child.material.metalness = 1;
      }
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          map: texture,
          normalMap: textureNormal,
        });
      }
    });
    // 👉 Center the model
    const box = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    box.getCenter(center);

    model.position.sub(center);
    model.position.y = -0.5;

    scene.add(model);
  });

  // Ambient light
  const ambientLight = new THREE.AmbientLight("#fff", 1);
  scene.add(ambientLight);

  // Directional light
  const directionalLight = new THREE.DirectionalLight("#fff", 2);
  directionalLight.position.x = -2;

  scene.add(directionalLight);

  const sizes = {};
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  /**
   * Camera
   */
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.z = 3;

  scene.add(camera);

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  });

  /**
   * Canvas
   */

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  const canvas = document.querySelector(".blank");
  canvas.appendChild(renderer.domElement);
  renderer.domElement.className = "webgl2";
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const clock = new THREE.Clock();

  const tick = () => {
    const eplaspedTime = clock.getElapsedTime();

    if (model) {
      model.rotation.y = eplaspedTime;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };
  tick();
};
three();
