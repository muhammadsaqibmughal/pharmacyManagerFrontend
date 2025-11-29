import { Routes, Route } from "react-router-dom";

// Landing page
import Navbar from "./Pages/Landing/Navbar";
import Hero from "./Pages/Landing/Hero";
import Modules from "./Pages/Landing/Modules";
import Footer from "./Pages/Landing/Footer";

// Auth pages
import FormPage from "./Pages/Auth/FormPage";
import SignUp from "./Pages/Auth/SignUp";
import OtpVerification from "./Pages/Auth/OtpVerification";


// ***************** Manager pages ***********************

//Side Navigation
import SideNavigation from "./Pages/Manager/Side_Navigation/SideNavigation";

//Dashboard
import Dashboard from "./Pages/Manager/Dashboard/Dashboard";

//Products
import AllPackages from "./Pages/Manager/Products/AllPackages";
import AllProduct from "./Pages/Manager/Products/AllProduct";
import ExpiryProducts from "./Pages/Manager/Products/ExpiryProducts";
import Inventry from "./Pages/Manager/Products/Inventry";

//Sales
import Sales from "./Pages/Manager/Sales/Sales";
import SalesDetail from "./Pages/Manager/Sales/SalesDetail";
import SalesReturn from "./Pages/Manager/Sales/SalesReturn";
import SalesReturnDetails from "./Pages/Manager/Sales/SalesReturnDetails";

//Purchase
import Purchase from "./Pages/Manager/Purchase/Purchase";
import PurchaseReturen from "./Pages/Manager/Purchase/PurchaseReturen";
import PurchaseReturnDetail from "./Pages/Manager/Purchase/PurchaseReturnDetail";

//Supplier
import Supplier from "./Pages/Manager/Supplier/Supplier";
import SupplierDetail from "./Pages/Manager/Supplier/SupplierDetail";

//Counter 
import CounterDetail from "./Pages/Manager/Counter/CounterDetail";
import Counter from "./Pages/Manager/Counter/Counters";
import CounterSaleDetail from "./Pages/Manager/Counter/CounterSaleDetail";

//POS
import OnlyCounter from "./Pages/Manager/POS/OnlyCounter";
import PosPage from "./Pages/Manager/POS/PosPage";

//Reports
import Customer from "./Pages/Manager/Reports/Customer";
import Reports from "./Pages/Manager/Reports/Reports";
import MedicineForecast from "./Pages/Manager/Reports/Forcasting";

//Users
import ManagerForgotPassword from "./Pages/Manager/User/ManagerForgotPassword";
import ManagerResetPassword from "./Pages/Manager/User/ManagerResetPassword";
import PendingApproval from "./Pages/Manager/User/PendingApproval";
import ProfilePage from "./Pages/Manager/User/ProfilePage";
import Settings from "./Pages/Manager/User/Settings";

// Scanner Setup
import  ScannerSetup from "./Pages/Manager/ScannerSetup/ScannerSetup"


// Route Guard
import ProtectedRoute from "./utils/ProtectedRoute";

// Layouts
const HomeLayout = () => (
  <>
    <Navbar />
    <Hero />
    <Modules />
    <Footer />
  </>
);

const SignUpLayout = () => <SignUp />;
const FormLayout = () => (
  <>
    <Navbar />
    <FormPage />
  </>
);

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomeLayout />} />
      <Route path="/signup" element={<SignUpLayout />} />
      <Route path="/verify-email" element={<OtpVerification />} />
      <Route path="/forgot-password" element={<ManagerForgotPassword />} />
      <Route
        path="/manager/reset-password/:id/:token"
        element={<ManagerResetPassword />}
      />

      {/* Staff-only Routes: Staff can ONLY access these */}
      <Route
        path="/onlyCounter"
        element={
          <ProtectedRoute allowedRoles={["staff" ]}>
            <OnlyCounter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Authenticated routes — restrict staff from accessing except above */}
      <Route
        path="/form"
        element={
          <ProtectedRoute redirectStaff={true}>
            <FormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pending-approval"
        element={
          <ProtectedRoute redirectStaff={true}>
            <PendingApproval />
          </ProtectedRoute>
        }
      />

      {/* Protected POS System & subroutes: Staff redirected away */}
      <Route
        path="/pos"
        element={
          <ProtectedRoute redirectStaff={true}>
            <SideNavigation />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="scanner" element={<ScannerSetup/>}/>
        <Route path="pos" element={<OnlyCounter />} />
        <Route path="products/add" element={<AllProduct />} />
        <Route path="products/package" element={<AllPackages />} />
        <Route path="products/expiryProduct" element={<ExpiryProducts />} />
        <Route path="products/inventry" element={<Inventry />} />
        <Route path="purchase/supplier" element={<Supplier />} />
        <Route path="purchase/purchase" element={<Purchase />} />
        <Route path="purchase/purchaseReturn" element={<PurchaseReturen />} />
        <Route path="sales/sales" element={<Sales />} />
        <Route path="sales/salesReturn" element={<SalesReturn />} />
        <Route path="customer/counter" element={<Counter />} />
        <Route path="reports" element={<Reports />} />
        <Route path="forcasting" element={<MedicineForecast />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<ProfilePage />} />

        {/* Dynamic Routes */}
        <Route path="purchase/:id" element={<SupplierDetail />} />
        <Route path="purchase-return/:id" element={<PurchaseReturnDetail />} />
        <Route path="sale-detail/:id" element={<SalesDetail />} />
        <Route path="counter-detail" element={<CounterDetail />} />
        <Route path="counter-sale-detail" element={<CounterSaleDetail />} />
        <Route path="sales/salesReturn/:id" element={<SalesReturnDetails />} />
      </Route>
    </Routes>
  );
};

export default App;
