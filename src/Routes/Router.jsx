import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home/Home";
import Coverage from "../Pages/Coverage/Coverage";
import Error404 from "../Pages/Error/Error404";
import AboutUs from "../Pages/AboutUs/AboutUs";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Auth/Login/Login";
import Register from "../Pages/Auth/Register/Register";
import Rider from "../Pages/Rider/Rider";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import SendParcel from "../Pages/SendParcel/SendParcel";
import DashboardLayout from "../Layouts/DashboardLayout";
import MyParcels from "../Pages/Dashboard/MyParcels/MyParcels";
import Payment from "../Pages/Dashboard/Payment/Payment";
import { ClimbingBoxLoader } from "react-spinners";
import ParcelsDetails from "../Pages/Dashboard/ParcelsDetails/ParcelsDetails";
import PaymentSuccess from "../Pages/Dashboard/Payment/PaymentSuccess";
import PaymentCancel from "../Pages/Dashboard/Payment/PaymentCancel";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <Error404></Error404>,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: '/rider',
        element: <PrivateRoute>
          <Rider></Rider>
        </PrivateRoute>
      },
      {
        path: '/send-parcel',
        element: <PrivateRoute>
          <SendParcel></SendParcel>
        </PrivateRoute>,
        loader: () => fetch('/service-center.json').then(res => res.json()),
        hydrateFallbackElement:<ClimbingBoxLoader color='#CAEB66' className='mx-auto min-h-[50vh] '/>
      },
      {
        path: '/coverage',
        Component: Coverage,
        loader: () => fetch('/service-center.json').then(res => res.json()),
        hydrateFallbackElement:<ClimbingBoxLoader color='#CAEB66' className='mx-auto min-h-[50vh] '/>
      },
      {
        path: '/about-us',
        Component: AboutUs,
      }
    ]
  },
  {
    path: '/',
    element: <AuthLayout></AuthLayout>,
    errorElement: <Error404></Error404>,
    children: [
      {
        path: '/login',
        Component: Login,
      },
      {
        path: '/register',
        Component: Register
      }
    ]
  },
  {
    path: '/dashboard',
    element: <PrivateRoute>
      <DashboardLayout></DashboardLayout>
    </PrivateRoute>,
    errorElement: <Error404></Error404>,
    children: [
      {
        path: '/dashboard/my-parcels',
        Component: MyParcels,
      },
      {
        path: '/dashboard/payment/:parcelId',
        Component: Payment,
      },
      {
        path: '/dashboard/parcelsDetails/:parcelId',
        Component: ParcelsDetails,
      },
      {
        path: '/dashboard/payment-success',
        Component: PaymentSuccess,
      },
      {
        path: '/dashboard/payment-cancelled',
        Component: PaymentCancel,
      },
    ]
  },
]);

export default router;