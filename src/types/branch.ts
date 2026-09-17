export type BranchType =
  | "Retail Store"
  | "Flagship Store"
  | "Service Center"
  | "Warehouse"
  | "Distribution Hub";

export type BranchStatus = "ACTIVE" | "INACTIVE";

export interface Branch {
  id: string;
  _id?: string;
  name: string;
  code: string;
  location: string;
  address: string;
  type: BranchType | string;
  manager: string;
  managerPhone?: string;
  managerEmail?: string;
  phone: string;
  email: string;
  users: number;
  assignedUsers?: string[];
  status: BranchStatus;
  isMainBranch?: boolean;
  openingHours?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FilterParams {
  search: string;
  status: string;
  type: string;
  location: string;
}

export interface BranchStatsData {
  totalBranches: number;
  activeBranches: number;
  inactiveBranches: number;
  assignedUsers: number;
}

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: "br-001",
    name: "Dhaka Multiplan Center Branch",
    code: "BR-DHK-01",
    location: "Dhaka",
    address: "Shop 412, Level 4, Multiplan Center, New Elephant Road, Dhaka-1205",
    type: "Retail Store",
    manager: "Md. Tanvir Ahmed",
    managerPhone: "01711-223344",
    managerEmail: "tanvir@techbasket.com",
    phone: "01711-223344",
    email: "multiplan@techbasket.com",
    users: 6,
    assignedUsers: ["Tanvir Ahmed", "Shakil Hossain", "Mehedi Hasan", "Nafis Fuad", "Ripon Roy", "Sabbir Ahmed"],
    status: "ACTIVE",
    isMainBranch: true,
    openingHours: "10:00 AM - 08:30 PM",
    createdAt: "2025-01-10",
  },
  {
    id: "br-002",
    name: "IDB Bhaban Agargaon Branch",
    code: "BR-DHK-02",
    location: "Dhaka",
    address: "Shop 18, Ground Floor, BCS Computer City (IDB), Agargaon, Dhaka-1207",
    type: "Retail Store",
    manager: "Ashikur Rahman",
    managerPhone: "01819-334455",
    managerEmail: "ashikur@techbasket.com",
    phone: "01819-334455",
    email: "idb@techbasket.com",
    users: 5,
    assignedUsers: ["Ashikur Rahman", "Tareq Mahmud", "Kamran Ali", "Zahid Hasan", "Biplob Sen"],
    status: "ACTIVE",
    openingHours: "10:00 AM - 08:00 PM",
    createdAt: "2025-01-22",
  },
  {
    id: "br-003",
    name: "Uttara Tech Hub & Service Center",
    code: "BR-UTR-01",
    location: "Uttara",
    address: "House 12, Road 7, Sector 3, Uttara, Dhaka-1230",
    type: "Service Center",
    manager: "Kamrul Hasan",
    managerPhone: "01912-445566",
    managerEmail: "kamrul@techbasket.com",
    phone: "01912-445566",
    email: "uttara@techbasket.com",
    users: 4,
    assignedUsers: ["Kamrul Hasan", "Farhan Labib", "Fahim Shahriar", "Milon Mia"],
    status: "ACTIVE",
    openingHours: "09:30 AM - 07:30 PM",
    createdAt: "2025-02-05",
  },
  {
    id: "br-004",
    name: "Chattogram Agrabad Branch",
    code: "BR-CTG-01",
    location: "Chattogram",
    address: "C&F Tower, 122 Sheikh Mujib Road, Agrabad C/A, Chattogram",
    type: "Retail Store",
    manager: "Jashim Uddin",
    managerPhone: "01611-556677",
    managerEmail: "jashim@techbasket.com",
    phone: "01611-556677",
    email: "chattogram@techbasket.com",
    users: 3,
    assignedUsers: ["Jashim Uddin", "Nurul Huda", "Saiful Islam"],
    status: "ACTIVE",
    openingHours: "10:00 AM - 08:00 PM",
    createdAt: "2025-02-18",
  },
  {
    id: "br-005",
    name: "Sylhet Zindabazar Branch",
    code: "BR-SYL-01",
    location: "Sylhet",
    address: "Level 3, Al-Hamra Shopping City, Zindabazar, Sylhet",
    type: "Retail Store",
    manager: "Tanvir Chowdhury",
    managerPhone: "01722-667788",
    managerEmail: "tanvir.syl@techbasket.com",
    phone: "01722-667788",
    email: "sylhet@techbasket.com",
    users: 2,
    assignedUsers: ["Tanvir Chowdhury", "Masum Billah"],
    status: "ACTIVE",
    openingHours: "10:00 AM - 08:00 PM",
    createdAt: "2025-03-01",
  },
  {
    id: "br-006",
    name: "Central Fulfillment Warehouse",
    code: "BR-GZP-01",
    location: "Gazipur",
    address: "Plot 45, Vogra Bypass Road, Gazipur Industrial Area, Gazipur",
    type: "Warehouse",
    manager: "Md. Rafiqul Islam",
    managerPhone: "01822-778899",
    managerEmail: "rafiq.warehouse@techbasket.com",
    phone: "01822-778899",
    email: "warehouse@techbasket.com",
    users: 8,
    assignedUsers: [
      "Md. Rafiqul Islam",
      "Hasan Mahmud",
      "Akhtar Hossain",
      "Sojib Kanti",
      "Sharif Ahmed",
      "Al-Amin",
      "Delwar Hossain",
      "Rony Sarker"
    ],
    status: "ACTIVE",
    openingHours: "08:00 AM - 09:00 PM",
    createdAt: "2025-01-05",
  },
  {
    id: "br-007",
    name: "Bogura Satellite Store",
    code: "BR-BOG-01",
    location: "Bogura",
    address: "Jaleshwaritola Main Road, Bogura-5800",
    type: "Retail Store",
    manager: "Not Assigned",
    phone: "01511-889900",
    email: "bogura@techbasket.com",
    users: 0,
    assignedUsers: [],
    status: "INACTIVE",
    openingHours: "10:00 AM - 07:00 PM",
    createdAt: "2025-03-12",
  },
];