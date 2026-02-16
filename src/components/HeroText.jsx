import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HeroText.css';

gsap.registerPlugin(ScrollTrigger);

const HeroText = () => {
    const textRef = useRef(null);

    useEffect(() => {
        const element = textRef.current;

        // Use container as trigger for better scroll sync
        const container = document.querySelector('.image-sequence-hero');

        // Cinematic Fade-in and Scale synced to scroll
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
                    end: '30% top', // Finish entrance early
                    scrub: true,
                },
                opacity: 1,
                scale: 1,
                y: 0,
                ease: 'power3.out',
            }
        );

        // No exit animation - let it stay until the section unpins

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div className="hero-text" ref={textRef}>
            <h1 className="hero-text__title">
                Elevating the Art of <br />
                <span className="hero-text__accent">Architectural Storytelling</span>
            </h1>
            <div className="hero-text__cta">
                <button className="hero-text__button">
                    <span className="hero-text__button-content">
                        Contact Us
                        <span className="hero-text__button-arrow">→</span>
                    </span>
                    <span className="hero-text__button-border"></span>
                </button>
            </div>
        </div>
    );
};

export default HeroText;
