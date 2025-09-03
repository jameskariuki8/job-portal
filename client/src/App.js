import React from 'react';
import './App.scss';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import Add from './pages/add/Add';
import Message from './pages/message/Message';
import Messages from './pages/messages/Messages';
import Orders from "./pages/orders/Orders.jsx";
import MyGigs from "./pages/myGigs/MyGigs";
import Gig from "./pages/gig/Gig";
import Gigs from "./pages/gigs/Gigs";
import Home from './pages/home/Home';
import Pay from './pages/pay/Pay';
import Success from './pages/success/Success';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import BecomeSeller from './components/becomeSeller/BecomeSeller';
import BecomeSeller2 from './components/becomeSeller2/BecomeSeller2';
import Profile from './pages/profile/Profile';
import { LanguageProvider } from './contexts/LanguageContext';
import HowItWorks from './pages/howItWorks/HowItWorks';

function App() {
  const queryClient = new QueryClient();
  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient} key={55}>
        <LanguageProvider>
          <div className='app'>
            <Navbar key={3} />
            <Outlet key={5454} />
            <hr></hr>
            <Footer key={6563}/>
          </div>
        </LanguageProvider>
      </QueryClientProvider>
    )
  }
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
          element: <Add />
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
          element: <BecomeSeller />
        },
        {
          path: "/becomeSeller2",
          element: <BecomeSeller2 />
        },
        {
          path: "/how-it-works",
          element: <HowItWorks />
        },
      ]
    }
  ]);
  return (
    [
      <RouterProvider key={1} router={router} />
    ]
  );
}

export default App;
