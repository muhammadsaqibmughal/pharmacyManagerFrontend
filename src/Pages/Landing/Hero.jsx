import { words } from '../../constants/index.js';
import {useGSAP} from "@gsap/react"
import gsap from "gsap";
import { useTheme } from "../../theme-support/ThemeContext.jsx";

const Hero = () => {
      const { theme } = useTheme();
    
       useGSAP(() => {
        gsap.fromTo("h1",
            {
               y: 100,
               opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                stagger: 0.2,
                duration: 2,
                ease: 'power2.inOut',
            }
        )
    })
  return (
    <div className={`relative flex overflow-hidden items-center justify-center h-dvh ${
        theme === "dark" ? "bg-dark-50" : " bg-light-50"
      }`}>
        <div className=' flex justify-center gap-5 items-center   flex-col  '>
            <div className='absolute top-0 left-0 inset-0 bg-primary-50  z-0 pointer-events-none w-full h-full'>
                <img src='../images/pham.png' alt='background' className='h-full w-full  opacity-40'/>
            </div>
            <h1 className='lg:text-7xl md:text-4xl text-3xl text-bg-50 font-extrabold  tracking-[20px] '>PHARMACY</h1>
            <h1 className={`md:text-4xl md:font-semibold text-2xl ${theme === "dark" ? "text-light-50" : "text-white/80"} `}>Deleviring</h1>
            <span className={` inline-block   overflow-hidden h-12 ${theme === "dark" ? "text-light-50" : "text-white/80"} `}>
               <span className='flex  flex-col gap-5 w-100 animation-wordSlider '>
                 {words.map((item , index) => (
                    <span key={index} className='h-10  flex justify-center gap-3 md:gap-2 items-center'>
                        <span className='bg-selected-50 rounded-full p-2 text-black'> <item.icon className={`${theme === "dark" ? "text-light-50" : "text-white/80"} `}/> </span>
                        <span className='text-white-50 md:text-4xl text-2xl  font-semibold'>{item.text}</span>
                    </span>
                ))}
               </span>
            </span>
            <h1 className={`md:text-4xl md:font-semibold text-3xl ${theme === "dark" ? "text-light-50" : "text-white/80"} `}>with Precision & Care</h1>
            <h1 className={`md:text-4xl md:font-semibold text-3xl ${theme === "dark" ? "text-light-50" : "text-white/80"} `}>for Healthier Lives</h1>
        </div>
    </div>
  )
}

export default Hero
