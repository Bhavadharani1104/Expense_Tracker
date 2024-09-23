import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/Login';
import './Splash.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SplashGif from './Splash.gif';
import { Container, Row, Col } from 'react-bootstrap'; // Import from react-bootstrap

function SplashScreen() {
  return (
    <Container fluid className="splash-screen d-flex align-items-center justify-content-center">
      <Row className="justify-content-center">
        <Col className="d-flex align-items-center justify-content-center">
          <img src={SplashGif} alt="Splash Screen" className="splash-gif" />
          <h1 className="welcome-text">Expense Tracker</h1>
        </Col>
      </Row>
    </Container>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);  // Splash screen state

  useEffect(() => {
    // Set a timeout of 3 seconds before hiding the splash screen
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    // Cleanup the timeout when component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash ? (
        <SplashScreen /> // Display the splash screen for 3 seconds
      ) : (
        <Routes>
          <Route path='/' element={<ProtectedRoutes><HomePage /></ProtectedRoutes>} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      )}
    </>
  );
}

export function ProtectedRoutes(props) {
  if (localStorage.getItem('user')) {
    return props.children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default App;
