import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Hotels from './pages/Hotels.jsx'
import AddHotel from './pages/AddHotel.jsx'
import HotelDetail from './pages/HotelDetail.jsx'
import Rooms from './pages/Rooms.jsx'
import AddRoom from './pages/AddRoom.jsx'
import RoomDetail from './pages/RoomDetail.jsx'
import Bookings from './pages/Bookings.jsx'
import AddBooking from './pages/AddBooking.jsx'
import BookingDetail from './pages/BookingDetail.jsx'
import Payments from './pages/Payments.jsx'
import Users from './pages/Users.jsx'
import AddUser from './pages/AddUser.jsx'
import UserDetail from './pages/UserDetail.jsx'
import Staff from './pages/Staff.jsx'
import AddStaff from './pages/AddStaff.jsx'
import StaffDetail from './pages/StaffDetail.jsx'
import AddPayment from './pages/AddPayment.jsx'
// import AddPayments from './pages/AddPayments.jsx'
const router = createBrowserRouter([
  {
    path: '/',
    element: <App page={<Dashboard />} />,
  },
  {
    path: '/hotels',
    element: <App page={<Hotels />} />,
  },
  {
    path: '/hotels/add',
    element: <App page={<AddHotel />} />,
  },
  {
    path: '/hotels/:id',
    element: <App page={<HotelDetail />} />,
  },
  {
    path: '/rooms',
    element: <App page={<Rooms />} />,
  },
  {
    path: '/rooms/add',
    element: <App page={<AddRoom />} />,
  },
  {
    path: '/rooms/:id',
    element: <App page={<RoomDetail />} />,
  },
  {
    path: '/bookings',
    element: <App page={<Bookings />} />,
  },
  {
    path: '/bookings/add',
    element: <App page={<AddBooking />} />,
  },
  {
    path: '/bookings/:id',
    element: <App page={<BookingDetail />} />,
  },
  {
    path: '/payments',
    element: <App page={<Payments />} />,
  },
  {
    path: '/payments/add',
    element: <App page={<AddPayment />} />,
  },
  {
    path: '/users',
    element: <App page={<Users />} />,
  },
  {
    path: '/users/add',
    element: <App page={<AddUser />} />,
  },
  {
    path: '/users/:id',
    element: <App page={<UserDetail />} />,
  },
  {
    path: '/staff',
    element: <App page={<Staff />} />,
  },
  {
    path: '/staff/add',
    element: <App page={<AddStaff />} />,
  },
  {
    path: '/staff/:id',
    element: <App page={<StaffDetail />} />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
