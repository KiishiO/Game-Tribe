// Sidebar.jsx - Navigation sidebar
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faGamepad, faShoppingCart, faUsers, faInfoCircle, faRocket } from '@fortawesome/free-solid-svg-icons';
import '../assets/styles/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src="/assets/myotherimages/GameTribe_Logo.png" width="50px" height="50px" style={{ borderRadius: '50%' }} alt="logo" />
      </div>
      <div className="sidebar-nav">
        <div className="sidebar-nav-item">
          <NavLink to="/"><FontAwesomeIcon icon={faHome} /></NavLink>
        </div>
        <div className="sidebar-nav-item">
          <NavLink to="/search"><FontAwesomeIcon icon={faGamepad} /></NavLink>
        </div>
        <div className="sidebar-nav-item">
          <NavLink to="/cart"><FontAwesomeIcon icon={faShoppingCart} /></NavLink>
        </div>
        <div className="sidebar-nav-item">
          <NavLink to="/profile"><FontAwesomeIcon icon={faUsers} /></NavLink>
        </div>
        <div className="sidebar-nav-item">
          <NavLink to="/team"><FontAwesomeIcon icon={faInfoCircle} /></NavLink>
        </div>
        <div className="sidebar-nav-item">
          <NavLink to="/future"><FontAwesomeIcon icon={faRocket} /></NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;