import React from 'react';
import { Link } from 'react-router';

const PaymentCancel = () => {
    return (
        <div className="max-w-5xl mx-auto py-5">
            <div className="bg-white rounded-2xl p-4 h-[50vh] flex items-center justify-center flex-col gap-5">
                <h2 className='text-4xl text-secondary font-bold'>Payment is Cancelled. Please try again</h2>
                <Link to='/dashboard/my-parcels'>
                    <button className='btn bg-primary rounded-2xl'>Try Again</button>
                </Link>
            </div>
        </div>
    );
};

export default PaymentCancel;