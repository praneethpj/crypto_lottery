import { ArrowPathIcon, ArrowUturnDownIcon, CurrencyDollarIcon, StarIcon } from '@heroicons/react/24/solid'
import { useContract, useContractData } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import React from 'react'
import toast from 'react-hot-toast';
import { currency } from '../constants';

function AdminControls() {
    const {contract, isLoading} = useContract(process.env.NEXT_PUBLIC_CONTACT_ADDRESS);
    
    const { data:DrawWinnerTicket } = useContractData(contract, "DrawWinnerTicket")
    const { data:RefundAll } = useContractData(contract, "RefundAll")
    const { data:restartDraw } = useContractData(contract, "restartDraw")
    const { data:WithdrawCommission } = useContractData(contract, "WithdrawCommission")
    const { data:totalCommision } = useContractData(contract, "operatorTotalCommission")


    
    const onDrawWinner = async ()=>{
        const notification = toast.loading("Picking a Lucky Winner...");

        try{

            const data = await DrawWinnerTicket(
                [{}]
            );

        toast.success("A Winner has been Selected ",{
            id:notification
        })

        }catch(err){
            toast.error("Whoops something went to wrong!",{
                id:notification
            })
        }
    }

    const onWithdrawCommision = async ()=>{
        const notification = toast.loading("Withdrawing Commisions...");

        try{

            const data = await WithdrawCommission(
                [{}]
            );

        toast.success("Your Commision has been withdrawn successfully ! ",{
            id:notification
        })

        }catch(err){
            toast.error("Whoops something went to wrong!",{
                id:notification
            })
        }
    }

    
    const onRestartDraw= async ()=>{
        const notification = toast.loading("Restarting Draw...");

        try{

            const data = await restartDraw(
                [{}]
            );

        toast.success("Draw restarted successfully ",{
            id:notification
        })

        }catch(err){
            toast.error("Whoops something went to wrong!",{
                id:notification
            })
        }
    }

    const onRefundAll= async ()=>{
        const notification = toast.loading("Refunding All...");

        try{

            const data = await RefundAll(
                [{}]
            );

        toast.success("All refund successfully ",{
            id:notification
        })

        }catch(err){
            toast.error("Whoops something went to wrong!",{
                id:notification
            })
        }
    }
  return (
    <div className='text-white text-center px-5 py-3 rounded-md border-emerald-300/20 border'>
        <h2 className='font-bold'>Admin Controls</h2>
        <p className='mb-5'>Total Commisions to be Withdraw : {totalCommision && ethers.utils.formatEther(totalCommision?.toString())}{" "}
        {currency}
        </p>
        
        <div className='flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2'>
            <button onClick={onWithdrawCommision} className='admin-button'><CurrencyDollarIcon className='h-6 mb-2 mx-auto'/>Withdraw Commisions</button>
            <button onClick={onRestartDraw} className='admin-button'><ArrowPathIcon className='h-6 mb-2 mx-auto'/>Restart Draw</button>
            <button onClick={onRefundAll} className='admin-button'><ArrowUturnDownIcon className='h-6 mb-2 mx-auto'  />Refund All</button>
            <button onClick={onDrawWinner} className='admin-button'><StarIcon className='h-6 mb-2 mx-auto'  />Draw Winner</button>
        </div>
    </div>
  )
}

export default AdminControls