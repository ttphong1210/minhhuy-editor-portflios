import { createApp, onMounted } from 'vue';
import ScrollIndicator from './components/ScrollIndicator.vue';
import AppHeader from './components/AppHeader.vue';
import HeroSection from './components/HeroSection.vue';
import AboutSection from './components/AboutSection.vue';
import PortfolioSection from './components/PortfolioSection.vue';
import ServicesSection from './components/ServicesSection.vue';
import ContactSection from './components/ContactSection.vue';
import AppFooter from './components/AppFooter.vue';

const app = createApp({
    setup() {
        onMounted(() => {
            // Smooth scrolling
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        const headerOffset = 80;
                        const elementPosition = target.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });

            // Intersection Observer for scroll animations
            const observerOptions = {
                root: null,
                rootMargin: '-10% 0px -10% 0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.animate-on-scroll, .animate-slide-left, .animate-slide-right').forEach((el) => {
                observer.observe(el);
            });

            // Staggered animation for portfolio items
            const portfolioItems = document.querySelectorAll('.portfolio-item');
            portfolioItems.forEach((item, index) => {
                item.style.transitionDelay = `${index * 0.1}s`;
            });

            // Header background and scroll progress
            let ticking = false;
            function updateScroll() {
                const header = document.querySelector('header');
                const scrollProgress = document.getElementById('scrollProgress');
                const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
                
                if (window.scrollY > 100) {
                    header.style.background = 'rgba(15, 15, 35, 0.98)';
                    header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
                } else {
                    header.style.background = 'rgba(15, 15, 35, 0.95)';
                    header.style.boxShadow = 'none';
                }
                
                scrollProgress.style.width = scrollPercent + '%';
                ticking = false;
            }

            function requestTick() {
                if (!ticking) {
                    requestAnimationFrame(updateScroll);
                    ticking = true;
                }
            }

            window.addEventListener('scroll', requestTick);

            // Parallax effect for floating elements
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                document.querySelectorAll('.floating-element').forEach((element, index) => {
                    const speed = 0.2 + (index * 0.1);
                    element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.02}deg)`;
                });
            });

            // Mouse parallax for hero section
            document.addEventListener('mousemove', (e) => {
                const hero = document.querySelector('.hero');
                const heroContent = document.querySelector('.hero-content');
                
                if (hero && heroContent) {
                    const rect = hero.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = (y - centerY) / centerY * -2;
                    const rotateY = (x - centerX) / centerX * 2;
                    
                    heroContent.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
                }
            });

            // Reset hero transform
            document.addEventListener('mouseleave', () => {
                const heroContent = document.querySelector('.hero-content');
                if (heroContent) {
                    heroContent.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
                }
            });

            // Loading animation
            document.body.classList.add('loaded');
            setTimeout(() => {
                document.querySelectorAll('.hero h1, .hero .subtitle, .hero-description, .cta-buttons').forEach((el, index) => {
                    el.style.animationDelay = `${index * 0.2}s`;
                    el.style.animationFillMode = 'both';
                });
            }, 100);
        });
    }
});

app.component('scroll-indicator', ScrollIndicator);
app.component('app-header', AppHeader);
app.component('hero-section', HeroSection);
app.component('about-section', AboutSection);
app.component('portfolio-section', PortfolioSection);
app.component('services-section', ServicesSection);
app.component('contact-section', ContactSection);
app.component('app-footer', AppFooter);

app.mount('#app');