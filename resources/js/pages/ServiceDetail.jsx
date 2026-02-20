import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import { Camera, Clock, CheckCircle, ArrowLeft, Star } from 'lucide-react';

const DETAIL_IMAGES = [
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
    'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1200&q=80',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80',
    'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?w=1200&q=80',
    'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1200&q=80',
    'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=80',
    'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=1200&q=80',
];

export default function ServiceDetail() {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/services/${id}`)
            .then(r => setService(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div></div>;
    if (!service) return <div className="text-center py-20 text-gray-500">Service not found.</div>;

    const imgIdx = (parseInt(id) || 0) % DETAIL_IMAGES.length;

    return (
        <div>
            {/* Hero Image */}
            <section className="relative h-56 sm:h-72 lg:h-80 overflow-hidden">
                <img
                    src={DETAIL_IMAGES[imgIdx]}
                    alt={service.name}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
                <div className="relative h-full flex items-end">
                    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
                        <Link to="/services" className="inline-flex items-center gap-1 text-white/80 hover:text-white mb-3 text-sm font-medium transition">
                            <ArrowLeft className="h-4 w-4" /> Back to Services
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-xs font-medium text-white bg-amber-600 px-2.5 py-1 rounded-full">
                                {service.category?.name}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{service.name}</h1>
                    </div>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 sm:p-6 md:p-8">
                        <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">{service.description}</p>

                        <div className="grid grid-cols-2 gap-4 mb-6 sm:mb-8">
                            <div className="bg-amber-50 rounded-xl p-4 sm:p-5">
                                <p className="text-xs sm:text-sm text-gray-500 mb-1">Price</p>
                                <p className="text-2xl sm:text-3xl font-bold text-amber-600">₱{Number(service.price).toLocaleString()}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
                                <p className="text-xs sm:text-sm text-gray-500 mb-1">Duration</p>
                                <p className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                                    <Clock className="h-5 w-5 sm:h-7 sm:w-7 text-gray-400" />
                                    {service.duration_hours}h
                                </p>
                            </div>
                        </div>

                        {service.inclusions && service.inclusions.length > 0 && (
                            <div className="mb-6 sm:mb-8">
                                <h3 className="font-semibold text-gray-900 mb-3">What's Included</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {service.inclusions.map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Link
                            to={`/book/${service.id}`}
                            className="block w-full text-center bg-amber-600 hover:bg-amber-700 text-white py-3 sm:py-3.5 rounded-lg font-medium transition text-base sm:text-lg shadow-lg shadow-amber-600/20"
                        >
                            Book This Service
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
