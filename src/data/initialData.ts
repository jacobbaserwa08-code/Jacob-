import { Product, Client, Expense, Employee, SalaryPayment, Sale, Purchase, StockMovement } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Ciment Portland 50kg CPJ 45',
    sku: 'MAT-CIM-50',
    barcode: '370012345601',
    category: 'materiaux',
    buyingPrice: 4200,
    sellingPrice: 5000,
    stockQuantity: 120,
    minStockLevel: 30,
    unit: 'Sac',
    location: 'Dépôt A1',
    description: 'Ciment Haute résistance pour béton et maçonnerie.',
    createdAt: '2026-07-01T08:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'prod-002',
    name: 'Perceuse Percuteuse 800W Pro',
    sku: 'OUT-PER-800',
    barcode: '370012345602',
    category: 'outillage',
    buyingPrice: 28000,
    sellingPrice: 35000,
    stockQuantity: 14,
    minStockLevel: 5,
    unit: 'Pièce',
    location: 'Rayon Outillage 1',
    description: 'Perceuse filaire 800W avec coffret et forets.',
    createdAt: '2026-07-01T08:00:00Z',
    updatedAt: '2026-08-02T11:30:00Z'
  },
  {
    id: 'prod-003',
    name: 'Marteau de Charpentier 500g Manche Fibre',
    sku: 'OUT-MAR-500',
    barcode: '370012345603',
    category: 'outillage',
    buyingPrice: 3200,
    sellingPrice: 4500,
    stockQuantity: 28,
    minStockLevel: 10,
    unit: 'Pièce',
    location: 'Rayon Outillage 2',
    description: 'Marteau à panne fendue ergo manche tri-matière.',
    createdAt: '2026-07-02T08:00:00Z',
    updatedAt: '2026-08-02T11:30:00Z'
  },
  {
    id: 'prod-004',
    name: 'Tuyau PVC Pression Ø40mm L=4m',
    sku: 'PLO-PVC-40',
    barcode: '370012345604',
    category: 'plomberie',
    buyingPrice: 1800,
    sellingPrice: 2600,
    stockQuantity: 8, // Low stock alert
    minStockLevel: 15,
    unit: 'Mètre',
    location: 'Plomberie R2',
    description: 'Tuyau évacuation et adduction sanitaire.',
    createdAt: '2026-07-03T08:00:00Z',
    updatedAt: '2026-08-05T09:15:00Z'
  },
  {
    id: 'prod-005',
    name: 'Robinet Mélangeur Lavabo Chromé',
    sku: 'PLO-ROB-01',
    barcode: '370012345605',
    category: 'plomberie',
    buyingPrice: 7500,
    sellingPrice: 11000,
    stockQuantity: 19,
    minStockLevel: 8,
    unit: 'Pièce',
    location: 'Plomberie R1',
    description: 'Robinetterie laiton chromé sanitaire avec flexibles.',
    createdAt: '2026-07-03T08:00:00Z',
    updatedAt: '2026-08-04T14:00:00Z'
  },
  {
    id: 'prod-006',
    name: 'Câble Électrique TH 2.5mm² (Rouleau 100m)',
    sku: 'ELE-CAB-25',
    barcode: '370012345606',
    category: 'electricite',
    buyingPrice: 14500,
    sellingPrice: 19000,
    stockQuantity: 22,
    minStockLevel: 10,
    unit: 'Rouleau',
    location: 'Électricité A3',
    description: 'Câble cuivre isolé PVC rigide certifié NF.',
    createdAt: '2026-07-04T08:00:00Z',
    updatedAt: '2026-08-05T16:20:00Z'
  },
  {
    id: 'prod-007',
    name: 'Disjoncteur Différentiel 16A 30mA',
    sku: 'ELE-DIS-16',
    barcode: '370012345607',
    category: 'electricite',
    buyingPrice: 2900,
    sellingPrice: 4200,
    stockQuantity: 4, // Low stock
    minStockLevel: 12,
    unit: 'Pièce',
    location: 'Électricité A1',
    description: 'Protection circuits prises et éclairage.',
    createdAt: '2026-07-04T08:00:00Z',
    updatedAt: '2026-08-05T16:20:00Z'
  },
  {
    id: 'prod-008',
    name: 'Peinture Acrylique Blanche Mate 10 Litres',
    sku: 'PEI-ACR-10',
    barcode: '370012345608',
    category: 'peinture',
    buyingPrice: 12000,
    sellingPrice: 16500,
    stockQuantity: 35,
    minStockLevel: 10,
    unit: 'Litre',
    location: 'Zone Peintures',
    description: 'Peinture monocouche lavable haute couvrance.',
    createdAt: '2026-07-05T08:00:00Z',
    updatedAt: '2026-08-03T10:00:00Z'
  },
  {
    id: 'prod-009',
    name: 'Boîte de Vis à Bois Inox 4x40 (500 pcs)',
    sku: 'QUI-VIS-440',
    barcode: '370012345609',
    category: 'quincaillerie',
    buyingPrice: 2200,
    sellingPrice: 3200,
    stockQuantity: 45,
    minStockLevel: 15,
    unit: 'Boîte',
    location: 'Bac Visserie 4',
    description: 'Vis empreinte Torx traitement anticorrosion.',
    createdAt: '2026-07-05T08:00:00Z',
    updatedAt: '2026-08-01T09:00:00Z'
  },
  {
    id: 'prod-010',
    name: 'Casque de Chantier Sécurité ventilé',
    sku: 'PRO-CAS-01',
    barcode: '370012345610',
    category: 'protection',
    buyingPrice: 1900,
    sellingPrice: 2800,
    stockQuantity: 25,
    minStockLevel: 8,
    unit: 'Pièce',
    location: 'EPI Rayon 1',
    description: 'Casque de protection polypropylène avec jugulaire.',
    createdAt: '2026-07-06T08:00:00Z',
    updatedAt: '2026-08-02T15:00:00Z'
  },
  {
    id: 'prod-011',
    name: 'Gants de Manutention Renforcés (Paire)',
    sku: 'PRO-GAN-01',
    barcode: '370012345611',
    category: 'protection',
    buyingPrice: 600,
    sellingPrice: 1000,
    stockQuantity: 60,
    minStockLevel: 20,
    unit: 'Pièce',
    location: 'EPI Rayon 1',
    description: 'Gants enduits latex antidérapants.',
    createdAt: '2026-07-06T08:00:00Z',
    updatedAt: '2026-08-02T15:00:00Z'
  },
  {
    id: 'prod-012',
    name: 'Brique Creuse 15x20x40cm',
    sku: 'MAT-BRI-15',
    barcode: '370012345612',
    category: 'materiaux',
    buyingPrice: 350,
    sellingPrice: 480,
    stockQuantity: 450,
    minStockLevel: 100,
    unit: 'Pièce',
    location: 'Cour extérieure',
    description: 'Brique cuite pour murs porteurs et cloisonnement.',
    createdAt: '2026-07-07T08:00:00Z',
    updatedAt: '2026-08-04T12:00:00Z'
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-001',
    name: 'Entreprise Batiment & Renovation (M. Diallo)',
    phone: '+221 77 123 45 67',
    email: 'contact@batreno.sn',
    type: 'company',
    address: 'Zone Industrielle Lot 12, Dakar',
    outstandingBalance: 45000, // Client owes 45000
    totalPurchases: 480000,
    createdAt: '2026-06-15T08:00:00Z'
  },
  {
    id: 'cli-002',
    name: 'Maître Artisan Moussa (Plombier)',
    phone: '+221 70 987 65 43',
    email: 'moussa.plomberie@gmail.com',
    type: 'contractor',
    address: 'Avenue de la République',
    outstandingBalance: 12000,
    totalPurchases: 195000,
    createdAt: '2026-06-20T08:00:00Z'
  },
  {
    id: 'cli-003',
    name: 'Madame Aminata Sow',
    phone: '+221 76 555 12 34',
    type: 'particular',
    address: 'Quartier Liberté 5',
    outstandingBalance: 0,
    totalPurchases: 68500,
    createdAt: '2026-07-01T08:00:00Z'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-001',
    name: 'Ibrahima Ndiaye',
    role: 'Gérant Principal',
    monthlySalary: 250000,
    phone: '+221 77 333 11 22',
    email: 'ibrahima@quincaillerie-vie-nouvelle.com',
    hireDate: '2025-01-10',
    active: true
  },
  {
    id: 'emp-002',
    name: 'Fatou Kane',
    role: 'Caissière',
    monthlySalary: 160000,
    phone: '+221 77 444 22 33',
    email: 'fatou@quincaillerie-vie-nouvelle.com',
    hireDate: '2025-03-01',
    active: true
  },
  {
    id: 'emp-003',
    name: 'Cheikh Sarr',
    role: 'Magasinier & Responsable Stock',
    monthlySalary: 150000,
    phone: '+221 77 555 33 44',
    hireDate: '2025-05-15',
    active: true
  }
];

export const INITIAL_SALARY_PAYMENTS: SalaryPayment[] = [
  {
    id: 'sal-001',
    code: 'SAL-2026-001',
    employeeId: 'emp-001',
    employeeName: 'Ibrahima Ndiaye',
    date: '2026-07-30',
    periodMonth: '2026-07',
    amount: 250000,
    paymentType: 'full_salary',
    paymentMethod: 'cash',
    notes: 'Salaire complet Juillet 2026'
  },
  {
    id: 'sal-002',
    code: 'SAL-2026-002',
    employeeId: 'emp-002',
    employeeName: 'Fatou Kane',
    date: '2026-07-30',
    periodMonth: '2026-07',
    amount: 160000,
    paymentType: 'full_salary',
    paymentMethod: 'mobile_money',
    notes: 'Virement Wave Juillet 2026'
  },
  {
    id: 'sal-003',
    code: 'SAL-2026-003',
    employeeId: 'emp-003',
    employeeName: 'Cheikh Sarr',
    date: '2026-08-02',
    periodMonth: '2026-08',
    amount: 50000,
    paymentType: 'advance',
    paymentMethod: 'cash',
    notes: 'Avance sur salaire Août 2026'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-001',
    date: '2026-08-01',
    title: 'Loyer Magasin Principal (Mois d\'Août)',
    category: 'rent',
    amount: 180000,
    paymentMethod: 'cash',
    notes: 'Bail commercial quincaillerie'
  },
  {
    id: 'exp-002',
    date: '2026-08-03',
    title: 'Facture Électricité Senelec',
    category: 'utilities',
    amount: 32500,
    paymentMethod: 'mobile_money',
    notes: 'Éclairage magasin et enseigne lumineuse'
  },
  {
    id: 'exp-003',
    date: '2026-08-04',
    title: 'Frais de Transport & Déchargement Ciment',
    category: 'transport',
    amount: 25000,
    paymentMethod: 'cash',
    notes: 'Livraison camion 120 sacs de ciment'
  }
];

export const INITIAL_SALES: Sale[] = [
  {
    id: 'sale-001',
    code: 'VTE-2026-001',
    date: '2026-08-05T10:30:00Z',
    clientId: 'cli-001',
    clientName: 'Entreprise Batiment & Renovation (M. Diallo)',
    items: [
      {
        productId: 'prod-001',
        productName: 'Ciment Portland 50kg CPJ 45',
        unit: 'Sac',
        quantity: 20,
        unitPrice: 5000,
        unitCost: 4200,
        total: 100000
      },
      {
        productId: 'prod-006',
        productName: 'Câble Électrique TH 2.5mm² (Rouleau 100m)',
        unit: 'Rouleau',
        quantity: 2,
        unitPrice: 19000,
        unitCost: 14500,
        total: 38000
      }
    ],
    subtotal: 138000,
    discount: 3000,
    finalAmount: 135000,
    paymentMethod: 'credit',
    status: 'partial',
    paidAmount: 90000,
    notes: 'Acompte versé 90,000. Reste 45,000 en crédit.',
    servedBy: 'Fatou Kane'
  },
  {
    id: 'sale-002',
    code: 'VTE-2026-002',
    date: '2026-08-06T09:15:00Z',
    clientName: 'Client Comptant',
    items: [
      {
        productId: 'prod-003',
        productName: 'Marteau de Charpentier 500g Manche Fibre',
        unit: 'Pièce',
        quantity: 1,
        unitPrice: 4500,
        unitCost: 3200,
        total: 4500
      },
      {
        productId: 'prod-009',
        productName: 'Boîte de Vis à Bois Inox 4x40 (500 pcs)',
        unit: 'Boîte',
        quantity: 2,
        unitPrice: 3200,
        unitCost: 2200,
        total: 6400
      }
    ],
    subtotal: 10900,
    discount: 0,
    finalAmount: 10900,
    paymentMethod: 'cash',
    status: 'paid',
    paidAmount: 10900,
    notes: 'Achat rapide au comptoir',
    servedBy: 'Ibrahima Ndiaye'
  }
];

export const INITIAL_PURCHASES: Purchase[] = [
  {
    id: 'pur-001',
    code: 'ACH-2026-001',
    date: '2026-08-01T14:00:00Z',
    supplierName: 'Sococim Cimenterie Nationale',
    supplierPhone: '+221 33 800 00 00',
    invoiceNumber: 'FAC-SOC-9821',
    items: [
      {
        productId: 'prod-001',
        productName: 'Ciment Portland 50kg CPJ 45',
        unit: 'Sac',
        quantity: 100,
        unitBuyingPrice: 4200,
        total: 420000
      }
    ],
    totalAmount: 420000,
    paymentStatus: 'paid',
    paidAmount: 420000,
    notes: 'Livraison directe au dépôt Quincaillerie Vie Nouvelle'
  }
];

export const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [
  {
    id: 'mov-001',
    productId: 'prod-001',
    productName: 'Ciment Portland 50kg CPJ 45',
    type: 'purchase',
    quantity: 100,
    previousStock: 40,
    newStock: 140,
    date: '2026-08-01T14:00:00Z',
    reference: 'ACH-2026-001',
    notes: 'Réapprovisionnement Sococim'
  },
  {
    id: 'mov-002',
    productId: 'prod-001',
    productName: 'Ciment Portland 50kg CPJ 45',
    type: 'sale',
    quantity: -20,
    previousStock: 140,
    newStock: 120,
    date: '2026-08-05T10:30:00Z',
    reference: 'VTE-2026-001',
    notes: 'Vente à Ent. Batiment & Renovation'
  }
];
