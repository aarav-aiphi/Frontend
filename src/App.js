// src/index.js

import React from "react";
import ReactDOM from "react-dom/client";
import Navbar from "./Navbar";
import { AuthProvider } from './context/AuthContext';
import { AllAgents } from "./AllAgents";
import Body from "./Body/Body";
import AOS from 'aos';
import { useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet,useLocation } from "react-router-dom";
import { AgentDetail } from "./AgentDetail";
import CreateAgentForm from "./Components/NewAgentForm/Agentform";
import { Login } from "./User/Login/login";
import { Signup } from "./User/UserSignUp/signup";
import { AdminDashboard } from "./Admin/AdminDash";
import ForgotPassword from "./User/ForgotPassword/ForgotPassword";
import ResetPassword from "./User/ResetPassword/ResetPassword";
import TreeMap from "./Map";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Footer } from "./Footer/Footer";
import NewsList from "./Components/Newslist";
import ScrollToTop from "./ScrollToTop";

// **Import Blog Components**
import BlogList from "./Components/BlogList";
import BlogDetails from "./Components/BlogDetails";
import BlogForm from "./Components/BlogForm";

// **Import Blog Context Provider**
import { BlogProvider } from "./context/BlogContext";
import UserDashboard from "./Components/UserDashboard.js/UserDashboard";
import PrivacyPolicy from "./Components/PrivacyPolicy/PrivacyPolicy";
import { Contact } from "./Contact/Contact";
import { Provider } from 'react-redux';
import store from "./redux/store";

const Applayout = () => {
  useEffect(() => {
    AOS.init({
        duration: 1000, // Animation duration
        once: true, // Whether animation should happen only once - while scrolling down
    });
}, []);
const location =useLocation();
const noNavbarRoutes=[];
    return (
        <>
        <Provider store={store}>
        <ScrollToTop />
        <AuthProvider>
        <BlogProvider>
        {!noNavbarRoutes.includes(location.pathname) && <Navbar />}
            <Outlet />
            <Footer />
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
               
            />
        </BlogProvider>
        </AuthProvider>
        </Provider>
        </>
    );
}

const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <Applayout />,
        children: [
            {
                path: "/",
                element: <Body />
            },
            {
                path: "/agent/:id",
                element: <AgentDetail />
            },
            {
                path: "/agentform",
                element: <CreateAgentForm />
            },
            {
                path: "/allagent/:id",
                element: <AllAgents />
            },
            {
                path: "/allagent",
                element: <AllAgents />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/signup",
                element: <Signup />
            },
            {
                path: "/admin-dashboard",
                element: <AdminDashboard />
            },
            {
                path: "/forgot-password",
                element: <ForgotPassword />
            },
            {
                path: "/reset-password/:token",
                element: <ResetPassword />
            },
            {
                path: "/map",
                element: <TreeMap />
            },
            {
                path: "/news",
                element: <NewsList />
            },
            // **Blog Routes**
            {
                path: "/blogs",
                element: <BlogList />
            },
            {
                path: "/blogs/:slug",
                element: <BlogDetails />
            },
            {
                path: "/add-blog",
                element: <BlogForm />
            }
            ,{
                path:"/userdash",
                element:<UserDashboard/>
            },{
                path:"/privacy",
                element:<PrivacyPolicy/>
            },{
                path:"/contact",
                element:<Contact/>
            }
        ]
    }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter} />);
