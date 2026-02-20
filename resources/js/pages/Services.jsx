import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Camera, Clock, CheckCircle, ArrowRight } from 'lucide-react';

const SERVICE_IMAGES = [
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&q=80',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
    'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?w=600&q=80',
    'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=600&q=80',
    'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&q=80',
    'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=600&q=80',
];

export default function Services() {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);

    useEffect(() => {
        api.get('/categories').then(r => setCategories(r.data)).catch(() => {});
        loadServices();
    }, []);

    const loadServices = (categoryId = null) => {
        const params = categoryId ? `?category_id=${categoryId}` : '';
        api.get(`/services${params}`).then(r => setServices(r.data)).catch(() => {});
        setActiveCategory(categoryId);
    };

    return (
        <div>
            {/* Hero Banner */}
            <section className="relative h-48 sm:h-64 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1920&q=80"
                    alt="Services"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative h-full flex items-center justify-center text-center px-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Photography Services</h1>
                        <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto">Browse our professional photography packages and find the perfect one for your needs.</p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-10">
                    <button
                        onClick={() => loadServices(null)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${!activeCategory ? 'bg-amber-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        All Services
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => loadServices(cat.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeCategory === cat.id ? 'bg-amber-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Services Grid */}
                {services.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                        {services.map((service, idx) => (
                            <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                                <div className="h-44 sm:h-52 overflow-hidden relative">
                                    <img
                                        src={SERVICE_IMAGES[idx % SERVICE_IMAGES.length]}
                                        alt={service.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                    <span className="absolute top-3 left-3 text-xs font-medium text-white bg-amber-600 px-2.5 py-1 rounded-full shadow">
                                        {service.category?.name}
                                    </span>
                                </div>
                                <div className="p-4 sm:p-5">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{service.name}</h3>
                                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{service.description}</p>

                                    {service.inclusions && service.inclusions.length > 0 && (
                                        <div className="mb-4 space-y-1">
                                            {service.inclusions.slice(0, 3).map((item, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                    <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" />
                                                    <span className="line-clamp-1">{item}</span>
                                                </div>
                                            ))}
                                            {service.inclusions.length > 3 && (
                                                <p className="text-xs text-gray-400 ml-6">+{service.inclusions.length - 3} more</p>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <div>
                                            <span className="text-xl sm:text-2xl font-bold text-amber-600">₱{Number(service.price).toLocaleString()}</span>
                                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                                <Clock className="h-3 w-3" /> {service.duration_hours} hour{service.duration_hours > 1 ? 's' : ''}
                                            </div>
                                        </div>
                                        <Link
                                            to={`/services/${service.id}`}
                                            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition inline-flex items-center gap-1"
                                        >
                                            View <ArrowRight className="h-3.5 w-3.5 hidden sm:inline" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 sm:py-20 text-gray-400">
                        <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No services available yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
