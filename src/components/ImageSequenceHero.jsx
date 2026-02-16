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
                        img.onload = () => {
                            // Pre-decode the image to offload decompression to the GPU/background
                            img.decode()
                                .then(() => resolve(img))
                                .catch(() => resolve(img)); // Fallback if decode fails
                        };
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

        // Cache drawing parameters to avoid re-calculating every frame
        let cachedDrawParams = null;

        const calculateDrawParams = (img) => {
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

            return { offsetX, offsetY, drawWidth, drawHeight };
        };

        let lastIndex = -1;
        const render = () => {
            const index = Math.min(Math.floor(frameIndex.current.value), frameCount - 1);

            // Avoid redundant draws if the index hasn't changed
            if (index === lastIndex) return;
            lastIndex = index;

            const img = images.current[index];
            if (!img || !img.complete) return;

            context.clearRect(0, 0, canvas.width, canvas.height);

            if (!cachedDrawParams) {
                cachedDrawParams = calculateDrawParams(img);
            }

            const { offsetX, offsetY, drawWidth, drawHeight } = cachedDrawParams;
            context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Clear cache on resize
            cachedDrawParams = null;
            render();
        };

        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        // Detect small screens (Mobile/Tablet) for independent playback
        const isSmallScreen = window.innerWidth < 1024;

        // Ensure smoothing is set once
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'medium';

        // Use GSAP ticker for high-performance rendering synchronized with refresh rate
        gsap.ticker.add(render);

        const ctx = gsap.context(() => {
            if (isSmallScreen) {
                // Mobile/Tablet approach: Hybrid logic
                // 1. Independent Frame Playback (Timed) - Ensures no "hanging"
                gsap.to(frameIndex.current, {
                    value: frameCount - 1,
                    duration: 4,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: container,
                        start: 'top top',
                        end: 'bottom bottom',
                        pin: true,
                        pinSpacing: false,
                        toggleActions: 'play none none reverse',
                    }
                });

                // 2. Scrub-based Overlay (Reactive) - Light curve with bottom clarity
                const overlayTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: container,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: true,
                    }
                });

                overlayTl
                    .to('.image-sequence-hero__overlay', { opacity: 0.4, duration: 1 })
                    .to('.image-sequence-hero__overlay', { opacity: 0.1, duration: 1 });

            } else {
                // Desktop approach: High-precision scrubbing for everything
                const desktopTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: container,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: true,
                        pin: true,
                        pinSpacing: false,
                    }
                });

                desktopTl.to(frameIndex.current, {
                    value: frameCount - 1,
                    ease: 'none',
                });

                // Dim background independently - Light curve
                const desktopOverlayTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: container,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: true,
                    }
                });

                desktopOverlayTl
                    .to('.image-sequence-hero__overlay', { opacity: 0.4, duration: 1 })
                    .to('.image-sequence-hero__overlay', { opacity: 0.1, duration: 1 });
            }
        }, container);

        return () => {
            window.removeEventListener('resize', setCanvasSize);
            gsap.ticker.remove(render);
            ctx.revert(); // Automatically kills all ScrollTriggers and animations
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
