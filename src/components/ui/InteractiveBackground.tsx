// InteractiveBackground.tsx
'use client';

import React, { useEffect, useRef } from 'react';

const InteractiveBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let blobs: { x: number; y: number; radius: number; color: string; vx: number; vy: number }[] = [];
        const mouse = { x: 0, y: 0 };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initBlobs();
        };

        const initBlobs = () => {
            blobs = [];
            const blobCount = 5;
            for (let i = 0; i < blobCount; i++) {
                const grayValue = Math.random() * 255; // Random grayscale value
                blobs.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 100 + 50,
                    color: `rgba(${grayValue}, ${grayValue}, ${grayValue}, 0.3)`, // Monochromatic color
                    vx: Math.random() * 2 - 1,
                    vy: Math.random() * 2 - 1,
                });
            }
        };

        const drawBlobs = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            blobs.forEach((blob, index) => {
                ctx.beginPath();
                ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
                ctx.fillStyle = blob.color;
                ctx.fill();

                blob.x += blob.vx;
                blob.y += blob.vy;

                if (blob.x < 0 || blob.x > canvas.width) blob.vx *= -1;
                if (blob.y < 0 || blob.y > canvas.height) blob.vy *= -1;

                const dx = mouse.x - blob.x;
                const dy = mouse.y - blob.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 200) {
                    const angle = Math.atan2(dy, dx);
                    blob.vx -= Math.cos(angle) * 0.2;
                    blob.vy -= Math.sin(angle) * 0.2;
                }

                blobs.forEach((otherBlob, otherIndex) => {
                    if (index !== otherIndex) {
                        const dx = otherBlob.x - blob.x;
                        const dy = otherBlob.y - blob.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < blob.radius + otherBlob.radius) {
                            const angle = Math.atan2(dy, dx);
                            blob.vx -= Math.cos(angle) * 0.1;
                            blob.vy -= Math.sin(angle) * 0.1;
                            otherBlob.vx += Math.cos(angle) * 0.1;
                            otherBlob.vy += Math.sin(angle) * 0.1;
                        }
                    }
                });

                blob.vx *= 0.99;
                blob.vy *= 0.99;
            });

            animationFrameId = requestAnimationFrame(drawBlobs);
        };

        const handleMouseMove = (event: MouseEvent) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        };

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);

        resizeCanvas();
        drawBlobs();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" />;
};

export default InteractiveBackground;
