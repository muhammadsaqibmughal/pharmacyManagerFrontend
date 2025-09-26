import { FaPills, FaSyringe, FaHeartbeat, FaMortarPestle } from "react-icons/fa";
import { GiMedicines, GiHealthCapsule } from "react-icons/gi";
import { MdLocalPharmacy } from "react-icons/md";
import {

  FaCashRegister,
  FaClipboardList,
  FaExchangeAlt,
  FaMapMarkedAlt
} from 'react-icons/fa';
// import { MdDashboard } from 'react-icons/md';
// import { FiBox, FiUsers, FiBarChart2 } from 'react-icons/fi';
// import { AiOutlineShoppingCart } from 'react-icons/ai';
import {
  MdDashboard,
  MdPointOfSale,
  MdOutlineTrendingUp,
} from "react-icons/md";
import { FaBoxOpen, FaShoppingCart, FaUserFriends } from "react-icons/fa";
import { AiOutlineBarChart } from "react-icons/ai";
import { TbReportAnalytics } from "react-icons/tb";


export const navLinks = [
    {
    name: 'Products',
    url: '/products',
    },
     {
    name: 'Services',
    url: '/services',
    },
     {
    name: 'People',
    url: '/people',
    },
     {
    name: 'Features',
    url: '/feature',
    },
]


export const words = [
    {
        text: "Medication",
        icon: FaPills
    },
   {
        text: "Vaccination",
        icon: FaSyringe
    },
    { 
        text: "Wellness",
        icon: FaHeartbeat
    },
    {
        text: "Pharmacy",
        icon: MdLocalPharmacy 
    },
    { 
        text: "Health", 
        icon: GiHealthCapsule 
    },
    { 
        text: "Formulations",
        icon: FaMortarPestle 
    },

    { 
        text: "Prescriptions",
        icon: GiMedicines
    },
];


export const expCards = [
  {
    review: 'Managed all drug inventory, batches, and suppliers efficiently.',
    imgPath: '/images/pharmacy1.png',
    logoPath: '/images/pharmacyLogo1.png',
    title: 'Inventory Management',
    responsibilities: [
      'Tracked medicine stock levels and expiry dates.',
      'Generated low-stock alerts automatically.',
      'Integrated with suppliers for automatic reordering.',
    ],
    icon: FaPills,
    iconClass: 'text-3xl text-green-400',
  },
  {
    review: 'Handled secure and fast billing with multiple payment modes.',
    imgPath: '/images/pharmacy2.png',
    logoPath: '/images/pharmacyLogo2.png',
    title: 'Billing & Payments',
    responsibilities: [
      'Integrated barcode scanner for quick billing.',
      'Supported cash, card, and digital payments.',
      'Printed customer receipts with GST and discounts.',
    ],
    icon: FaCashRegister,
    iconClass: 'text-3xl text-yellow-400',
  },
  {
    review: 'Tracked customer purchases, invoices, and reports.',
    imgPath: '/images/pharmacy3.png',
    logoPath: '/images/pharmacyLogo3.png',
    title: 'Sales Reports',
    responsibilities: [
      'Daily and monthly sales summary generation.',
      'Exported sales reports to Excel and PDF.',
      'Enabled data-driven decision making.',
    ],
    icon: FaClipboardList,
    iconClass: 'text-3xl text-blue-400',
  },
  {
    review: 'Uses GPS to tag customer addresses or deliver locations.',
    imgPath: '/images/pharmacy5.png',
    logoPath: '/images/pharmacyLogo5.png',
    title: 'Location Services',
    responsibilities: [
      'Prompts user to enable GPS.',
      'Captures coordinates for deliveries.',
      'Integrated with Google Maps API.',
    ],
    icon: FaMapMarkedAlt,
    iconClass: 'text-3xl text-red-400',
  },
];

export const footerImages = [
  {
    img: '/images/fb.png'
  },
  {
    img: '../images/insta.png'
  },
  {
    img: './images/x.png'
  },
  {
    img: '../images/linkedin.png'
  }

]

 

export const fields = [
  // personal info
  {
    name: 'phoneNumber',
    label: 'Phone Number',
    placeholder: 'Enter your phone number (e.g., 03089156503)',
    type: 'tel',
    section: 'personal',
  },
  {
    name: 'frontId',
    label: 'Front ID',
    placeholder: 'Add your Front ID card Picture',
    type: 'file',
    section: 'personal',
  },
  {
    name: 'backId',
    label: 'Back ID',
    placeholder: 'Add your Back ID card Picture',
    type: 'file',
    section: 'personal',
  },

  // pharmacy info
  {
    name: 'pharmacyName',
    label: 'Pharmacy Name',
    placeholder: 'Enter your pharmacy name',
    type: 'text',
    section: 'pharmacy',
  },
  {

    name: 'state',
    label: 'State',
    placeholder: 'Enter your state',
    section: 'pharmacy',
  },
  {
    name:"Country",
    label: 'Country',
    placeholder: 'Enter your Country',
    type: 'text',
    section: 'pharmacy',
  },

{
    label: 'City',
    placeholder: 'Enter your city',
    type: 'text',
    section: 'pharmacy',
  },
  {
    name: 'address',
    label: 'Address',
    placeholder: 'Enter your address',
    type: 'text',
    section: 'pharmacy',
  },
  {
    name: 'licenseNumber',
    label: 'License Number',
    placeholder: 'Enter your license number',
    type: 'text',
    section: 'pharmacy',
  },
  {
    name: 'licensePicture',
    label: 'License Picture',
    placeholder: 'Add your License Picture',
    type: 'file',
    section: 'pharmacy',
  },
];




export const pos = [
  {
    name: 'Dashboard',
    href: '/pos/dashboard',
    icon: MdDashboard,
  },
  {
    name: 'Products',
    // href: '/pos/products',
    icon: FaBoxOpen ,
    subitems: [  
      { name: "Add Product", href: "/pos/products/add" },
      { name: "Add Package", href: "/pos/products/package" },
      { name: "Inventory Management", href: "/pos/products/inventry" },
      { name: "Expiry Product", href: "/pos/products/expiryProduct" },
    ],
  },
  {
    name: 'POS',
    href: '/pos/pos',
    icon: MdPointOfSale,
  },
    {
    name: 'Sales',
    // href: '/pos/products',
    icon: AiOutlineBarChart ,
    subitems: [  
      { name: "Sales", href: "/pos/sales/sales" },
      { name: "Sales Return", href: "/pos/sales/salesReturn" },
    ],

  },
    {
    name: 'Purchase',
    // href: '/pos/products',
    icon: FaShoppingCart ,
    subitems: [
      { name: "Supplier", href: "/pos/purchase/supplier" },
      { name: "Purchase", href: "/pos/purchase/purchase" },
      { name: "Purchase Return", href: "/pos/purchase/purchaseReturn" }
    ],

  },
  {
    name: 'Customers',
    // href: '/pos/customers',
    icon: FaUserFriends,
     subitems: [
      { name: "counters", href: "/pos/customer/counter" },
    ],
  },
  {
    name: 'Forcasting',
    href: '/pos/customers',
    icon: MdOutlineTrendingUp,
  },
  {
    name: 'Reports',
    href: '/pos/reports',
    icon: TbReportAnalytics,
  },
];
export const counterIndex = [
  {
    name: "Ahmed Khan",
    email: "ahmed.khan@example.com",
    counterName: "Counter 1",
    status: true
  },
  {
    name: "Sara Ali",
    email: "sara.ali@example.com",
    counterName: "Counter 2",
    status: true
  },
  {
    name: "Usman Tariq",
    email: "usman.tariq@example.com",
    counterName: "Counter 3",
    status: false
  },
  {
    name: "Ayesha Noor",
    email: "ayesha.noor@example.com",
    counterName: "Counter 4",
    status: true
  },
  {
    name: "Hassan Raza",
    email: "hassan.raza@example.com",
    counterName: "Counter 5",
    status: false
  },
  {
    name: "Mehwish Fatima",
    email: "mehwish.fatima@example.com",
    counterName: "Counter 6",
    status: true
  },
  {
    name: "Ali Haider",
    email: "ali.haider@example.com",
    counterName: "Counter 7",
    status: false
  },
  {
    name: "Zara Malik",
    email: "zara.malik@example.com",
    counterName: "Counter 8",
    status: true
  },
  {
    name: "Bilal Ahmad",
    email: "bilal.ahmad@example.com",
    counterName: "Counter 9",
    status: false
  },
  {
    name: "Laiba Shah",
    email: "laiba.shah@example.com",
    counterName: "Counter 10",
    status: true
  }
];


// src/constants/itemIndex.js

export const itemIndex = [
  { item: "Paracetamol", price: 20, quantity: 50 },
  { item: "Ibuprofen", price: 35, quantity: 30 },
  { item: "Cough Syrup", price: 120, quantity: 15 },
  { item: "Antibiotic Cream", price: 80, quantity: 20 },
  { item: "Multivitamins", price: 150, quantity: 25 }
];



export const salesData = [
  { day: 'Mon', sales: 400 },
  { day: 'Tue', sales: 800 },
  { day: 'Wed', sales: 600 },
  { day: 'Thu', sales: 1000 },
  { day: 'Fri', sales: 700 },
  { day: 'Sat', sales: 1200 },
  { day: 'Sun', sales: 900 }
];


export const monthlySales = [
  { month: 'Jan', sales: 4500 },
  { month: 'Feb', sales: 5200 },
  { month: 'Mar', sales: 6100 },
  { month: 'Apr', sales: 5800 },
  { month: 'May', sales: 6700 },
  { month: 'Jun', sales: 7100 },
  { month: 'Jul', sales: 6800 },
  { month: 'Aug', sales: 7300 },
  { month: 'Sep', sales: 6400 },
  { month: 'Oct', sales: 6900 },
  { month: 'Nov', sales: 7500 },
  { month: 'Dec', sales: 8000 }
];

export const topProducts = [
  { name: 'Paracetamol', category: 'Painkiller', units: 320, revenue: 2400 },
  { name: 'Amoxicillin', category: 'Antibiotic', units: 250, revenue: 1800 },
  { name: 'Ibuprofen', category: 'Painkiller', units: 210, revenue: 1700 },
  { name: 'Vitamin C', category: 'Supplement', units: 190, revenue: 1500 },
  { name: 'Vitamin C', category: 'Supplement', units: 190, revenue: 1500 },
  { name: 'Vitamin C', category: 'Supplement', units: 190, revenue: 1500 },
  { name: 'Vitamin C', category: 'Supplement', units: 190, revenue: 1500 },
]


export const nearExpiryProducts = [
  { name: 'Aspirin', category: 'Painkiller', expiry: '2025-06-15', stock: 150 },
  { name: 'Metformin', category: 'Diabetes', expiry: '2025-07-01', stock: 80 },
  { name: 'Lisinopril', category: 'Hypertension', expiry: '2025-07-10', stock: 65 },
  { name: 'Cetirizine', category: 'Antihistamine', expiry: '2025-06-20', stock: 90 },
  { name: 'Dolo 650', category: 'Painkiller', expiry: '2025-06-25', stock: 120 },
  { name: 'Omeprazole', category: 'Antacid', expiry: '2025-06-22', stock: 70 },
  { name: 'Cough Syrup', category: 'Cold/Flu', expiry: '2025-06-12', stock: 60 },
  { name: 'Zincovit', category: 'Supplement', expiry: '2025-07-05', stock: 100 },
  { name: 'ORS Sachet', category: 'Hydration', expiry: '2025-06-18', stock: 40 },
  { name: 'Clotrimazole', category: 'Antifungal', expiry: '2025-06-30', stock: 50 },
  { name: 'Calpol', category: 'Painkiller', expiry: '2025-06-17', stock: 95 },
  { name: 'Losartan', category: 'Hypertension', expiry: '2025-07-02', stock: 55 },
  { name: 'Pantoprazole', category: 'Antacid', expiry: '2025-06-28', stock: 75 },
  { name: 'Azithromycin', category: 'Antibiotic', expiry: '2025-07-07', stock: 30 },
  { name: 'Becosules', category: 'Supplement', expiry: '2025-06-19', stock: 110 },
  { name: 'Thyronorm', category: 'Hormone', expiry: '2025-06-23', stock: 100 },
  { name: 'Dexamethasone', category: 'Steroid', expiry: '2025-06-21', stock: 45 },
  { name: 'Hydrocortisone Cream', category: 'Topical', expiry: '2025-06-26', stock: 60 },
  { name: 'Multivitamin Syrup', category: 'Supplement', expiry: '2025-07-04', stock: 85 },
  { name: 'Iron Tablets', category: 'Supplement', expiry: '2025-06-29', stock: 90 }
];


export const demandingProducts = [
  { product: "Paracetamol", sales: 600 },
  { product: "Amoxicillin", sales: 790 },
  { product: "Ibuprofen", sales: 500 },
  { product: "Azithromycin", sales: 720 },
  { product: "Cetirizine", sales: 400 },
  { product: "Metformin", sales: 660 },
  { product: "Atorvastatin", sales: 400 },
  { product: "Omeprazole", sales: 620 },

];

export const barColors = [
  "#4F46E5", // Indigo
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#3B82F6", // Blue
  "#8B5CF6", // Violet
  "#EC4899", // Pink
];




// products page dummy data 
export const initialData = [
  {
    id: 1,
    brandName: 'Paracetamol ',
    genericName: 'Paracetamol',
    strength: '500mg',
    dosageForm: 'Tablet',
    manufacturer: 'ABC Pharma',
    barcode: '1234567890'
  },
  {
    id: 2,
    brandName: 'Ibuprofen ',
    genericName: 'Ibuprofen',
    strength: '200mg',
    dosageForm: 'Tablet',
    manufacturer: 'HealthMed',
    barcode: '2345678901'
  },
  {
    id: 3,
    brandName: 'Cetirizine ',
    genericName: 'Cetirizine',
    strength: '10mg',
    dosageForm: 'Tablet',
    manufacturer: 'AllergyRelief Co.',
    barcode: '3456789012'
  },
  {
    id: 4,
    brandName: 'Amoxicillin ',
    genericName: 'Amoxicillin',
    strength: '250mg',
    dosageForm: 'Capsule',
    manufacturer: 'Antibiotic Inc.',
    barcode: '4567890123'
  },
  {
    id: 5,
    brandName: 'Panadol',
    genericName: 'Paracetamol',
    strength: '500mg',
    dosageForm: 'Tablet',
    manufacturer: 'GSK',
    barcode: '5678901234'
  },
  {
    id: 6,
    brandName: 'Advil',
    genericName: 'Ibuprofen',
    strength: '200mg',
    dosageForm: 'Tablet',
    manufacturer: 'Pfizer',
    barcode: '6789012345'
  },
  {
    id: 7,
    brandName: 'Zyrtec',
    genericName: 'Cetirizine',
    strength: '10mg',
    dosageForm: 'Tablet',
    manufacturer: 'UCB Pharma',
    barcode: '7890123456'
  },
  {
    id: 8,
    brandName: 'Augmentin',
    genericName: 'Amoxicillin + Clavulanic Acid',
    strength: '625mg',
    dosageForm: 'Tablet',
    manufacturer: 'GSK',
    barcode: '8901234567'
  }
];



export const packageData = [
  {
    medicine: "Paracetamol",
    packageType: "Blister Pack",
    unitsPerPack: "10",
    unitType: "Tablet",
    packsPerBox: "20",
    barcode: "1234567890"
  },
  {
    medicine: "Ibuprofen",
    packageType: "Blister Pack",
    unitsPerPack: "10",
    unitType: "Tablet",
    packsPerBox: "20",
    barcode: "2345678901"
  },
  {
    medicine: "Cetirizine",
    packageType: "Strip Pack",
    unitsPerPack: "10",
    unitType: "Tablet",
    packsPerBox: "10",
    barcode: "3456789012"
  },
  {
    medicine: "Amoxicillin",
    packageType: "Blister Pack",
    unitsPerPack: "12",
    unitType: "Capsule",
    packsPerBox: "15",
    barcode: "4567890123"
  },
  {
    medicine: "Panadol",
    packageType: "Box",
    unitsPerPack: "20",
    unitType: "Tablet",
    packsPerBox: "10",
    barcode: "5678901234"
  },
  {
    medicine: "Advil",
    packageType: "Bottle",
    unitsPerPack: "30",
    unitType: "Tablet",
    packsPerBox: "6",
    barcode: "6789012345"
  },
  {
    medicine: "Zyrtec",
    packageType: "Blister Pack",
    unitsPerPack: "10",
    unitType: "Tablet",
    packsPerBox: "10",
    barcode: "7890123456"
  },
  {
    medicine: "Augmentin",
    packageType: "Box",
    unitsPerPack: "14",
    unitType: "Tablet",
    packsPerBox: "8",
    barcode: "8901234567"
  },
  {
    medicine: "Metformin",
    packageType: "Strip Pack",
    unitsPerPack: "10",
    unitType: "Tablet",
    packsPerBox: "25",
    barcode: "9012345678"
  },
  {
    medicine: "Ciprofloxacin",
    packageType: "Blister Pack",
    unitsPerPack: "10",
    unitType: "Tablet",
    packsPerBox: "12",
    barcode: "0123456789"
  }
];



export const pharmacyStockData = [
  {
    pharmacyId: "pharmacy_001",
    medicineId: "med_paracetamol",
    packagingId: "pack_blister",
    shelf: "A1",
    stock: 0,
    costPrice: 5.0,
    sellingPrice: 8.0,
    batchNumber: "BATCH001",
    expiryDate: new Date("2025-12-31"),
    packsPerBox: 20,
    packsBarcode: "1234567890",
    reorderLevel: 10,
  },
  {
    pharmacyId: "pharmacy_001",
    medicineId: "med_ibuprofen",
    packagingId: "pack_blister",
    shelf: "A2",
    stock: 0,
    costPrice: 6.5,
    sellingPrice: 9.5,
    batchNumber: "BATCH002",
    expiryDate: new Date("2026-01-15"),
    packsPerBox: 20,
    packsBarcode: "2345678901",
    reorderLevel: 10,
  },
  {
    pharmacyId: "pharmacy_001",
    medicineId: "med_cetirizine",
    packagingId: "pack_strip",
    shelf: "A3",
    stock: 0,
    costPrice: 4.0,
    sellingPrice: 7.0,
    batchNumber: "BATCH003",
    expiryDate: new Date("2025-11-20"),
    packsPerBox: 10,
    packsBarcode: "3456789012",
    reorderLevel: 10,
  },
  {
    pharmacyId: "pharmacy_001",
    medicineId: "med_amoxicillin",
    packagingId: "pack_blister",
    shelf: "B1",
    stock: 0,
    costPrice: 8.0,
    sellingPrice: 12.0,
    batchNumber: "BATCH004",
    expiryDate: new Date("2025-09-01"),
    packsPerBox: 15,
    packsBarcode: "4567890123",
    reorderLevel: 10,
  },
  {
    pharmacyId: "pharmacy_001",
    medicineId: "med_panadol",
    packagingId: "pack_box",
    shelf: "B2",
    stock: 0,
    costPrice: 6.0,
    sellingPrice: 9.5,
    batchNumber: "BATCH005",
    expiryDate: new Date("2026-03-15"),
    packsPerBox: 10,
    packsBarcode: "5678901234",
    reorderLevel: 10,
  },
  {
    pharmacyId: "pharmacy_001",
    medicineId: "med_advil",
    packagingId: "pack_bottle",
    shelf: "B3",
    stock: 0,
    costPrice: 7.2,
    sellingPrice: 10.0,
    batchNumber: "BATCH006",
    expiryDate: new Date("2026-02-28"),
    packsPerBox: 6,
    packsBarcode: "6789012345",
    reorderLevel: 10,
  },
  {
    pharmacyId: "pharmacy_001",
    medicineId: "med_zyrtec",
    packagingId: "pack_blister",
    shelf: "C1",
    stock: 0,
    costPrice: 5.5,
    sellingPrice: 8.5,
    batchNumber: "BATCH007",
    expiryDate: new Date("2025-10-10"),
    packsPerBox: 10,
    packsBarcode: "7890123456",
    reorderLevel: 10,
  },
  {
    pharmacyId: "pharmacy_001",
    medicineId: "med_augmentin",
    packagingId: "pack_box",
    shelf: "C2",
    stock: 0,
    costPrice: 9.0,
    sellingPrice: 13.0,
    batchNumber: "BATCH008",
    expiryDate: new Date("2025-11-05"),
    packsPerBox: 8,
    packsBarcode: "8901234567",
    reorderLevel: 10,
  },
  {
    pharmacyId: "pharmacy_001",
    medicineId: "med_metformin",
    packagingId: "pack_strip",
    shelf: "C3",
    stock: 0,
    costPrice: 3.5,
    sellingPrice: 6.5,
    batchNumber: "BATCH009",
    expiryDate: new Date("2025-12-01"),
    packsPerBox: 25,
    packsBarcode: "9012345678",
    reorderLevel: 10,
  },
  {
    pharmacyId: "pharmacy_001",
    medicineId: "med_ciprofloxacin",
    packagingId: "pack_blister",
    shelf: "D1",
    stock: 0,
    costPrice: 7.0,
    sellingPrice: 11.0,
    batchNumber: "BATCH010",
    expiryDate: new Date("2026-01-30"),
    packsPerBox: 12,
    packsBarcode: "0123456789",
    reorderLevel: 10,
  },
];


// index.js
export const users = [
  {
    name: "Ahmad Raza",
    email: "ahmad.raza@example.com",
    phone: "+92 300 1234567",
    address: "Street 12, G-10, Islamabad, Pakistan",
    supplier: "MedLife Pharmaceuticals"
  },
  {
    name: "Sara Khan",
    email: "sara.khan@example.com",
    phone: "+92 301 7654321",
    address: "House 5, DHA Phase 5, Lahore, Pakistan",
    supplier: "PharmaZone Ltd."
  },
  {
    name: "Ali Haider",
    email: "ali.haider@example.com",
    phone: "+92 302 1112233",
    address: "Block B, North Nazimabad, Karachi, Pakistan",
    supplier: "WellCare Distributors"
  },
  {
    name: "Hina Malik",
    email: "hina.malik@example.com",
    phone: "+92 303 4445566",
    address: "Faisal Town, Multan, Pakistan",
    supplier: "NovaMed Suppliers"
  },
  {
    name: "Zain Ul Abideen",
    email: "zain.abideen@example.com",
    phone: "+92 304 9876543",
    address: "Satellite Town, Rawalpindi, Pakistan",
    supplier: "Sunrise Pharma"
  },
  {
    name: "Mehwish Tariq",
    email: "mehwish.tariq@example.com",
    phone: "+92 305 6789123",
    address: "Model Town, Gujranwala, Pakistan",
    supplier: "LifeLine Distributors"
  },
  {
    name: "Usman Bashir",
    email: "usman.bashir@example.com",
    phone: "+92 306 3456789",
    address: "University Road, Peshawar, Pakistan",
    supplier: "Medico Pvt Ltd"
  },
  {
    name: "Sana Javed",
    email: "sana.javed@example.com",
    phone: "+92 307 2345678",
    address: "Gulberg, Lahore, Pakistan",
    supplier: "HealWell Corporation"
  },
  {
    name: "Hamza Qureshi",
    email: "hamza.qureshi@example.com",
    phone: "+92 308 1122334",
    address: "Johar Town, Lahore, Pakistan",
    supplier: "CureLine Supplies"
  },
  {
    name: "Marium Akbar",
    email: "marium.akbar@example.com",
    phone: "+92 309 5566778",
    address: "Blue Area, Islamabad, Pakistan",
    supplier: "Global Health Traders"
  }
];


export const purchaseDataa = [
  {
    purchaseID: "P-001",
    supplier: "MedLife Pharmaceuticals",
    invoiceNo: "INV-1001",
    purchaseDate: new Date("2025-09-01"),
    totalAmount: 1250.50,
    discount: 50.0,
    tax: 100.0,
  },
  {
    purchaseID: "P-002",
    supplier: "PharmaZone Ltd.",
    invoiceNo: "INV-1002",
    purchaseDate: new Date("2025-09-03"),
    totalAmount: 980.00,
    discount: 20.0,
    tax: 70.0,
  },
  {
    purchaseID: "P-003",
    supplier: "WellCare Distributors",
    invoiceNo: "INV-1003",
    purchaseDate: new Date("2025-09-05"),
    totalAmount: 1575.25,
    discount: 0.0,
    tax: 125.25,
  },
  {
    purchaseID: "P-004",
    supplier: "NovaMed Suppliers",
    invoiceNo: "INV-1004",
    purchaseDate: new Date("2025-09-06"),
    totalAmount: 1340.10,
    discount: 40.0,
    tax: 90.0,
  },
  {
    purchaseID: "P-005",
    supplier: "Sunrise Pharma",
    invoiceNo: "INV-1005",
    purchaseDate: new Date("2025-09-08"),
    totalAmount: 1120.00,
    discount: 0.0,
    tax: 80.0,
  },
  {
    purchaseID: "P-006",
    supplier: "LifeLine Distributors",
    invoiceNo: "INV-1006",
    purchaseDate: new Date("2025-09-09"),
    totalAmount: 2100.75,
    discount: 100.0,
    tax: 160.75,
  },
  {
    purchaseID: "P-007",
    supplier: "Medico Pvt Ltd",
    invoiceNo: "INV-1007",
    purchaseDate: new Date("2025-09-10"),
    totalAmount: 1435.00,
    discount: 25.0,
    tax: 110.0,
  },
  {
    purchaseID: "P-008",
    supplier: "HealWell Corporation",
    invoiceNo: "INV-1008",
    purchaseDate: new Date("2025-09-12"),
    totalAmount: 890.00,
    discount: 10.0,
    tax: 60.0,
  },
  {
    purchaseID: "P-009",
    supplier: "CureLine Supplies",
    invoiceNo: "INV-1009",
    purchaseDate: new Date("2025-09-14"),
    totalAmount: 1650.90,
    discount: 30.0,
    tax: 120.90,
  },
  {
    purchaseID: "P-010",
    supplier: "Global Health Traders",
    invoiceNo: "INV-1010",
    purchaseDate: new Date("2025-09-16"),
    totalAmount: 1980.00,
    discount: 50.0,
    tax: 150.0,
  },
];


export const purchases = [
  {
    productName: "Paracetamol 500mg",
    productType: "Tablet",
    quantity: "100",
    costPrice: "2.5",
    batchNo: "B001",
    expiryDate: "2026-01-15",
    discount: "5",
    discountPayment: "12.5",
    lineTotal: "237.5"
  },
  {
    productName: "Ibuprofen 200mg",
    productType: "Tablet",
    quantity: "200",
    costPrice: "3.0",
    batchNo: "B002",
    expiryDate: "2026-03-20",
    discount: "10",
    discountPayment: "60",
    lineTotal: "540"
  },
  {
    productName: "Cough Syrup 100ml",
    productType: "Syrup",
    quantity: "50",
    costPrice: "20",
    batchNo: "B003",
    expiryDate: "2025-12-01",
    discount: "8",
    discountPayment: "80",
    lineTotal: "920"
  },
  {
    productName: "Vitamin C 1000mg",
    productType: "Tablet",
    quantity: "150",
    costPrice: "5",
    batchNo: "B004",
    expiryDate: "2026-05-10",
    discount: "7",
    discountPayment: "52.5",
    lineTotal: "697.5"
  },
  {
    productName: "Azithromycin 250mg",
    productType: "Tablet",
    quantity: "80",
    costPrice: "10",
    batchNo: "B005",
    expiryDate: "2025-10-10",
    discount: "6",
    discountPayment: "48",
    lineTotal: "752"
  },
  {
    productName: "Amoxicillin 500mg",
    productType: "Capsule",
    quantity: "120",
    costPrice: "4",
    batchNo: "B006",
    expiryDate: "2026-08-15",
    discount: "5",
    discountPayment: "24",
    lineTotal: "456"
  },
  {
    productName: "Multivitamin Syrup",
    productType: "Syrup",
    quantity: "60",
    costPrice: "18",
    batchNo: "B007",
    expiryDate: "2025-11-25",
    discount: "9",
    discountPayment: "97.2",
    lineTotal: "982.8"
  },
  {
    productName: "Loratadine 10mg",
    productType: "Tablet",
    quantity: "90",
    costPrice: "3.5",
    batchNo: "B008",
    expiryDate: "2026-06-30",
    discount: "4",
    discountPayment: "12.6",
    lineTotal: "295.4"
  },
  {
    productName: "Calcium + D3",
    productType: "Tablet",
    quantity: "70",
    costPrice: "6",
    batchNo: "B009",
    expiryDate: "2026-02-10",
    discount: "5",
    discountPayment: "21",
    lineTotal: "399"
  },
  {
    productName: "ORS Sachets",
    productType: "Sachet",
    quantity: "100",
    costPrice: "2",
    batchNo: "B010",
    expiryDate: "2025-12-20",
    discount: "10",
    discountPayment: "20",
    lineTotal: "180"
  }
];



export const items = [
  {
    itemName: "Paracetamol 500mg",
    quantity: 120,
    shelfNo: "A1",
    price: 2.5,
  },
  {
    itemName: "Ibuprofen 200mg",
    quantity: 80,
    shelfNo: "A2",
    price: 3.0,
  },
  {
    itemName: "Amoxicillin 250mg",
    quantity: 45,
    shelfNo: "B1",
    price: 5.0,
  },
  {
    itemName: "Cetirizine 10mg",
    quantity: 150,
    shelfNo: "B2",
    price: 1.75,
  },
  {
    itemName: "Azithromycin 500mg",
    quantity: 30,
    shelfNo: "B3",
    price: 7.2,
  },
  {
    itemName: "Cough Syrup (100ml)",
    quantity: 60,
    shelfNo: "C1",
    price: 4.0,
  },
  {
    itemName: "Vitamin C 1000mg",
    quantity: 100,
    shelfNo: "C2",
    price: 2.2,
  },
  {
    itemName: "Loratadine 10mg",
    quantity: 90,
    shelfNo: "D1",
    price: 2.8,
  },
  {
    itemName: "Metformin 500mg",
    quantity: 70,
    shelfNo: "D2",
    price: 6.0,
  },
  {
    itemName: "Insulin Injection",
    quantity: 20,
    shelfNo: "D3",
    price: 25.0,
  },
  {
    itemName: "Omeprazole 20mg",
    quantity: 110,
    shelfNo: "E1",
    price: 3.5,
  },
  {
    itemName: "Antiseptic Cream",
    quantity: 35,
    shelfNo: "E2",
    price: 6.8,
  },
  {
    itemName: "Pain Relief Spray",
    quantity: 50,
    shelfNo: "F1",
    price: 8.5,
  },
  {
    itemName: "Multivitamin Tablets",
    quantity: 200,
    shelfNo: "F2",
    price: 4.5,
  },
  {
    itemName: "Hydrocortisone Cream",
    quantity: 40,
    shelfNo: "F3",
    price: 3.25,
  },
  {
    itemName: "Antacid Tablets",
    quantity: 100,
    shelfNo: "G1",
    price: 1.9,
  },
  {
    itemName: "Oral Rehydration Salts (ORS)",
    quantity: 75,
    shelfNo: "G2",
    price: 1.5,
  },
  {
    itemName: "Bandages (5-pack)",
    quantity: 60,
    shelfNo: "G3",
    price: 2.0,
  },
  {
    itemName: "Digital Thermometer",
    quantity: 25,
    shelfNo: "H1",
    price: 12.0,
  },
  {
    itemName: "Pulse Oximeter",
    quantity: 15,
    shelfNo: "H2",
    price: 18.0,
  },
];


