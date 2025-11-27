import React from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { FaRegTrashAlt, FaUserCheck } from "react-icons/fa";
import { MdGroupRemove } from "react-icons/md";
import Swal from 'sweetalert2';

const ApproveRider = () => {
    // axios
    const axiosSecure = useAxiosSecure();

    const { refetch, data: riders = [] } = useQuery({
        queryKey: ['riders', 'pending'],
        queryFn: async () => {
            const res = await axiosSecure.get('/riders');
            return res.data;
        }
    })

    const updateRiderStatus = (rider, status) => {
        const updateInfo = { status: status, email: rider.email }
        axiosSecure.patch(`/riders/${rider._id}`, updateInfo)
            .then(res => {
                if (res.data.modifiedCount) {
                    refetch();
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `Rider status is set to ${status}.`,
                        showConfirmButton: false,
                        timer: 2000
                    });
                }
            })
    }

    const handleApproval = rider => {
        updateRiderStatus(rider, 'approved');
    }

    const handleReject = rider => {
        updateRiderStatus(rider, 'rejected')
    }
    
    return (
        <div className=' max-w-6xl mx-auto py-5'>
            <div className="bg-white rounded-2xl p-4">
                <h2 className='text-2xl text-secondary font-bold'>
                    Riders Pending Approval: <span className='text-gray-500'>{riders.length}</span>
                </h2>
                <div className="overflow-x-auto mt-10">
                    <table className="table table-zebra">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>District</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                riders.map((rider, index) => <tr key={rider._id}>
                                    <th>{index + 1}</th>
                                    <td>{rider.name}</td>
                                    <td>{rider.email}</td>
                                    <td className={`${rider.status==='approved'? 'text-green-600' : rider.status==='pending'? 'text-yellow-600': 'text-red-600'}`}>
                                        {rider.status}
                                    </td>
                                    <td>{rider.riderDistrict}</td>
                                    <td className='space-x-1.5'>
                                        <button onClick={() => handleApproval(rider)} className='btn bg-primary '>
                                            <FaUserCheck />
                                        </button>
                                        <button onClick={()=>handleReject(rider)} className='btn bg-primary '>
                                            <MdGroupRemove />
                                        </button>
                                        <button className='btn bg-primary '>
                                            <FaRegTrashAlt />
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

export default ApproveRider;