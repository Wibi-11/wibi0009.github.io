
document.addEventListener('DOMContentLoaded', function() {
    const canvasContainer = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasContainer.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 1500;
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    for(let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
        colorArray[i] = Math.random();
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.03,
        transparent: true,
        opacity: 0.8,
        vertexColors: true,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    camera.position.z = 3;

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
        requestAnimationFrame(animate);
        particlesMesh.rotation.x += 0.0002;
        particlesMesh.rotation.y += 0.0002;

        const positions = particlesGeometry.attributes.position.array;
        for(let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3 + 0] += Math.sin(Date.now() * 0.0005 + i) * 0.0005;
            positions[i3 + 1] += Math.cos(Date.now() * 0.0005 + i) * 0.0005;

            if(mouseX !== 0 || mouseY !== 0) {
                const dx = mouseX * 5 - positions[i3 + 0];
                const dy = mouseY * 5 - positions[i3 + 1];
                const distance = Math.sqrt(dx * dx + dy * dy);
                if(distance < 3) {
                    positions[i3 + 0] -= dx * 0.005;
                    positions[i3 + 1] -= dy * 0.005;
                }
            }
        }
        particlesGeometry.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
});
