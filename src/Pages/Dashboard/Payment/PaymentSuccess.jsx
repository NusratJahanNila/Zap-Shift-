import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const PaymentSuccess = () => {
    // Payment info
    const [paymentInfo,setPaymentInfo]=useState({});
    // jei parcel er payment hoyeche,tar sessionId dia payment-details ber korbe
    const [searchParams]=useSearchParams();
    const sessionId=searchParams.get('session_id');
    const axiosSecure=useAxiosSecure();

    useEffect(()=>{
        if(sessionId){
            axiosSecure.patch(`/payment-success?session_id=${sessionId}`)
                .then(res=>{
                    console.log(res.data)
                    setPaymentInfo({
                        transactionId: res.data.transactionId,
                        trackingId:res.data.trackingId
                    })
                })
        }
    },[sessionId,axiosSecure])
    return (
        <div className="max-w-5xl mx-auto py-5">
            <div className="bg-white rounded-2xl p-4 h-[50vh] grid grid-cols-1 items-center justify-center">
                <h2 className='text-4xl text-secondary font-bold'>Payment Successful</h2>
                <p>Your transaction Id: {paymentInfo?.transactionId}</p>
                <p>Your Parcel tracking Id: {paymentInfo?.trackingId}</p>
            </div>
        </div>
    );
};

export default PaymentSuccess;