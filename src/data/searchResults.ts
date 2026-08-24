import type { ResultSection, SearchTab, SearchTabConfig } from "@/types/search";

export const SEARCH_TABS: SearchTabConfig[] = [
  { key: "advance", label: "Advance Search" },
  { key: "rma", label: "RMA Search" },
  { key: "production", label: "Production Search" },
];

const ADVANCE_RESULTS: ResultSection[] = [
  {
    title: "Import Product",
    columns: ["Import Product Inv", "Date", "Product Title", "Serial", "Importer Name"],
    rows: [
      ["IMP-2026-001", "15 Jan 26", "Apple iPhone 15 Pro Max 256GB Natural Titanium Unlocked", "SN-10001-XXXXX-YYYYY", "Rahim Uddin"],
      ["IMP-2026-002", "20 Feb 26", "Samsung Galaxy S24 Ultra 512GB Titanium Black 5G", "SN-10002", "Karim Ahmed"],
    ],
  },
  {
    title: "Purchase",
    columns: ["Purchase Inv", "Date", "Product Title", "Serial", "Supplier Name"],
    rows: [
      ["PUR-2026-001", "10 Mar 26", "Apple MacBook Air 15-inch M3 Chip 16GB RAM 512GB SSD Midnight", "SN-20001-ABCD-EFGH", "Tech Distributors Ltd"],
      ["PUR-2026-002", "05 Apr 26", "Dell XPS 15 9530 Intel Core i9 32GB 1TB OLED", "SN-20002", "Global IT Supply"],
    ],
  },
  {
    title: "Customer",
    columns: ["Customer Inv", "Date", "Product Title", "Serial", "Warranty Days"],
    rows: [
      ["CUS-2026-001", "12 May 26", "Apple iPad Air M2 11-inch Wi-Fi 256GB Space Gray", "SN-30001", "365"],
      ["CUS-2026-002", "18 Jun 26", "HP Pavilion 15-eg3000TU Intel Core i7 16GB 512GB", "SN-30002-QRST-UVWX", "730"],
    ],
  },
  {
    title: "Sales Return",
    columns: ["Sales Return Inv", "Date", "Product Title", "Serial", "Reason"],
    rows: [
      ["RET-2026-001", "01 Jul 26", "Lenovo ThinkPad X1 Carbon Gen 11 14-inch i7 32GB", "SN-40001", "Screen defect"],
      ["RET-2026-002", "15 Jul 26", "ASUS ROG Strix SCAR 18 G834JY RTX 4090 32GB", "SN-40002-LMNOP", "Battery issue"],
    ],
  },
];

const RMA_RESULTS: ResultSection[] = [
  {
    title: "Import Product",
    columns: ["Import Product Inv", "Date", "Product Title", "Serial", "Importer Name"],
    rows: [
      ["IMP-2026-010", "20 Jan 26", "Apple iPhone 14 128GB Blue International Warranty", "SN-50001-ZZZZZ", "Sakib Hasan"],
    ],
  },
  {
    title: "Purchase",
    columns: ["Purchase Inv", "Date", "Product Title", "Serial", "Supplier Name"],
    rows: [
      ["PUR-2026-010", "25 Feb 26", "Sony WH-1000XM5 Wireless Noise Cancelling Headphones Black", "SN-60001", "Audio Tech BD"],
    ],
  },
  {
    title: "Customer",
    columns: ["Customer Inv", "Date", "Product Title", "Serial", "Warranty Days"],
    rows: [
      ["CUS-2026-010", "30 Mar 26", "Google Pixel 8 Pro 128GB Bay Blue Unlocked", "SN-70001-HIJKL", "180"],
    ],
  },
  {
    title: "Complain Received",
    columns: ["Complain Received Inv", "Date", "Product Title", "Serial", "Product Problem/Remarks"],
    rows: [
      ["CMP-2026-001", "10 Apr 26", "OnePlus 12 5G 256GB Flowy Emerald", "SN-80001", "Display flickering issue observed during low brightness"],
      ["CMP-2026-002", "22 May 26", "Xiaomi 14 Ultra Leica Summilux 512GB White", "SN-80002-MNOPQ", "Charging port not working intermittently"],
    ],
  },
  {
    title: "Delivery Info",
    columns: ["Delivery Inv", "Date", "Product Title", "Old Serial", "New Serial"],
    rows: [
      ["DLV-2026-001", "01 May 26", "OnePlus 12 5G 256GB Flowy Emerald", "SN-80001", "SN-80101-RSTUV"],
    ],
  },
  {
    title: "Replacement Out to Supplier",
    columns: ["Replacement Out Inv", "Date", "Product Title", "Serial", "Supplier Name"],
    rows: [
      ["RPO-2026-001", "05 May 26", "OnePlus 12 5G 256GB Flowy Emerald", "SN-80001", "OnePlus Service BD Authorized Center"],
    ],
  },
  {
    title: "Replacement In",
    columns: ["Replacement In Inv", "Date", "Product Title", "Old SN", "New SN"],
    rows: [
      ["RPI-2026-001", "15 May 26", "OnePlus 12 5G 256GB Flowy Emerald", "SN-80001", "SN-80201-WXYZA"],
    ],
  },
];

const PRODUCTION_RESULTS: ResultSection[] = [
  {
    title: "Import Product",
    columns: ["Import Product Inv", "Date", "Product Title", "Serial", "Importer Name", "Country", "Quantity"],
    rows: [
      ["IMP-2026-020", "10 Jan 26", "Apple iPhone 15 128GB Pink 5G Global Version", "SN-90001-BCDEF", "Nabil Imports International", "USA", "50"],
      ["IMP-2026-021", "14 Feb 26", "Samsung Galaxy Watch 6 Classic 47mm Bluetooth Black", "SN-90002", "Trade Corp Asia Pacific", "Korea", "120"],
    ],
  },
  {
    title: "International Warranty",
    columns: ["Warranty Inv", "Date", "Product Title", "Serial", "Warranty Provider", "Expiry Date", "Status"],
    rows: [
      ["WRN-2026-001", "01 Mar 26", "Apple iPhone 15 128GB Pink 5G Global Version", "SN-90001-BCDEF", "Apple Global Warranty Services", "01 Mar 27", "Active"],
      ["WRN-2026-002", "20 Apr 26", "Samsung Galaxy Watch 6 Classic 47mm Bluetooth Black", "SN-90002", "Samsung International Warranty", "20 Apr 27", "Active"],
    ],
  },
];

export const RESULTS_MAP: Record<SearchTab, ResultSection[]> = {
  advance: ADVANCE_RESULTS,
  rma: RMA_RESULTS,
  production: PRODUCTION_RESULTS,
};
