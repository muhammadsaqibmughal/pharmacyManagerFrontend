import React from 'react';
import { useNavigate } from 'react-router-dom';
import { navLinks } from '../constants';
//  const navLinks = [
//   { name: 'Home', link: '/' },
//   { name: 'About', link: '/about' },
//   { name: 'Services', link: '/services' },
//   { name: 'Contact', link: '/contact' },
// ];


const Navbar = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/signup'); // Navigate to sign up page
  };

  const handleNavClick = (link) => {
    navigate(link); // Navigate to selected nav link
  };

  return (
    <div className="flex   bg-primary-50 w-full h-12 left-0">
      <div className="flex w-full justify-between items-center md:mx-10 mx-5">
        <h2
          className="text-lg font-semibold text-white cursor-pointer transform transition duration-300 hover:scale-105"
          onClick={() => navigate('/')}
        >
          PharmaConnect +
        </h2>

        <ul className="hidden relative md:flex gap-5">
          {navLinks.map((item) => (
            <li
              key={item.name} // Use unique string key
              className="relative group cursor-pointer transform transition duration-300 hover:scale-110 hover:font-semibold ease-in"
              
            >
              <span className="text-white text-sm"><a href={item.url}>{item.name}</a></span>
              <span className="absolute bottom-0 bg-white left-0 w-0 h-0.5 transform transition-all duration-300 group-hover:w-full" />
            </li>
          ))}
        </ul>

        <button
          onClick={handleRegisterClick}
          className="bg-bg-50 hover:bg-selected-50 rounded-xl p-1.5 transition duration-300"
        >
          <span className="text-primary-50 hover:text-white">Register</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
