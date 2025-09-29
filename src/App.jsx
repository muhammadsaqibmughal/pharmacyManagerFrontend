import { Routes, Route } from "react-router-dom";

// Components & Pages
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Modules from "./components/Modules";
import Footer from "./components/Footer";
import FormPage from "./components/FormPage";
import SignUp from "./components/SignUp";
import OtpVerification from "./components/OtpVerification";
import RoleRedirect from "./utils/RoleRedirect";

// Pages
import Pos from "./components/Pos";
import PosPage from "./Pages/PosPage";
import Dashboard from "./Pages/Dashboard";
import AllProduct from "./Pages/AllProduct";
import AllPackages from "./Pages/AllPackages";
import ExpiryProducts from "./Pages/ExpiryProducts";
import Inventry from "./Pages/Inventry";
import Supplier from "./Pages/Supplier";
import SupplierDetail from "./Pages/SupplierDetail";
import Purchase from "./Pages/Purchase";
import PurchaseReturen from "./Pages/PurchaseReturen";
import Customer from "./Pages/Customer";
import Reports from "./Pages/Reports";
import Settings from "./Pages/Settings";
import PendingApproval from "./Pages/PendingApproval";
import PurchaseReturnDetail from "./Pages/PurchaseReturnDetail";
import Sales from "./Pages/Sales";
import SalesReturn from "./Pages/SalesReturn";
import Counters from "./Pages/Counters";
import CounterDetail from "./Pages/CounterDetail";
import SaleDetail from "./Pages/CounterSaleDetail";
import OnlyCounter from "./Pages/OnlyCounter";
import SalesDetail from "./Pages/SalesDetail";
import ProfilePage from "./Pages/ProfilePage";

// Route Guards
import ProtectedRoute from "./utils/ProtectedRoute";
import RequireLogin from "./utils/RequireLogin";

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
      {/*  Auto-redirect based on login & role */}
      <Route path="/" element={<HomeLayout />} />

      {/*  Public Routes */}
      <Route path="/" element={<SignUpLayout />} />
      <Route path="/signup" element={<SignUpLayout />} />
      <Route path="/verify-email" element={<OtpVerification />} />
      <Route path="/onlyCounter" element={<OnlyCounter />} />
      <Route path="/profile" element={<ProfilePage />} />

      {/*  Requires login but not necessarily approval */}
      <Route
        path="/form"
        element={
          <RequireLogin>
            <FormLayout />
          </RequireLogin>
        }
      />
      <Route
        path="/pending-approval"
        element={
          <RequireLogin>
            <PendingApproval />
          </RequireLogin>
        }
      />

      <Route
        path="/pos"
        element={
          <ProtectedRoute>
            <Pos />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="pos" element={<PosPage />} />
        <Route path="products/add" element={<AllProduct />} />
        <Route path="products/package" element={<AllPackages />} />
        <Route path="products/expiryProduct" element={<ExpiryProducts />} />
        <Route path="products/inventry" element={<Inventry />} />
        <Route path="purchase/supplier" element={<Supplier />} />
        <Route path="purchase/purchase" element={<Purchase />} />
        <Route path="purchase/purchaseReturn" element={<PurchaseReturen />} />
        <Route path="sales/sales" element={<Sales />} />
        <Route path="sales/salesReturn" element={<SalesReturn />} />
        <Route path="customer/counter" element={<Counters />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<ProfilePage />} />

        {/* Dynamic Routes */}
        <Route path="purchase/:id" element={<SupplierDetail />} />
        <Route path="purchase-return/:id" element={<PurchaseReturnDetail />} />
        <Route path="sale-detail/:id" element={<SalesDetail />} />
        {/* <Route path="counter-detail/:id" element={<CounterDetail />} />
         */}
         <Route path="counter-detail/name/" element={<CounterDetail />} />
        <Route path="sale-detail/:name/:date" element={<SaleDetail />} />
      </Route>
    </Routes>
  );
};

export default App;
