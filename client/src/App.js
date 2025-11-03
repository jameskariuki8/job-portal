import React from 'react';
import './App.scss';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Add from './pages/add/Add';
import Message from './pages/message/Message';
import Messages from './pages/messages/Messages';
import Orders from "./pages/orders/Orders.jsx";
import MyGigs from "./pages/myGigs/MyGigs";
import Gig from "./pages/gig/Gig";
import Gigs from "./pages/gigs/Gigs";
import Home from './pages/home/Home';
import SuperAdmin from './pages/superadmin/SuperAdmin';
import Pay from './pages/pay/Pay';
import Success from './pages/success/Success';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
// Removed: BecomeSeller and BecomeSeller2 (redirecting to Register)
import Profile from './pages/profile/Profile';
import { LanguageProvider } from './contexts/LanguageContext';
import HowItWorks from './pages/howItWorks/HowItWorks';
import SellerDashboard from './pages/sellerDashboard/SellerDashboard';
import SellerLayout from './layouts/SellerLayout';

function App() {
  const queryClient = new QueryClient();
  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient} key={55}>
        <LanguageProvider>
          <div className='app'>
            <ScrollToTop />
            <Navbar key={3} />
            <Outlet key={5454} />
            <hr></hr>
            <Footer key={6563}/>
          </div>
        </LanguageProvider>
      </QueryClientProvider>
    )
  }
  // Root layout (site-wide navbar/footer)
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout></Layout>,
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/profile/:id",
          element: <Profile />
        },
        {
          path: "/gigs",
          element: <Gigs></Gigs>
        },
        {
          path: "gig/:id",
          element: <Gig />
        },
        {
          path: "/orders",
          element: <Orders />
        },
        {
          path: "/mygigs",
          element: <MyGigs />
        },
        {
          path: "/add",
          element: <Navigate to="/seller/add" replace />
        },
        {
          path: "/messages",
          element: <Messages />
        },
        {
          path: "/message/:id",
          element: <Message />
        },
        {
          path: "/login",
          element: <Login />
        },
        {
          path: "/register",
          element: <Register />
        },
        {
          path: "/pay/:id",
          element: <Pay />
        },
        {
          path: "/success",
          element: <Success />
        },
        {
          path: "/becomeSeller",
          element: <Navigate to="/register?seller=1" replace />
        },
        {
          path: "/becomeSeller2",
          element: <Navigate to="/register?seller=1" replace />
        },
        {
          path: "/how-it-works",
          element: <HowItWorks />
        },
        {
          path: "/superadmin",
          element: <SuperAdmin />
        },
      ]
    }
    ,
    // Seller area (no site navbar/footer). Lightweight provider shell.
    {
      path: "/seller",
      element: (
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <div className='app'>
              <ScrollToTop />
              <Outlet />
            </div>
          </LanguageProvider>
        </QueryClientProvider>
      ),
      children: [
        {
          element: <SellerLayout />,
          children: [
            { path: "dashboard", element: <SellerDashboard /> },
            { path: "mygigs", element: <MyGigs /> },
            { path: "add", element: <Add /> },
            { path: "orders", element: <Orders /> },
            { path: "messages", element: <Messages /> },
            { path: "message/:id", element: <Message /> },
          ]
        }
      ]
    },
    // Back-compat old path
    { path: "/seller-dashboard", element: <Navigate to="/seller/dashboard" replace /> },
  ]);
  return (
    [
      <RouterProvider key={1} router={router} />
    ]
  );
}

export default App;
