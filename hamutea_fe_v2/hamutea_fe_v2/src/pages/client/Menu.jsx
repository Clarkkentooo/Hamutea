import { useState, useEffect } from 'react';
import Ad1 from "@assets/promos/ad1.jpg"
import Ad2 from "@assets/promos/ad2.jpg"
import Ad3 from "@assets/promos/ad3.jpg"
import Ad4 from "@assets/promos/ad4.jpg"
import banner1 from '@assets/menu_assets/banner1.svg';
import banner2 from '@assets/menu_assets/banner2.svg';
import banner3 from '@assets/menu_assets/banner3.svg';
import images from "@utils/imageLoader";
import CartBar from "@features/client/menu/components/CartBar";
import { useClientContext } from "@context/ClientContext"
import Icon from "@components/common/Icon";
import { useNavigate } from 'react-router-dom';
import QRCodeImage from '@assets/menu_assets/HAMUTEA_QRPH.jpg';

// Add custom animations to tailwind
import './menu-animations.css';

// Import PayMongo service
import { createPaymentLink } from '@utils/paymongoService';

const Menu = () => {
    const [openAds, setOpenAds] = useState(true);
    const ads = [Ad1, Ad2, Ad3, Ad4];
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    
    const [columns, setColumns] = useState('repeat(5, 1fr)');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [quantities, setQuantities] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);
    const [activeTab, setActiveTab] = useState('description');
    const [activeCategory, setActiveCategory] = useState('Top Drinks');
    const [isCategoryChanging, setIsCategoryChanging] = useState(false);
    const [detailAnim, setDetailAnim] = useState(false);
    const bannerImages = [banner1, banner2, banner3];
    const [currentBanner, setCurrentBanner] = useState(0);
    const [showTotalSummary, setShowTotalSummary] = useState(false);
    const [summaryAnim, setSummaryAnim] = useState(false);
    const [pickupOption, setPickupOption] = useState('after');
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('QR Code');
    const [timeWarning, setTimeWarning] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [showQRPayment, setShowQRPayment] = useState(false);
    
    const navigate = useNavigate();
    
    // Custom time state
    const [customTime, setCustomTime] = useState('');
    const [customHour, setCustomHour] = useState('--');
    const [customMinute, setCustomMinute] = useState('--');
    const [customPeriod, setCustomPeriod] = useState('edit');
    
    // Ad rotation effect
    useEffect(() => {
        if (!openAds) return;
        
        const interval = setInterval(() => {
            setCurrentAdIndex((prev) => (prev + 1) % ads.length);
        }, 3500);
        
        return () => clearInterval(interval);
    }, [openAds, ads.length]);

    // Custom time effect
    useEffect(() => {
        setCustomTime(`${customHour}:${customMinute} ${customPeriod}`);
        
        if (pickupOption === 'custom' && customHour !== '--' && customMinute !== '--' && customPeriod !== 'edit') {
            setTimeWarning(false);
        }
    }, [customHour, customMinute, customPeriod, pickupOption]);

    const getQty = (key) => quantities[key] ?? 1;

    const { cartItems, setCartItems } = useClientContext();
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedAddOns, setSelectedAddOns] = useState([]);
    const [selectedSugar, setSelectedSugar] = useState('');
    const [selectedIce, setSelectedIce] = useState('');
    const [selectedNote, setSelectedNote] = useState('');
    const [showToast, setShowToast] = useState(false);

    const triggerToast = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    const resetSelections = () => {
        setSelectedSize('');
        setSelectedSugar('');
        setSelectedIce('');
        setSelectedAddOns([]);
        setSelectedNote('');
        setValidationErrors({ size: false, sugar: false, ice: false });

        if (selectedItem?.imageKey) {
            setQuantities(prev => {
                const copy = { ...prev };
                delete copy[selectedItem.imageKey];
                return copy;
            });
        }
    };

    const [validationErrors, setValidationErrors] = useState({
        size: false,
        sugar: false,
        ice: false,
    });

    // Handle responsive columns
    useEffect(() => {
        const updateColumns = () => {
            const width = window.innerWidth;
            if (width <= 480) setColumns('1fr');
            else if (width <= 768) setColumns('repeat(2, 1fr)');
            else if (width <= 1024) setColumns('repeat(3, 1fr)');
            else setColumns('repeat(5, 1fr)');
        };

        updateColumns();
        window.addEventListener('resize', updateColumns);
        return () => window.removeEventListener('resize', updateColumns);
    }, []);

    // Banner slider auto change
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBanner(prev => (prev + 1) % bannerImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [bannerImages.length]);
    
    // Remove test PayMongo integration - we'll use the proper service instead

    // Scroll to top when item is selected
    useEffect(() => {
        if (selectedItem) {
            window.scrollTo(0, 0);
        }
    }, [selectedItem]);

    // Summary effects
    useEffect(() => {
        const handleOpenSummary = () => {
            setShowTotalSummary(true);
            setTimeout(() => setSummaryAnim(true), 30);
        };

        window.addEventListener('openTotalSummary', handleOpenSummary);
        return () => window.removeEventListener('openTotalSummary', handleOpenSummary);
    }, []);

    useEffect(() => {
        if (showTotalSummary) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [showTotalSummary]);

    const menuItems = [
        // Top Drinks
        {
            name: 'Signature Pudding Dodol', category: 'Top Drinks', price: '₱110', imageKey: 'sig_pudding_dodol', description: 'A rich and creamy blend with our signature pudding and Hamutea Dodol', ingredients: ['Sugar', 'Pudding', 'Thick Milk', 'Iced'], sizes: [
                { size: 'Medium', price: '₱110' },
                { size: 'Large', price: '₱130' }
            ]
        },
        {
            name: 'No.3 Milk Tea', category: 'Classic Milktea Series', price: '₱110', imageKey: 'no_3_milktea', description: 'The third in line, but first in flavor—crafted to stand', ingredients: ['Sugar', 'Thick Milk', 'Iced'], sizes: [
                { size: 'Medium', price: '₱110' },
                { size: 'Large', price: '₱130' }
            ]
        },
        {
            name: 'Black Sugar Pearl Milk Tea', category: 'Top Drinks', price: '₱110', imageKey: 'black_sugar_pearl_milk_tea', description: 'A bold tea with deep caramel notes and chewy black sugar pearls', ingredients: ['Sugar', 'Thick Milk', 'Iced'], sizes: [
                { size: 'Medium', price: '₱110' },
                { size: 'Large', price: '₱120' }
            ]
        },
        {
            name: 'Black Sugar Pearl Milk Tea', category: 'Classic Milktea Series', price: '₱110', imageKey: 'black_sugar_pearl_milk_tea', description: 'A bold tea with deep caramel notes and chewy black sugar pearls', ingredients: ['Sugar', 'Thick Milk', 'Iced'], sizes: [
                { size: 'Medium', price: '₱110' },
                { size: 'Large', price: '₱120' }
            ]
        },
        {
            name: 'Red Bean Milk Tea', category: 'Classic Milktea Series', price: '₱90', imageKey: 'red_bean_milk_tea', description: 'A hearty tea balanced with the subtle sweetness of red beans', ingredients: ['Sugar', 'Thick Milk', 'Iced'], sizes: [
                { size: 'Medium', price: '₱90' },
                { size: 'Large', price: '₱110' }
            ]
        },
        {
            name: 'Coconut Jelly Milk Tea', category: 'Classic Milktea Series', price: '₱90', imageKey: 'coconut_jelly_milk_tea', description: 'A tropical twist featuring soft coconut jelly bits', ingredients: ['Sugar', 'Thick Milk', 'Iced'], sizes: [
                { size: 'Medium', price: '₱90' },
                { size: 'Large', price: '₱110' }
            ]
        },
        {
            name: 'Pudding Milk Tea', category: 'Classic Milktea Series', price: '₱90', imageKey: 'pudding_milk_tea', description: 'A smooth blend topped with rich pudding to comfort your cravings', ingredients: ['Sugar', 'Thick Milk', 'Iced'], sizes: [
                { size: 'Medium', price: '₱90' },
                { size: 'Large', price: '₱110' }
            ]
        },
        {
            name: 'Highland Barley Milk Tea', category: 'Classic Milktea Series', price: '₱90', imageKey: 'highland_barley_milk_tea', description: 'Nutty and soothing—barley adds a wholesome edge to your tea', ingredients: ['Sugar', 'Thick Milk', 'Iced'], sizes: [
                { size: 'Medium', price: '₱90' },
                { size: 'Large', price: '₱110' }
            ]
        },
        {
            name: 'Pearl Milk Tea', category: 'Top Drinks', price: '₱90', imageKey: 'pearl_milk_tea', description: "The timeless combo of pearls and milk tea you can't go wrong with", ingredients: ['Sugar', 'Thick Milk', 'Iced'], sizes: [
                { size: 'Medium', price: '₱90' },
                { size: 'Large', price: '₱110' }
            ]
        },
        {
            name: 'Pearl Milk Tea', category: 'Classic Milktea Series', price: '₱90', imageKey: 'pearl_milk_tea', description: "The timeless combo of pearls and milk tea you can't go wrong with", ingredients: ['Sugar', 'Thick Milk', 'Iced'], sizes: [
                { size: 'Medium', price: '₱90' },
                { size: 'Large', price: '₱110' }
            ]
        },
        {
            name: 'Oolong Milk Tea', category: 'Classic Milktea Series', price: '₱90', imageKey: 'oolong_milk_tea', description: 'Robust oolong flavor mellowed by creamy milk', ingredients: ['Sugar', 'Thick Milk', 'Iced'], sizes: [
                { size: 'Medium', price: '₱90' },
                { size: 'Large', price: '₱110' }
            ]
        },
        // Fresh Milk Tea
        {
            name: 'Black Sugar Pearl Fresh Milk', category: 'Fresh Milk Tea', price: '₱120', imageKey: 'skull2', description: 'Fresh milk swirled with dark sugar pearls deeply satisfying.', ingredients: ['Black Pearl', 'Fresh Milk', 'Sugar'], sizes: [
                { size: 'Medium', price: '₱120' },
                { size: 'Large', price: '₱130' }
            ]
        },
        {
            name: 'Black Sugar Matcha Fresh Milk', category: 'Fresh Milk Tea', price: '₱120', imageKey: 'skull2', description: 'Earthy matcha gets a bold upgrade with black sugar syrup', ingredients: ['Black Pearl', 'Fresh Milk', 'Sugar'], sizes: [
                { size: 'Medium', price: '₱120' },
                { size: 'Large', price: '₱130' }
            ]
        },
        // Fresh Fruit Tea
        {
            name: 'Passion QQ', category: 'Top Drinks', price: '₱100', imageKey: 'passion_qq', description: 'Fruity and fun with every bite a passion fruit and jelly delight', ingredients: ['Passion Fruit', 'Nata', 'Coconut Jelly'], sizes: [
                { size: 'Medium', price: '₱100' },
                { size: 'Large', price: '₱110' }
            ]
        },
        {
            name: 'Passion QQ', category: 'Fresh Fruit Tea', price: '₱100', imageKey: 'passion_qq', description: 'Fruity and fun with every bite a passion fruit and jelly delight', ingredients: ['Passion Fruit', 'Nata', 'Coconut Jelly'], sizes: [
                { size: 'Medium', price: '₱100' },
                { size: 'Large', price: '₱110' }
            ]
        },
        {
            name: 'Mighty Sunshine Orange', category: 'Fresh Fruit Tea', price: '₱110', imageKey: 'skull3', description: 'A bright citrus blast bottled as a tea', ingredients: ['Nata', 'Coconut Jelly'], sizes: [
                { size: 'Medium', price: '₱110' },
                { size: 'Large', price: '₱130' }
            ]
        },
        // Milk Shake
        {
            name: 'Yogurt Shake', category: 'Milk Shake', price: '₱100', imageKey: 'skull4', description: 'A tangy and creamy shake that wakes your tastebud', ingredients: ['Yogurt', 'Milk', 'Sugar', 'Iced'], sizes: [
                { size: 'Medium', price: '₱100' }
            ]
        },
        // Pure Tea
        {
            name: 'Black Tea', category: 'Pure Tea', price: '₱60', imageKey: 'skull5', description: 'Straightforward and strong pure black tea on ice', ingredients: ['Iced'], sizes: [
                { size: 'Medium', price: '₱60' },
                { size: 'Large', price: '₱90' }
            ]
        },
        {
            name: 'Green Tea', category: 'Pure Tea', price: '₱60', imageKey: 'skull5', description: 'Fresh and grassy green tea brewed to perfection', ingredients: ['Iced'], sizes: [
                { size: 'Medium', price: '₱60' },
                { size: 'Large', price: '₱90' }
            ]
        }
    ];
    
    return (
        <div className="flex flex-col min-h-screen bg-[#FDF8F8] w-full mt-10">
            {/* Popup Advertisement */}
            {openAds && (
                <div 
                    className="fixed top-0 left-0 w-full h-full z-50 bg-black bg-opacity-40 flex items-center justify-center"
                    onClick={() => setOpenAds(false)}
                >
                    <div
                        className="w-full max-w-5xl relative bg-[url('/src/assets/bg/pattern.svg')] bg-cover bg-center rounded-[30px] p-5 shadow-2xl border border-[#f6dcdc]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setOpenAds(false)}
                            className="absolute top-3 right-3 z-50 p-2 bg-[#FFF5F3] text-[#D91517] hover:bg-[#FFEFEF] rounded-full border border-[#f6dcdc] shadow-md transition-all duration-200 ease-in-out"
                        >
                            <Icon name="X" className="w-5 h-5" />
                        </button>

                        <div className="relative w-full h-auto overflow-hidden rounded-xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#fcd5ce]/40 to-[#fae1dd]/50 blur-2xl animate-pulse z-0"></div>
                            <div
                                className="flex transition-transform duration-700 ease-in-out relative z-10 touch-pan-x"
                                style={{ transform: `translateX(-${currentAdIndex * 100}%)` }}
                                onTouchStart={(e) => {
                                    const touchStart = e.touches[0].clientX;
                                    const handleTouchMove = (e) => {
                                        const touchEnd = e.touches[0].clientX;
                                        const diff = touchStart - touchEnd;
                                        if (Math.abs(diff) > 50) {
                                            if (diff > 0) {
                                                // Swipe left - next ad
                                                setCurrentAdIndex((prev) => (prev + 1) % ads.length);
                                            } else {
                                                // Swipe right - previous ad
                                                setCurrentAdIndex((prev) => (prev - 1 + ads.length) % ads.length);
                                            }
                                            document.removeEventListener('touchmove', handleTouchMove);
                                        }
                                    };
                                    document.addEventListener('touchmove', handleTouchMove, { passive: true });
                                    document.addEventListener('touchend', () => {
                                        document.removeEventListener('touchmove', handleTouchMove);
                                    }, { once: true });
                                }}
                            >
                                {ads.map((ad, i) => (
                                    <img
                                        key={i}
                                        src={ad}
                                        alt={`Ad ${i}`}
                                        className="w-full flex-shrink-0 object-contain rounded-xl"
                                    />
                                ))}
                            </div>
                            
                            {/* Ad navigation dots */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                {ads.map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${i === currentAdIndex ? 'bg-white scale-125' : 'bg-gray-400'}`}
                                        onClick={() => setCurrentAdIndex(i)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TOP BANNER SLIDER */}
            {!selectedItem && (
                <div className="mt-[45px] sm:mt-[60px] relative w-[94%] md:w-[95%] max-w-[1370px] mx-auto rounded-tl-[30px] rounded-br-[30px] overflow-hidden group bg-gray-100">
                    <div className="relative w-full pb-[35%]">
                        {bannerImages.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`Banner ${idx + 1}`}
                                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === currentBanner ? 'opacity-100' : 'opacity-0'}`}
                            />
                        ))}
                    </div>

                    <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => setCurrentBanner((currentBanner - 1 + bannerImages.length) % bannerImages.length)} className="bg-black bg-opacity-40 text-white rounded-full w-8 h-8 flex items-center justify-center">‹</button>
                        <button onClick={() => setCurrentBanner((currentBanner + 1) % bannerImages.length)} className="bg-black bg-opacity-40 text-white rounded-full w-8 h-8 flex items-center justify-center">›</button>
                    </div>

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {bannerImages.map((_, i) => (
                            <div key={i} className={`w-2.5 h-2.5 rounded-full ${i === currentBanner ? 'bg-white' : 'bg-gray-400'}`} />
                        ))}
                    </div>
                </div>
            )}

            {/* MENU LIST */}
            {!selectedItem ? (
                <div className="relative mx-auto mb-20 mt-5 sm:mt-10 p-3 sm:p-5 flex w-full max-w-[95%] bg-white border border-[#E0DEDE] rounded-[30px] overflow-hidden min-h-[600px] shadow-md">
                    {/* LEFT CATEGORY PANEL */}
                    <div className="flex-none w-[80px] pr-2 sm:w-[200px] overflow-y-auto px-1 sm:px-4 py-3 sm:py-5 border-r border-[#F0F0F0]">
                        <h2 className="font-[SF Pro Rounded] pl-2 font-semibold text-[20px] sm:text-[28px] text-[#462525] w-full text-center sm:text-left">Menu</h2>
                        <ul className="mt-3 flex flex-col gap-1.5 text-[11px] sm:text-[15px]">
                            {['Top Drinks', 'Classic Milktea Series', 'Fresh Milk Tea', 'Fresh Fruit Tea', 'Milk Shake', 'Pure Tea'].map((item, i) => (
                                <li key={i}
                                    className={`text-left text-[10px] sm:text-[15px] py-2 sm:py-2 px-3 sm:px-4 rounded-[12px] sm:rounded cursor-pointer font-[SF Pro Rounded] font-medium transition-all text-[#462525] ${activeCategory === item ? 'bg-[#D91517] text-white scale-[1.05]' : 'hover:text-[#D91517] opacity-80'}`}
                                    onClick={() => {
                                        setIsCategoryChanging(true);
                                        setTimeout(() => {
                                            setActiveCategory(item);
                                            setIsCategoryChanging(false);
                                        }, 200);
                                    }}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* RIGHT MENU GRID */}
                    <div className="flex-1 w-full px-2 sm:px-5 pb-5 pt-3 sm:pt-5 overflow-x-hidden">
                        <div className="flex items-center bg-[#F8F8F8] rounded-[30px] px-5 py-2 gap-2 w-full max-w-[500px] mb-6 shadow-sm hover:shadow-md transition-shadow">
                            <svg className="w-[18px] h-[18px]" fill="none" stroke="#848484" strokeWidth="1.5" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        setSearchQuery(searchInput.trim());
                                    }
                                }}
                                className="bg-[#F8F8F8] outline-none font-[SF Pro Rounded] text-[#848484] text-[15px] w-full"
                            />
                        </div>

                        <h1 className="font-[SF Pro Rounded] font-semibold text-[16px] sm:text-[24px] text-[#462525] mb-5 uppercase transition-all duration-300 ease-in-out w-full">{activeCategory}</h1>

                        <div className="w-full relative">
                            <div className="w-full pr-4 sm:pr-6 md:pr-8">
                                <div
                                    className={`grid gap-4 w-full max-w-[900px] mx-auto justify-center relative transition-all duration-200 ease-in-out transform ${isCategoryChanging ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0'}`}
                                    style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}
                                >
                                    {menuItems
                                        .filter(item => item.category === activeCategory)
                                        .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                        .length === 0 ? (
                                        <p className="text-center text-[#999] font-[SF Pro Rounded] text-[16px] col-span-full">Not available</p>
                                    ) : (
                                        menuItems
                                            .filter(item => item.category === activeCategory)
                                            .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                            .map((item, idx) => (
                                                <div key={idx} 
                                                    className="flex flex-col border border-[#E0DEDE] rounded-2xl p-4 overflow-hidden text-left hover:shadow-lg transition hover:border-[#D91517] h-[250px] cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedItem(item);
                                                        setSelectedSize('');
                                                        setIsEditing(false);
                                                        setEditingIndex(null);
                                                        setQuantities(prev => ({
                                                            ...prev,
                                                            [item.imageKey]: 1
                                                        }));
                                                        setTimeout(() => setDetailAnim(true), 50);
                                                    }}
                                                >
                                                    <div className="flex justify-center mb-4 relative">
                                                        <img src={item.imageKey ? images[item.imageKey] : item.image} alt={item.name} className="w-full h-[100px] sm:h-[120px] object-contain z-10 hover:scale-105 transition-transform" />
                                                    </div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <p className="font-[SF Pro Rounded] font-medium text-[14px] text-[#462525] w-[calc(100%-40px)] h-[60px] line-clamp-3">{item.name}</p>
                                                        <div>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedItem(item);
                                                                    setSelectedSize('');
                                                                    setIsEditing(false);
                                                                    setEditingIndex(null);
                                                                    
                                                                    // Set quantity to 1 when selecting an item
                                                                    setQuantities(prev => ({
                                                                        ...prev,
                                                                        [item.imageKey]: 1
                                                                    }));
                                                                    
                                                                    setTimeout(() => setDetailAnim(true), 50);
                                                                }}
                                                                className="font-[SF Pro Rounded] bg-[#D91517] text-white rounded-full text-[16px] font-bold transform transition-transform duration-150 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg flex items-center justify-center z-10"
                                                                style={{ width: '30px', height: '30px', padding: '0' }}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p className="text-left font-[SF Pro Rounded] text-[12px] text-[#D91517] font-semibold">
                                                        {selectedSize === 'Large' && selectedItem?.name === item.name
                                                            ? item.sizes?.find(sz => sz.size === 'Large')?.price
                                                            : `₱${parseFloat(item.price.replace('₱', '')).toFixed(2)}`
                                                        }
                                                    </p>
                                                </div>
                                            ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={`w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 transition-all duration-300 mt-[60px] ${detailAnim ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="bg-white rounded-[30px] shadow-lg p-5 sm:p-8 md:p-10">
                        <div className="flex items-center mb-6">
                            <button 
                                onClick={() => {
                                    setDetailAnim(false);
                                    setTimeout(() => setSelectedItem(null), 300);
                                    resetSelections();
                                }}
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F8F8F8] mr-4"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#462525" strokeWidth="2">
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h2 className="font-[SF Pro Rounded] font-semibold text-xl sm:text-2xl text-[#462525]">Customize Your Drink</h2>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Left side - Image and description */}
                            <div className="w-full md:w-1/3">
                                <div className="bg-[#F8F8F8] rounded-[20px] p-6 flex justify-center items-center mb-4">
                                    <img 
                                        src={selectedItem?.imageKey ? images[selectedItem.imageKey] : selectedItem?.image} 
                                        alt={selectedItem?.name} 
                                        className="w-full max-w-[200px] h-auto object-contain"
                                    />
                                </div>
                                
                                <h3 className="font-[SF Pro Rounded] font-semibold text-lg sm:text-xl text-[#462525] mb-2">{selectedItem?.name}</h3>
                                <p className="text-[#666] text-sm mb-4">{selectedItem?.description}</p>
                                
                                <div className="flex gap-4 mb-4">
                                    <button 
                                        className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'description' ? 'bg-[#D91517] text-white' : 'bg-[#F8F8F8] text-[#666]'}`}
                                        onClick={() => setActiveTab('description')}
                                    >
                                        Description
                                    </button>
                                    <button 
                                        className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'ingredients' ? 'bg-[#D91517] text-white' : 'bg-[#F8F8F8] text-[#666]'}`}
                                        onClick={() => setActiveTab('ingredients')}
                                    >
                                        Ingredients
                                    </button>
                                </div>
                                
                                <div className="bg-[#F8F8F8] rounded-[15px] p-4">
                                    {activeTab === 'description' ? (
                                        <p className="text-sm text-[#666]">{selectedItem?.description}</p>
                                    ) : (
                                        <ul className="list-disc pl-5 text-sm text-[#666]">
                                            {selectedItem?.ingredients.map((ingredient, i) => (
                                                <li key={i}>{ingredient}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            
                            {/* Right side - Customization options */}
                            <div className="w-full md:w-2/3">
                                {/* Size selection */}
                                <div className="mb-6">
                                    <h4 className="font-[SF Pro Rounded] font-semibold text-[#462525] mb-3">Size <span className="text-[#D91517]">*</span></h4>
                                    <div className="flex flex-wrap gap-3">
                                        {selectedItem?.sizes.map((size, i) => (
                                            <button
                                                key={i}
                                                className={`px-4 py-2 rounded-full text-sm font-medium border ${
                                                    selectedSize === size.size 
                                                    ? 'bg-[#D91517] text-white border-[#D91517]' 
                                                    : 'bg-white text-[#666] border-[#E0DEDE] hover:border-[#D91517]'
                                                } ${validationErrors.size ? 'border-red-500' : ''}`}
                                                onClick={() => {
                                                    setSelectedSize(size.size);
                                                    setValidationErrors(prev => ({...prev, size: false}));
                                                }}
                                            >
                                                {size.size} - {size.price}
                                            </button>
                                        ))}
                                    </div>
                                    {validationErrors.size && <p className="text-red-500 text-xs mt-1">Please select a size</p>}
                                </div>
                                
                                {/* Sugar level */}
                                <div className="mb-6">
                                    <h4 className="font-[SF Pro Rounded] font-semibold text-[#462525] mb-3">Sugar Level <span className="text-[#D91517]">*</span></h4>
                                    <div className="flex flex-wrap gap-3">
                                        {['0%', '25%', '50%', '75%', '100%'].map((sugar, i) => (
                                            <button
                                                key={i}
                                                className={`px-4 py-2 rounded-full text-sm font-medium border ${
                                                    selectedSugar === sugar 
                                                    ? 'bg-[#D91517] text-white border-[#D91517]' 
                                                    : 'bg-white text-[#666] border-[#E0DEDE] hover:border-[#D91517]'
                                                } ${validationErrors.sugar ? 'border-red-500' : ''}`}
                                                onClick={() => {
                                                    setSelectedSugar(sugar);
                                                    setValidationErrors(prev => ({...prev, sugar: false}));
                                                }}
                                            >
                                                {sugar}
                                            </button>
                                        ))}
                                    </div>
                                    {validationErrors.sugar && <p className="text-red-500 text-xs mt-1">Please select sugar level</p>}
                                </div>
                                
                                {/* Ice level */}
                                <div className="mb-6">
                                    <h4 className="font-[SF Pro Rounded] font-semibold text-[#462525] mb-3">Ice Level <span className="text-[#D91517]">*</span></h4>
                                    <div className="flex flex-wrap gap-3">
                                        {['No Ice', 'Less Ice', 'Regular Ice', 'Extra Ice'].map((ice, i) => (
                                            <button
                                                key={i}
                                                className={`px-4 py-2 rounded-full text-sm font-medium border ${
                                                    selectedIce === ice 
                                                    ? 'bg-[#D91517] text-white border-[#D91517]' 
                                                    : 'bg-white text-[#666] border-[#E0DEDE] hover:border-[#D91517]'
                                                } ${validationErrors.ice ? 'border-red-500' : ''}`}
                                                onClick={() => {
                                                    setSelectedIce(ice);
                                                    setValidationErrors(prev => ({...prev, ice: false}));
                                                }}
                                            >
                                                {ice}
                                            </button>
                                        ))}
                                    </div>
                                    {validationErrors.ice && <p className="text-red-500 text-xs mt-1">Please select ice level</p>}
                                </div>
                                
                                {/* Add-ons */}
                                <div className="mb-6">
                                    <h4 className="font-[SF Pro Rounded] font-semibold text-[#462525] mb-3">Add-ons (Optional)</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {['Pearl (+₱20)', 'Pudding (+₱25)', 'Nata (+₱15)', 'Cheese Cream (+₱30)'].map((addon, i) => {
                                            const isSelected = selectedAddOns.includes(addon);
                                            return (
                                                <button
                                                    key={i}
                                                    className={`px-4 py-2 rounded-full text-sm font-medium border ${
                                                        isSelected
                                                        ? 'bg-[#D91517] text-white border-[#D91517]' 
                                                        : 'bg-white text-[#666] border-[#E0DEDE] hover:border-[#D91517]'
                                                    }`}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setSelectedAddOns(prev => prev.filter(item => item !== addon));
                                                        } else {
                                                            setSelectedAddOns(prev => [...prev, addon]);
                                                        }
                                                    }}
                                                >
                                                    {addon}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                
                                {/* Special Instructions / Note */}
                                <div className="mb-8 animate-fadeIn">
                                    <h4 className="font-[SF Pro Rounded] font-semibold text-[#462525] mb-3">Special Instructions (Optional)</h4>
                                    <textarea
                                        placeholder="Add any special requests or notes for your drink..."
                                        value={selectedNote}
                                        onChange={(e) => setSelectedNote(e.target.value)}
                                        className="w-full border border-[#E0DEDE] rounded-lg p-3 text-sm text-[#666] focus:border-[#D91517] focus:outline-none transition-colors duration-200 min-h-[80px]"
                                    />
                                </div>
                                
                                {/* Quantity and Add to Cart */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                                    <div className="flex items-center bg-[#F8F8F8] rounded-full px-4 py-2">
                                        <button 
                                            className="w-8 h-8 flex items-center justify-center text-[#D91517] text-xl font-bold"
                                            onClick={() => {
                                                if (selectedItem?.imageKey && getQty(selectedItem.imageKey) > 1) {
                                                    setQuantities(prev => ({
                                                        ...prev,
                                                        [selectedItem.imageKey]: prev[selectedItem.imageKey] - 1
                                                    }));
                                                }
                                            }}
                                        >
                                            -
                                        </button>
                                        <span className="w-10 text-center font-medium">{selectedItem?.imageKey ? getQty(selectedItem.imageKey) : 1}</span>
                                        <button 
                                            className="w-8 h-8 flex items-center justify-center text-[#D91517] text-xl font-bold"
                                            onClick={() => {
                                                if (selectedItem?.imageKey) {
                                                    setQuantities(prev => ({
                                                        ...prev,
                                                        [selectedItem.imageKey]: (prev[selectedItem.imageKey] || 1) + 1
                                                    }));
                                                }
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                    
                                    <button 
                                        className="flex-1 bg-[#D91517] text-white font-medium py-3 px-6 rounded-full hover:bg-[#c41315] active:bg-[#a31113] transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
                                        onClick={() => {
                                            // Validate required fields
                                            const errors = {
                                                size: !selectedSize,
                                                sugar: !selectedSugar,
                                                ice: !selectedIce
                                            };
                                            
                                            if (errors.size || errors.sugar || errors.ice) {
                                                setValidationErrors(errors);
                                                return;
                                            }
                                            
                                            // Calculate price based on size and add-ons
                                            let basePrice = parseFloat(selectedItem.price.replace('₱', ''));
                                            if (selectedSize === 'Large') {
                                                const largePrice = selectedItem.sizes.find(sz => sz.size === 'Large')?.price;
                                                if (largePrice) {
                                                    basePrice = parseFloat(largePrice.replace('₱', ''));
                                                }
                                            }
                                            
                                            // Add price for add-ons
                                            let addOnPrice = 0;
                                            selectedAddOns.forEach(addon => {
                                                const priceMatch = addon.match(/\+₱(\d+)/);
                                                if (priceMatch && priceMatch[1]) {
                                                    addOnPrice += parseInt(priceMatch[1]);
                                                }
                                            });
                                            
                                            const totalPrice = basePrice + addOnPrice;
                                            
                                            // Create or update cart item
                                            const cartItem = {
                                                ...selectedItem,
                                                size: selectedSize,
                                                sugar: selectedSugar,
                                                ice: selectedIce,
                                                addOns: selectedAddOns,
                                                note: selectedNote,
                                                price: totalPrice,
                                                qty: getQty(selectedItem.imageKey)
                                            };
                                            
                                            if (isEditing && editingIndex !== null) {
                                                // Update existing item
                                                const updatedCart = [...cartItems];
                                                updatedCart[editingIndex] = cartItem;
                                                setCartItems(updatedCart);
                                            } else {
                                                // Add new item
                                                setCartItems(prev => [...prev, cartItem]);
                                            }
                                            
                                            // Reset and close
                                            resetSelections();
                                            setDetailAnim(false);
                                            setTimeout(() => setSelectedItem(null), 300);
                                            triggerToast();
                                        }}
                                    >
                                        {isEditing ? 'Update Cart' : 'Add to Cart'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {cartItems.length > 0 && !showTotalSummary && !selectedItem && (
                <div className="sticky bottom-0 left-0 right-0 z-40">
                    <CartBar
                        cartItems={cartItems}
                        total={cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)}
                        onClick={() => {
                            setShowTotalSummary(true);
                            setTimeout(() => setSummaryAnim(true), 30);
                        }}
                    />
                </div>
            )}
                
            {showTotalSummary && (
                <div className={`fixed inset-0 z-30 bg-[#FDF8F8] transition-all duration-500 ease-out overflow-y-auto overflow-x-hidden ${summaryAnim ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="mt-[80px] max-w-4xl mx-auto px-4 sm:px-6 pb-20">
                        <div className="flex items-center mb-6">
                            <button 
                                onClick={() => {
                                    setSummaryAnim(false);
                                    setTimeout(() => setShowTotalSummary(false), 300);
                                }}
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F8F8F8] mr-4"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#462525" strokeWidth="2">
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h2 className="font-[SF Pro Rounded] font-semibold text-xl sm:text-2xl text-[#462525]">Order Summary</h2>
                        </div>
                        
                        <div className="bg-white rounded-[30px] shadow-lg p-5 sm:p-8 mb-6">
                            <h3 className="font-[SF Pro Rounded] font-semibold text-lg text-[#462525] mb-4">Your Items</h3>
                            
                            {cartItems.length === 0 ? (
                                <p className="text-center text-gray-500 py-6">Your cart is empty</p>
                            ) : (
                                <div className="space-y-4">
                                    {cartItems.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-4">
                                            <div className="flex items-center">
                                                <div className="w-16 h-16 bg-[#F8F8F8] rounded-lg flex items-center justify-center mr-4">
                                                    <img 
                                                        src={item.imageKey ? images[item.imageKey] : item.image} 
                                                        alt={item.name} 
                                                        className="w-12 h-12 object-contain" 
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="font-[SF Pro Rounded] font-medium text-[#462525]">{item.name}</h4>
                                                    <p className="text-xs text-gray-500">
                                                        {item.size} • {item.sugar} Sugar • {item.ice}
                                                        {item.addOns && item.addOns.length > 0 && (
                                                            <span> • {item.addOns.join(', ')}</span>
                                                        )}
                                                    </p>
                                                    {item.note && (
                                                        <p className="text-xs text-gray-500 italic mt-1">
                                                            Note: {item.note}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center mt-1">
                                                        <span className="text-[#D91517] font-medium">₱{item.price.toFixed(2)}</span>
                                                        <span className="mx-2 text-gray-400">×</span>
                                                        <span>{item.qty}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center">
                                                <button 
                                                    className="text-gray-400 hover:text-[#D91517] mr-4"
                                                    onClick={() => {
                                                        // Edit item
                                                        setSelectedItem(item);
                                                        setSelectedSize(item.size);
                                                        setSelectedSugar(item.sugar);
                                                        setSelectedIce(item.ice);
                                                        setSelectedAddOns(item.addOns || []);
                                                        setSelectedNote(item.note || '');
                                                        setIsEditing(true);
                                                        setEditingIndex(index);
                                                        setQuantities(prev => ({
                                                            ...prev,
                                                            [item.imageKey]: item.qty
                                                        }));
                                                        setShowTotalSummary(false);
                                                        setTimeout(() => setDetailAnim(true), 50);
                                                        setSelectedAddOns(item.addOns || []);
                                                        setIsEditing(true);
                                                        setEditingIndex(index);
                                                        setQuantities(prev => ({
                                                            ...prev,
                                                            [item.imageKey]: item.qty
                                                        }));
                                                        setShowTotalSummary(false);
                                                        setTimeout(() => setDetailAnim(true), 50);
                                                    }}
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                    </svg>
                                                </button>
                                                <button 
                                                    className="text-gray-400 hover:text-[#D91517]"
                                                    onClick={() => {
                                                        // Remove item
                                                        setCartItems(prev => prev.filter((_, i) => i !== index));
                                                    }}
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {/* Order summary calculations */}
                            {cartItems.length > 0 && (
                                <div className="mt-6 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span>₱{cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-2 mt-2">
                                        <div className="flex justify-between font-medium">
                                            <span>Total</span>
                                            <span className="text-[#D91517]">₱{cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Pickup Time Section */}
                        {cartItems.length > 0 && (
                            <div className="bg-white rounded-[30px] shadow-lg p-5 sm:p-8 mb-6">
                                <h3 className="font-[SF Pro Rounded] font-semibold text-lg text-[#462525] mb-4">Pickup Time</h3>
                                
                                <div className="space-y-4">
                                    {/* After I Order Option */}
                                    <div 
                                        onClick={() => setPickupOption('after')}
                                        className="flex items-center gap-4 cursor-pointer"
                                    >
                                        <div className="w-[22px] h-[22px] border border-[#E0DEDE] rounded-full flex items-center justify-center">
                                            {pickupOption === 'after' && <div className="w-[11px] h-[11px] bg-[#61D76C] rounded-full" />}
                                        </div>
                                        <p className="text-[16px] text-[#3E3E3E] font-[SF Pro Rounded]">After I Order</p>
                                    </div>
                                    
                                    <hr className="border-[#E0DEDE]" />
                                    
                                    {/* Custom Time Option - Only available for E-wallet payments */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div 
                                                onClick={() => setPickupOption('custom')}
                                                className="w-[22px] h-[22px] border border-[#E0DEDE] rounded-full flex items-center justify-center cursor-pointer"
                                            >
                                                {pickupOption === 'custom' && <div className="w-[11px] h-[11px] bg-[#61D76C] rounded-full" />}
                                            </div>
                                            <p className="text-[16px] text-[#3E3E3E] font-[SF Pro Rounded]">
                                                Custom
                                            </p>
                                        </div>
                                        
                                        <input 
                                            type="time" 
                                            className={`border border-[#E0DEDE] rounded-[13px] px-3 py-2 text-[#462525] ${pickupOption !== 'custom' ? 'opacity-50' : ''}`}
                                            disabled={pickupOption !== 'custom'}
                                            onChange={(e) => {
                                                const [hour, minute] = e.target.value.split(':');
                                                const h = parseInt(hour);
                                                const suffix = h >= 12 ? 'PM' : 'AM';
                                                const hour12 = h % 12 === 0 ? 12 : h % 12;
                                                setCustomTime(`${hour12}:${minute} ${suffix}`);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Payment Method Section */}
                        {cartItems.length > 0 && (
                            <div className="bg-white rounded-[30px] shadow-lg p-5 sm:p-8 mb-6">
                                <h3 className="font-[SF Pro Rounded] font-semibold text-lg text-[#462525] mb-4">Payment Method</h3>
                                <p className="text-sm text-gray-500 mb-4">Select how you'd like to pay for your order</p>
                                
                                <div className="space-y-4">
                                    {/* QR Code Payment Option */}
                                    <div 
                                        onClick={() => setSelectedPayment('QR Code')}
                                        className="flex items-center justify-between cursor-pointer border border-[#D91517] rounded-lg p-3 bg-[#FEF2F2] mb-2 hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-[22px] h-[22px] border border-[#E0DEDE] rounded-full flex items-center justify-center">
                                                {selectedPayment === 'QR Code' && <div className="w-[11px] h-[11px] bg-[#61D76C] rounded-full" />}
                                            </div>
                                            <div>
                                                <p className="text-[16px] text-[#3E3E3E] font-[SF Pro Rounded]">QR Code Payment</p>
                                                <p className="text-[12px] text-[#D91517]">Recommended</p>
                                            </div>
                                        </div>
                                        
                                        <p className="text-[14px] text-[#999] font-[SF Pro Rounded]">
                                            Scan & Pay
                                        </p>
                                    </div>
                                    
                                    {/* Other Payment Options */}
                                    {['E-wallet', 'Cash on Pickup'].map((method) => (
                                        <div 
                                            key={method}
                                            onClick={() => {
                                                setSelectedPayment(method);
                                                // No need to reset pickup option when changing payment method
                                            }}
                                            className="flex items-center justify-between cursor-pointer border-b border-gray-100 pb-3"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-[22px] h-[22px] border border-[#E0DEDE] rounded-full flex items-center justify-center">
                                                    {selectedPayment === method && <div className="w-[11px] h-[11px] bg-[#61D76C] rounded-full" />}
                                                </div>
                                                <p className="text-[16px] text-[#3E3E3E] font-[SF Pro Rounded]">{method}</p>
                                            </div>
                                            
                                            <p className="text-[14px] text-[#999] font-[SF Pro Rounded]">
                                                {method === 'E-wallet' ? 'Pay online via GCash, Maya, etc.' : 'Pay at store'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {cartItems.length > 0 && (
                            <div className="flex justify-center">
                                <button 
                                    className="bg-[#D91517] text-white font-medium py-3 px-12 rounded-full hover:bg-[#c41315] active:bg-[#a31113] transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
                                    onClick={async () => {
                                        try {
                                            // E-wallet payments with custom pickup time require time to be set
                                            if (selectedPayment === 'E-wallet' && pickupOption === 'custom' && !customTime) {
                                                alert('Please set a time for your custom pickup');
                                                return;
                                            }
                                            
                                            const finalCustomTime = pickupOption === 'custom' ? customTime : "After Order";
                                            
                                            // For all payment methods, use the same flow
                                            const orderData = {
                                                customTime: finalCustomTime,
                                                items: cartItems,
                                                subtotal: cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
                                                total: cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
                                                paymentMethod: selectedPayment,
                                                pickupOption: pickupOption,
                                                customerName: 'Customer', // Add customer info for PayMongo
                                                customerEmail: 'customer@example.com',
                                                customerPhone: '09123456789'
                                            };
                                            
                                            // Store order in localStorage
                                            localStorage.setItem('hamutea_order', JSON.stringify(orderData));
                                            
                                            // Close the summary modal first
                                            setSummaryAnim(false);
                                            setTimeout(() => {
                                                setShowTotalSummary(false);
                                                
                                                if (selectedPayment === 'QR Code') {
                                                    // Show QR payment modal
                                                    setShowQRPayment(true);
                                                } else if (selectedPayment === 'E-wallet') {
                                                    // Navigate to payment page for online payment
                                                    navigate('/payment', { 
                                                        state: orderData,
                                                        autoProcess: true // Auto-process payment on page load
                                                    });
                                                } else {
                                                    // For cash payments, go directly to success page
                                                    navigate('/payment-success', { 
                                                        state: {
                                                            orderDetails: orderData
                                                        }
                                                    });
                                                }
                                            }, 300);
                                        } catch (error) {
                                            console.error('Checkout error:', error);
                                            alert('There was an error processing your checkout. Please try again.');
                                        }
                                    }}
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {showToast && (
                <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-[#D91517] text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 animate-bounce">
                    Item added to cart!
                </div>
            )}
            
            {/* QR Payment Modal */}
            {showQRPayment && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-1 sm:p-4">
                    <div 
                        className="absolute inset-0 bg-black transition-opacity duration-300 ease-in-out" 
                        style={{ opacity: showQRPayment ? 0.7 : 0 }}
                        onClick={() => setShowQRPayment(false)}
                    ></div>
                    <div 
                        className="bg-white rounded-[20px] shadow-xl p-2 w-[95%] max-w-md sm:max-w-lg relative z-[101] max-h-[90vh] overflow-y-auto transition-all duration-300 ease-in-out transform"
                        style={{ 
                            opacity: showQRPayment ? 1 : 0,
                            transform: showQRPayment ? 'scale(1)' : 'scale(0.9)'
                        }}
                    >
                        <h3 className="font-medium text-sm text-[#462525] mb-1 text-center">QR Code Payment</h3>
                        
                        <div className="flex flex-col items-center">
                            {/* QR Code - Responsive size for mobile with animation */}
                            <div className="mb-2 flex flex-col items-center animate-fadeIn">
                                <img 
                                    src={QRCodeImage} 
                                    alt="Payment QR Code" 
                                    className="w-[90%] max-w-[300px] sm:max-w-[350px] md:max-w-[400px] h-auto hover:scale-105 transition-transform duration-300 animate-float"
                                />
                                <a 
                                    href={QRCodeImage} 
                                    download="HAMUTEA_QRPH.jpg"
                                    className="text-xs text-blue-500 mt-1 underline hover:text-blue-700 transition-colors duration-200"
                                >
                                    Download QR Code
                                </a>
                            </div>
                            
                            {/* Minimized text with animation */}
                            <div className="text-center mb-2 animate-fadeIn" style={{animationDelay: '0.2s'}}>
                                <p className="text-xs">Total: ₱{cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)} • QR ID: gLXtvL • CODE: code_xjdVPSLN9on8XAawLXuiU2Vc</p>
                            </div>
                            
                            {/* Minimized receipt upload with animation */}
                            <div className="w-full animate-fadeIn" style={{animationDelay: '0.3s'}}>
                                <div className="border border-gray-300 rounded p-2 text-center hover:border-[#D91517] transition-colors duration-200">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        className="w-full text-xs cursor-pointer"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-2 mt-2">
                                <button 
                                    onClick={() => setShowQRPayment(false)}
                                    className="flex-1 py-2 border border-gray-300 rounded text-xs hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => {
                                        setShowQRPayment(false);
                                        
                                        // Get order data
                                        const orderData = {
                                            customTime: "After Order",
                                            items: cartItems,
                                            subtotal: cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
                                            total: cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
                                            paymentMethod: 'QR Code Payment'
                                        };
                                        
                                        // Navigate to success page
                                        navigate('/payment-success', { 
                                            state: { 
                                                orderDetails: orderData
                                            }
                                        });
                                    }}
                                    className="flex-1 py-2 rounded text-white text-xs bg-[#D91517] hover:bg-[#c41315] active:bg-[#a31113] transform hover:scale-105 active:scale-95 transition-all duration-200"
                                >
                                    Confirm Payment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Menu;