export type SupplierType =
  | "Distributor"
  | "Importer"
  | "Wholesaler"
  | "Manufacturer"
  | "Local Vendor";

export type PaymentTerm =
  | "Cash on Delivery"
  | "Net 15"
  | "Net 30"
  | "Net 60";

export type SupplierStatus = "Active" | "Inactive" | "On Hold";

export interface SupplierPurchaseRecord {
  id: string;
  invoiceNo: string;
  date: string;
  itemsCount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: "Paid" | "Partial" | "Unpaid";
}

export interface SupplierLedgerEntry {
  id: string;
  date: string;
  referenceNo: string;
  type: "Purchase" | "Payment" | "Return" | "Opening Balance";
  debit: number;
  credit: number;
  balance: number;
}

export interface SupplierRMAItem {
  id: string;
  rmaNo: string;
  date: string;
  productName: string;
  serialNo: string;
  issue: string;
  status: "Pending Supplier" | "Replaced" | "Credit Issued" | "Rejected";
}

export interface Supplier {
  id: string;
  _id?: string;
  supplierCode: string;
  name: string;
  companyName: string;
  type: SupplierType;
  tradeLicense?: string;
  binNumber?: string;
  
  // Contact
  contactPerson: string;
  designation: string;
  phone: string;
  alternatePhone?: string;
  email: string;
  address: string;
  city: string;
  
  // Financials
  paymentTerms: PaymentTerm;
  creditLimit: number;
  currentBalance: number; // Positive = Due/Payable to supplier
  totalPurchased: number;
  totalOrders: number;
  
  // Bank Details
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  branchName?: string;
  bkashNumber?: string;

  // Brands & Operational
  brands?: string[];
  status: SupplierStatus;
  rating: number; // 1 to 5
  pendingRmaCount: number;
  
  createdAt: string;
  
  // Related records for 360 view
  purchases?: SupplierPurchaseRecord[];
  ledger?: SupplierLedgerEntry[];
  rmaItems?: SupplierRMAItem[];
}

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: "sup-1",
    supplierCode: "SUP-00101",
    name: "Smart Technologies BD Ltd.",
    companyName: "Smart Technologies (BD) Ltd.",
    type: "Distributor",
    tradeLicense: "TR-DHK-2024-8841",
    binNumber: "002345891-0101",
    contactPerson: "Md. Rafiqul Islam",
    designation: "Key Account Manager",
    phone: "01711-445566",
    alternatePhone: "01819-223344",
    email: "rafiq@smart-bd.com",
    address: "Jahangir Tower, 10 Kawran Bazar C/A",
    city: "Dhaka",
    paymentTerms: "Net 30",
    creditLimit: 2500000,
    currentBalance: 420000,
    totalPurchased: 12450000,
    totalOrders: 34,
    bankName: "City Bank PLC",
    accountNumber: "1102948291001",
    routingNumber: "22527189",
    branchName: "Kawran Bazar Branch",
    bkashNumber: "01711-445566",
    brands: ["HP", "Lenovo", "Dell", "Acer", "Intel"],
    status: "Active",
    rating: 4.8,
    pendingRmaCount: 3,
    createdAt: "2025-01-15",
    purchases: [
      {
        id: "po-101",
        invoiceNo: "INV-ST-2026-041",
        date: "2026-03-10",
        itemsCount: 15,
        totalAmount: 450000,
        paidAmount: 300000,
        dueAmount: 150000,
        status: "Partial",
      },
      {
        id: "po-102",
        invoiceNo: "INV-ST-2026-018",
        date: "2026-02-22",
        itemsCount: 8,
        totalAmount: 270000,
        paidAmount: 0,
        dueAmount: 270000,
        status: "Unpaid",
      },
      {
        id: "po-103",
        invoiceNo: "INV-ST-2026-003",
        date: "2026-01-12",
        itemsCount: 22,
        totalAmount: 680000,
        paidAmount: 680000,
        dueAmount: 0,
        status: "Paid",
      },
    ],
    ledger: [
      {
        id: "led-1",
        date: "2026-01-01",
        referenceNo: "OB-2026",
        type: "Opening Balance",
        debit: 0,
        credit: 0,
        balance: 0,
      },
      {
        id: "led-2",
        date: "2026-01-12",
        referenceNo: "INV-ST-2026-003",
        type: "Purchase",
        debit: 0,
        credit: 680000,
        balance: 680000,
      },
      {
        id: "led-3",
        date: "2026-01-20",
        referenceNo: "PAY-2026-092",
        type: "Payment",
        debit: 680000,
        credit: 0,
        balance: 0,
      },
      {
        id: "led-4",
        date: "2026-02-22",
        referenceNo: "INV-ST-2026-018",
        type: "Purchase",
        debit: 0,
        credit: 270000,
        balance: 270000,
      },
      {
        id: "led-5",
        date: "2026-03-10",
        referenceNo: "INV-ST-2026-041",
        type: "Purchase",
        debit: 0,
        credit: 450000,
        balance: 720000,
      },
      {
        id: "led-6",
        date: "2026-03-14",
        referenceNo: "PAY-2026-118",
        type: "Payment",
        debit: 300000,
        credit: 0,
        balance: 420000,
      },
    ],
    rmaItems: [
      {
        id: "rma-1",
        rmaNo: "RMA-2026-088",
        date: "2026-03-05",
        productName: "ThinkPad T14 Gen 3 Motherboard",
        serialNo: "SN-TP-884102",
        issue: "No display power",
        status: "Pending Supplier",
      },
      {
        id: "rma-2",
        rmaNo: "RMA-2026-072",
        date: "2026-02-28",
        productName: "Dell UltraSharp 27' Panel",
        serialNo: "SN-DL-192844",
        issue: "Dead pixels line",
        status: "Pending Supplier",
      },
    ],
  },
  {
    id: "sup-2",
    supplierCode: "SUP-00102",
    name: "Global Brand PLC",
    companyName: "Global Brand Private Limited",
    type: "Distributor",
    tradeLicense: "TR-DHK-2023-1120",
    binNumber: "001928481-0102",
    contactPerson: "Kamrul Hasan",
    designation: "Senior Corporate Sales Executive",
    phone: "01755-667788",
    email: "corporate@globalbrand.com.bd",
    address: "19/2 West Panthapath",
    city: "Dhaka",
    paymentTerms: "Net 15",
    creditLimit: 1800000,
    currentBalance: 185000,
    totalPurchased: 8920000,
    totalOrders: 28,
    bankName: "BRAC Bank PLC",
    accountNumber: "1501203948501",
    routingNumber: "06026194",
    branchName: "Panthapath Branch",
    brands: ["Asus", "LG", "Transcend", "A4Tech", "Rapoo"],
    status: "Active",
    rating: 4.6,
    pendingRmaCount: 1,
    createdAt: "2025-02-01",
    purchases: [
      {
        id: "po-201",
        invoiceNo: "GB-INV-992",
        date: "2026-03-02",
        itemsCount: 20,
        totalAmount: 185000,
        paidAmount: 0,
        dueAmount: 185000,
        status: "Unpaid",
      },
    ],
    ledger: [
      {
        id: "led-201",
        date: "2026-03-02",
        referenceNo: "GB-INV-992",
        type: "Purchase",
        debit: 0,
        credit: 185000,
        balance: 185000,
      },
    ],
    rmaItems: [
      {
        id: "rma-201",
        rmaNo: "RMA-2026-061",
        date: "2026-02-14",
        productName: "Asus TUF Gaming Router",
        serialNo: "SN-AS-550192",
        issue: "Firmware bootloop",
        status: "Pending Supplier",
      },
    ],
  },
  {
    id: "sup-3",
    supplierCode: "SUP-00103",
    name: "UCC Bangladesh Ltd.",
    companyName: "Unique Computer Corporation (UCC)",
    type: "Distributor",
    tradeLicense: "TR-DHK-2022-9014",
    binNumber: "004819284-0103",
    contactPerson: "Shahriar Kabir",
    designation: "Distribution Lead",
    phone: "01912-334455",
    email: "shahriar@ucc.com.bd",
    address: "Eastern Plus Shopping Complex, Shantinagar",
    city: "Dhaka",
    paymentTerms: "Net 30",
    creditLimit: 1500000,
    currentBalance: 0,
    totalPurchased: 6540000,
    totalOrders: 19,
    bankName: "Eastern Bank PLC",
    accountNumber: "104106029384",
    routingNumber: "09027142",
    branchName: "Shantinagar Branch",
    brands: ["MSI", "Sapphire", "Western Digital", "Thermaltake"],
    status: "Active",
    rating: 4.5,
    pendingRmaCount: 0,
    createdAt: "2025-03-10",
    purchases: [
      {
        id: "po-301",
        invoiceNo: "UCC-2026-114",
        date: "2026-02-18",
        itemsCount: 12,
        totalAmount: 310000,
        paidAmount: 310000,
        dueAmount: 0,
        status: "Paid",
      },
    ],
    ledger: [
      {
        id: "led-301",
        date: "2026-02-18",
        referenceNo: "UCC-2026-114",
        type: "Purchase",
        debit: 0,
        credit: 310000,
        balance: 310000,
      },
      {
        id: "led-302",
        date: "2026-02-25",
        referenceNo: "PAY-2026-099",
        type: "Payment",
        debit: 310000,
        credit: 0,
        balance: 0,
      },
    ],
    rmaItems: [],
  },
  {
    id: "sup-4",
    supplierCode: "SUP-00104",
    name: "Nexus Electronics & Hardware",
    companyName: "Nexus IT Solutions Enterprise",
    type: "Wholesaler",
    tradeLicense: "TR-SYL-2023-4019",
    contactPerson: "Tanvir Chowdhury",
    designation: "Proprietor",
    phone: "01844-556677",
    email: "nexus.sylhet@gmail.com",
    address: "Al-Hamra Shopping City, Zindabazar",
    city: "Sylhet",
    paymentTerms: "Cash on Delivery",
    creditLimit: 500000,
    currentBalance: 65000,
    totalPurchased: 2150000,
    totalOrders: 14,
    bankName: "Dutch-Bangla Bank PLC",
    accountNumber: "123105009841",
    routingNumber: "08026190",
    branchName: "Zindabazar Branch",
    bkashNumber: "01844-556677",
    brands: ["Logitech", "Rapoo", "TP-Link", "Fantech"],
    status: "Active",
    rating: 4.2,
    pendingRmaCount: 1,
    createdAt: "2025-05-18",
    purchases: [
      {
        id: "po-401",
        invoiceNo: "NEX-2026-012",
        date: "2026-03-08",
        itemsCount: 30,
        totalAmount: 65000,
        paidAmount: 0,
        dueAmount: 65000,
        status: "Unpaid",
      },
    ],
    ledger: [
      {
        id: "led-401",
        date: "2026-03-08",
        referenceNo: "NEX-2026-012",
        type: "Purchase",
        debit: 0,
        credit: 65000,
        balance: 65000,
      },
    ],
    rmaItems: [
      {
        id: "rma-401",
        rmaNo: "RMA-2026-049",
        date: "2026-02-20",
        productName: "Logitech MX Master 3S",
        serialNo: "SN-LOG-992140",
        issue: "Scroll wheel glitch",
        status: "Pending Supplier",
      },
    ],
  },
  {
    id: "sup-5",
    supplierCode: "SUP-00105",
    name: "Prime IT Systems CTG",
    companyName: "Prime Information Technology Ltd.",
    type: "Local Vendor",
    tradeLicense: "TR-CTG-2022-7712",
    contactPerson: "Jashim Uddin",
    designation: "Branch Coordinator",
    phone: "01611-998877",
    email: "jashim@primeit-ctg.com",
    address: "C&F Tower, Sheikh Mujib Road, Agrabad",
    city: "Chittagong",
    paymentTerms: "Net 15",
    creditLimit: 750000,
    currentBalance: 0,
    totalPurchased: 3400000,
    totalOrders: 16,
    bankName: "Islami Bank Bangladesh PLC",
    accountNumber: "205018294819",
    routingNumber: "12526189",
    branchName: "Agrabad Branch",
    brands: ["D-Link", "Cisco", "Hikvision", "MikroTik"],
    status: "Inactive",
    rating: 3.9,
    pendingRmaCount: 0,
    createdAt: "2025-06-22",
    purchases: [],
    ledger: [],
    rmaItems: [],
  },
];
