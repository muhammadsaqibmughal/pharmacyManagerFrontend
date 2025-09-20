import React from 'react'

const TitleHeader = ({title,sub}) => {
  return (
    <div className='flex items-center justify-center '>
        <div className='flex flex-col gap-5 items-center justify-center'>
            <p className='font-semibold text-sm md:text-base text-nowrap bg-hf-50 p-2 px-5 rounded-full '>{title}</p>
            <h2 className='font-semibold md:text-4xl text-primary-50 text-xl'>{sub}</h2>
        </div>
    </div>
  )
}

export default TitleHeader