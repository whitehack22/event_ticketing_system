import { createBrowserRouter, RouterProvider } from 'react-router'
import './App.css'
import Error from './components/error/Error'
import AboutPage from './pages/AboutPage'
import LandingPage from './pages/LandingPage'
import { Toaster } from 'sonner'
import Register from './pages/auth/Register'
import VerifyUser from './pages/auth/VerifyUser'
import Login from './pages/auth/Login'
import { useSelector } from 'react-redux'
import type { RootState } from './app/store'
import AdminDashboard from './pages/dashboard/AdminDashboard/AdminDashboard'
import UserDashboard from './pages/dashboard/UserDashboard/UserDashboard'
import Events from './pages/dashboard/AdminDashboard/events/Events'
import Venues from './pages/dashboard/AdminDashboard/venues/Venues'
import Bookings from './pages/dashboard/AdminDashboard/bookings/Bookings'
import Payments from './pages/dashboard/AdminDashboard/payments/Payments'
import Users from './pages/dashboard/AdminDashboard/manageUsers/Users'
import CustomerSupport from './pages/dashboard/AdminDashboard/customerSupport/CustomerSupport'
import AdminProfile from './pages/dashboard/AdminDashboard/profile/AdminProfile'
import Analytics from './pages/dashboard/AdminDashboard/analytics/Analytics'
import UserEvents from './pages/dashboard/UserDashboard/events/UserEvents'

function App() {
   const isAdmin = useSelector((state: RootState) => state.user.user?.role === 'admin');
  const isUser = useSelector((state: RootState) => state.user.user?.role === 'user');
  
const router = createBrowserRouter([
    {
      path: '/',
      element: <LandingPage />,
    },
    {
      path: '/about',
      element: <AboutPage />
    },
    {
      path: '/register',
      element: <Register />
    },
     {
      path: '/register/verify',
      element: <VerifyUser />
    },
    {
      path: '/login',
      element: <Login />
    },
     // Admin Dashboard Routes
    {
      path: '/admin/dashboard',
       element: isAdmin ? <AdminDashboard /> : <Login />,
       children: [
        {
          path: 'analytics',
          element: <Analytics />
        },
        {
          path: 'bookings',
          element: <Bookings />
        },
        {
          path: 'payments',
          element: <Payments />
        },
        {
          path: 'events',
          element:<Events />
        },
        {
          path: 'venues',
          element:<Venues />
        },
        {  
          path: 'users',
          element: <Users />
        },
        {  
          path: 'customerSupport',
          element: <CustomerSupport />
        },
        {
          path: 'profile',
          element:<AdminProfile />
        },
        
      ]
    },
     // User Dashboard Routes
     {
      path: '/user/dashboard',
      element: isUser ? <UserDashboard /> : <Login />,
       children: [
        
        {
          path: 'bookings',
          element: <h1>Bookings</h1>
        },
        {
          path: 'payments',
          element: <h1>Payments</h1>
        },
        {
          path: 'events',
          element:< UserEvents />
        },
        {  
          path: 'customerSupport',
          element: <h1>User Customer Support</h1>
        },
        {
          path: 'profile',
          element:<h1>User Profile</h1>
        },
        
      ]
    },
    {
      path: '*',
      element: <Error />
    }
  ])
  return (
    <>
     <RouterProvider router={router} />
       <Toaster position='top-right' toastOptions={{
        classNames: {
          error: 'bg-red-500 text-white',
          success: 'bg-green-500 text-white',
          info: 'bg-blue-500 text-white',
        }

      }} />
    </>
  )
}

export default App
