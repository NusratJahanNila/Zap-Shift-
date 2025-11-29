import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { FaUserMinus, FaUserShield } from 'react-icons/fa';
import Swal from 'sweetalert2';

const UsersManagement = () => {
    // search
    const [searchText, setSearchText]=useState('');

    // axios
    const axiosSecure = useAxiosSecure();
    // data fetch
    const { refetch, data: users = [] } = useQuery({
        queryKey: ['users',searchText],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users?searchText=${searchText}`);
            return res.data;
        }
    })

    // user role k admin a convert kora
    const handleMakeAdmin = user => {
        const roleInfo = {
            role: 'admin',
        }
        // confirmation before making admin
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, make Admin!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.patch(`/users/${user._id}/role`, roleInfo)
                    .then(res => {
                        console.log(res.data)
                        if (res.data.modifiedCount) {
                            refetch();
                            Swal.fire({
                                position: "top-end",
                                icon: "success",
                                title: `${user.displayName} is marked as Admin.`,
                                showConfirmButton: false,
                                timer: 2000
                            });
                        }
                    })
            }
        });

    }
    // make user to admin
    const handleRemoveAdmin = user => {
        const roleInfo = {
            role: 'user',
        }
        // confirmation before remove
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Remove him/her!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.patch(`/users/${user._id}/role`, roleInfo)
                    .then(res => {
                        console.log(res.data)
                        if (res.data.modifiedCount) {
                            refetch();
                            Swal.fire({
                                position: "top-end",
                                icon: "success",
                                title: `${user.displayName} is removed from Admin.`,
                                showConfirmButton: false,
                                timer: 2000
                            });
                        }
                    })
            }
        });

    }
    return (
        <div className="max-w-6xl mx-auto py-5">
            <div className="bg-white rounded-2xl p-4  ">
                <h2 className='text-2xl text-secondary font-bold'>Users Management : <span className='text-xl text-black'>{users.length}</span></h2>

                <label className="input my-5">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2.5"
                            fill="none"
                            stroke="currentColor"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input
                        onChange={(e)=>setSearchText(e.target.value)}
                        type="search"
                        className="grow"
                        placeholder="Search"
                    />
                </label>

                <div className="overflow-x-auto">
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Admin Actions</th>
                                <th>Others Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users.map((user, index) => <tr key={user._id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle h-12 w-12">
                                                    <img
                                                        src={user.photoURL}
                                                        alt="" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{user.displayName}</div>
                                                <div className="text-sm opacity-50">United States</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td className=''>
                                        {
                                            user.role === 'admin' ? <button onClick={() => handleRemoveAdmin(user)} className='btn bg-red-600 '>
                                                <FaUserMinus />
                                            </button> : <button onClick={() => handleMakeAdmin(user)} className='btn bg-green-600 '>
                                                <FaUserShield />
                                            </button>

                                        }




                                    </td>
                                    <th>
                                        <button className="btn btn-ghost btn-xs">details</button>
                                    </th>
                                </tr>)
                            }

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersManagement;