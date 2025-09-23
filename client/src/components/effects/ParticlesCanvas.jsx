import React, { useEffect, useRef } from 'react';

export default function ParticlesCanvas({ density = 0.00012, speed = 0.3, color = '#60a5fa' }) {
  const canvasRef = useRef(null);
  const requestRef = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouse);

    let particles = [];
    function initParticles() {
      const area = width * height;
      const count = Math.max(30, Math.floor(area * density));
      particles = new Array(count).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        r: Math.random() * 1.6 + 0.6,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;
      const mx = mouse.current.x || width / 2;
      const my = mouse.current.y || height / 2;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // gentle parallax toward mouse
        p.x += p.vx + (mx - p.x) * 0.0005;
        p.y += p.vy + (my - p.y) * 0.0005;
        if (p.x < -10) p.x = width + 10; if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10; if (p.y > height + 10) p.y = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestRef.current = requestAnimationFrame(draw);
    }

    initParticles();
    draw();

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouse);
    };
  }, [density, speed, color]);

  return <canvas ref={canvasRef} className="particlesCanvas" aria-hidden />;
}


