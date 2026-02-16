import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HeroText.css';

gsap.registerPlugin(ScrollTrigger);

const HeroText = ({ preloaderComplete }) => {
    const textRef = useRef(null);

    useEffect(() => {
        if (!preloaderComplete) return;

        const element = textRef.current;
        const container = document.querySelector('.image-sequence-hero');
        const isSmallScreen = window.innerWidth < 1024;

        const ctx = gsap.context(() => {
            if (isSmallScreen) {
                // Mobile/Tablet: Independent staggered entrance
                // No ScrollTrigger here to ensure it's fully independent
                const tl = gsap.timeline();

                // Animate the Title
                tl.fromTo(
                    '.hero-text__title',
                    {
                        opacity: 0,
                        scale: 0.8,
                        y: 50,
                    },
                    {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        duration: 1.2,
                        ease: 'power3.out',
                    }
                );

                // Animate the Button (staggered)
                tl.fromTo(
                    '.hero-text__cta',
                    {
                        opacity: 0,
                        y: 30,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: 'power3.out',
                    },
                    "-=0.6" // Start before title finishes
                );
            } else {
                // Desktop: Scrub-based entrance synced to dynamic track
                gsap.fromTo(
                    element,
                    {
                        opacity: 0,
                        scale: 0.7,
                        y: 150,
                    },
                    {
                        scrollTrigger: {
                            trigger: container,
                            start: 'top top',
                            end: '+=100%', // Finish reveal halfway through the track
                            scrub: true,
                        },
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        ease: 'power3.out',
                    }
                );
            }
        }, textRef);

        return () => ctx.revert();
    }, [preloaderComplete]);

    return (
        <div className="hero-text" ref={textRef}>
            <h1 className="hero-text__title">
                Elevating the Art of <br />
                <span className="hero-text__accent">Architectural Storytelling</span>
            </h1>
            <div className="hero-text__cta">
                <button className="hero-text__button" style={{ pointerEvents: 'none' }}>
                    <span className="hero-text__button-content">
                        Explore
                        <span className="hero-text__button-arrow">→</span>
                    </span>
                    <span className="hero-text__button-border"></span>
                </button>
            </div>
        </div>
    );
};

export default HeroText;
