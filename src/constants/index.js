import { FaPills, FaSyringe, FaHeartbeat, FaMortarPestle } from "react-icons/fa";
import { GiMedicines, GiHealthCapsule } from "react-icons/gi";
import { MdLocalPharmacy } from "react-icons/md";
import {

  FaCashRegister,
  FaClipboardList,
  FaExchangeAlt,
  FaMapMarkedAlt
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { FiBox, FiUsers, FiBarChart2 } from 'react-icons/fi';
import { AiOutlineShoppingCart } from 'react-icons/ai';


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
    label: 'Phone',
    placeholder: 'Enter your phone number',
    type: 'tel',
    section: 'personal',
  },
  {
    label: 'Front ID',
    placeholder: 'Add your Front ID card Picture',
    type: 'file',
    section: 'personal',
  },
  {
    label: 'Back ID',
    placeholder: 'Add your Back ID card Picture',
    type: 'file',
    section: 'personal',
  },

  // pharmacy info
  {
    label: 'Pharmacy Name',
    placeholder: 'Enter your pharmacy name',
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
    label: 'Address',
    placeholder: 'Enter your address',
    type: 'text',
    section: 'pharmacy',
  },
  {
    label: 'License No',
    placeholder: 'Enter your License Number',
    type: 'text',
    section: 'pharmacy',
  },
  {
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
    icon: FiBox ,
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
    icon: AiOutlineShoppingCart,
  },
    {
    name: 'Sales',
    href: '/pos/products',
    icon: FiBox ,
    subitems: [{ name: "Sales Return", href: "/pos/sales/return" }],

  },
    {
    name: 'Purchase',
    // href: '/pos/products',
    icon: FiBox ,
    subitems: [
      { name: "Supplier", href: "/pos/purchase/supplier" },
      { name: "Purchase", href: "/pos/purchase/purchase" },
      { name: "Purchase Return", href: "/pos/purchase/purchaseReturn" }
    ],

  },
  {
    name: 'Customers',
    href: '/pos/customers',
    icon: FiUsers,
  },
  {
    name: 'Forcasting',
    href: '/pos/customers',
    icon: FiUsers,
  },
  {
    name: 'Reports',
    href: '/pos/reports',
    icon: FiBarChart2,
  },
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
