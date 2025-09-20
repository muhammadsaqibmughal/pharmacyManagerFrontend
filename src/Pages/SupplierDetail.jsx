import { useParams, Link } from "react-router-dom";
import { users, purchaseDataa } from "../constants";
import Card, { CardContent } from "../components/Card";

const SupplierDetail = () => {
  const { supplierName } = useParams();
  const decodedSupplier = decodeURIComponent(supplierName);

  // ✅ FIX: Match by user.supplier not user.name
  const supplierInfo = users.find((user) => user.supplier === decodedSupplier);

  const supplierPurchases = purchaseDataa.filter(
    (item) => item.supplier === decodedSupplier
  );

  return (
    <div className="mt-8 p-10">
      <div className="flex justify-between gap-2 items-center mb-6">
        <div className="rounded-full px-4 py-2 bg-[#4F7942] ">
          <Link
            to="/pos/purchase/purchase"
            className="text-sm bg-[#4F7942] text-white hover:bg-hf-100"
          >
            ← Back
          </Link>
        </div>
        <h2 className="text-2xl   font-bold text-primary-50">
          <span>{decodedSupplier}</span>
        </h2>
        <button
          onClick={() => console.log("Add new purchase")}
          className="bg-[#4F7942] text-white max-md:text-sm px-4 py-1 h-10 rounded-full hover:bg-hf-100"
        >
          Add New Purchase
        </button>
      </div>

      {/* Supplier Details */}
      {supplierInfo && (
        <div className="bg-hf-50 shadow rounded p-4 mb-6 text-sm text-primary-50">
          <p><span className="font-semibold">Email:</span> {supplierInfo.email}</p>
          <p><span className="font-semibold">Phone:</span> {supplierInfo.phone}</p>
          <p><span className="font-semibold">Address:</span> {supplierInfo.address}</p>
        </div>
      )}

      {supplierPurchases.length === 0 ? (
        <p className="text-primary-50 text-sm">No purchases found for this supplier.</p>
      ) : (
        <Card>
          <CardContent>
            <table className="w-full">
              <thead className="text-sm text-left uppercase text-white bg-[#4F7942]">
                <tr>
                  <th className="px-4 py-2">Invoice No</th>
                  <th className="px-4 py-2">Purchase Date</th>
                  <th className="px-4 py-2">Total Amount</th>
                  <th className="px-4 py-2">Discount</th>
                  <th className="px-4 py-2">Tax</th>
                </tr>
              </thead>
              <tbody>
                {supplierPurchases.map((purchase, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-2 text-xs font-medium">{purchase.invoiceNo}</td>
                    <td className="px-4 py-2 text-xs font-medium">
                      {new Date(purchase.purchaseDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-xs font-medium">{purchase.totalAmount}</td>
                    <td className="px-4 py-2 text-xs font-medium">{purchase.discount}</td>
                    <td className="px-4 py-2 text-xs font-medium">{purchase.tax}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SupplierDetail;
