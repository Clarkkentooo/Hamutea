import { useState, useRef, useEffect } from "react";
import RED from "@assets/Contact_Assets/RED.svg";
import SEPARATOR from "@assets/Contact_Assets/Separator.svg";
import Mobile from "@assets/mobile_contact.svg"
import Desktop from "@assets/desktop_contact.svg"
import Left from "@assets/left.svg"
import Right from "@assets/right.svg"
import Icon from "@components/common/Icon";
import emailjs from 'emailjs-com';
import { EMAILJS_CONFIG } from "@utils/emailConfig";

const ContactUs = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const [showContactOptions, setShowContactOptions] = useState(false);
    const contactOptionsRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        franchiseType: '',
        investmentBudget: '',
        investmentArea1: '',
        investmentArea2: ''
    });
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [formSuccess, setFormSuccess] = useState(false);
    const [formError, setFormError] = useState('');
    
    // Philippine cities and their corresponding places/districts
    const philippineLocationsData = {
      // Metro Manila
      "Manila": ["Intramuros", "Binondo", "Ermita", "Malate", "Quiapo", "Sampaloc", "Tondo", "Paco"],
      "Quezon City": ["Cubao", "Diliman", "Eastwood", "Fairview", "Katipunan", "New Manila", "Novaliches"],
      "Makati": ["Ayala Center", "Bel-Air", "Legaspi Village", "Poblacion", "Rockwell Center", "Salcedo Village"],
      "Taguig": ["Bonifacio Global City", "McKinley Hill", "Fort Bonifacio", "Lower Bicutan", "Upper Bicutan"],
      "Pasig": ["Ortigas Center", "Kapitolyo", "Greenpark", "San Antonio", "Ugong", "Bagong Ilog"],
      
      // Luzon
      "Baguio City": ["Burnham Park", "Camp John Hay", "Mines View Park", "Session Road", "Teachers Camp"],
      "Angeles City": ["Balibago", "Clark Freeport Zone", "Friendship", "Malabanias", "Pampang"],
      "Batangas City": ["Alangilan", "Balagtas", "Kumintang", "Pallocan", "Poblacion", "Santa Rita"],
      
      // Visayas
      "Cebu City": ["Ayala Center Cebu", "Capitol Site", "Fuente Osmeña", "IT Park", "Lahug", "Mabolo"],
      "Iloilo City": ["Arevalo", "City Proper", "Jaro", "La Paz", "Lapuz", "Mandurriao", "Molo"],
      "Bacolod City": ["Alijis", "Banago", "Bata", "Capitol Shopping", "Estefania", "Mandalagan"],
      
      // Mindanao
      "Davao City": ["Agdao", "Buhangin", "Bunawan", "Calinan", "Poblacion", "Talomo", "Toril"],
      "Cagayan de Oro City": ["Agusan", "Carmen", "Gusa", "Lapasan", "Lumbia", "Macasandig", "Patag"],
      "Zamboanga City": ["Ayala", "Baliwasan", "Campo Islam", "Canelar", "Pasonanca", "Putik", "Santa Maria"]
    };

    const handleToggle = (index) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };
    
    const toggleContactOptions = () => {
        setShowContactOptions(prev => !prev);
    };
    
    // Close contact options when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contactOptionsRef.current && !contactOptionsRef.current.contains(event.target)) {
                setShowContactOptions(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    // Initialize EmailJS
    useEffect(() => {
        emailjs.init(EMAILJS_CONFIG.USER_ID);
    }, []);
    
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };
    
    const handleFranchiseTypeSelect = (type) => {
        setFormData(prev => ({
            ...prev,
            franchiseType: type
        }));
    };
    
    const handleAreaSelect = (e, areaNumber) => {
        const { value } = e.target;
        
        if (areaNumber === 1) {
            // When city is selected, reset the district
            setFormData(prev => ({
                ...prev,
                investmentArea1: value,
                investmentArea2: ''
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [`investmentArea${areaNumber}`]: value
            }));
        }
    };
    
    const handleFranchiseSubmit = (e) => {
        e.preventDefault();
        setFormSubmitting(true);
        setFormError('');
        
        const templateParams = {
            to_email: EMAILJS_CONFIG.RECIPIENT_EMAIL,
            from_name: formData.name,
            from_email: formData.email,
            franchise_type: formData.franchiseType,
            investment_budget: formData.investmentBudget,
            investment_area1: formData.investmentArea1,
            investment_area2: formData.investmentArea2
        };
        
        emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.FRANCHISE_TEMPLATE_ID,
            templateParams
        )
        .then(() => {
            setFormSuccess(true);
            setFormData({
                name: '',
                email: '',
                franchiseType: '',
                investmentBudget: '',
                investmentArea1: '',
                investmentArea2: ''
            });
            setTimeout(() => setFormSuccess(false), 5000);
        })
        .catch(error => {
            console.error('Email sending failed:', error);
            setFormError('Failed to send your application. Please try again later.');
        })
        .finally(() => {
            setFormSubmitting(false);
        });
    };

    return (
        <div className="relative w-full flex flex-col justify-center items-center pt-20 mt-14 min-h-screen">
            <div className="w-full max-w-7xl absolute top-20">
                <img src={RED} alt="Red" className="w-full h-auto" />
            </div>

            {/* Paragraph Positioned Absolutely */}
            <div className="z-10 max-w-[60rem] mt-32 md:mt-72 px-10">
                <h1 className="mt-7 text-[3rem] md:text-[5rem] w-full max-w-screen-sm mx-auto leading-normal font-semibold text-center bg-gradient-to-r from-[#E44040] to-[#FF7A31] bg-clip-text text-transparent break-words z-10 font-sf-pro-rounded">
                    General Enquiries
                </h1>
                <p className="font-sans font-medium text-[1rem] leading-snug text-center text-[#462525]">
                    Got questions, feedback, or just want to share your love for Milk tea with us?
                    We'd love to hear from you! For any general information or enquiries about Hamutea,
                    get in touch, and we'll get back to you as soon as we can.
                </p>

                <div className="flex items-center justify-center mt-5 relative" ref={contactOptionsRef}>
                    <button
                        className="px-10 bg-[#E44040] hover:bg-[#FF7A31] text-white text-[3vw] sm:text-sm md:text-base font-semibold transition-colors duration-300"
                        style={{ borderRadius: '30.1834px' }}
                        onClick={toggleContactOptions}
                    >
                        Contact Us
                    </button>
                    
                    {/* Contact Options Dropdown */}
                    {showContactOptions && (
                        <div className="absolute top-full mt-2 bg-white shadow-lg rounded-md p-4 z-20 w-64">
                            <div className="flex flex-col gap-3">
                                <a 
                                    href="mailto:faith@afanti.com.ph" 
                                    className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md transition-colors"
                                >
                                    <Icon name="Mail" className="w-5 h-5 text-[#E44040]" />
                                    <span>faith@afanti.com.ph</span>
                                </a>
                                <a 
                                    href="tel:09672068268" 
                                    className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md transition-colors"
                                >
                                    <Icon name="Phone" className="w-5 h-5 text-[#E44040]" />
                                    <span>09672068268</span>
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Freely Positioned Separator */}
            <div className="w-full mt-10">
                <img src={SEPARATOR} alt="Separator" className="w-full h-auto" />
            </div>

            <h1 className="my-10 w-full max-w-screen-sm mx-auto text-[6vw] sm:text-[5vw] md:text-[65px] leading-none font-semibold text-center text-[#D91517] whitespace-nowrap z-10 font-sf-pro-rounded">
                Collaboration process
            </h1>

            <div className="relative p-10">
                <picture>
                    <source media="(max-width: 640px)" srcSet={Mobile} />
                    <img src={Desktop} alt="Desktop" className="w-full h-auto" />
                </picture>
            </div>

            <div className="h-screen w-full relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 md:block hidden">
                    <img src={Left} alt="Left" className="w-full h-auto" />
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 md:block hidden">
                    <img src={Right} alt="Left" className="w-full h-auto" />
                </div>
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center px-10">
                    <div className="border w-full max-w-xl p-5 rounded-2xl border-hamutea-border bg-white">
                        <h1 className="text-2xl font-bold">Franchise Application</h1>
                        {formSuccess ? (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4">
                                <p>Thank you for your application! We'll contact you soon.</p>
                            </div>
                        ) : (
                            <form className="flex flex-col gap-5 mt-3" onSubmit={handleFranchiseSubmit}>
                                {formError && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                        <p>{formError}</p>
                                    </div>
                                )}
                                
                                <div className="relative mb-4">
                                    <input
                                        id="name"
                                        type="text"
                                        className="peer w-full px-3 pt-4 pb-2 border-b border-gray-300 bg-transparent text-black focus:outline-none focus:ring-0 focus:border-[#D91517] transition"
                                        required
                                        placeholder=" "
                                        aria-required="true"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                    <label
                                        htmlFor="name"
                                        className="absolute left-3 top-1 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-[#D91517] peer-focus:text-sm"
                                    >
                                        Name
                                    </label>
                                </div>

                                <div className="relative mb-4">
                                    <input
                                        id="email"
                                        type="text"
                                        className="peer w-full px-3 pt-4 pb-2 border-b border-gray-300 bg-transparent text-black focus:outline-none focus:ring-0 focus:border-[#D91517] transition"
                                        required
                                        placeholder=" "
                                        aria-required="true"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                    <label
                                        htmlFor="email"
                                        className="absolute left-3 top-1 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-[#D91517] peer-focus:text-sm"
                                    >
                                        Email / Phone no:
                                    </label>
                                </div>

                                <div className="relative mb-4 flex md:items-center md:flex-row flex-col justify-between px-2 gap-2">
                                    <p className="text-gray-400">Type of Franchise Application</p>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            type="button" 
                                            className={`px-3 py-2 border rounded-full transition-colors ${formData.franchiseType === 'Multi-Store' ? 'bg-[#D91517] text-white' : 'text-gray-400'}`}
                                            onClick={() => handleFranchiseTypeSelect('Multi-Store')}
                                        >
                                            Multi-Store
                                        </button>
                                        <button 
                                            type="button" 
                                            className={`px-3 py-2 border rounded-full transition-colors ${formData.franchiseType === 'Single-Store' ? 'bg-[#D91517] text-white' : 'text-gray-400'}`}
                                            onClick={() => handleFranchiseTypeSelect('Single-Store')}
                                        >
                                            Single Store
                                        </button>
                                    </div>
                                </div>

                                <div className="relative mb-4">
                                    <input
                                        id="investmentBudget"
                                        type="text"
                                        className="peer w-full px-3 pt-4 pb-2 border-b border-gray-300 bg-transparent text-black focus:outline-none focus:ring-0 focus:border-[#D91517] transition"
                                        required
                                        placeholder=" "
                                        aria-required="true"
                                        value={formData.investmentBudget}
                                        onChange={handleInputChange}
                                    />
                                    <label
                                        htmlFor="investmentBudget"
                                        className="absolute left-3 top-1 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-[#D91517] peer-focus:text-sm"
                                    >
                                        Investment Budget
                                    </label>
                                </div>

                                <div className="relative mb-4 flex md:items-center md:flex-row flex-col justify-between px-2 gap-2">
                                    <p className="text-gray-400">Investment Areas</p>
                                    <div className="flex items-center gap-2">
                                        <select
                                            className="px-3 py-2 border text-gray-400 rounded-full appearance-none bg-transparent focus:outline-none"
                                            value={formData.investmentArea1}
                                            onChange={(e) => handleAreaSelect(e, 1)}
                                        >
                                            <option value="" disabled hidden>Select City</option>
                                            {/* Metro Manila */}
                                            <optgroup label="Metro Manila">
                                                <option value="Manila">Manila</option>
                                                <option value="Quezon City">Quezon City</option>
                                                <option value="Makati">Makati</option>
                                                <option value="Taguig">Taguig</option>
                                                <option value="Pasig">Pasig</option>
                                                <option value="Parañaque">Parañaque</option>
                                            </optgroup>
                                            {/* Luzon */}
                                            <optgroup label="Luzon">
                                                <option value="Baguio City">Baguio City</option>
                                                <option value="Angeles City">Angeles City</option>
                                                <option value="Batangas City">Batangas City</option>
                                            </optgroup>
                                            {/* Visayas */}
                                            <optgroup label="Visayas">
                                                <option value="Cebu City">Cebu City</option>
                                                <option value="Iloilo City">Iloilo City</option>
                                                <option value="Bacolod City">Bacolod City</option>
                                            </optgroup>
                                            {/* Mindanao */}
                                            <optgroup label="Mindanao">
                                                <option value="Davao City">Davao City</option>
                                                <option value="Cagayan de Oro City">Cagayan de Oro City</option>
                                                <option value="Zamboanga City">Zamboanga City</option>
                                            </optgroup>
                                        </select>
                                        <select
                                            className="px-3 py-2 border text-gray-400 rounded-full appearance-none bg-transparent focus:outline-none"
                                            value={formData.investmentArea2}
                                            onChange={(e) => handleAreaSelect(e, 2)}
                                            disabled={!formData.investmentArea1}
                                        >
                                            <option value="" disabled hidden>Select District</option>
                                            {formData.investmentArea1 && philippineLocationsData[formData.investmentArea1]?.map((district, index) => (
                                                <option key={index} value={district}>{district}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="bg-hamutea-red text-white py-2 rounded-full disabled:opacity-70"
                                    disabled={formSubmitting}
                                >
                                    {formSubmitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full max-w-[50rem] mb-10 px-10">
                <h1 className="text-2xl font-bold mb-3">Frequently Asked Questions</h1>

                {[
                    {
                        question: "What types of milk tea do you offer?",
                        answer: "We offer a variety of milk tea flavors, including classic, fruit-infused, and creamy options."
                    },
                    {
                        question: "Do you have any promotions or discounts?",
                        answer: "Yes, we regularly offer promotions and discounts, especially during exam seasons or holidays. Follow us on social media to stay updated!"
                    },
                    {
                        question: "Can I customize my milk tea order?",
                        answer: "Yes, you can customize your milk tea with different flavors, sweetness levels, and ice options."
                    },
                    {
                        question: "Do you offer delivery or takeout?",
                        answer: "Yes, we offer both delivery and takeout options. Check our social media or website for more information."
                    },
                    {
                        question: "How do I contact Hamutea Milk Tea Shop?",
                        answer: "You can reach us through our social media pages or by visiting our shop directly."
                    }
                ].map((item, index) => (
                    <div key={index}>
                        <div
                            onClick={() => handleToggle(index)}
                            className="bg-hamutea-red rounded-full px-3 py-2 text-white mb-2 relative cursor-pointer"
                        >
                            <p>{index + 1}. {item.question}</p>
                            <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center justify-center">
                                <Icon
                                    name="ChevronDown"
                                    className={`w-6 h-6 shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
                                />
                            </div>
                        </div>

                        <div 
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                            }`}
                        >
                            <div className="bg-white rounded-2xl p-5 border border-hamutea-border mb-3">
                                <p>{item.answer}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ContactUs;