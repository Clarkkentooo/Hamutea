import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import Logo from "@assets/svg/logo-lndscp.svg";
import FlatLogo from "@assets/svg/flat-logo-white.svg";
import LogoWithText from "@assets/svg/logo-text-white.svg";
import images from "@utils/imageLoader";
import Icon from "@components/common/Icon";
import { useClientContext } from "@context/ClientContext";
import { useAuth } from "@context/AuthContext";
import CheckoutModal from "@components/common/CheckoutModal";
import { NAV_ITEMS, SOCIAL_LINKS, FOOTER_LINKS } from "@utils/constants";

const ClientLayout = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const { cartItems } = useClientContext();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [location]);

    useEffect(() => {
        const handleOpenCheckout = () => setIsCheckoutOpen(true);
        window.addEventListener('openTotalSummary', handleOpenCheckout);
        return () => window.removeEventListener('openTotalSummary', handleOpenCheckout);
    }, []);

    return (
        <>
            <nav className="fixed top-0 left-0 w-full z-50 p-5">
                <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} isAuthenticated={isAuthenticated} />
                <div className="flex bg-hamutea-red rounded-full text-white justify-between items-center h-[40px] sm:h-[60px] px-4 sm:px-8">
                    <div className="flex items-center gap-4">
                        <Icon name="Menu" className="text-white w-6 h-6 md:hidden block cursor-pointer" onClick={() => setIsOpen(true)} />
                        <img src={Logo} alt="Hamutea Logo" className="h-6 md:block hidden" />
                    </div>
                    <img src={FlatLogo} alt="Hamutea" className="h-6 md:hidden block" />
                    <div className="flex gap-5 items-center">
                        <div className="gap-8 md:flex hidden">
                            <NavItems isAuthenticated={isAuthenticated} />
                        </div>
                        <AuthButton isAuthenticated={isAuthenticated} />
                        <CartIcon cartItems={cartItems} onClick={() => setIsCheckoutOpen(true)} />
                    </div>
                </div>
            </nav>
            
            <main>
                <Outlet />
            </main>
            
            <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
            <Footer />
        </>
    );
};

const MobileMenu = ({ isOpen, setIsOpen, isAuthenticated }) => (
    <div className={`md:hidden fixed top-0 left-0 h-screen w-screen bg-hamutea-red z-50 flex items-center justify-center flex-col text-white gap-10 transform transition-all duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="absolute top-10 right-10">
            <Icon name="X" className="text-white w-7 h-7 cursor-pointer" onClick={() => setIsOpen(false)} />
        </div>
        <NavItems setIsOpen={setIsOpen} isAuthenticated={isAuthenticated} />
    </div>
);

const NavItems = ({ setIsOpen, isAuthenticated }) => (
    <>
        {NAV_ITEMS.map((item, index) => (
            <Link
                to={item.href}
                onClick={() => setIsOpen?.(false)}
                key={index}
                className="cursor-pointer relative group overflow-hidden mx-3 text-sm"
            >
                {item.name}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full group-hover:left-0" />
            </Link>
        ))}
    </>
);

const AuthButton = ({ isAuthenticated }) => (
    isAuthenticated ? (
        <Link to="/account" className="bg-white rounded-full text-hamutea-red px-4 py-1.5 text-sm cursor-pointer md:block hidden">
            Account
        </Link>
    ) : (
        <Link to="/sign-up" className="bg-white rounded-full text-hamutea-red px-4 py-1.5 text-sm cursor-pointer md:block hidden">
            Sign Up
        </Link>
    )
);

const CartIcon = ({ cartItems, onClick }) => (
    <div className="relative cursor-pointer">
        {cartItems.length > 0 && (
            <div className="absolute -top-1 -right-2 bg-white text-hamutea-red w-4 h-4 rounded-full flex items-center justify-center text-[0.7rem]">
                {cartItems.length}
            </div>
        )}
        <Icon
            name="ShoppingCart"
            className="text-white w-6 h-6 shrink-0 cursor-pointer transform transition-transform duration-200 hover:scale-110 active:scale-90"
            onClick={onClick}
        />
    </div>
);

const Footer = () => (
    <footer className="bg-hamutea-red text-white p-6 sm:p-8 pb-2">
        <div className="flex mb-7 md:flex-row flex-col md:items-center">
            <div className="md:w-1/3 flex justify-center md:justify-start">
                <img src={LogoWithText} alt="Hamutea" className="h-20 md:h-24 md:mb-0 mb-5" />
            </div>
            <div className="md:w-1/3 flex justify-center items-center pb-5">
                <div className="flex flex-wrap gap-4 sm:gap-8 items-center justify-center px-4">
                    <NavItems />
                </div>
            </div>
            <div className="md:w-1/3 flex items-center justify-center md:justify-end">
                <SocialLinks />
            </div>
        </div>
        <FooterBottom />
    </footer>
);

const SocialLinks = () => (
    <div className="flex gap-4 items-center">
        {SOCIAL_LINKS.map(({ href, icon, alt }) => (
            <a key={icon} href={href} target="_blank" rel="noopener noreferrer">
                <img src={images[icon]} alt={alt} className="w-6 h-6 hover:scale-110 transition-all duration-300 cursor-pointer" />
            </a>
        ))}
    </div>
);

const FooterBottom = () => (
    <div className="border-t border-white w-full items-center flex md:justify-between justify-center md:px-5 px-0 py-5 md:flex-row flex-col gap-4">
        <div className="flex items-center gap-2">
            <div className="aspect-square h-2.5 w-2.5 rounded-full bg-white border-2 border-hamutea-gray" />
            <p className="text-sm">{new Date().getFullYear()} All rights reserved.</p>
        </div>
        <div className="flex items-center gap-6 sm:gap-8 text-sm flex-wrap justify-center">
            {FOOTER_LINKS.map((text) => (
                <Link key={text} to="#" className="hover:underline cursor-pointer">
                    {text}
                </Link>
            ))}
        </div>
    </div>
);

export default ClientLayout;