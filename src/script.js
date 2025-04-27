import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Lenis from "lenis";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

gsap.registerPlugin(ScrollTrigger);

const smoothScroll = () => {
  // Initialize a new Lenis instance for smooth scrolling
  const lenis = new Lenis();

  // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
  lenis.on("scroll", ScrollTrigger.update);

  // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
  // This ensures Lenis's smooth scroll animation updates on each GSAP tick
  gsap.ticker.add((time) => {
    lenis.raf(time * 700); // Convert time from seconds to milliseconds
  });

  // Disable lag smoothing in GSAP to prevent any delay in scroll animations
  gsap.ticker.lagSmoothing(0);
};
smoothScroll();

const textSplit = (element) => {
  const htmlTag = document.querySelector(element);
  let clutter = "";

  htmlTag.textContent
    .split("")
    .forEach(
      (word) =>
        (clutter += `<span className="inline-block">${
          word === " " ? "\u00A0" : word
        }</span>`)
    );

  htmlTag.innerHTML = clutter;
};

textSplit(".hero-title1");
textSplit(".hero-title2");
textSplit(".who");
textSplit(".secondary1");
textSplit(".secondary2");

const heroSectionAnimations = () => {
  gsap.from(".hero-title1 span", {
    transform: "translateY(110%)",
    stagger: { amount: 0.4 },
  });
  gsap.from(".hero-title2 span", {
    transform: "translateY(110%)",
    stagger: { amount: 0.4 },
  });
};

heroSectionAnimations();

const videoAnimation = () => {
  gsap.from("video", {
    scale: ".5",
    scrollTrigger: {
      scroller: "body",
      trigger: ".showreel",
      start: "center center",
      end: "+=100",
      scrub: 1,
      // markers: true,
      pin: true,
    },
  });
};

videoAnimation();

const aboutAnimation = () => {
  gsap.from(".who span", {
    transform: "translateY(110%)",
    stagger: { amount: 0.4 },
    scrollTrigger: {
      scroller: "body",
      trigger: ".who",
      start: "top 90%",
      end: "top 70%",
      scrub: 1,
      // markers: true,
    },
  });
  gsap.from(".secondary1 span", {
    transform: "translateY(110%)",
    stagger: { amount: 0.4 },
    scrollTrigger: {
      scroller: "body",
      trigger: ".secondary1",
      start: "top 90%",
      end: "top 70%",
      scrub: 1,
      // markers: true,
    },
  });
  gsap.from(".secondary2 span", {
    transform: "translateY(110%)",
    stagger: { amount: 0.4 },
    scrollTrigger: {
      scroller: "body",
      trigger: ".secondary2",
      start: "top 90%",
      end: "top 70%",
      scrub: 1,
      // markers: true,
    },
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      scroller: "body",
      trigger: ".secondary2",
      start: "top 90%",
      end: "top 40%",
      scrub: 1,
      // markers: true,
    },
  });

  tl.from(".time", {
    x: 100,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
  })
    .from(".home", {
      x: 100,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    })
    .from(".earth", {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    });
};

aboutAnimation();

const swiper = () => {
  var swiper = new Swiper(".mySwiper", {
    cssMode: true,
    slidesPerView: 3,
    spaceBetween: 16,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  window.addEventListener("click", function (event, index) {
    const halfWidth = window.innerWidth / 2;
    let clamp = Math.floor(document.querySelectorAll(".card").length / 2);

    if (event.clientX < halfWidth) {
      document.querySelector(".swiper-button-prev").click();
      const tl = gsap.timeline();
      gsap.from(".swiper-wrapper", {
        height: "55vh !important",
      });
      tl.to(".card> img", {
        scale: 1.2,
      }).to(".card> img", {
        scale: 1,
      });
    } else {
      document.querySelector(".swiper-button-next").click();
    }
  });
};

swiper();

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
    model.position.sub(center); // shift the model by the center offset

    model.position.y -= 2;
    model.position.x += 3;
    model.rotation.y = -2;

    gsap.to(model.position, {
      x: -5,
      scrollTrigger: {
        trigger: ".page1",
        endTrigger: ".about",
        start: "top 0%",
        end: "top 0 ",
        scrub: true,
        // markers: true,
      },
    });

    gsap.to(model.rotation, {
      y: 1,
      scrollTrigger: {
        trigger: ".page1",
        endTrigger: ".about",
        start: "top 0%",
        end: "top 0 ",
        scrub: true,
        // markers: true,
      },
    });

    ScrollTrigger.create({
      trigger: ".about",
      start: "top 20%",
      end: "top 20%",
      // markers: true,
      onEnter: () => {
        const canvas = document.querySelector(".webgl");
        canvas.style.position = "absolute";
        canvas.style.top = window.scrollY + "px";
      },
      onLeaveBack: () => {
        const canvas = document.querySelector(".webgl");
        canvas.style.position = "fixed";
        canvas.style.top = "0px";
      },
    });

    scene.add(model);
  });

  // Ambient light
  const ambientLight = new THREE.AmbientLight("#fff", 1);
  scene.add(ambientLight);

  // Directional light
  const directionalLight = new THREE.DirectionalLight("#fff", 2);
  directionalLight.position.x = -2;

  scene.add(directionalLight);

  /**
   * Camera
   */

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
  document.body.appendChild(renderer.domElement);
  renderer.domElement.className = "webgl";
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  /**
   * Controls
   */
  // const controls = new OrbitControls(camera, renderer.domElement);

  // controls.enableDamping = true;

  /**
   * Tick Function
   */

  const tick = () => {
    // controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };
  tick();
};
three();
