import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Navbar.css';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
            <div className="navbar__container">
                <div className="navbar__logo">
                    <span className="navbar__logo-text">Imarat</span>
                </div>

                <ul className="navbar__menu">
                    <li className="navbar__item">
                        <a href="#work" className="navbar__link">Work</a>
                    </li>
                    <li className="navbar__item">
                        <a href="#about" className="navbar__link">About</a>
                    </li>
                    <li className="navbar__item">
                        <a href="#contact" className="navbar__link">Contact</a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
