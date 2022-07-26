import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

/* COMPONENTS */
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Container from './components/layout/Container'
/* PAGES */
import Login from './components/pages/Auth/Login'
import Home from './components/pages/Home'
import Register from './components/pages/Auth/Register'

function App() {
  return (
    <Router>
      <Navbar />
      <Container>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/' element={<Home />} />
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;
