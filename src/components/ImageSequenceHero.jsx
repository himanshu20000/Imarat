import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroText from './HeroText';
import './ImageSequenceHero.css';

gsap.registerPlugin(ScrollTrigger);

const ImageSequenceHero = ({ onLoad }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    // Configuration
    const frameCount = 192; // Total number of frames (0-191)
    const images = useRef([]);
    const frameIndex = useRef({ value: 0 }); // Using an object with 'value' for GSAP to target reliably

    // Preload all images
    useEffect(() => {
        const loadImages = async () => {
            const imagePromises = [];

            for (let i = 0; i < frameCount; i++) {
                const img = new Image();
                const frameNumber = String(i).padStart(3, '0');
                const delay = (i % 3 === 1) ? '0.041s' : '0.042s';
                img.src = `/sequence/frame_${frameNumber}_delay-${delay}.webp`;

                imagePromises.push(
                    new Promise((resolve, reject) => {
                        img.onload = () => resolve(img);
                        img.onerror = () => reject(new Error(`Failed to load frame ${i}`));
                    })
                );

                images.current[i] = img;
            }

            try {
                await Promise.all(imagePromises);
                setImagesLoaded(true);
                if (onLoad) onLoad(true);
            } catch (error) {
                console.error('❌ Error loading images:', error.message);
            }
        };

        loadImages();
    }, []);

    // Setup canvas and ScrollTrigger
    useEffect(() => {
        if (!imagesLoaded) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const container = containerRef.current;

        const render = () => {
            const index = Math.min(Math.floor(frameIndex.current.value), frameCount - 1);
            const img = images.current[index];
            if (!img || !img.complete) return;

            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = 'high';
            context.clearRect(0, 0, canvas.width, canvas.height);

            const imgAspect = img.width / img.height;
            const canvasAspect = canvas.width / canvas.height;

            let drawWidth, drawHeight, offsetX, offsetY;

            if (canvasAspect > imgAspect) {
                drawWidth = canvas.width;
                drawHeight = drawWidth / imgAspect;
            } else {
                drawHeight = canvas.height;
                drawWidth = drawHeight * imgAspect;
            }

            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = (canvas.height - drawHeight) / 2;

            context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            render();
        };

        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);
        render();

        // GSAP ScrollTrigger animation
        const animation = gsap.to(frameIndex.current, {
            value: frameCount - 1,
            ease: 'none',
            scrollTrigger: {
                trigger: container,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
                pin: true,
                anticipatePin: 1,
            },
            onUpdate: render,
        });

        // Background dimming effect on scroll
        gsap.to('.image-sequence-hero__overlay', {
            scrollTrigger: {
                trigger: container,
                start: 'top top',
                end: 'center center',
                scrub: 0.5,
            },
            opacity: 0.85,
            ease: 'none'
        });

        return () => {
            window.removeEventListener('resize', setCanvasSize);
            animation.scrollTrigger?.kill();
            animation.kill();
        };
    }, [imagesLoaded]);

    return (
        <div ref={containerRef} className="image-sequence-hero">
            <canvas ref={canvasRef} className="image-sequence-hero__canvas" />
            <div className="image-sequence-hero__overlay" />
            <HeroText />
        </div>
    );
};

export default ImageSequenceHero;
