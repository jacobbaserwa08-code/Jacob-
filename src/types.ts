export type ProductType = 
  | 'outillage'
  | 'plomberie'
  | 'electricite'
  | 'peinture'
  | 'quincaillerie'
  | 'materiaux'
  | 'protection'
  | 'autres';

export interface ProductTypeInfo {
  id: ProductType;
  label: string;
  labelEn: string;
  iconName: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  category: ProductType;
  buyingPrice: number; // Prix d'achat / Cost
  sellingPrice: number; // Prix de vente / Price
  stockQuantity: number; // Quantity of stock remaining
  minStockLevel: number; // Seuil d'alerte stock
  unit: string; // Pièce, Mètre, Sac, Kg, Boîte, Litre, etc.
  location?: string; // Rayon / Étagère
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  total: number;
}

export type PaymentMethod = 'cash' | 'card' | 'mobile_money' | 'credit';
export type PaymentStatus = 'paid' | 'unpaid' | 'partial';

export interface Sale {
  id: string;
  code: string; // ex: VTE-2026-001
  date: string;
  clientId?: string;
  clientName: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  finalAmount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  paidAmount: number;
  notes?: string;
  servedBy?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  type: 'particular' | 'company' | 'contractor';
  address?: string;
  outstandingBalance: number; // Dette / Crédit accumulé
  totalPurchases: number;
  createdAt: string;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  unit: string;
  quantity: number;
  unitBuyingPrice: number;
  total: number;
}

export interface Purchase {
  id: string;
  code: string; // ex: ACH-2026-001
  date: string;
  supplierName: string;
  supplierPhone?: string;
  invoiceNumber?: string;
  items: PurchaseItem[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paidAmount: number;
  notes?: string;
}

export type ExpenseCategory = 
  | 'rent'
  | 'utilities'
  | 'transport'
  | 'maintenance'
  | 'supplies'
  | 'taxes'
  | 'other';

export interface Expense {
  id: string;
  date: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string; // Caissier, Vendeur, Magasinier, Gérant, etc.
  monthlySalary: number;
  phone: string;
  email?: string;
  hireDate: string;
  active: boolean;
}

export interface SalaryPayment {
  id: string;
  code: string; // ex: SAL-2026-001
  employeeId: string;
  employeeName: string;
  date: string;
  periodMonth: string; // ex: "2026-08" (Août 2026)
  amount: number;
  paymentType: 'full_salary' | 'advance' | 'bonus';
  paymentMethod: PaymentMethod;
  notes?: string;
}

export type MovementType = 'sale' | 'purchase' | 'adjustment_add' | 'adjustment_remove' | 'damage';

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  quantity: number; // positive or negative adjustment
  previousStock: number;
  newStock: number;
  date: string;
  reference?: string;
  notes?: string;
}

export type CurrencyCode = 'XOF' | 'USD' | 'EUR' | 'CDF';

export type ActiveTab = 
  | 'dashboard'
  | 'pos'
  | 'sales'
  | 'inventory'
  | 'purchasing'
  | 'clients'
  | 'costs'
  | 'salaries'
  | 'reports'
  | 'ai_assistant';
