import { useState } from "react"
import {users} from "../constants"
import Card , { CardContent } from "../components/Card"
 
const ITEM_PER_PAGE = 8

const Supplier = () => {

    const[userData , setUserData]=useState(users);
    const[newUser , setNewUser]=useState({
        supplier:"",
        name:"",
        email:"",
        phone:"",
        address:""
    })
    const[showModal , setShowModal] = useState(false);
    const[searchTerm , setSearchTerm] = useState("")
    const[currentPage , setCurrentPage] = useState(1)

    // ****** Filter Supllier Data ****
    const filteredItems = userData.filter((product) => {
        const term = searchTerm.toLowerCase();
        return (
            product.name.toLowerCase().includes(term)
        );
    });

    // *********** Table Pages Per Page **********
    const totalPages = Math.ceil(filteredItems.length/ITEM_PER_PAGE)
    const paginatedProducts = filteredItems.slice(
        (currentPage - 1) * ITEM_PER_PAGE,
        currentPage * ITEM_PER_PAGE
    )

    // ************* handle Addind New Supplier **********
    const handleAddSupplier = () => {
        setUserData([newUser , ...userData])
        setShowModal(false)
        resetForm();
    }

    const handleChange = (e) => {
        const  {name , value} = e.target
        setNewUser({...newUser , [name]: value})
    }

    // *********** CLear Form Fields *************
    const resetForm = () => {
        setNewUser({
            supplier:"",
            name:"",
            email:"",
            phone:"",
            address:""
        })
    }



  return (
    <div className="mt-8 p-10">
        {/* *********** TOP ************ */}
        <div className="flex justify-between max-md:flex-col max-md:gap-2 max-md:justify-center items-center mb-4">
            <h2 className="text-2xl text-primary-50 max-md:text-xl font-bold">Suppliers Data</h2>
            <div className="space-x-2  max-md:flex">
            <button
                onClick={()=> setShowModal(true)}
                className="bg-[#4F7942] text-white max-md:text-sm px-4 py-1 h-10 rounded-full hover:bg-hf-100"
            >
                Add Supplier
            </button>
            </div>
        </div>

        {/* ********* Search Bar ********** */}
        <div className="mb-4 bg-[#acc5b0ff] rounded-full">
            <input
            type="text"
            placeholder="Search by name..."
            className="px-4 py-2 w-full font-semibold text-primary-50 outline-none text-sm"
            value={searchTerm}
            onChange={(e)=> setSearchTerm(e.target.value)}
            />
        </div>


        {/* ************ Table ************** */}
        <Card>
        <CardContent>
          <div className="overflow-y-auto mt-2">
            <table className="w-full">
              <thead className="text-sm text-left uppercase text-white bg-[#4F7942]">
                <tr className="row-span-3">
                  <th className="px-4 py-2">Supplier</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Phone No</th>
                  <th className="px-4 py-2">Address</th>
                </tr>
                <tr className=" col-span-6  h-3">

                </tr>
              </thead>
              <tbody className="text-left">
                {paginatedProducts.map((product, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-2 text-xs font-medium">{product.supplier}</td>
                    <td className="px-4 py-2 text-xs font-medium">{product.name}</td>
                    <td className="px-4 py-2 text-xs font-medium">{product.email}</td>
                    <td className="px-4 py-2 text-xs font-medium">{product.phone}</td>
                    <td className="px-4 py-2 text-xs font-medium">{product.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between mt-4">
            <button
              className="px-4 py-1 bg-[#4F7942] text-white rounded disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-1 bg-[#4F7942] text-white rounded disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-10">
          <div className="bg-db-50 p-6 rounded-md w-full max-w-lg">
            <h2 className="text-xl text-primary-50 font-semibold mb-4">Add New Supplier</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(newUser).map((field) => (
                <div className="relative" key={field}>
                  <input
                    type="text"
                    name={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={newUser[field]}
                    onChange={handleChange}
                    className="border text-xs border-gray-300 font-semibold text-primary-50 px-3 py-2 rounded w-full"
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
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSupplier}
                className="px-4 py-2 bg-[#4F7942] text-white rounded hover:bg-hf-100"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Supplier