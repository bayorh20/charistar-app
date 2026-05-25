export type CategoryId =
  | 'yogurts'
  | 'parfait'
  | 'granola'
  | 'fruit-bowls'
  | 'combos'
  | 'snacks';

export type ProductSection =
  | 'popular'
  | 'hot-deals'
  | 'new-arrivals'
  | 'best-sellers'
  | 'preorder-lunch';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryId;
  sections: ProductSection[];
  image: string;
  sizes: string[];
  flavors?: string[];
  benefits: string[];
  isInstant?: boolean;
  badge?: string;
}

export const CATEGORIES: { id: CategoryId; label: string; icon: string }[] = [
  { id: 'yogurts', label: 'Yogurts', icon: 'water-outline' },
  { id: 'parfait', label: 'Parfait', icon: 'layers-outline' },
  { id: 'granola', label: 'Granola', icon: 'nutrition-outline' },
  { id: 'fruit-bowls', label: 'Fruit Bowls', icon: 'leaf-outline' },
  { id: 'combos', label: 'Combos', icon: 'gift-outline' },
  { id: 'snacks', label: 'Snacks', icon: 'cafe-outline' },
];

const img = {
  yogurt:
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
  greek:
    'https://images.unsplash.com/photo-1571212515416-9e4c4b4e4b8e?w=800&q=80',
  strawberry:
    'https://images.unsplash.com/photo-1571212515416-9e4c4b4e4b8e?w=800&q=80',
  parfait:
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
  granola:
    'https://images.unsplash.com/photo-1517673400267-025144a246e8?w=800&q=80',
  bowl:
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
  combo:
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
  snack:
    'https://images.unsplash.com/photo-1505253716367-df942b609e9f?w=800&q=80',
};

export const PRODUCTS: Product[] = [
  {
    id: 'creamy-yogurt',
    name: 'Creamy Yogurt',
    description: 'Fresh yogurt, made creamy. Silky smooth and perfectly balanced.',
    price: 1200,
    category: 'yogurts',
    sections: ['popular', 'best-sellers'],
    image: img.yogurt,
    sizes: ['350ml', '500ml', '1L'],
    flavors: ['Original', 'Honey'],
    benefits: ['High protein', 'Probiotics', 'No artificial sweeteners'],
    badge: 'Bestseller',
  },
  {
    id: 'greek-yogurt',
    name: 'Greek Yogurt',
    description: 'Thick, rich Greek-style yogurt for the health-conscious.',
    price: 1500,
    category: 'yogurts',
    sections: ['popular', 'hot-deals'],
    image: img.greek,
    sizes: ['350ml', '500ml', '1L'],
    flavors: ['Plain', 'Vanilla'],
    benefits: ['Extra protein', 'Low sugar', 'Gut-friendly'],
  },
  {
    id: 'strawberry-yogurt',
    name: 'Strawberry Yogurt',
    description: 'Real strawberry swirl in every spoonful.',
    price: 1400,
    category: 'yogurts',
    sections: ['new-arrivals', 'popular'],
    image: img.strawberry,
    sizes: ['350ml', '500ml', '1L'],
    flavors: ['Strawberry', 'Berry Mix'],
    benefits: ['Real fruit', 'Vitamin C', 'Fresh daily'],
    badge: 'New',
  },
  {
    id: 'vanilla-yogurt',
    name: 'Vanilla Yogurt',
    description: 'Classic vanilla — smooth, sweet, and satisfying.',
    price: 1300,
    category: 'yogurts',
    sections: ['best-sellers'],
    image: img.yogurt,
    sizes: ['350ml', '500ml', '1L'],
    flavors: ['Madagascar Vanilla'],
    benefits: ['Classic taste', 'Calcium rich'],
  },
  {
    id: 'mango-yogurt',
    name: 'Mango Yogurt',
    description: 'Tropical mango bliss in creamy yogurt form.',
    price: 1450,
    category: 'yogurts',
    sections: ['hot-deals', 'new-arrivals'],
    image: img.strawberry,
    sizes: ['350ml', '500ml', '1L'],
    flavors: ['Mango', 'Mango-Passion'],
    benefits: ['Tropical flavor', 'Energy boost'],
    badge: 'Hot',
  },
  {
    id: 'yogurt-parfait',
    name: 'Yogurt Parfait',
    description: 'Build your perfect parfait — layers of yogurt, granola, and fruit.',
    price: 2800,
    category: 'parfait',
    sections: ['popular', 'preorder-lunch'],
    image: img.parfait,
    sizes: ['Regular', 'Large'],
    flavors: ['Berry', 'Tropical', 'Classic'],
    benefits: ['Customizable', 'Balanced macros', 'Instagram-worthy'],
    isInstant: false,
  },
  {
    id: 'granola-mix',
    name: 'Granola Mix',
    description: 'Crunchy artisan granola with nuts and seeds.',
    price: 1800,
    category: 'granola',
    sections: ['popular', 'best-sellers'],
    image: img.granola,
    sizes: ['200g', '400g'],
    benefits: ['Whole grains', 'No preservatives', 'Perfect crunch'],
    isInstant: true,
  },
  {
    id: 'fruit-yogurt-bowl',
    name: 'Fruit & Yogurt Bowl',
    description: 'Fresh seasonal fruits over creamy Charistar yogurt.',
    price: 3200,
    category: 'fruit-bowls',
    sections: ['popular', 'preorder-lunch'],
    image: img.bowl,
    sizes: ['Regular', 'Large'],
    benefits: ['Fresh fruit daily', 'Antioxidants', 'Filling & light'],
    isInstant: false,
  },
  {
    id: 'healthy-snack-combo',
    name: 'Healthy Snack Combo',
    description: 'Yogurt + granola + fruit — the ultimate healthy treat pack.',
    price: 4500,
    category: 'combos',
    sections: ['hot-deals', 'preorder-lunch'],
    image: img.combo,
    sizes: ['Solo', 'Duo'],
    benefits: ['Save 15%', 'Perfect for sharing', 'Campus favorite'],
    badge: 'Combo',
  },
  {
    id: 'campus-power-pack',
    name: 'Campus Power Pack',
    description: 'Greek yogurt, granola bar, and fruit cup for busy students.',
    price: 3800,
    category: 'snacks',
    sections: ['new-arrivals', 'preorder-lunch'],
    image: img.snack,
    sizes: ['Standard'],
    benefits: ['Study fuel', 'Quick grab', 'Balanced energy'],
    isInstant: true,
  },
  {
    id: 'honey-nut-parfait',
    name: 'Honey Nut Parfait',
    description: 'Honey drizzle, roasted nuts, and creamy yogurt layers.',
    price: 3100,
    category: 'parfait',
    sections: ['best-sellers'],
    image: img.parfait,
    sizes: ['Regular', 'Large'],
    benefits: ['Natural sweetness', 'Healthy fats'],
  },
  {
    id: 'green-smoothie-bowl',
    name: 'Green Smoothie Bowl',
    description: 'Spinach, banana, and yogurt — refreshingly healthy.',
    price: 3500,
    category: 'fruit-bowls',
    sections: ['new-arrivals'],
    image: img.bowl,
    sizes: ['Regular'],
    benefits: ['Detox-friendly', 'Fiber rich'],
  },
];

export const ADD_ONS = [
  { id: 'granola', name: 'Extra Granola', price: 400 },
  { id: 'fruits', name: 'Fresh Fruits', price: 600 },
  { id: 'nuts', name: 'Mixed Nuts', price: 500 },
  { id: 'honey', name: 'Honey Drizzle', price: 300 },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(category: CategoryId): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getProductsBySection(section: ProductSection): Product[] {
  return PRODUCTS.filter((p) => p.sections.includes(section));
}

export function formatPrice(naira: number): string {
  return `₦${naira.toLocaleString('en-NG')}`;
}
