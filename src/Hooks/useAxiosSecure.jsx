import axios from 'axios';
import { useEffect } from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';

const axiosSecure = axios.create({
  baseURL: 'http://localhost:3000'
});


const useAxiosSecure = () => {
  // token verify
  const { user , logOut} = useAuth();
  const navigate= useNavigate();
  useEffect(() => {
    // intercept request
    const reqInterceptor=axiosSecure.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${user?.accessToken}`
      return config;
    });
    // interceptor response
    const resInterceptor=axiosSecure.interceptors.response.use((res)=>{
      return res;
    },(err)=>{
      console.log(err);

      const statusCode=err.status;
      if(statusCode ===401|| statusCode===403){
        logOut()
        .then(()=>{
          navigate('/login')
        })
      }



      return Promise.reject(err);
    })

    return ()=>{
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    }
  }, [user,logOut,navigate])

  return axiosSecure;
};

export default useAxiosSecure;