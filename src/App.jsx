import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Modules from "./components/Modules";
import Footer from "./components/Footer";
import FormPage from "./components/FormPage";
import SignUp from "./components/SignUp";
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
import OtpVerification from "./components/OtpVerification";
import PendingApproval from "./Pages/PendingApproval";
import ProtectedRoute from "./utils/ProtectedRoute";
import RequireLogin from "./utils/RequireLogin";
import PurchaseReturnDetail from "./Pages/PurchaseReturnDetail";
import Sales from "./Pages/Sales";
import SalesReturn from "./Pages/SalesReturn";
import Counters from "./Pages/Counters";
import CounterDetail from "./Pages/CounterDetail";
import SaleDetail from "./Pages/CounterSaleDetail";
import OnlyCounter from "./Pages/OnlyCounter";
import SalesDetail from "./Pages/SalesDetail";
import ProfilePage from "./Pages/ProfilePage";
const HomeLayout = () => (
  <>
    <Navbar />
    <Hero />
    <Modules />
    <Footer />
  </>
);

const SignUpLayout = () => (
  <>
    {/* <Navbar /> */}
    <SignUp />
  </>
);

const FormLayout = () => (
  <>
    <Navbar />
    <FormPage />
  </>
);

const App = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomeLayout />} />
        <Route path="/signup" element={<SignUpLayout />} />
        <Route path="/verify-email" element={<OtpVerification />} />
        <Route path="/onlyCounter" element={<OnlyCounter />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Protected Routes: Only logged-in users can access */}
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

        {/* Protected Route: Only logged-in users with approved pharmacy can access */}
        <Route
          path="/pos"
          element={
            <ProtectedRoute>
              <Pos />
            </ProtectedRoute>
          }
        >
          {/* Protected POS pages */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="/pos/pos" element={<PosPage />} />
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
          <Route path="posPage" element={<PosPage />} />
          <Route path="profile" element={<ProfilePage />} />

          {/* Dynamic route under POS layout  */}
          <Route path="purchase/:id" element={<SupplierDetail />} />
          <Route
            path="purchase-return/:id"
            element={<PurchaseReturnDetail />}
          />
          <Route path="/pos/sale-detail/:id" element={<SalesDetail />} />

          <Route path="counter-detail/name/:name" element={<CounterDetail />} />
          <Route path="/pos/sale-detail/:name/:date" element={<SaleDetail />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
