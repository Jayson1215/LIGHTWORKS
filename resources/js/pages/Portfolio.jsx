import React, { useEffect, useState } from 'react';
import api from '../api';
import { Camera, X } from 'lucide-react';

const PORTFOLIO_IMAGES = [
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80',
    'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80',
    'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=800&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=800&q=80',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
    'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80',
];

export default function Portfolio() {
    const [portfolios, setPortfolios] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [lightbox, setLightbox] = useState(null);

    useEffect(() => {
        api.get('/categories').then(r => setCategories(r.data)).catch(() => {});
        loadPortfolios();
    }, []);

    const loadPortfolios = (categoryId = null) => {
        const params = categoryId ? `?category_id=${categoryId}` : '';
        api.get(`/portfolios${params}`).then(r => setPortfolios(r.data)).catch(() => {});
        setActiveCategory(categoryId);
    };

    return (
        <div>
            {/* Hero Banner */}
            <section className="relative h-48 sm:h-64 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1920&q=80"
                    alt="Portfolio"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative h-full flex items-center justify-center text-center px-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Our Portfolio</h1>
                        <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto">Explore our collection of professional photography works across various categories.</p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-10">
                    <button
                        onClick={() => loadPortfolios(null)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${!activeCategory ? 'bg-amber-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => loadPortfolios(cat.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeCategory === cat.id ? 'bg-amber-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                {portfolios.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {portfolios.map((item, idx) => (
                            <div
                                key={item.id}
                                className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer"
                                onClick={() => setLightbox(idx)}
                            >
                                <img
                                    src={PORTFOLIO_IMAGES[idx % PORTFOLIO_IMAGES.length]}
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-end">
                                    <div className="p-3 sm:p-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                                        <p className="font-semibold text-sm sm:text-lg">{item.title}</p>
                                        <p className="text-xs sm:text-sm text-amber-400">{item.category?.name}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 sm:py-20 text-gray-400">
                        <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No portfolio items found.</p>
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {lightbox !== null && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setLightbox(null)}
                >
                    <button className="absolute top-4 right-4 text-white/70 hover:text-white p-2">
                        <X className="h-6 w-6" />
                    </button>
                    <div className="max-w-4xl max-h-[85vh] w-full" onClick={e => e.stopPropagation()}>
                        <img
                            src={PORTFOLIO_IMAGES[lightbox % PORTFOLIO_IMAGES.length].replace('w=800', 'w=1400')}
                            alt={portfolios[lightbox]?.title}
                            className="w-full h-auto max-h-[75vh] object-contain rounded-lg"
                        />
                        <div className="text-center mt-4">
                            <p className="text-white font-semibold text-lg">{portfolios[lightbox]?.title}</p>
                            <p className="text-amber-400 text-sm">{portfolios[lightbox]?.category?.name}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
