/**
 * Cinematic Las Vegas Night Hero — Three.js
 * Neon glow, particles, subtle camera drift + mouse parallax
 * Respects prefers-reduced-motion
 */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isLowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;

  if (prefersReduced || isLowPower) {
    canvas.style.display = 'none';
    document.documentElement.classList.add('reduced-motion');
    return;
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (window.THREE) return resolve();
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function init() {
    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
    } catch (e) {
      console.warn('Three.js failed to load, using static fallback');
      canvas.style.display = 'none';
      return;
    }

    const THREE = window.THREE;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.035);

    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 2.2, 8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x050505, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const ambient = new THREE.AmbientLight(0x0a1a2a, 0.4);
    scene.add(ambient);

    const neonLight = new THREE.PointLight(0x00d4ff, 2.2, 30);
    neonLight.position.set(-4, 3, 2);
    scene.add(neonLight);

    const magentaLight = new THREE.PointLight(0xff2d95, 1.4, 25);
    magentaLight.position.set(5, 2, -1);
    scene.add(magentaLight);

    const warm = new THREE.PointLight(0xffaa66, 0.8, 40);
    warm.position.set(0, 1, -12);
    scene.add(warm);

    const particleCount = 1800;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorNeon = new THREE.Color(0x00d4ff);
    const colorMag = new THREE.Color(0xff2d95);
    const colorGold = new THREE.Color(0xd4af37);
    const colorWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 40;
      positions[i3 + 1] = Math.random() * 12 - 1;
      positions[i3 + 2] = (Math.random() - 0.5) * 30 - 5;

      const t = Math.random();
      let c;
      if (t < 0.55) c = colorNeon;
      else if (t < 0.8) c = colorMag;
      else if (t < 0.92) c = colorGold;
      else c = colorWhite;

      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
      sizes[i] = Math.random() * 3.5 + 0.8;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const planeGeo = new THREE.PlaneGeometry(60, 40);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.03,
      side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1.2;
    scene.add(plane);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let frame = 0;

    function animate() {
      frame = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      particles.rotation.y = t * 0.015;
      particles.rotation.x = Math.sin(t * 0.1) * 0.02;

      targetX = mouseX * 0.6;
      targetY = mouseY * 0.3;
      camera.position.x += (targetX - camera.position.x) * 0.04;
      camera.position.y += (2.2 + targetY - camera.position.y) * 0.04;
      camera.lookAt(0, 1.2, -2);

      neonLight.intensity = 2.0 + Math.sin(t * 0.7) * 0.3;
      magentaLight.intensity = 1.2 + Math.sin(t * 0.9 + 1) * 0.25;

      renderer.render(scene, camera);
    }

    animate();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(frame);
      else animate();
    });
  }

  if (document.readyState === 'complete') {
    setTimeout(init, 100);
  } else {
    window.addEventListener('load', () => setTimeout(init, 100));
  }
})();
