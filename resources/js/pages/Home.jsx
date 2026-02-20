import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Camera, ArrowRight, Star, Calendar, Shield, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const HERO_SLIDES = [
    {
        image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1920&q=80',
        title: 'Capturing Your Perfect Moments',
        subtitle: 'Professional photography services for portraits, events, products, and more.',
    },
    {
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80',
        title: 'Timeless Wedding Photography',
        subtitle: 'Let us tell the story of your most beautiful day with stunning imagery.',
    },
    {
        image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1920&q=80',
        title: 'Creative Portrait Sessions',
        subtitle: 'Express your personality through expertly crafted portrait photography.',
    },
    {
        image: 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=1920&q=80',
        title: 'Stunning Event Coverage',
        subtitle: 'From corporate events to celebrations, we capture every important detail.',
    },
    {
        image: 'https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=1920&q=80',
        title: 'Product Photography Excellence',
        subtitle: 'Showcase your products with clean, professional imagery that sells.',
    },
];

const SERVICE_IMAGES = [
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&q=80',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
    'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?w=600&q=80',
];

const PORTFOLIO_IMAGES = [
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&q=80',
    'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=600&q=80',
    'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=600&q=80',
    'https://images.unsplash.com/photo-1504439904031-93ded9f93e4e?w=600&q=80',
    'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80',
    'https://images.unsplash.com/photo-1470114716159-e389f8712fda?w=600&q=80',
    'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80',
];

export default function Home() {
    const [featured, setFeatured] = useState([]);
    const [services, setServices] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        api.get('/portfolios?featured=1').then(r => setFeatured(r.data.slice(0, 6))).catch(() => {});
        api.get('/services?available=1').then(r => setServices(r.data.slice(0, 3))).catch(() => {});
    }, []);

    // Auto-advance slideshow
    useEffect(() => {
        const timer = setInterval(() => {
            goToSlide((currentSlide + 1) % HERO_SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [currentSlide]);

    const goToSlide = useCallback((index) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentSlide(index);
            setIsTransitioning(false);
        }, 500);
    }, []);

    const prevSlide = () => goToSlide((currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    const nextSlide = () => goToSlide((currentSlide + 1) % HERO_SLIDES.length);

    return (
        <div>
            {/* Hero Slideshow */}
            <section className="relative h-[60vh] sm:h-[70vh] lg:h-[85vh] min-h-[400px] lg:min-h-[600px] overflow-hidden">
                {/* Background images (all preloaded, opacity-toggled) */}
                {HERO_SLIDES.map((slide, i) => (
                    <div
                        key={i}
                        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                        style={{ opacity: i === currentSlide && !isTransitioning ? 1 : 0 }}
                    >
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading={i === 0 ? 'eager' : 'lazy'}
                        />
                    </div>
                ))}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30 sm:from-black/75 sm:via-black/50" />

                {/* Content */}
                <div className="relative h-full flex items-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div className="max-w-2xl">
                            <p className="text-amber-500 font-medium mb-4 flex items-center gap-2 text-sm tracking-widest uppercase">
                                <Camera className="h-5 w-5" /> LIGHT Photography Studio
                            </p>
                            <h1
                                className={`text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-white transition-all duration-700 ${
                                    isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                                }`}
                            >
                                {HERO_SLIDES[currentSlide].title.split(' ').map((word, wi, arr) => (
                                    <span key={wi}>
                                        {wi === arr.length - 1 ? (
                                            <span className="text-amber-500">{word}</span>
                                        ) : (
                                            word
                                        )}{' '}
                                    </span>
                                ))}
                            </h1>
                            <p
                                className={`text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed max-w-lg transition-all duration-700 delay-100 ${
                                    isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                                }`}
                            >
                                {HERO_SLIDES[currentSlide].subtitle}
                            </p>
                            <div className={`flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 transition-all duration-700 delay-200 ${
                                isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                            }`}>
                                <Link to="/services" className="bg-amber-600 hover:bg-amber-700 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg font-medium transition flex items-center justify-center gap-2 shadow-lg shadow-amber-600/25 text-sm sm:text-base">
                                    Book a Session <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link to="/portfolio" className="border border-white/30 hover:border-white/60 backdrop-blur-sm text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg font-medium transition text-center text-sm sm:text-base">
                                    View Portfolio
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Slide Navigation Arrows - hidden on mobile */}
                <button onClick={prevSlide} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition hidden sm:block">
                    <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
                <button onClick={nextSlide} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition hidden sm:block">
                    <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>

                {/* Slide Dots */}
                <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5">
                    {HERO_SLIDES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goToSlide(i)}
                            className={`h-3 sm:h-2.5 rounded-full transition-all duration-500 ${
                                i === currentSlide
                                    ? 'w-8 sm:w-8 bg-amber-500'
                                    : 'w-3 sm:w-2.5 bg-white/40 hover:bg-white/70'
                            }`}
                        />
                    ))}
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                    <div
                        className="h-full bg-amber-500 transition-all ease-linear"
                        style={{
                            width: `${((currentSlide + 1) / HERO_SLIDES.length) * 100}%`,
                            transition: 'width 0.8s ease',
                        }}
                    />
                </div>
            </section>

            {/* Features */}
            <section className="py-10 sm:py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Star, title: 'Premium Quality', desc: 'Professional equipment and expert photographers for stunning results.' },
                            { icon: Calendar, title: 'Easy Booking', desc: 'Book your preferred date and time online with our simple scheduling system.' },
                            { icon: Shield, title: 'Secure Payments', desc: 'Multiple payment options with secure transaction processing.' },
                        ].map((f, i) => (
                            <div key={i} className="text-center p-6 rounded-xl border border-gray-100 hover:shadow-lg transition">
                                <div className="bg-amber-50 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                                    <f.icon className="h-7 w-7 text-amber-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                                <p className="text-gray-500 text-sm">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Preview */}
            {services.length > 0 && (
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-8 sm:mb-12">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Our Services</h2>
                            <p className="text-gray-500 max-w-2xl mx-auto">Choose from our wide range of professional photography services.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {services.map((service, idx) => (
                                <div key={service.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                                    <div className="h-52 overflow-hidden relative">
                                        <img
                                            src={SERVICE_IMAGES[idx % SERVICE_IMAGES.length]}
                                            alt={service.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                    </div>
                                    <div className="p-5">
                                        <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                            {service.category?.name}
                                        </span>
                                        <h3 className="text-lg font-semibold text-gray-900 mt-2 mb-1">{service.name}</h3>
                                        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{service.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-bold text-amber-600">₱{Number(service.price).toLocaleString()}</span>
                                            <div className="flex items-center gap-1 text-sm text-gray-400">
                                                <Clock className="h-4 w-4" /> {service.duration_hours}h
                                            </div>
                                        </div>
                                        <Link to={`/services/${service.id}`} className="mt-4 block text-center bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-lg text-sm font-medium transition">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <Link to="/services" className="text-amber-600 hover:text-amber-700 font-medium inline-flex items-center gap-1">
                                View All Services <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Portfolio Preview */}
            {featured.length > 0 && (
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-8 sm:mb-12">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Featured Works</h2>
                            <p className="text-gray-500 max-w-2xl mx-auto">Browse through our collection of stunning photography works.</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {featured.map((item, idx) => (
                                <div key={item.id} className="aspect-square rounded-xl overflow-hidden bg-gray-100 relative group cursor-pointer">
                                    <img
                                        src={PORTFOLIO_IMAGES[idx % PORTFOLIO_IMAGES.length]}
                                        alt={item.title}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-end">
                                        <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                                            <p className="font-semibold text-lg">{item.title}</p>
                                            <p className="text-sm text-amber-400">{item.category?.name}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <Link to="/portfolio" className="text-amber-600 hover:text-amber-700 font-medium inline-flex items-center gap-1">
                                View Full Portfolio <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA with background image */}
            <section className="relative py-16 sm:py-24 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1920&q=80"
                    alt="CTA background"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gray-900/80" />
                <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Book Your Session?</h2>
                    <p className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8">Let us capture your special moments with our professional photography services.</p>
                    <Link to="/services" className="bg-amber-600 hover:bg-amber-700 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg font-medium transition inline-flex items-center gap-2 shadow-lg shadow-amber-600/25 text-sm sm:text-base">
                        Browse Services <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
