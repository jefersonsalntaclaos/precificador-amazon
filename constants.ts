
export const AMAZON_MARKETPLACES: { [key: string]: { currency: string; weightUnit: string; dimensionUnit: string } } = {
    US: { currency: 'USD', weightUnit: 'lb', dimensionUnit: 'in' },
    BR: { currency: 'BRL', weightUnit: 'kg', dimensionUnit: 'cm' },
    UK: { currency: 'GBP', weightUnit: 'kg', dimensionUnit: 'cm' },
    DE: { currency: 'EUR', weightUnit: 'kg', dimensionUnit: 'cm' },
};

// Simplified referral fees for demonstration. Real fees can be tiered.
export const AMAZON_CATEGORIES: { [key: string]: number } = {
    'Amazon Device Accessories': 0.45,
    'Books': 0.15,
    'Camera & Photo': 0.08,
    'Cell Phones & Accessories': 0.08,
    'Computers & Accessories': 0.08,
    'Electronics': 0.08,
    'Fashion': 0.17,
    'Furniture': 0.15,
    'Grocery & Gourmet Food': 0.08,
    'Health & Personal Care': 0.15,
    'Home & Kitchen': 0.15,
    'Jewelry': 0.20,
    'Office Products': 0.15,
    'Pet Supplies': 0.15,
    'Sports & Outdoors': 0.15,
    'Tools & Home Improvement': 0.15,
    'Toys & Games': 0.15,
    'Video Games': 0.15,
};
