import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { ClimbingBoxLoader } from "react-spinners";

const Payment = () => {
    const { parcelId } = useParams();
    const axiosSecure = useAxiosSecure();

    const { isLoading, data: parcel } = useQuery({
        queryKey: ['parcels', parcelId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/${parcelId}`)
            return res.data
        },
    })
    if (isLoading) {
        return <ClimbingBoxLoader color='#CAEB66' className='mx-auto min-h-[50vh] ' />
    }

    // Payment
    const handlePayment=async()=>{
        // backend a jei data gula lagbe
        const paymentInfo={
            cost: parcel.cost,
            parcelId:parcel._id,
            senderEmail: parcel.senderEmail,
            parcelName: parcel.parcelName,
        }
        // hit backend api
        const res=await axiosSecure.post('/create-checkout-session',paymentInfo);

        console.log(res.data);
        // go to checkout page
        window.location.href=res.data.url;
    }
    return (
        <div className="max-w-5xl mx-auto py-5">
            <div className="bg-white rounded-2xl p-4">
                <h2 className='text-2xl text-secondary font-bold'>Please Pay ${parcel.cost} For: <span className='text-black font-semibold'>{parcel.parcelName}</span></h2>
                <button
                onClick={handlePayment} 
                className='btn bg-primary rounded-2xl'>Pay</button>
            </div>
        </div>
    );
};

export default Payment;