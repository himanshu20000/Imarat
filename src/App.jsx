import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import ImageSequenceHero from './components/ImageSequenceHero';
import Preloader from './components/Preloader';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [preloaderComplete, setPreloaderComplete] = useState(false);

    useEffect(() => {
        // Initialize Lenis
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        // Synchronize Lenis with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove(lenis.raf);
        };
    }, []);

    return (
        <div className="app">
            {!preloaderComplete && (
                <Preloader
                    isLoaded={imagesLoaded}
                    onComplete={() => setPreloaderComplete(true)}
                />
            )}

            {/* Only show/render main content after preloader transition has progressed */}
            <div style={{
                opacity: preloaderComplete ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
                visibility: preloaderComplete ? 'visible' : 'hidden'
            }}>
                <Navbar />
                <ImageSequenceHero onLoad={(status) => setImagesLoaded(status)} />

                {/* <section className="content-section" id="work">
                    <div className="container">
                        <h2 className="section-title">Selected Work</h2>
                        <p className="section-description">
                            Explore our architectural storytelling through motion.
                        </p>
                    </div>
                </section> */}

                {/* <section className="content-section content-section--dark" id="about">
                    <div className="container">
                        <h2 className="section-title">The Imarat Vision</h2>
                        <p className="section-description">
                            Blending cinematic precision with structural elegance.
                        </p>
                    </div>
                </section>

                <section className="content-section" id="contact">
                    <div className="container">
                        <h2 className="section-title">Get In Touch</h2>
                        <p className="section-description">
                            Elevate your next project with us.
                        </p>
                    </div>
                </section> */}
            </div>
        </div>
    );
}

export default App;
