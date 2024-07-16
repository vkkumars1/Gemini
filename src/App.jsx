import React from 'react';
import { Routes, Route, Navigate, BrowserRouter, Outlet } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Sidebar from './components/Sidebar/Sidebar';
import Main from './components/Main/Main';
import Login from './components/Login/Login';
import './App.css'; // Import the CSS file

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/sign-in" element={<Login />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={<MainApp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const ProtectedRoute = () => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className='loading'>
        <div className='loader-text'>Loading...</div>
      </div>
    );
  }

  return isSignedIn ? <Outlet /> : <Navigate to="/auth/sign-in" />;
};

const MainApp = () => (
  <>
    <Sidebar />
    <Main />
  </>
);

export default App;
