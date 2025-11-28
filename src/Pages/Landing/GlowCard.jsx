import React, { useRef } from 'react'
import Icons from './Icons';

const GlowCard = ({card , children , index}) => {

  return (
    <div  className='card  card-border bg-bg-50 timeline-card rounded-xl p-8 max-sm:p-10 mb-5   break-inside-avoid'>
        {/* <div className='glow'/> */}
        <div className='flex items-center gap-1 mb-5'>
            {Array.from({length:5}, (_, i) => (
                <img src='/images/star.png ' key={i} alt='star' className='size-5 '/>
            ))}
        </div>
        <div className='mb-10 '>
            <p className='text-white-50 font-semibold text-sm ' >{card.review}</p>
        </div>
       <div className=' h-5  relative'>
         <div className='absolute  '>
            {children }

        </div>
       </div>


    </div>
  )
}

export default GlowCard