import React from 'react';
import useAuth from '../../../Hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const PaymentHistory = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { data: payments = [] } = useQuery({
        queryKey: ['payments', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user.email}`)
            return res.data;
        }
    })
    return (
        <div className="max-w-5xl mx-auto py-5">
            <div className="bg-white rounded-2xl p-4  ">
                <h2 className='text-2xl text-secondary font-bold'>Payment history: <span className='text-xl text-black'>{payments.length}</span></h2>

                <div className="overflow-x-auto mt-5">
                    <table className="table table-zebra">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Parcel Name</th>
                                <th>Amount</th>
                                <th>Transaction Id</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                payments.map((payment,index) => <tr key={payment._id}>
                                    <th>{index+1}</th>
                                    <td>{payment.parcelName}</td>
                                    <td>${payment.amount}</td>
                                    <td>{payment.transactionId}</td>
                                    <td>
                                        <button className='btn bg-primary'>View</button>
                                    </td>
                                </tr>)
                            }

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PaymentHistory;