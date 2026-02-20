// Helper to construct the full URL for images stored in Laravel storage
export function getStorageUrl(imagePath) {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = import.meta.env.VITE_API_URL || '/api';
    const storageBase = baseUrl.replace(/\/api\/?$/, '') + '/storage/';
    return storageBase + imagePath;
}

// Photography-themed Unsplash fallback images
export const FALLBACK_IMAGES = {
    services: [
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
        'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&q=80',
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
        'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?w=600&q=80',
        'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=600&q=80',
        'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&q=80',
        'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=600&q=80',
    ],
    categories: [
        'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=600&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
        'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&q=80',
        'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=600&q=80',
        'https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=600&q=80',
        'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&q=80',
    ],
    portfolios: [
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
    ],
};

// Get image src: returns storage URL if image exists, otherwise a fallback
export function getImageSrc(item, type, index = 0) {
    const stored = getStorageUrl(item?.image);
    if (stored) return stored;
    const fallbacks = FALLBACK_IMAGES[type] || FALLBACK_IMAGES.services;
    return fallbacks[index % fallbacks.length];
}
