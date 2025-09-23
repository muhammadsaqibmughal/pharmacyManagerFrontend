// src/components/Modules.jsx
import React from 'react';
import { expCards } from '../constants';
import GlowCard from './GlowCard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Icons from './Icons';
import TitleHeader from './TitleHeader';

gsap.registerPlugin(ScrollTrigger);

const Modules = () => {
  useGSAP(() => {
    gsap.utils.toArray('.timeline-card').forEach((card) => {
      gsap.from(card, {
        xPercent: -100,
        opacity: 0,
        transformOrigin: 'left left',
        duration: 1,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
        },
      });
    });

    gsap.to('.timeline', {
      transformOrigin: 'bottom bottom',
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: '.timeline',
        start: 'top center',
        end: '80% center',
        onUpdate: (self) => {
          gsap.to('.timeline', {
            scaleY: 1 - self.progress,
          });
        },
      },
    });

    gsap.utils.toArray('.expText').forEach((text) => {
      gsap.from(text, {
        xPercent: 0,
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: text,
          start: 'top 60%',
        },
      });
    });
  }, []);

  return (
    <div id='services' className="mt-12 ">
      <div>
        <TitleHeader title='Pharmacy POS System' sub='Modules and Responsibilities'/>
      </div>
      <div className="relative mt-5 w-full xl:p-10 p-5   ">
        {expCards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col-reverse xl:flex-row max-xl:gap-25  overflow-hidden gap-5 max-xl:space-y-25 space-y-35"
          >
            <div className="xl:w-100 mt-5 max-sm:mx-5 max-md:mx-10 max-lg:mx-10 max-xl:mx-10">
              <GlowCard card={card} index={index} >
                  <div >
                      <Icons IconComponent={card.icon} iconClass={card.iconClass} />
                  </div>
              </GlowCard>
            </div>

            <div className="flex xl:w-4/6  max-sm:w-95 w-full overflow-hidden flex-row max-sm:ml-5 max-md:ml-20 max-lg:ml-32 max-xl:ml-40 p-5 gap-8">
              <div className="flex items-start gap-15">
                <div className="timeline-wrapper ">
                  <div className="timeline " />
                  <div className="gradient-line  " />
                </div>

                {/* ✅ Show only one icon for each card */}
                <Icons IconComponent={card.icon} iconClass={card.iconClass} />

                <div className="space-y-5 lg:ml-5 flex-1">
                  <h1 className="font-semibold text-3xl text-primary-50 max-sm:text-xl">{card.title}</h1>
                  <p className="text-Secondary-50 text-sm">Responsibilities</p>
                  {card.responsibilities.map((item, i) => (
                    <li
                      key={i}
                      className="expText exp-card-wrapper text-primary-50 max-sm:text-xs text-sm"
                    >
                      {item}
                    </li>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Modules;
