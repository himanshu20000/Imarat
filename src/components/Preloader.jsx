import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Preloader.css';

const Preloader = ({ isLoaded, onComplete }) => {
    const preloaderRef = useRef(null);
    const contentRef = useRef(null);
    const svgRef = useRef(null);

    // 1. Entrance Animation (on mount)
    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ name: 'entrance' });

            tl.fromTo('.building-path',
                { strokeDasharray: 1000, strokeDashoffset: 1000 },
                { strokeDashoffset: 0, duration: 2.5, ease: 'power2.inOut', stagger: 0.2 }
            );

            tl.to('.building-svg', {
                opacity: 0.6,
                scale: 0.98,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            }, '-=1');
        }, preloaderRef);

        return () => ctx.revert();
    }, []);

    // 2. Exit Sequence (when isLoaded becomes true)
    useEffect(() => {
        if (!isLoaded) return;

        const ctx = gsap.context(() => {
            const exitTl = gsap.timeline({
                onComplete: () => {
                    if (onComplete) onComplete();
                }
            });

            exitTl.to(contentRef.current, {
                opacity: 0,
                scale: 1.1,
                duration: 1,
                ease: 'power4.in'
            })
                .to(preloaderRef.current, {
                    yPercent: -100,
                    duration: 1.2,
                    ease: 'expo.inOut'
                }, '-=0.5');
        }, preloaderRef);

        return () => ctx.revert();
    }, [isLoaded, onComplete]);

    return (
        <div className="preloader" ref={preloaderRef}>
            <div className="preloader__content" ref={contentRef}>
                <div className="preloader__logo">
                    <svg
                        className="building-svg"
                        viewBox="0 0 100 100"
                        ref={svgRef}
                        fill="none"
                        stroke="white"
                        strokeWidth="0.5"
                    >

                        <path className="building-path" d="M20 80 V30 L50 15 L80 30 V80 H20" />
                        <path className="building-path" d="M35 80 V45 H65 V80" />
                        <path className="building-path" d="M20 50 H80" />
                        <path className="building-path" d="M20 65 H80" />
                        <path className="building-path" d="M50 15 V80" />
                    </svg>
                </div>
                <div className="preloader__text">
                    <h2 className="preloader__title">Imarat</h2>
                    <p className="preloader__subtitle">Architectural Storytelling</p>
                </div>
                <div className="preloader__progress-bar">
                    <div className="preloader__progress-fill"></div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
