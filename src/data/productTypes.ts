import { ProductType, ProductTypeInfo } from '../types';

export const PRODUCT_TYPES: ProductTypeInfo[] = [
  {
    id: 'outillage',
    label: 'Outillage & Équipement',
    labelEn: 'Tools & Equipment',
    iconName: 'Wrench',
    color: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  {
    id: 'plomberie',
    label: 'Plomberie & Sanitaire',
    labelEn: 'Plumbing & Sanitary',
    iconName: 'Droplets',
    color: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  {
    id: 'electricite',
    label: 'Électricité & Éclairage',
    labelEn: 'Electrical & Lighting',
    iconName: 'Zap',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  },
  {
    id: 'peinture',
    label: 'Peinture & Revêtements',
    labelEn: 'Paint & Coatings',
    iconName: 'Paintbrush',
    color: 'bg-purple-100 text-purple-800 border-purple-300'
  },
  {
    id: 'quincaillerie',
    label: 'Quincaillerie & Vis',
    labelEn: 'Hardware & Fasteners',
    iconName: 'Nut',
    color: 'bg-slate-100 text-slate-800 border-slate-300'
  },
  {
    id: 'materiaux',
    label: 'Matériaux de Construction',
    labelEn: 'Building Materials',
    iconName: 'Boxes',
    color: 'bg-orange-100 text-orange-800 border-orange-300'
  },
  {
    id: 'protection',
    label: 'Protection & EPI',
    labelEn: 'Safety & PPE',
    iconName: 'ShieldCheck',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  {
    id: 'autres',
    label: 'Autres Produits',
    labelEn: 'Other Products',
    iconName: 'Package',
    color: 'bg-gray-100 text-gray-800 border-gray-300'
  }
];

export function getProductTypeInfo(type: ProductType): ProductTypeInfo {
  return (
    PRODUCT_TYPES.find((pt) => pt.id === type) || {
      id: 'autres',
      label: 'Autres Produits',
      labelEn: 'Other Products',
      iconName: 'Package',
      color: 'bg-gray-100 text-gray-800 border-gray-300'
    }
  );
}
