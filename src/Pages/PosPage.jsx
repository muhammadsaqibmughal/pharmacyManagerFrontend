import React from 'react'
import Card , {CardContent} from '..//components/Card'
const PosPage = () => {
  return (
    <div className='flex mt-5  w-full p-5'>
      <Card className='w-full'>
        <CardContent>
          <div className='flex justify-center items-center gap-5 max-md:flex-col w-full'>
            <div className='w-4/6 max-md:w-full '>
              <Card>
                <CardContent>
                  <h2 className='text-2xl font-semibold text-primary-50'>Categories</h2>
                  <input type='text' placeholder='Search' className='bg-[#E2DFD2] p-2 mt-8 outline-none rounded-full w-full'/>
                  <div className='flex max-md:flex-col w-full mt-10 justify-center items-center gap-5'>
                    <div className='bg-[#E2DFD2] p-2 rounded-xl '>
                      <div className='flex flex-col-reverse justify-center items-center'>
                        <p className='text-primary-50 tracking-widest text-center font-semibold'>Tablets</p>
                        <img src="/images/tablets.png" alt=""  className='w-35  rounded-lg h-30'/>
                      </div>
                    </div>
                    <div className='bg-[#E2DFD2] p-2 rounded-xl '>
                      <div className='flex flex-col-reverse justify-center items-center'>
                        <p className='text-primary-50 tracking-widest text-center font-semibold'>Syrups</p>
                        <img src="/images/syrup.webp" alt=""  className='w-35  rounded-lg h-30'/>
                      </div>
                    </div>
                    <div className='bg-[#E2DFD2] p-2 rounded-xl '>
                      <div className='flex flex-col-reverse justify-center items-center'>
                        <p className='text-primary-50 tracking-widest text-center font-semibold'>Injextions</p>
                        <img src="/images/injections.webp" alt=""  className='w-35  rounded-lg h-30'/>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className='w-1/2 max-md:w-full'>
              <Card>
                <CardContent>
                  <table className='w-full text-center rounded'>
                    <thead className='bg-[#E2DFD2] w-full '>
                      <tr>
                        <td className='px-4 py-2 text-xs font-semibold text-primary-50'>Product</td>
                        <td className='px-4 py-2 text-xs font-semibold text-primary-50'>Price</td>
                        <td className='px-4 py-2 text-xs font-semibold text-primary-50'>Quantity</td>
                        <td className='px-4 py-2 text-xs font-semibold text-primary-50'>Subtotal</td>
                        <td className='px-4 py-2 text-xs font-semibold text-primary-50'>Action</td>
                      </tr>
                    </thead>
                  </table>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PosPage

