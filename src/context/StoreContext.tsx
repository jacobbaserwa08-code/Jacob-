import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Sale,
  Purchase,
  Client,
  Expense,
  Employee,
  SalaryPayment,
  StockMovement,
  CurrencyCode,
  ActiveTab,
  SaleItem,
  PurchaseItem,
  MovementType
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_SALES,
  INITIAL_PURCHASES,
  INITIAL_CLIENTS,
  INITIAL_EXPENSES,
  INITIAL_EMPLOYEES,
  INITIAL_SALARY_PAYMENTS,
  INITIAL_STOCK_MOVEMENTS
} from '../data/initialData';
import { generateCode } from '../utils/formatters';

interface StoreContextType {
  products: Product[];
  sales: Sale[];
  purchases: Purchase[];
  clients: Client[];
  expenses: Expense[];
  employees: Employee[];
  salaryPayments: SalaryPayment[];
  stockMovements: StockMovement[];
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (productId: string, quantity: number, type: MovementType, notes?: string) => void;
  
  // Sale actions
  recordSale: (saleData: {
    clientId?: string;
    clientName: string;
    items: SaleItem[];
    discount: number;
    paymentMethod: any;
    paidAmount: number;
    notes?: string;
    servedBy?: string;
  }) => Sale;
  
  // Client actions
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'outstandingBalance' | 'totalPurchases'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  recordClientPayment: (clientId: string, amount: number, notes?: string) => void;
  
  // Purchase actions
  recordPurchase: (purchaseData: {
    supplierName: string;
    supplierPhone?: string;
    invoiceNumber?: string;
    items: PurchaseItem[];
    paidAmount: number;
    notes?: string;
  }) => void;
  
  // Expense actions
  recordExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  
  // Employee & Salary actions
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  recordSalaryPayment: (payment: Omit<SalaryPayment, 'id' | 'code'>) => void;
  
  // Global actions
  resetToDemoData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
  
  // Selected printable receipt state
  currentReceiptSale: Sale | null;
  setCurrentReceiptSale: (sale: Sale | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'quincaillerie_vn_products_v1',
  SALES: 'quincaillerie_vn_sales_v1',
  PURCHASES: 'quincaillerie_vn_purchases_v1',
  CLIENTS: 'quincaillerie_vn_clients_v1',
  EXPENSES: 'quincaillerie_vn_expenses_v1',
  EMPLOYEES: 'quincaillerie_vn_employees_v1',
  SALARY_PAYMENTS: 'quincaillerie_vn_salary_payments_v1',
  STOCK_MOVEMENTS: 'quincaillerie_vn_stock_movements_v1',
  CURRENCY: 'quincaillerie_vn_currency_v1'
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    return (localStorage.getItem(STORAGE_KEYS.CURRENCY) as CurrencyCode) || 'XOF';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currentReceiptSale, setCurrentReceiptSale] = useState<Sale | null>(null);

  // Lazy load state from localStorage or initialData
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SALES);
    return saved ? JSON.parse(saved) : INITIAL_SALES;
  });

  const [purchases, setPurchases] = useState<Purchase[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PURCHASES);
    return saved ? JSON.parse(saved) : INITIAL_PURCHASES;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [salaryPayments, setSalaryPayments] = useState<SalaryPayment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SALARY_PAYMENTS);
    return saved ? JSON.parse(saved) : INITIAL_SALARY_PAYMENTS;
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STOCK_MOVEMENTS);
    return saved ? JSON.parse(saved) : INITIAL_STOCK_MOVEMENTS;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALARY_PAYMENTS, JSON.stringify(salaryPayments));
  }, [salaryPayments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STOCK_MOVEMENTS, JSON.stringify(stockMovements));
  }, [stockMovements]);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem(STORAGE_KEYS.CURRENCY, c);
  };

  // Product Actions
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    setProducts((prev) => [newProduct, ...prev]);

    // Initial stock movement
    if (newProduct.stockQuantity > 0) {
      const mov: StockMovement = {
        id: `mov-${Date.now()}`,
        productId: newProduct.id,
        productName: newProduct.name,
        type: 'adjustment_add',
        quantity: newProduct.stockQuantity,
        previousStock: 0,
        newStock: newProduct.stockQuantity,
        date: now,
        notes: 'Stock initial de création'
      };
      setStockMovements((prev) => [mov, ...prev]);
    }
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    const now = new Date().toISOString();
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...productData, updatedAt: now } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const adjustStock = (productId: string, quantity: number, type: MovementType, notes?: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const previousStock = product.stockQuantity;
    let newStock = previousStock;

    if (type === 'adjustment_add' || type === 'purchase') {
      newStock = previousStock + Math.abs(quantity);
    } else {
      newStock = Math.max(0, previousStock - Math.abs(quantity));
    }

    const now = new Date().toISOString();

    updateProduct(productId, { stockQuantity: newStock });

    const mov: StockMovement = {
      id: `mov-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      type,
      quantity: type === 'adjustment_add' || type === 'purchase' ? Math.abs(quantity) : -Math.abs(quantity),
      previousStock,
      newStock,
      date: now,
      notes: notes || 'Ajustement manuel de stock'
    };

    setStockMovements((prev) => [mov, ...prev]);
  };

  // Record Sale (Checkout)
  const recordSale = (saleData: {
    clientId?: string;
    clientName: string;
    items: SaleItem[];
    discount: number;
    paymentMethod: any;
    paidAmount: number;
    notes?: string;
    servedBy?: string;
  }): Sale => {
    const now = new Date().toISOString();
    const subtotal = saleData.items.reduce((acc, item) => acc + item.total, 0);
    const finalAmount = Math.max(0, subtotal - (saleData.discount || 0));

    let status: 'paid' | 'unpaid' | 'partial' = 'paid';
    if (saleData.paidAmount <= 0) {
      status = 'unpaid';
    } else if (saleData.paidAmount < finalAmount) {
      status = 'partial';
    }

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      code: generateCode('VTE'),
      date: now,
      clientId: saleData.clientId,
      clientName: saleData.clientName || 'Client Comptant',
      items: saleData.items,
      subtotal,
      discount: saleData.discount || 0,
      finalAmount,
      paymentMethod: saleData.paymentMethod,
      status,
      paidAmount: saleData.paidAmount,
      notes: saleData.notes,
      servedBy: saleData.servedBy || 'Vendeur'
    };

    // 1. Save Sale
    setSales((prev) => [newSale, ...prev]);

    // 2. Decrement stock for each item & log stock movement
    saleData.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        const previousStock = prod.stockQuantity;
        const newStock = Math.max(0, previousStock - item.quantity);
        
        // Update product stock
        setProducts((prev) =>
          prev.map((p) =>
            p.id === item.productId ? { ...p, stockQuantity: newStock, updatedAt: now } : p
          )
        );

        // Movement
        const mov: StockMovement = {
          id: `mov-${Date.now()}-${item.productId}`,
          productId: item.productId,
          productName: item.productName,
          type: 'sale',
          quantity: -item.quantity,
          previousStock,
          newStock,
          date: now,
          reference: newSale.code,
          notes: `Vente ${newSale.code} à ${newSale.clientName}`
        };
        setStockMovements((prev) => [mov, ...prev]);
      }
    });

    // 3. Update Client balance if credit or client sale
    const unpaidPart = Math.max(0, finalAmount - saleData.paidAmount);
    if (saleData.clientId) {
      setClients((prev) =>
        prev.map((c) => {
          if (c.id === saleData.clientId) {
            return {
              ...c,
              totalPurchases: c.totalPurchases + finalAmount,
              outstandingBalance: c.outstandingBalance + unpaidPart
            };
          }
          return c;
        })
      );
    }

    return newSale;
  };

  // Client Actions
  const addClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'outstandingBalance' | 'totalPurchases'>) => {
    const newClient: Client = {
      ...clientData,
      id: `cli-${Date.now()}`,
      outstandingBalance: 0,
      totalPurchases: 0,
      createdAt: new Date().toISOString()
    };
    setClients((prev) => [newClient, ...prev]);
  };

  const updateClient = (id: string, clientData: Partial<Client>) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...clientData } : c)));
  };

  const recordClientPayment = (clientId: string, amount: number, notes?: string) => {
    if (amount <= 0) return;
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          const newBalance = Math.max(0, c.outstandingBalance - amount);
          return { ...c, outstandingBalance: newBalance };
        }
        return c;
      })
    );
  };

  // Purchase Actions
  const recordPurchase = (purchaseData: {
    supplierName: string;
    supplierPhone?: string;
    invoiceNumber?: string;
    items: PurchaseItem[];
    paidAmount: number;
    notes?: string;
  }) => {
    const now = new Date().toISOString();
    const totalAmount = purchaseData.items.reduce((acc, item) => acc + item.total, 0);

    let paymentStatus: 'paid' | 'unpaid' | 'partial' = 'paid';
    if (purchaseData.paidAmount <= 0) {
      paymentStatus = 'unpaid';
    } else if (purchaseData.paidAmount < totalAmount) {
      paymentStatus = 'partial';
    }

    const newPurchase: Purchase = {
      id: `pur-${Date.now()}`,
      code: generateCode('ACH'),
      date: now,
      supplierName: purchaseData.supplierName,
      supplierPhone: purchaseData.supplierPhone,
      invoiceNumber: purchaseData.invoiceNumber,
      items: purchaseData.items,
      totalAmount,
      paymentStatus,
      paidAmount: purchaseData.paidAmount,
      notes: purchaseData.notes
    };

    setPurchases((prev) => [newPurchase, ...prev]);

    // Increment Stock and log stock movement
    purchaseData.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        const previousStock = prod.stockQuantity;
        const newStock = previousStock + item.quantity;

        // Update product stock & cost price if provided
        setProducts((prev) =>
          prev.map((p) =>
            p.id === item.productId
              ? {
                  ...p,
                  stockQuantity: newStock,
                  buyingPrice: item.unitBuyingPrice || p.buyingPrice,
                  updatedAt: now
                }
              : p
          )
        );

        // Movement
        const mov: StockMovement = {
          id: `mov-${Date.now()}-${item.productId}`,
          productId: item.productId,
          productName: item.productName,
          type: 'purchase',
          quantity: item.quantity,
          previousStock,
          newStock,
          date: now,
          reference: newPurchase.code,
          notes: `Achat auprès de ${newPurchase.supplierName}`
        };
        setStockMovements((prev) => [mov, ...prev]);
      }
    });
  };

  // Expense Actions
  const recordExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`
    };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Employee & Salary Actions
  const addEmployee = (employeeData: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: `emp-${Date.now()}`
    };
    setEmployees((prev) => [newEmployee, ...prev]);
  };

  const updateEmployee = (id: string, employeeData: Partial<Employee>) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...employeeData } : e)));
  };

  const recordSalaryPayment = (paymentData: Omit<SalaryPayment, 'id' | 'code'>) => {
    const newPayment: SalaryPayment = {
      ...paymentData,
      id: `sal-${Date.now()}`,
      code: generateCode('SAL')
    };
    setSalaryPayments((prev) => [newPayment, ...prev]);
  };

  // Global Actions
  const resetToDemoData = () => {
    if (window.confirm('Voulez-vous réinitialiser toutes les données aux valeurs de démonstration ?')) {
      setProducts(INITIAL_PRODUCTS);
      setSales(INITIAL_SALES);
      setPurchases(INITIAL_PURCHASES);
      setClients(INITIAL_CLIENTS);
      setExpenses(INITIAL_EXPENSES);
      setEmployees(INITIAL_EMPLOYEES);
      setSalaryPayments(INITIAL_SALARY_PAYMENTS);
      setStockMovements(INITIAL_STOCK_MOVEMENTS);
      localStorage.clear();
    }
  };

  const exportDataJSON = (): string => {
    const backup = {
      products,
      sales,
      purchases,
      clients,
      expenses,
      employees,
      salaryPayments,
      stockMovements,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(backup, null, 2);
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.products && Array.isArray(data.products)) setProducts(data.products);
      if (data.sales && Array.isArray(data.sales)) setSales(data.sales);
      if (data.purchases && Array.isArray(data.purchases)) setPurchases(data.purchases);
      if (data.clients && Array.isArray(data.clients)) setClients(data.clients);
      if (data.expenses && Array.isArray(data.expenses)) setExpenses(data.expenses);
      if (data.employees && Array.isArray(data.employees)) setEmployees(data.employees);
      if (data.salaryPayments && Array.isArray(data.salaryPayments)) setSalaryPayments(data.salaryPayments);
      if (data.stockMovements && Array.isArray(data.stockMovements)) setStockMovements(data.stockMovements);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        sales,
        purchases,
        clients,
        expenses,
        employees,
        salaryPayments,
        stockMovements,
        currency,
        setCurrency,
        activeTab,
        setActiveTab,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        recordSale,
        addClient,
        updateClient,
        recordClientPayment,
        recordPurchase,
        recordExpense,
        deleteExpense,
        addEmployee,
        updateEmployee,
        recordSalaryPayment,
        resetToDemoData,
        exportDataJSON,
        importDataJSON,
        currentReceiptSale,
        setCurrentReceiptSale
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
