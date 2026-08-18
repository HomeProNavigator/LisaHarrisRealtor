/**
 * Cinematic Las Vegas Night Hero — Three.js
 * Neon glow, dense particles, subtle camera drift + mouse parallax
 * Designed to feel like the Strip at night
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
      console.warn('Three.js failed to load');
      canvas.style.display = 'none';
      return;
    }

    const THREE = window.THREE;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.028);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 120);
    camera.position.set(0, 3.5, 14);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x050508, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    const ambient = new THREE.AmbientLight(0x0a1525, 0.55);
    scene.add(ambient);

    const neonLight = new THREE.PointLight(0x00d4ff, 3.5, 45);
    neonLight.position.set(-6, 5, 4);
    scene.add(neonLight);

    const magentaLight = new THREE.PointLight(0xff2d95, 2.2, 35);
    magentaLight.position.set(7, 3.5, -2);
    scene.add(magentaLight);

    const warm = new THREE.PointLight(0xffaa55, 1.4, 50);
    warm.position.set(0, 2, -18);
    scene.add(warm);

    const coolFill = new THREE.PointLight(0x4488ff, 1.0, 40);
    coolFill.position.set(3, 8, 8);
    scene.add(coolFill);

    const particleCount = 3200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorNeon = new THREE.Color(0x00d4ff);
    const colorMag = new THREE.Color(0xff2d95);
    const colorGold = new THREE.Color(0xd4af37);
    const colorWhite = new THREE.Color(0xffffff);
    const colorPurple = new THREE.Color(0x9b59ff);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 55;
      positions[i3 + 1] = Math.random() * 18 - 2;
      positions[i3 + 2] = (Math.random() - 0.5) * 40 - 8;

      const t = Math.random();
      let c;
      if (t < 0.45) c = colorNeon;
      else if (t < 0.7) c = colorMag;
      else if (t < 0.82) c = colorGold;
      else if (t < 0.92) c = colorPurple;
      else c = colorWhite;

      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
      sizes[i] = Math.random() * 4.2 + 1.0;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.11,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const planeGeo = new THREE.PlaneGeometry(80, 50);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.045,
      side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1.8;
    scene.add(plane);

    for (let i = 0; i < 4; i++) {
      const bandGeo = new THREE.PlaneGeometry(70, 0.15);
      const bandMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x00d4ff : 0xff2d95,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide
      });
      const band = new THREE.Mesh(bandGeo, bandMat);
      band.position.set(0, 1 + i * 2.2, -12 - i * 3);
      band.rotation.x = -0.15;
      scene.add(band);
    }

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });

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

      particles.rotation.y = t * 0.012;
      particles.rotation.x = Math.sin(t * 0.08) * 0.025;

      targetX = mouseX * 0.9;
      targetY = mouseY * 0.4;
      camera.position.x += (targetX - camera.position.x) * 0.035;
      camera.position.y += (3.5 + targetY - camera.position.y) * 0.035;
      camera.lookAt(0, 2.0, -4);

      neonLight.intensity = 3.2 + Math.sin(t * 0.65) * 0.45;
      magentaLight.intensity = 2.0 + Math.sin(t * 0.85 + 1.2) * 0.35;

      renderer.render(scene, camera);
    }

    animate();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(frame);
      else animate();
    });
  }

  if (document.readyState === 'complete') {
    setTimeout(init, 80);
  } else {
    window.addEventListener('load', () => setTimeout(init, 80));
  }
})();
