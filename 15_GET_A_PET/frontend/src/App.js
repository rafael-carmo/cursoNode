import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

/* COMPONENTS */
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Container from './components/layout/Container'
import Message from './components/layout/Message'
/* PAGES */
import Login from './components/pages/Auth/Login'
import Home from './components/pages/Home'
import Register from './components/pages/Auth/Register'
/* CONTEXT */
import { UserProvider } from './context/UserContext'
import Profile from './components/pages/User/Profile'

function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <Message />
        <Container>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/user/profile' element={<Profile />} />
            <Route path='/' element={<Home />} />
          </Routes>
        </Container>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
