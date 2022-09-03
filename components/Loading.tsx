import React from 'react'
import { PropagateLoader } from 'react-spinners'

function Loading() {
  return (
    <div> <div className='bg-[#091818] min-h-screen flex flex-col items-center justify-center text-center'>
    <div className='flex  items-center space-x-2 mb-10'>
                <img className='rounded-full h-20 w-20' src='https://preppykitchen.com/wp-content/uploads/2020/04/Macaron-Recipe-1200-500x500.jpg'/>
                <h1 className='text-lg text-white font-bold'>Loading draw</h1>
            </div>
            <PropagateLoader size={30} color="white"/>
        </div></div>
  )
}

export default Loading