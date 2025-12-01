import React from 'react';
import useRole from '../../../Hooks/useRole';
import { ClimbingBoxLoader } from 'react-spinners';
import AdminDashboardHome from './AdminDashboardHome';
import RiderDashboardHome from './RiderDashboardHome';
import UserDashboardHome from './UserDashboardHome';

const DashboardHome = () => {
    const {role,roleLoading}=useRole();
    if(roleLoading){
        return <ClimbingBoxLoader></ClimbingBoxLoader>
    }
    if(role==='admin'){
        return <AdminDashboardHome></AdminDashboardHome>
    }
    else if(role==='rider'){
        return <RiderDashboardHome></RiderDashboardHome>
    }
    else{
        return <UserDashboardHome></UserDashboardHome>
    }
};

export default DashboardHome;