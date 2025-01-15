import React from 'react'
import { Button } from 'flowbite-react';


export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
        <div className='flex-1 justify-center flex flex-col'  >
            <h2 className='text-2xl'>
                Want to learn how to do EIA and Environmental Audit?
            </h2>
            <p className='text-gray-500 my-2'>Check out my course on EIA and environmental Audits report.</p>
            <Button gradientDuoTone='purpleToPink' className='rounded-full'>
                <a href="#" target='_blank' rel='noopener noreferrer'>Become an expert now</a>
            </Button>
        </div>
        <div className='flex-1 p-7'>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxz1fuj24lv__ta3P4emPjTrktwF6zmZG1dA&s" alt="" />
        </div>
      
    </div>
  )
}
