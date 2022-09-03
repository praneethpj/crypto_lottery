import { useMetamask } from '@thirdweb-dev/react'
import React from 'react'

function Login() {
    const connectWithMetaMask= useMetamask();
  return (
    <div className='bg-[#091818] min-h-screen flex flex-col items-center justify-center text-center'>
        <div className='flex flex-col items-center mb-10'>
            <img className='rounded-full h-56 w-56 mb-10' src="https://preppykitchen.com/wp-content/uploads/2020/04/Macaron-Recipe-1200-500x500.jpg" alt="" />
            <h1 className='text-6xl text-white font-bold'>Welcome Macoroni draw</h1>
            <h2 className='text-white'>Get started by logging in with your Metamask</h2>
           <button onClick={connectWithMetaMask} className='bg-white px-8 py-5 mt-10 rounded-lg shadow-lg font-bold'>
            Login with metamask
           </button>
            </div>
    </div>
  )
}

export default Login