import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useClientContext } from '@context/ClientContext';
import Logo from '@assets/logo.svg';
import Icon from '@components/common/Icon';
import CheckoutModal from '@components/common/CheckoutModal';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartItems } = useClientContext();
  const location = useLocation();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Hamutea" className="h-10" />
            <span className="ml-2 font-bold text-[#462525] text-xl hidden sm:block">Hamutea</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-[#462525] hover:text-[#D91517] transition-colors ${location.pathname === '/' ? 'font-semibold' : ''}`}>
              Home
            </Link>
            <Link to="/menu" className={`text-[#462525] hover:text-[#D91517] transition-colors ${location.pathname === '/menu' ? 'font-semibold' : ''}`}>
              Menu
            </Link>
            <Link to="/order-history" className={`text-[#462525] hover:text-[#D91517] transition-colors ${location.pathname === '/order-history' ? 'font-semibold' : ''}`}>
              My Orders
            </Link>
            <div className="relative">
              <button 
                onClick={() => setShowCheckout(true)}
                className="text-[#462525] hover:text-[#D91517] transition-colors"
              >
                <Icon name="ShoppingBag" className="w-6 h-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#D91517] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
            <Link to="/sign-in" className="bg-[#D91517] text-white px-6 py-2 rounded-full hover:bg-[#c41315] transition-colors">
              Sign In
            </Link>
          </div>
          
          {/* Mobile Navigation */}
          <div className="flex items-center space-x-4 md:hidden">
            <div className="relative">
              <button 
                onClick={() => setShowCheckout(true)}
                className="text-[#462525] hover:text-[#D91517] transition-colors"
              >
                <Icon name="ShoppingBag" className="w-6 h-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#D91517] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#462525] hover:text-[#D91517] transition-colors"
            >
              <Icon name={isOpen ? "X" : "Menu"} className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link to="/" className={`text-[#462525] hover:text-[#D91517] transition-colors ${location.pathname === '/' ? 'font-semibold' : ''}`}>
                Home
              </Link>
              <Link to="/menu" className={`text-[#462525] hover:text-[#D91517] transition-colors ${location.pathname === '/menu' ? 'font-semibold' : ''}`}>
                Menu
              </Link>
              <Link to="/order-history" className={`text-[#462525] hover:text-[#D91517] transition-colors ${location.pathname === '/order-history' ? 'font-semibold' : ''}`}>
                My Orders
              </Link>
              <Link to="/sign-in" className="bg-[#D91517] text-white px-6 py-2 rounded-full hover:bg-[#c41315] transition-colors text-center">
                Sign In
              </Link>
            </div>
          </div>
        )}
      </nav>
      
      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={showCheckout} 
        onClose={() => setShowCheckout(false)} 
      />
    </>
  );
};

export default Navbar;