import React from 'react'

import { footerImages } from '../constants'

const Footer = () => {
  return (
    <div className=' border border-primary-50 bg-primary-50  '>
        <div className='flex max-lg:flex-col max-lg:gap-5 justify-between items-center  w-full  p-2 px-5'>
            <div className='text-xs text-white-50'>Terms and Conditions</div>
            <div className='flex gap-5  lg:ml-18 '>
                {footerImages.map((img) => (
                    <span className='border border-black-50 bg-bg-50 flex justify-center items-center rounded-xl size-4 md:size-8 cursor-pointer transition-all duration-500 hover:bg-black-50'>
                        <img src={img.img} className='inline-block' />
                        
                    </span>
                ))}
            </div>
            <div>
                <p className='text-white-50 max-sm:text-sm text-xs'>
                    © {new Date().getFullYear()} Ahmad Raza. All rights reserved.
                </p>
            </div>
        </div>
     </div>
  )
}

export default Footer