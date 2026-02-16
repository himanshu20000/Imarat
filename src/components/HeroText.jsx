import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HeroText.css';

gsap.registerPlugin(ScrollTrigger);

const HeroText = () => {
    const textRef = useRef(null);

    useEffect(() => {
        const element = textRef.current;
        const container = document.querySelector('.image-sequence-hero');
        const isSmallScreen = window.innerWidth < 1024;

        const ctx = gsap.context(() => {
            if (isSmallScreen) {
                // Mobile/Tablet: Scrub-based timed entrance starting at 15%
                gsap.fromTo(
                    element,
                    {
                        opacity: 0,
                        scale: 0.7,
                        y: 100,
                    },
                    {
                        scrollTrigger: {
                            trigger: container,
                            start: '10% top',
                            end: '80% top', // Complete before full bottom for visual comfort
                            scrub: true,
                        },
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        ease: 'power3.out',
                    }
                );
            } else {
                // Desktop: Scrub-based entrance
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
                            end: '50% top', // Finish half way through the long track
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
    }, []);

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
