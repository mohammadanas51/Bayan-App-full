import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom/client';
import Login from './components/Login/login';
import Signup from './components/Signup/signup';
import Viewbayan from './components/viewBayan/viewBayan';
import { Route, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './components/HomePage/homepage';
import AboutMe from './components/AboutMe/aboutMe';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />
  },
  
  {
    path: "/signup",
    element: <Signup />
  },

  {
    path: "/login",
    element: <Login />
  },

  {
    path: "/viewbayan",
    element: <Viewbayan />
  },
  {
    path: "/aboutme",
    element: <AboutMe />
  }

 

])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router = {router}/>
);
