import { Link } from "react-router-dom"

import Logo from '../../assets/img/logo.png'

import styles from './Navbar.module.css'

const Navbar = () => {
    return (
      <nav className={styles.navbar}>
        <div className={styles.navbar_logo}>
            <img className={styles.navbar_logo_img} src={Logo} alt="Get A Pet" />
            <h2>Get A Pet</h2>
        </div>
        <ul>
            <li>
                <Link to={'/'}>Adotar</Link>
                <Link to={'/login'}>Entrar</Link>
                <Link to={'/register'}>Cadastrar</Link>
            </li>
        </ul>
      </nav>
    )
  }
  
  export default Navbar