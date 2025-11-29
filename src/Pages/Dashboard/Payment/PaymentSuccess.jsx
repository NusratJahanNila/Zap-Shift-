import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const PaymentSuccess = () => {
    // Payment info
    const [paymentInfo, setPaymentInfo] = useState({});
    // jei parcel er payment hoyeche,tar sessionId dia payment-details ber korbe
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        if (sessionId) {
            axiosSecure.patch(`/payment-success?session_id=${sessionId}`)
                .then(res => {
                    console.log(res.data)
                    setPaymentInfo({
                        transactionId: res.data.transactionId,
                        trackingId: res.data.trackingId
                    })
                })
        }
    }, [sessionId, axiosSecure])
    return (
        <div className="max-w-5xl mx-auto py-5">
            <div className="bg-white rounded-2xl p-4 h-[50vh] ">
                <h2 className='text-4xl text-secondary font-bold'>Payment Successful</h2>
                <div className="mt-5">
                    <p className='text-gray-500 font-bold mt-3'>Your transaction Id  : <span className='text-black text-sm'> {paymentInfo?.transactionId}</span></p>
                    <p className='text-gray-500 font-bold mt-3'>Your Parcel tracking Id  : <span className='text-black text-sm'> {paymentInfo?.trackingId}</span></p>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;