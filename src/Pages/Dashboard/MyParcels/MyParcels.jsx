import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Swal from 'sweetalert2';
import { Link } from 'react-router';


const MyParcels = () => {
    // userdata
    const { user } = useAuth();
    // axios
    const axiosSecure = useAxiosSecure();
    // tanstack
    const { data: parcels = [], refetch } = useQuery({
        queryKey: ['myParcels', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user.email}`);
            return res.data;
        }
    })

    // delete
    const handleParcelDelete = (id) => {
        console.log(id);
        // alert
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                // fetch delete
                axiosSecure.delete(`/parcels/${id}`)
                    .then(res => {
                        console.log('after delete: ', res.data);
                        if (res.data.deletedCount) {
                            // refresh data on ui
                            refetch();
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your parcel request has been deleted.",
                                icon: "success"
                            });
                        }
                    })

            }
        });
    }
    // payment
    const handlePayment = async (parcel) => {
        // backend a jei data gula lagbe
        const paymentInfo = {
            cost: parcel.cost,
            parcelId: parcel._id,
            senderEmail: parcel.senderEmail,
            parcelName: parcel.parcelName,
        }
        // hit backend api
        const res = await axiosSecure.post('/create-checkout-session', paymentInfo);

        console.log(res.data.url);
        // go to checkout page
        window.location.assign(res.data.url);
    }
    return (
        <div className="max-w-6xl mx-auto py-5">
            <div className="bg-white rounded-2xl p-4">
                <h2 className='text-2xl text-secondary font-bold'>My Parcels : <span className='text-black font-semibold'>{parcels.length}</span></h2>
                <div className="overflow-x-auto">
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Cost</th>
                                <th>Payment</th>
                                <th>Delivery Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                parcels.map((parcel, index) => <tr key={parcel._id} className="bg-base-200">
                                    <th>{index + 1}</th>
                                    <td>{parcel.parcelName}</td>
                                    <td>{parcel.cost}</td>
                                    <td>
                                        {
                                            parcel.paymentStatus === 'paid' ?
                                                <span className='text-green-800 font-bold'>Paid</span>
                                                :
                                                <button
                                                    onClick={() => handlePayment(parcel)}
                                                    className='btn bg-primary rounded-2xl text-black'>Pay</button>

                                        }
                                    </td>
                                    <td>{'pending'}</td>
                                    <td className='space-x-1.5'>
                                        {/* view */}
                                        <Link to={`/dashboard/parcelsDetails/${parcel._id}`} className='btn btn-square hover:bg-primary'>
                                            <FaMagnifyingGlass />
                                        </Link>
                                        {/* edit */}
                                        <button className='btn btn-square hover:bg-primary'>
                                            <FiEdit />
                                        </button>
                                        {/* delete */}
                                        <button
                                            onClick={() => handleParcelDelete(parcel._id)}
                                            className='btn btn-square hover:bg-primary'>
                                            <MdDelete />
                                        </button>
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

export default MyParcels;