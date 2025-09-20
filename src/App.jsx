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
import AllPackages from "./Pages/AllPackages"
import ExpiryProducts from "./Pages/ExpiryProducts";
import Inventry from "./Pages/Inventry";
import Supplier from "./Pages/Supplier";
import Purchase from "./Pages/Purchase";
import PurchaseReturen from "./Pages/PurchaseReturen";
import Customer from "./pages/Customer";
import Reports from "./Pages/Reports";
import Settings from "./Pages/Settings";
import OtpVerification from "./components/OtpVerification";
import PendingApproval from "./Pages/PendingApproval";
import ProtectedRoute from "./utils/ProtectedRoute";
import RequireLogin from "./utils/RequireLogin";

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
  // <>
  //   <Routes>
  //     {/* Public Routes */}
  //     <Route path="/" element={<HomeLayout />} />
  //     <Route path="/signup" element={<SignUpLayout />} />
  //     <Route path="/verify-email" element={<OtpVerification />} />

  //     {/* // Protected: Only logged-in users can access */}
  //     <Route
  //       path="/form"
  //       element={
  //         <RequireLogin>
  //           <FormLayout />
  //         </RequireLogin>
  //       }
  //     />
  //     <Route
  //       path="/pending-approval"
  //       element={
  //         <RequireLogin>
  //           <PendingApproval />
  //         </RequireLogin>
  //       }
  //     />

  //     {/* // Protected: Only logged-in users with approved pharmacy can access */}
  //     <Route
  //       path="/pos"
  //       element={
  //         <ProtectedRoute>
  //           <Pos />
  //         </ProtectedRoute>
  //       }
  //     >
  //       <Route path="dashboard" element={<Dashboard />} />
  //       <Route path="products" element={<Product />} />
  //       <Route path="pos" element={<PosPage />} />
  //       <Route path="customers" element={<Customer />} />
  //       <Route path="reports" element={<Reports />} />
  //       <Route path="settings" element={<Settings />} />
  //     </Route>
  //   </Routes>
    
  // </>

          <>
    <Routes>
      {/* This is your layout route */}
      <Route path="/" element={<Pos />}>
        {/* These will render inside <Outlet /> */}
        <Route path="/pos/dashboard" element={<Dashboard />} />
        <Route path="/pos/products/add" element={<AllProduct />} />
        <Route path="/pos/products/package" element={<AllPackages />} />
        <Route path="/pos/products/expiryProduct" element={<ExpiryProducts />} />
        <Route path="/pos/products/inventry" element={<Inventry />} />
        <Route path="/pos/purchase/supplier" element={<Supplier />} />
        <Route path="/pos/purchase/purchase" element={<Purchase />} />
        <Route path="/pos/purchase/purchaseReturn" element={<PurchaseReturen />} />
        <Route path="/pos/pos" element={<PosPage />} />
        <Route path="/pos/customers" element={<Customer />} />
        <Route path="/pos/reports" element={<Reports />} />
        <Route path="/pos/settings" element={<Settings />} />
      </Route>
    </Routes>
           
            {/* <Hero />
            <Modules />
            <SignUp />
            <FormPage/>
            <OtpVerification/>
            <PendingApproval/>
            <Footer /> */}
          </>
  );
};

export default App;
