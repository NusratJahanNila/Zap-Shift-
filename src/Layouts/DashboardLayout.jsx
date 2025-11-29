import React from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import Logo from '../Components/Logo/Logo';
import { MdOutlinePayments } from "react-icons/md";
import { RiMotorbikeFill } from "react-icons/ri";
import { FaBoxes, FaUser } from 'react-icons/fa';
import useRole from '../Hooks/useRole';
import { MdAssignmentInd } from "react-icons/md";

const DashboardLayout = () => {
    const {role}=useRole();

    return (
        <div className="drawer lg:drawer-open max-w-7xl mx-auto">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/* Navbar */}
                <nav className="navbar w-full bg-white shadow-sm">
                    <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
                        {/* Sidebar toggle icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
                    </label>
                    <div className="text-xl"><Logo></Logo></div>
                </nav>
                {/* Page content here */}
                <div className="bg-base-300 min-h-screen">
                    <Outlet></Outlet>
                </div>
            </div>

            <div className="drawer-side is-drawer-close:overflow-visible">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="flex min-h-full flex-col items-start bg-white shadow-sm is-drawer-close:w-14 is-drawer-open:w-64">
                    {/* Sidebar content here */}
                    <ul className="menu w-full grow">
                        {/* List item */}
                        <li>
                            <Link to='/' className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Homepage">
                                {/* Home icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                                <span className="is-drawer-close:hidden">Homepage</span>
                            </Link>
                        </li>

                        {/* Our list items */}
                        {/* my parcels */}
                        <li>
                            <NavLink to='/dashboard/my-parcels' className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="My Parcels">
                                <div >
                                    <FaBoxes className="my-1.5 inline-block size-4" />
                                </div>
                                <span className="is-drawer-close:hidden">
                                    <h2>My Parcels</h2>
                                </span>
                            </NavLink>
                        </li>
                        {/* payment history */}
                        <li>
                            <NavLink to='/dashboard/payment-history' className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Payment History">
                                <div >
                                    <MdOutlinePayments className="my-1.5 inline-block size-4" />
                                </div>
                                <span className="is-drawer-close:hidden">
                                    <h2>Payment History</h2>
                                </span>
                            </NavLink>
                        </li>
                        {/* Private links ,only for Admin */}
                        {
                            role === 'admin' && <>
                                {/* Approve Rider */}
                                <li>
                                    <NavLink to='/dashboard/approve-rider' className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Approve Rider">
                                        <div >
                                            <RiMotorbikeFill className="my-1.5 inline-block size-4" />
                                        </div>
                                        <span className="is-drawer-close:hidden">
                                            < h2>Approve Rider</h2>
                                        </span>
                                    </NavLink>
                                </li>
                                {/* Assign Riders */}
                                <li>
                                    <NavLink to='/dashboard/assign-riders' className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Assign Riders">
                                        <div >
                                            <MdAssignmentInd className="my-1.5 inline-block size-4" />
                                        </div>
                                        <span className="is-drawer-close:hidden">
                                            < h2>Assign Riders</h2>
                                        </span>
                                    </NavLink>
                                </li>
                                {/* Users Management */}
                                <li>
                                    <NavLink to='/dashboard/users-management' className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Users Management">
                                        <div >
                                            <FaUser className="my-1.5 inline-block size-4" />
                                        </div>
                                        <span className="is-drawer-close:hidden">
                                            < h2>Users Management</h2>
                                        </span>
                                    </NavLink>
                                </li>
                            </>
                        }

                        {/* List item */}
                        <li>
                            <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Settings">
                                {/* Settings icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M20 7h-9"></path><path d="M14 17H5"></path><circle cx="17" cy="17" r="3"></circle><circle cx="7" cy="7" r="3"></circle></svg>
                                <span className="is-drawer-close:hidden"> Settings</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;