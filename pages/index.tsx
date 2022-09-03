import {useAddress, useContract, useContractCall, useContractData} from '@thirdweb-dev/react'
import { ethers } from 'ethers'
import type {NextPage}
from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Marquee from 'react-fast-marquee'
import toast from 'react-hot-toast'
import {PropagateLoader} from 'react-spinners'
import AdminControls from '../components/AdminControls'
import CountDownTimer from '../components/CountDownTimer'
 
import Header from '../components/Header'
import Loading from '../components/Loading'
import Login from '../components/Login'
import { currency } from '../constants'

const Home: NextPage = () => {
    const address = useAddress();
    const [useTickets,setUserTickets]=useState(0);
 
    const {contract, isLoading} = useContract(process.env.NEXT_PUBLIC_CONTACT_ADDRESS);
    const [quantity,setQuantity]=useState<number>(1);

    const {data:remainigTickets}=useContractData(
        contract,
        "RemainingTickets"
    )

    const {data:currentRewardWining}=useContractData(
        contract,
        "CurrentWinningReward"
    )

    const {data:ticketPrice}=useContractData(
        contract,
        "ticketPrice"
    )
    const {data:ticketCommission}=useContractData(
        contract,
        "ticketCommission"
    )
    const {data:expiration}=useContractData(
        contract,
        "expiration"
    )
    const {mutateAsync:BuyTickets}=useContractCall(contract,"BuyTickets");    

    const {data:tickets}=useContractCall(contract,"getTickets");  
    
    const {data:winning}=useContractData(
        contract,
        "getWinningsForAddress",
        address
    );

    const{data:lastWinner}=useContractData(contract,"lastWinner");
    const{data:lastWinnerAmount}=useContractData(contract,"lastWinnerAmount");

    const {data:isLotteryOperator}=useContractData(
        contract,
        "lotteryOperator"
    );

    useEffect(()=>{
        if(!tickets) return;

        const totalTickets:string[]=tickets;

        const noOfUserTickets=totalTickets.reduce(
            (total,ticketAddress)=>(ticketAddress==address?total+1 : total),0
        );
        setUserTickets(noOfUserTickets);

    },[tickets,address]);

    const { mutateAsync: WithdrawWinnings } = useContractCall(contract, "WithdrawWinnings")



    const onWithdrawWinning = async ()=>{
        const notification = toast.loading("Withdrawing winings...");

        try{

            const data = await WithdrawWinnings(
                [{}]
            );

        toast.success("Tickets purchased successfully ",{
            id:notification
        })

        }catch(err){
            toast.error("Whoops something went to wrong!",{
                id:notification
            })
        }
    }

    if (isLoading) {
        return (
            <Loading/>)
    }

    if (! address) 
        return <Login/>

 
    const handledClick = async () =>{
        if(!ticketPrice) return;

        const notification = toast.loading("Buying your tickets...");

        try{

            const data = await BuyTickets([{
                value:ethers.utils.parseEther(
                    (Number(ethers.utils.formatEther(ticketPrice))*quantity).
                    toString()
                ),
            }]);

        toast.success("Tickets purchased successfully ",{
            id:notification
        })

        }catch(err){
            toast.error("Whoops something went to wrong!",{
                id:notification
            })
        }

    }


    console.log(address);
    return (
        <div className="bg-[#091818] min-h-screen flex flex-col">
            <Head>
                <title>Create Next App</title>

            </Head>
<div className='flex-1'>
<Header/>
<Marquee gradient={false} className="bg-[#0A1F1C] p-5 mb-5" speed={100}>
    <div className='flex  space-x-2 mx-10'>
    <h4 className='text-white font-bold'>Last Winner: {lastWinner?.toString()}</h4>
        <h4 className='text-white font-bold'>Previouse Winner: {lastWinnerAmount && ethers.utils.formatEther(lastWinnerAmount?.toString())}{" "} {currency}</h4>
    </div>
</Marquee>
{isLotteryOperator === address &&(
    <div className='flex justify-center'>
        <AdminControls/>
    </div>
)}
{winning>0 &&(
    <div className='max-w-md md:max-w-2xl lg:mx-w-4xl mx-auto mt-5'> 
        <button onClick={onWithdrawWinning} className='p-5 bg-gradient-to-b from-orange-500 to-emerald-600 animate-pulse text-center rounded-xl w-full'>
            <p>Winner Winner</p>
            <p>Total Winning: {ethers.utils.formatEther(winning.toString())}{" "}{currency}</p>
            <br/>
            <p>Click here to withdraw</p>
            

        </button>
    </div>
)}
<div className='space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5 max-w-8xl'>
                <div className='stats-container'>
                    <h1 className='text-5xl text-white font-semibold text-center'>The Next Draw</h1>
                    <div className='flex justify-between p-2 space-x-2'>
                        <div className='stats'>
                            <h2 className='text-sm'>Total Pool</h2>
                            <p className='text-xl'>{remainigTickets && ethers.utils.formatEther(currentRewardWining.toString())}{" "} {currency}</p>
                        </div>
                        <div className='stats'>
                            <h2 className='text-sm'>Ticket Remainig</h2>
                            <p className='text-xl'>{remainigTickets?.toNumber()}</p>
                        </div>
                    </div>
                    <div className='mt-5 mb-3'>
                        <CountDownTimer/>
                    </div>
                </div>

                <div className='stats-container space-y-2'>
                  <div className='stats-container'>

                    <div className='flex justify-between items-center text-white pb-2'>
                      <h2>Price per ticket </h2>
                      <p>{ticketPrice && ethers.utils.formatEther(ticketPrice.toString())}{" "} {currency}</p>
                    </div>
                   
                   <div className='flex text-white item-center space-x-2 bg-[#091818] border-[#004337] border-p4'>
                    <p>Ticket</p>
                    <input type="number" 
                    className='flex w-full bg-transparent text-right outline-none' 
                    min="1"
                    max="2"
                    value={quantity}
                    onChange={(e)=>setQuantity(Number(e.target.value))}
                    />
                   </div>

                   <div className='space-y-2 mt-5'>
                    <div className='flex item-center justify-between text-emerald-300 text-xs italic font-extrabold'>
                        <p>Total Cost of Tickets</p>
                        <p>{ticketPrice && Number(ethers.utils.formatEther(ticketPrice.toString()))*quantity} {currency}</p>
                    </div>
                    <div className='flex item-center justify-between text-emerald-300 text-xs italic'>
                        <p>Service fees</p>
                        <p>{ticketCommission && ethers.utils.formatEther(ticketCommission.toString())}{" "} {currency}</p>
                    </div>
                    <div className='flex item-center justify-between text-emerald-300 text-xs italic'>
                       <p> * Network fees</p>
                       <p>TBC</p>
                    </div>
                   </div>
                <button onClick={handledClick} disabled={expiration?.toString() < Date.now().toString() || remainigTickets?.toNumber() === 0} className='mt-5 w-full bg-gradient-to-br from-orange-500 to-emerald-300 px-10 py-5 rounded-md text-white shadow-xl disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed disabled:text-gray-100'>
                Buy {quantity}  Ticket for {" "} {
                    ticketPrice && 
                    Number(ethers.utils.formatEther(ticketPrice.toString())) * quantity
                }{" "}{currency}
                </button>
                  </div>
                  {
                    useTickets>0 && (
                        <div className='stats'>
                            <p className='text-lg mb-2'>You have {useTickets} in this draw</p>
                        <div className='flex max-w-sm flex-wrap gap-x-2 gap-y-2'>
                            {Array(useTickets).fill("").map((_,index)=>(
                                    <p className='text-emerald-500/30 rounded-lg flex- flex-shrink items-center justify-center text-xs italic'>{index + 1}</p>
                            ))}
                            </div>
                        </div>
                    )
                  }
                </div>
            </div>
</div>
       
           
<footer>
    ddd
</footer>

        </div>
    )
}

export default Home
