import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, ShieldCheck, GraduationCap, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import './Homepage.css';

const Homepage = () => {
    const navigate = useNavigate();
    const [isNavbarHidden, setIsNavbarHidden] = React.useState(false);
    const [isSticky, setIsSticky] = React.useState(false);
    const [lastScrollY, setLastScrollY] = React.useState(0);

    React.useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Sticky logic
            if (currentScrollY > 100) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }

            // Hide logic
            if (currentScrollY > lastScrollY && currentScrollY > 400) {
                setIsNavbarHidden(true);
            } else {
                setIsNavbarHidden(false);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    const revealVariant = {
        initial: { opacity: 0, x: -60, filter: "blur(10px)" },
        whileInView: { opacity: 1, x: 0, filter: "blur(0px)" },
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    };

    const revealVariantRight = {
        initial: { opacity: 0, x: 60, filter: "blur(10px)" },
        whileInView: { opacity: 1, x: 0, filter: "blur(0px)" },
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="homepage">
            {/* Background Decorations */}
            <div className="bg-decoration blob-1"></div>
            <div className="bg-decoration blob-2"></div>
            <div className="bg-decoration blob-3"></div>

            {/* Navbar */}
            <motion.nav
                className={`navbar ${isSticky ? 'sticky' : ''} ${isNavbarHidden ? 'hidden' : ''}`}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container">
                    <div className="logo">
                        <Layout className="logo-icon" size={28} />
                        <span>IMS Portal</span>
                    </div>
                    <div className="nav-links">
                        <Link to="/login" className="nav-link">Login</Link>
                        <Button size="sm" onClick={() => navigate('/signup')}>Sign Up</Button>
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <header className="hero">
                <motion.div
                    className="container hero-content"
                    initial="initial"
                    animate="animate"
                    variants={staggerContainer}
                >
                    <motion.h1
                        className="hero-title"
                        variants={fadeInUp}
                    >
                        Empowering the Next Generation of <span>Professionals</span>
                    </motion.h1>
                    <motion.p
                        className="hero-subtitle"
                        variants={fadeInUp}
                    >
                        A scalable platform for managing internships.
                        Connect students, supervisors, and administrators with ease.
                    </motion.p>
                    <motion.div
                        className="hero-actions"
                        variants={fadeInUp}
                    >
                        <Button size="lg" onClick={() => navigate('/signup')}>
                            Get Started <ArrowRight size={20} />
                        </Button>
                        <Button variant="secondary" size="lg" onClick={() => navigate('/login')}>
                            Sign In
                        </Button>
                    </motion.div>
                </motion.div>
            </header>

            {/* Roles Section */}
            <section className="roles-section">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="discovery-main-title">Are you ready to discover?</h2>
                        <p className="discovery-main-subtitle">Tailored experiences for every user in the internship ecosystem.</p>
                    </motion.div>

                    <motion.div
                        className="path-selection-grid"
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        {/* Student Path */}
                        <motion.div
                            className="path-card student"
                            variants={fadeInUp}
                            whileHover={{
                                rotateY: 5,
                                rotateX: -5,
                                transition: { duration: 0.4 }
                            }}
                        >
                            <div className="path-icon-container">
                                <GraduationCap size={40} />
                            </div>
                            <div className="path-header">
                                <span className="path-question">Are you a Student?</span>
                                <h3>Elevated Career Mastery</h3>
                            </div>
                            <p>Automate your logbooks and track your professional evolution through a world-class interface.</p>
                            <Button size="lg" variant="secondary" className="path-btn" onClick={() => navigate('/signup')}>Start Your Legacy</Button>
                        </motion.div>

                        {/* Supervisor Path */}
                        <motion.div
                            className="path-card supervisor"
                            variants={fadeInUp}
                            whileHover={{
                                rotateY: -5,
                                rotateX: -5,
                                transition: { duration: 0.4 }
                            }}
                        >
                            <div className="path-icon-container">
                                <Users size={40} />
                            </div>
                            <div className="path-header">
                                <span className="path-question">Are you a Supervisor?</span>
                                <h3>Precision Mentorship</h3>
                            </div>
                            <p>Seamlessly guide future talent with high-impact professional feedback and real-time monitoring.</p>
                            <Button size="lg" variant="secondary" className="path-btn" onClick={() => navigate('/signup')}>Access Dashboard</Button>
                        </motion.div>

                        {/* Admin Path */}
                        <motion.div
                            className="path-card admin"
                            variants={fadeInUp}
                            whileHover={{
                                rotateY: 5,
                                rotateX: 5,
                                transition: { duration: 0.4 }
                            }}
                        >
                            <div className="path-icon-container">
                                <ShieldCheck size={40} />
                            </div>
                            <div className="path-header">
                                <span className="path-question">Are you an Admin?</span>
                                <h3>Program Sovereignty</h3>
                            </div>
                            <p>Oversee the entire internship lifecycle with enterprise-grade governance and analytics tools.</p>
                            <Button variant="secondary" size="lg" className="path-btn admin-btn" onClick={() => navigate('/signup')}>Admin Command</Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <p>&copy; 2026 Internship Management System. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Homepage;
