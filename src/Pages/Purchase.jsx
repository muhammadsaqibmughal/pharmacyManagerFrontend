import { useState } from "react"
import {purchaseDataa} from "../constants"
import Card , { CardContent } from "../components/Card"
import { Link } from "react-router-dom";

 
const ITEM_PER_PAGE = 5

const Purchase = () => {

    const[purchaseData , setPurchaseData]=useState(purchaseDataa);
    const[newPurchase , setNewPurchase]=useState({
        supplier:"",
        invoiceNo:"",
        purchaseDate:"",
        totalAmount:"",
        discount:"",
        tax:""
    })
    const[showModal , setShowModal] = useState(false);
    const[searchTerm , setSearchTerm] = useState("")
    const[currentPage , setCurrentPage] = useState(1)

    // ****** Filter Supllier Data ****
    const filteredItems = purchaseDataa.filter((product) => {
        const term = searchTerm.toLowerCase();
        return (
            product.supplier.toLowerCase().includes(term)
        );
    });

    // *********** Table Pages Per Page **********
    const totalPages = Math.ceil(filteredItems.length/ITEM_PER_PAGE)
    const paginatedProducts = filteredItems.slice(
        (currentPage - 1) * ITEM_PER_PAGE,
        currentPage * ITEM_PER_PAGE
    )

    // ************* handle Addind New Supplier **********
    const handleAddPurchase = () => {
        setPurchaseData([newPurchase , ...purchaseData])
        setShowModal(false)
        resetForm();
    }

    const handleChange = (e) => {
        const  {name , value} = e.target
        setNewPurchase({...newPurchase , [name]: value})
    }

    // *********** CLear Form Fields *************
    const resetForm = () => {
        setNewPurchase({
          supplier:"",
          invoiceNo:"",
          purchaseDate:"",
          totalAmount:"",
          discount:"",
          tax:""
        })
    }



  return (
    <div className="mt-8 p-10">
        {/* *********** TOP ************ */}
        <div className="flex justify-between max-md:flex-col max-md:gap-2 max-md:justify-center items-center mb-4">
            <h2 className="text-2xl text-white/90 max-md:text-xl font-bold">Purchase Data</h2>
            <div className="space-x-2  max-md:flex">
            <button
                onClick={()=> setShowModal(true)}
                className="bg-[#4F7942] text-white max-md:text-sm px-4 py-1 h-10 rounded-full hover:bg-hf-100"
            >
                Add New Purchase
            </button>
            </div>
        </div>

        {/* ********* Search Bar ********** */}
        <div className="mb-4 bg-[#acc5b0ff] rounded-full">
            <input
            type="text"
            placeholder="Search by supplier name..."
            className="px-4 py-2 w-full font-semibold text-primary-50 outline-none text-sm"
            value={searchTerm}
            onChange={(e)=> setSearchTerm(e.target.value)}
            />
        </div>


        {/* ************ Table ************** */}

      <div className="overflow-y-auto mt-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
        <table className="w-full table-auto text-white">
          <thead className="text-xs text-left uppercase bg-bg-50 text-white/80">
            <tr>
              <th className="px-4 py-2 border-b border-white/10">Supplier</th>
              <th className="px-4 py-2 border-b border-white/10">Invoice No</th>
              <th className="px-4 py-2 border-b border-white/10">Purchase Date</th>
              <th className="px-4 py-2 border-b border-white/10">Total Amount</th>
              <th className="px-4 py-2 border-b border-white/10">Discount</th>
              <th className="px-4 py-2 border-b border-white/10">Tax</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product, idx) => (
              <tr key={idx} className="hover:bg-white/10 transition-all duration-200">
                <td className="px-4 py-2 text-xs font-medium border-b border-white/10">
                  <Link
                    to={`/pos/purchase/supplier/${encodeURIComponent(product.supplier)}`}
                    className="text-blue-300 hover:text-blue-500 hover:underline"
                  >
                    {product.supplier}
                  </Link>
                </td>
                <td className="px-4 py-2 text-xs font-medium border-b border-white/10">{product.invoiceNo}</td>
                <td className="px-4 py-2 text-xs font-medium border-b border-white/10">
                  {new Date(product.purchaseDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-xs font-medium border-b border-white/10">{product.totalAmount}</td>
                <td className="px-4 py-2 text-xs font-medium border-b border-white/10">{product.discount}</td>
                <td className="px-4 py-2 text-xs font-medium border-b border-white/10">{product.tax}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center px-4 py-3 bg-white/10 border-t border-white/10">
          <button
            className="px-4 py-1 bg-[#4F7942] text-white rounded-full disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-sm text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-1 bg-[#4F7942] text-white rounded-full disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>



      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-10">
          <div className="rounded-xl p-6 w-full max-w-lg border border-white/20 bg-white/10 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
            <h2 className="text-xl text-white/90 font-semibold mb-4">Add New Purchase</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(newPurchase).map((field) => (
                <div className="relative" key={field}>
                  <input
                    type={field.includes("Date") ? "date" : "text"}
                    name={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={newPurchase[field]}
                    onChange={handleChange}
                    className="border-1 text-xs border-gray-300 font-semibold text-white/90 px-3 py-2 rounded-full w-full bg-white/5 backdrop-blur-sm"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-4 py-2 rounded-full bg-gray-400 text-white hover:bg-white/80 hover:text-primary-50 "
              >
                Cancel
              </button>
              <button
                onClick={handleAddPurchase}
                className="px-4 py-2 bg-bg-50 hover:bg-selected-50 text-white rounded-full hover:bg-hf-100"
              >
                Add Purchase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Purchase