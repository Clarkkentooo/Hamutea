    import { useState, useEffect, useMemo } from 'react';
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


    import { motion, AnimatePresence } from 'framer-motion';

    import { useNavigate } from 'react-router-dom';



    const Menu = () => {
        const [openAds, setOpenAds] = useState(true);
        const ads = [Ad1, Ad2, Ad3, Ad4];

        // Randomly pick one ad image once on mount
        const [currentAdIndex, setCurrentAdIndex] = useState(0);


        const [columns, setColumns] = useState('repeat(5, 1fr)');
        const [searchQuery, setSearchQuery] = useState('');
        const [searchInput, setSearchInput] = useState('');
        const [quantities, setQuantities] = useState({});
        const [selectedItem, setSelectedItem] = useState(null);
        const [activeTab, setActiveTab] = useState('description');
        const [activeCategory, setActiveCategory] = useState('Classic Milktea Series');
        const [isCategoryChanging, setIsCategoryChanging] = useState(false);
        const [detailAnim, setDetailAnim] = useState(false);
        const bannerImages = [banner1, banner2, banner3];
        const [currentBanner, setCurrentBanner] = useState(0);
        const [showTotalSummary, setShowTotalSummary] = useState(false);
        const [summaryAnim, setSummaryAnim] = useState(false);
        const [pickupOption, setPickupOption] = useState('after'); // 'after' or 'custom'
        const [showPaymentPopup, setShowPaymentPopup] = useState(false);
        const [selectedPayment, setSelectedPayment] = useState('GCash');
        const [timeWarning, setTimeWarning] = useState(false);


        const [isEditing, setIsEditing] = useState(false);
        const [editingIndex, setEditingIndex] = useState(null);

        const navigate = useNavigate();


        // Add to your state
        const [customTime, setCustomTime] = useState('');
        const [customHour, setCustomHour] = useState('--');
        const [customMinute, setCustomMinute] = useState('--');
        const [customPeriod, setCustomPeriod] = useState('edit');
        const generate12HourTimes = () => {
            const times = [];
            for (let hour = 0; hour < 24; hour++) {
                for (let minute = 0; minute < 60; minute += 30) {
                    const suffix = hour < 12 ? 'AM' : 'PM';
                    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
                    const min = minute === 0 ? '00' : minute;
                    times.push(`${hour12}:${min} ${suffix}`);
                }
            }


            return times;
        };

    useEffect(() => {
    if (!openAds) return;

    const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 3500); // changes ad every 3.5s

    return () => clearInterval(interval);
    }, [openAds]);




        useEffect(() => {
            setCustomTime(`${customHour}:${customMinute} ${customPeriod}`);

            // hide warning once valid custom time is set
            if (pickupOption === 'custom' && customHour !== '--' && customMinute !== '--' && customPeriod !== 'edit') {
                setTimeWarning(false);
            }
        }, [customHour, customMinute, customPeriod]);




        const getQty = (key) => quantities[key] ?? 1;

        const { cartItems, setCartItems } = useClientContext();
        const [selectedSize, setSelectedSize] = useState('');
        const [selectedAddOns, setSelectedAddOns] = useState([]);
        const [selectedSugar, setSelectedSugar] = useState('');
        const [selectedIce, setSelectedIce] = useState('');

        const [showToast, setShowToast] = useState(false);



        const triggerToast = () => {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000); // hide after 2 seconds
        };


        const resetSelections = () => {
            setSelectedSize('');
            setSelectedSugar('');
            setSelectedIce('');
            setSelectedAddOns([]);
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



        const addOnsPrice = selectedAddOns.length * 20;

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

        // Scroll to top when item is selected
        useEffect(() => {
            if (selectedItem) {
                window.scrollTo(0, 0);
            }
        }, [selectedItem]);


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

            // Cleanup in case component unmounts
            return () => {
                document.body.style.overflow = '';
            };
        }, [showTotalSummary]);


        const fadeInUp = {
            opacity: 0,
            transform: 'translateY(20px)',
        };

        const fadeInUpActive = {
            opacity: 1,
            transform: 'translateY(0)',
            transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        };




        const menuItems = [
            /// Classic Milktea Series
            {
                name: 'Signature Pudding Dodol', category: 'Classic Milktea Series', price: '₱110', imageKey: 'sig_pudding_dodol', description: 'A rich and creamy blend with our signature pudding and Hamutea Dodol', ingredients: ['Sugar', 'Pudding', 'Thick Milk', 'Iced'], sizes: [
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
                name: 'Pearl Milk Tea', category: 'Classic Milktea Series', price: '₱90', imageKey: 'pearl_milk_tea', description: 'The timeless combo of pearls and milk tea you can’t go wrong with', ingredients: ['Sugar', 'Thick Milk', 'Iced'], sizes: [
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
            {
                name: 'Pearl Green Milk Tea', category: 'Classic Milktea Series', price: '₱90', imageKey: 'pearl_green_milk_tea', description: 'Green tea meets pearls in a refreshing blend you will remember', ingredients: ['Sugar', 'Thick Milk', 'Iced'], sizes: [
                    { size: 'Medium', price: '₱90' },
                    { size: 'Large', price: '₱110' }
                ]
            },
            {
                name: 'Grand Slam', category: 'Classic Milktea Series', price: '₱140', imageKey: 'grand_slam', description: 'A champions cup packed with intense flavor in every sip', ingredients: ['Sugar', 'Thick Milk', 'Iced'], sizes: [
                    { size: 'Medium', price: '₱140' },
                    { size: 'Large', price: '₱140' }
                ]
            },
            /// Fresh Milk Tea
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
            /// Fresh Fruit Tea
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
            {
                name: 'Iced Lemon Water', category: 'Fresh Fruit Tea', price: '₱60', imageKey: 'iced_lemon_water', description: 'Cool and zesty, a lemony refresher made to hydrate', ingredients: ['Nata', 'Coconut Jelly'], sizes: [
                    { size: 'Large', price: '₱60' }
                ]
            },
            {
                name: 'Lemon Black/Green Tea', category: 'Fresh Fruit Tea', price: '₱60', imageKey: 'skull3', description: 'Classic tea with a lemon zing light yet flavorful', ingredients: ['Nata', 'Coconut Jelly'], sizes: [
                    { size: 'Medium', price: '₱60' },
                    { size: 'Large', price: '₱90' }
                ]
            },
            /// MilkShake
            {
                name: 'Yogurt Shake', category: 'Milk Shake', price: '₱100', imageKey: 'skull4', description: 'A tangy and creamy shake that wakes your tastebud', ingredients: ['Yogurt', 'Milk', 'Sugar', 'Iced'], sizes: [
                    { size: 'Medium', price: '₱100' },
                ]
            },
            {
                name: 'Black Tea Milk shake', category: 'Milk Shake', price: '₱90', imageKey: 'skull4', description: 'Robust black tea blended into a frosty sweet milkshake', ingredients: ['Black Tea', 'Milk', 'Sugar', 'Iced'], sizes: [
                    { size: 'Medium', price: '₱90' },
                ]
            },
            /// Pure Tea
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
            },
            {
                name: 'Oolong Tea', category: 'Pure Tea', price: '₱60', imageKey: 'skull5', description: 'Lightly roasted and floral classic oolong, served chilled', ingredients: ['Iced'], sizes: [
                    { size: 'Medium', price: '₱60' },
                    { size: 'Large', price: '₱90' }
                ]
            }
        ];


        const increaseQty = (index) => {
            setQuantities((prev) => ({ ...prev, [index]: (prev[index] || 0) + 1 }));
        };

        const decreaseQty = (index) => {
            setQuantities((prev) => ({ ...prev, [index]: Math.max(0, (prev[index] || 0) - 1) }));
        };

        return (
            <div className="flex flex-col min-h-screen bg-[#FDF8F8] w-full mt-10">

                <AnimatePresence>
                    {openAds && (
                        <motion.div
                            key="modal"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed top-0 left-0 w-full h-full z-50 bg-black bg-opacity-40 flex items-center justify-center"
                            onClick={() => setOpenAds(false)} // Close when clicking outside
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full max-w-5xl relative bg-[url('/src/assets/bg/pattern.svg')] bg-cover bg-center rounded-[30px] p-5 shadow-2xl border border-[#f6dcdc]"


                                onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
                            >
                                {/* Close Button */}
                                <button
    onClick={() => setOpenAds(false)}
    className="absolute top-3 right-3 z-50 p-2 bg-[#FFF5F3] text-[#D91517] hover:bg-[#FFEFEF] rounded-full border border-[#f6dcdc] shadow-md transition-all duration-200 ease-in-out"
    >
    <Icon name="X" className="w-5 h-5" />
    </button>




    <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className="relative w-full h-auto overflow-hidden rounded-xl"
    >
    <div
        className="absolute inset-0 bg-gradient-to-br from-[#fcd5ce]/40 to-[#fae1dd]/50 blur-2xl animate-pulse z-0"
    ></div>

    <div
        className="flex transition-transform duration-700 ease-in-out relative z-10"
        style={{ transform: `translateX(-${currentAdIndex * 100}%)` }}
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
    </motion.div>



                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>





                {/* TOP BANNER SLIDER */}
                {!selectedItem && (
                    <div className="mt-[45px] sm:mt-[80px] relative w-full max-w-[1370px] mx-auto rounded-tl-[30px] rounded-br-[30px] overflow-hidden group bg-gray-100">


                        <div className="relative w-full pb-[35%]"> {/* This keeps height stable */}
                            {bannerImages.map((img, idx) => (
                                <motion.img
                                    key={idx}
                                    src={img}
                                    alt={`Banner ${idx + 1}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: idx === currentBanner ? 1 : 0 }}
                                    transition={{ duration: 1 }}
                                    className="absolute top-0 left-0 w-full h-full object-cover"
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
    <div className="relative mx-auto mb-20 mt-5 sm:mt-10 p-3 sm:p-5 flex w-full max-w-[95%] bg-white border border-[#E0DEDE] rounded-[30px] overflow-hidden min-h-[600px]">


                        {/* LEFT CATEGORY PANEL */}
    <div className="flex-none w-[88px] pr-4  sm:w-[220px] overflow-y-auto px-1 sm:px-6 py-4 sm:py-6 border-r border-[#F0F0F0]">

    <h2 className="font-[SF Pro Rounded] pl-2 font-semibold text-[20px] sm:text-[30px] text-[#462525]">Menu</h2>
                        <ul className="mt-4 flex flex-col gap-2 text-[11px] sm:text-[16px]">


                                {['Classic Milktea Series', 'Fresh Milk Tea', 'Fresh Fruit Tea', 'Milk Shake', 'Pure Tea'].map((item, i) => (
                                    <li key={i}
                                        className={`text-left text-[10px] sm:text-[15px] py-2 sm:py-2 px-3 sm:px-4 rounded-[12px] sm:rounded cursor-pointer font-[SF Pro Rounded] font-semibold transition-all text-[#462525] ${activeCategory === item ? 'bg-[#D91517] text-white scale-[1.05]' : 'hover:text-[#D91517] opacity-80'}`}

                                        onClick={() => {
                                            setIsCategoryChanging(true);
                                            setTimeout(() => {
                                                setActiveCategory(item);
                                                setIsCategoryChanging(false);
                                            }, 200); // 200ms delay before showing new category
                                        }}

                                    >
                                        {item}
                                    </li>


                                ))}

                            </ul>
                        </div>

                        {/* RIGHT MENU GRID */}
                    <div className="flex-1 w-full px-2 sm:px-5 pb-5 pt-3 sm:pt-5 overflow-x-hidden">

                            <div className="flex items-center bg-[#F8F8F8] rounded-[30px] px-5 py-2 gap-2 w-full max-w-[500px] mb-6">
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

                            <h1 className="font-[SF Pro Rounded] font-semibold text-[15px] sm:text-[25px] text-[#462525] mb-6 uppercase transition-all duration-300 ease-in-out">{activeCategory}</h1>

                            <div className="w-full relative">
                                <div className="w-full pr-4 sm:pr-6 md:pr-8">




                                    <div /// Menu Items Grid
                                        className={`grid gap-4 w-full max-w-[900px] mx-auto justify-center relative transition-all duration-200 ease-in-out transform ${isCategoryChanging ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0 translate-x-4'}`}
                                        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}
                                    >


                                        {
                                            menuItems
                                                .filter(item => item.category === activeCategory)
                                                .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                                .length === 0 ? (
                                                <p className="text-center text-[#999] font-[SF Pro Rounded] text-[16px] col-span-full">Not available</p>
                                            ) : (
                                                menuItems
                                                    .filter(item => item.category === activeCategory)
                                                    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                                    .map((item, idx) => (
                                                        <div key={idx} className="flex flex-col border border-[#E0DEDE] rounded-2xl p-4 overflow-hidden text-left hover:shadow-lg transition">
                                                            <div className="flex justify-center mb-4 relative">
                                                                <img src={item.imageKey ? images[item.imageKey] : item.image} alt={item.name} className="w-full h-[100px] sm:h-[120px] object-contain z-10" />

                                                            </div>
                                                            <div className="flex justify-between items-center mb-2">
                                                            <p className="font-[SF Pro Rounded] font-semibold text-[14px] text-[#462525] w-20 h-[60px] flex items-center">{item.name}</p>

                                                                <div>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setSelectedItem(item);
                                                                            setSelectedSize('');
                                                                            setIsEditing(false);
                                                                            setEditingIndex(null);
                                                                            setTimeout(() => setDetailAnim(true), 50);


                                                                            setTimeout(() => setDetailAnim(true), 50); // trigger animation shortly after render
                                                                        }}

                                                                        className="px-3 py-2 [SF Pro Rounded] bg-[#D91517] text-white rounded-full text-[10px] transform transition-transform duration-150 hover:scale-110 active:scale-95"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <p className="text-left font-[SF Pro Rounded] text-[12px] text-[#462525]">
                                                                {selectedSize === 'Large' && selectedItem?.name === item.name
                                                                    ? item.sizes?.find(sz => sz.size === 'Large')?.price
                                                                    : `₱${parseFloat(item.price.replace('₱', '')).toFixed(2)}`
}
                                                            </p>

                                                        </div>
                                                    ))
                                            )
                                        }
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                ) : (
                    // Product Detail View
                    <div
                        className={`relative min-h-screen pt-[100px] px-4 sm:px-6 w-full flex items-center justify-center transition-all duration-500 ease-out transform ${detailAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    >



                        {/* Back Button */}
                        <button
                            onClick={() => {
                                setDetailAnim(false);
                                setTimeout(() => {
                                    setSelectedItem(null);
                                    resetSelections();
                                }, 300);
                            }}
                            className="fixed top-[90px] left-4 sm:top-[100px] sm:left-[20px] z-40
                bg-white border border-[#D91517] text-[#D91517] rounded-full 
                w-[42px] h-[42px] sm:w-[50px] sm:h-[50px]
                flex items-center justify-center shadow-md
                hover:bg-[#D91517] hover:text-white hover:scale-105 active:scale-95
                transition-all duration-200 ease-in-out"
                            aria-label="Go Back"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>



                        {/* Centered Content */}
                        <div className="relative z-10 flex flex-col md:flex-row justify-center items-center md:items-start gap-6 md:gap-10 max-w-screen-lg mx-auto w-full">
                            {/* Image */}
                            <img
                                src={images[selectedItem.imageKey]}
                                alt={selectedItem.name}
                                className="w-64 sm:w-72 md:w-80 h-auto object-contain"
                            />

                            {/* Details */}
                            <div className="w-full max-w-[600px]">

                                {/* Red Box */}
                                <div className="bg-[#D91517] rounded-[28px] p-6 flex flex-col gap-6 w-full">

                                    {/* Title + Price */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <h1 className="text-3xl sm:text-4xl font-bold font-[SF Pro Rounded] text-white">{selectedItem.name}</h1>
                                        <p className="text-xl sm:text-2xl font-semibold text-white">₱{parseFloat(selectedItem.price.replace('₱', '')).toFixed(2)}</p>

                                    </div>

                                    {/* Tabs + Quantity */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                                        {/* Tabs */}
                                        <div className="flex flex-wrap gap-3">
                                            <button
                                                onClick={() => setActiveTab('description')}
                                                className={`px-4 py-2 rounded-full font-semibold text-sm transition ${activeTab === 'description' ? 'bg-[#A31113] text-white' : 'bg-[#D91517]/20 text-white hover:bg-white/30'}`}
                                            >
                                                Description
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('ingredients')}
                                                className={`px-4 py-2 rounded-full font-semibold text-sm transition ${activeTab === 'ingredients' ? 'bg-[#A31113] text-white' : 'bg-[#D91517]/20 text-white hover:bg-white/30'}`}
                                            >
                                                Ingredients
                                            </button>
                                        </div>

                                        {/* Quantity */}
                                        <div className="flex items-center gap-2 bg-[#A31113] px-3 py-2 rounded-full self-start sm:self-auto">
                                            {/* Decrease Button */}
                                            <button
                                                onClick={() => setQuantities((prev) => ({
                                                    ...prev,
                                                    [selectedItem.imageKey]: Math.max(1, getQty(selectedItem.imageKey) - 1)
                                                }))}
                                                className="w-6 h-6 flex items-center justify-center bg-white text-[#D91517] rounded-full text-lg transition transform hover:scale-110 active:scale-90 hover:bg-gray-100"
                                            >-</button>

                                            <span className="text-white">{getQty(selectedItem.imageKey)}</span>

                                            {/* Increase Button */}
                                            <button
                                                onClick={() => setQuantities((prev) => ({
                                                    ...prev,
                                                    [selectedItem.imageKey]: getQty(selectedItem.imageKey) + 1
                                                }))}
                                                className="w-6 h-6 flex items-center justify-center bg-white text-[#D91517] rounded-full text-lg transition transform hover:scale-110 active:scale-90 hover:bg-gray-100"
                                            >+</button>

                                        </div>

                                    </div>

                                    {/* Description or Ingredients with smooth fade */}

                                    <div className="bg-[#A31113] p-4 rounded-2xl text-sm text-white transition-opacity duration-500 ease-in-out
    ">
                                        {activeTab === 'description' ? (
                                            <p className="transition-opacity duration-300 ease-in-out opacity-100">{selectedItem.description}</p>
                                        ) : (
                                            <div className="flex flex-wrap gap-2 transition-opacity duration-300 ease-in-out opacity-100">
                                                {selectedItem.ingredients?.length > 0
                                                    ? selectedItem.ingredients.map((ingredient, i) => (
                                                        <span key={i} className="px-3 py-1 bg-white/20 rounded-full">{ingredient}</span>
                                                    ))
                                                    : <span>Ingredients list is not available.</span>
                                                }
                                            </div>
                                        )}
                                    </div>



                                </div>


                                <div className="flex flex-col gap-6 mt-6">

                                    {/* Size Section */}
                                    <div className="border border-[#E0DEDE] rounded-[30px] bg-white p-6">
                                        <h3 className="font-[SF Pro Rounded] text-[#3E3E3E] text-[22px] mb-4 flex items-center gap-2">
                                            Size
                                            {validationErrors.size && <span className="text-red-500 text-sm">* This is required</span>}

                                        </h3>

                                        <div className="flex flex-col gap-4">
                                            {selectedItem.sizes?.map((sz, i) => (
                                                <label key={i} className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2">

                                                        <input
                                                            type="radio"
                                                            name="size"
                                                            value={sz.size}
                                                            checked={selectedSize === sz.size}
                                                            onChange={() => {
                                                                setSelectedSize(sz.size);
                                                                setValidationErrors(prev => ({ ...prev, size: false }));
                                                            }}
                                                            className="accent-[#61D76C]"
                                                        />

                                                        <span className="text-[#3E3E3E] text-[16px] font-[SF Pro Rounded]">{sz.size}</span>
                                                    </div>
                                                    <span className="text-[#3E3E3E] text-[16px] font-[SF Pro Rounded]">₱{parseFloat(sz.price.replace('₱', '')).toFixed(2)}</span>

                                                </label>
                                            ))}


                                        </div>
                                    </div>

                                    {/* Sugar Level Section */}
                                    <div className="border border-[#E0DEDE] rounded-[30px] bg-white p-6">
                                        <h3 className="font-[SF Pro Rounded] text-[#3E3E3E] text-[22px] mb-4 flex items-center gap-2">
                                            Sugar Level
                                            {validationErrors.sugar && <span className="text-red-500 text-sm">* This is required</span>}
                                        </h3>

                                        <div className="flex flex-col gap-4">
                                            {['0%', '10%', '30%', '50%', '70%', '100%'].map((sugar, i) => (
                                                <label key={i} className="flex items-center gap-2">

                                                    <input
                                                        type="radio"
                                                        name="sugar"
                                                        value={sugar}
                                                        checked={selectedSugar === sugar}
                                                        onChange={() => {
                                                            setSelectedSugar(sugar);
                                                            setValidationErrors(prev => ({ ...prev, sugar: false }));
                                                        }}
                                                        className="accent-[#61D76C]"
                                                    />

                                                    <span className="text-[#3E3E3E] text-[16px] font-[SF Pro Rounded]">{sugar}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Ice Section */}
                                    <div className="border border-[#E0DEDE] rounded-[30px] bg-white p-6">
                                        <h3 className="font-[SF Pro Rounded] text-[#3E3E3E] text-[22px] mb-4 flex items-center gap-2">
                                            Ice
                                            {validationErrors.ice && <span className="text-red-500 text-sm">* This is required</span>}
                                        </h3>


                                        <div className="flex flex-col gap-4">
                                            {['No Ice', 'Less Ice', 'More Ice'].map((ice, i) => (
                                                <label key={i} className="flex items-center gap-2">

                                                    <input
                                                        type="radio"
                                                        name="ice"
                                                        value={ice}
                                                        checked={selectedIce === ice}
                                                        onChange={() => {
                                                            setSelectedIce(ice);
                                                            setValidationErrors(prev => ({ ...prev, ice: false }));
                                                        }}
                                                        className="accent-[#61D76C]"
                                                    />

                                                    <span className="text-[#3E3E3E] text-[16px] font-[SF Pro Rounded]">{ice}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Toppings Section */}
                                    <div className="border border-[#E0DEDE] rounded-[30px] bg-white p-6">
                                        <h3 className="font-[SF Pro Rounded] text-[#3E3E3E] text-[22px] mb-4">Add-Ons</h3>
                                        <div className="flex flex-col gap-4">
                                            {[
                                                { name: 'Brown Sugar Pearls', price: '+₱20.00' },
                                                { name: 'Cononut Jelly', price: '+₱20.00' },
                                                { name: 'Red Beans', price: '+₱20.00' },
                                                { name: 'Pudding', price: '+₱20.00' },
                                                { name: 'Bwild Barley', price: '+₱20.00' }
                                            ].map((topping, i) => (
                                                <label key={i} className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            value={topping.name}
                                                            checked={selectedAddOns.includes(topping.name)}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                setSelectedAddOns(prev =>
                                                                    prev.includes(value)
                                                                        ? prev.filter(item => item !== value) // REMOVE if uncheck
                                                                        : [...prev, value] // ADD if check
                                                                );
                                                            }}
                                                            className="accent-[#61D76C]"
                                                        />

                                                        <span className="text-[#3E3E3E] text-[16px] font-[SF Pro Rounded]">{topping.name}</span>
                                                    </div>
                                                    <span className="text-[#CBCBCB] italic text-[15px]">
                                                        {topping.price}
                                                    </span>
                                                </label>
                                            ))}


                                        </div>

                                    </div>
                                    {/* ADD TO CART BUTTON */}
                                    <button
                                        onClick={() => {
                                            const errors = {
                                                size: !selectedSize,
                                                sugar: !selectedSugar,
                                                ice: !selectedIce,
                                            };

                                            setValidationErrors(errors);

                                            const hasError = errors.size || errors.sugar || errors.ice;

                                            if (hasError) {
                                                window.scrollTo({ top: 0, behavior: 'smooth' }); // ⬅ scrolls up if any error
                                                return;
                                            }

                                            const basePrice = parseInt(
                                                selectedItem.sizes.find(sz => sz.size === selectedSize).price.replace("₱", "")
                                            );
                                            const addOnsPrice = selectedAddOns.length * 20;
                                            const totalPrice = basePrice + addOnsPrice;

                                            const newItem = {
                                                name: selectedItem.name,
                                                size: selectedSize,
                                                sugar: selectedSugar,
                                                ice: selectedIce,
                                                price: totalPrice,
                                                qty: getQty(selectedItem.imageKey),
                                                addOns: selectedAddOns
                                            };

                                            if (isEditing && editingIndex !== null) {
                                                setCartItems(prev => {
                                                    const updated = [...prev];
                                                    updated[editingIndex] = newItem;
                                                    return updated;
                                                });
                                            } else {
                                                setCartItems(prev => {
        const existingIndex = prev.findIndex(item =>
            item.name === newItem.name &&
            item.size === newItem.size &&
            item.sugar === newItem.sugar &&
            item.ice === newItem.ice &&
            JSON.stringify(item.addOns.sort()) === JSON.stringify(newItem.addOns.sort())
        );

        if (existingIndex !== -1) {
            const updated = [...prev];
            updated[existingIndex] = {
                ...updated[existingIndex],
                qty: updated[existingIndex].qty + getQty(selectedItem.imageKey) // stack correctly
            };
            return updated;
        } else {
            return [...prev, { ...newItem, qty: getQty(selectedItem.imageKey) }];
        }
    });


                                            }

                                            triggerToast();
                                            setDetailAnim(false);
                                            setTimeout(() => {
                                                setSelectedItem(null);
                                                resetSelections();
                                                setIsEditing(false);
                                                setEditingIndex(null);
                                            }, 300);
                                        }}



                                        className="bg-[#D91517] hover:bg-[#a31113] text-white rounded-full py-3 text-lg font-semibold transition mt-6 mb-10"
                                    >
                                        <span>{isEditing ? 'Edit' : 'Add to Cart'}</span>

                                    </button>




                                </div>



                            </div>
                        </div>

                    </div>
                )}


                {cartItems.length > 0 && (
                    <CartBar
                        cartItems={cartItems}
                        total={cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)}
                        onClick={() => {
                            setShowTotalSummary(true);
                            setTimeout(() => setSummaryAnim(true), 30); // small delay for animation
                        }}
                    />


                    ///Total Summary Section
                )}
                {showToast && (
                    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-[#D91517] text-white px-6 py-3 rounded-full shadow-lg transition-opacity duration-250 animate-fadeIn">
                        Item added to cart!
                    </div>
                )}
                {showTotalSummary && (
    <div className={`fixed inset-0 z-50 bg-[#FDF8F8] pt-[20px] sm:pt-[30px] transition-all duration-500 ease-out overflow-y-auto overflow-x-hidden`}>





                        {/* Back Button */}
                        <button
    onClick={() => {
        setSummaryAnim(false);
        setTimeout(() => setShowTotalSummary(false), 300);
    }}
    className="absolute top-5 left-5 z-50
    bg-white border border-[#D91517] text-[#D91517] rounded-full 
    w-10 h-10 sm:w-[44px] sm:h-[44px]
    flex items-center justify-center shadow-md
    hover:bg-[#D91517] hover:text-white hover:scale-105 active:scale-95
    transition-all duration-200 ease-in-out"
    aria-label="Go Back"
    >

                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Title */}
                        <h1 className="absolute top-[60px] sm:top-[80px] md:top-[100px] lg:top-[110px] left-[5vw] sm:left-[80px] md:left-[100px] lg:left-[140px] text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] leading-none font-semibold text-[#462525] font-[SF Pro Rounded] [@media(max-width:929px)]:left-1/2 [@media(max-width:929px)]:-translate-x-1/2 [@media(max-width:929px)]:text-center">
                            Total Summary</h1>

                        {/* Summary Containers */}
                        <div className="flex flex-col items-center gap-4 mb-[40px] mt-[120px] sm:mt-[140px] md:mt-[160px] lg:mt-[180px] px-4 sm:px-6 md:px-10 w-full">



                            {/* 1st Container: only show if cart is not empty */}
                            {cartItems.length > 0 && (
                                <div className="w-full max-w-[1397px] bg-white border border-[#E0DEDE] rounded-[30px] px-6 py-5 flex flex-col gap-6">
                                    {cartItems.map((item, index) => (

                                        <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-5 w-full font-[SF Pro Rounded] text-[#3E3E3E] text-[14px] sm:text-[16px]">

    {/* LEFT: Image + Name + Edit/Remove */}
    <div className="flex items-center gap-3">
        <img
        src={images[menuItems.find(m => m.name === item.name)?.imageKey]}
        alt={item.name}
        className="w-[40px] h-[40px] object-contain rounded-xl border border-[#E0DEDE]"
        />
        <div className="flex flex-col">
        <span className="text-[15px] font-semibold text-[#462525]">{item.qty}x {item.name}</span>
        <div className="flex items-center gap-2 text-sm">
            <button
            onClick={() => {
                const menuItem = menuItems.find(m => m.name === item.name);
                if (!menuItem) return;
                setSelectedItem(menuItem);
                setSelectedSize(item.size);
                setSelectedSugar(item.sugar);
                setSelectedIce(item.ice);
                setSelectedAddOns(item.addOns || []);
                setActiveTab('description');
                setQuantities(prev => ({ ...prev, [menuItem.imageKey]: item.qty }));
                setIsEditing(true);
                setEditingIndex(index);
                setSummaryAnim(false);
                setTimeout(() => {
                setShowTotalSummary(false);
                setTimeout(() => setDetailAnim(true), 150);
                }, 150);
            }}
            className="text-[#1D42C7] text-xs underline hover:opacity-80"
            >
            Edit
            </button>
            <button
            onClick={() => {
                const removedItem = cartItems[index];
                const imageKey = menuItems.find(m => m.name === removedItem.name)?.imageKey;
                setCartItems(prev => prev.filter((_, i) => i !== index));
                setQuantities(prev => {
                const newQuantities = { ...prev };
                if (imageKey) delete newQuantities[imageKey];
                return newQuantities;
                });
                if (selectedItem?.name === removedItem.name) {
                resetSelections();
                }
            }}
            className="text-[#D91517] text-xs underline hover:opacity-80"
            >
            Remove
            </button>
        </div>
        </div>
    </div>

    {/* RIGHT: Quantity controls + Price + Subtotal */}
    <div className="flex flex-col items-end gap-1 w-full sm:w-auto">
        <div className="flex items-center justify-between border border-[#E0DEDE] rounded-full px-5 py-2 w-[100px] h-[40px] hover:scale-105 transition-transform">
        <button
            onClick={() => {
            const imageKey = menuItems.find(m => m.name === item.name)?.imageKey;
            setCartItems(prev => {
                const updated = [...prev];
                updated[index].qty = Math.max(1, updated[index].qty - 1);
                return updated;
            });
            setQuantities(prev => ({ ...prev, [imageKey]: Math.max(1, item.qty - 1) }));
            }}
            className="text-[#E0DEDE] text-2xl font-light"
        >–</button>
        <span className="text-[#3E1F1F] text-lg font-semibold">{item.qty}</span>
        <button
            onClick={() => {
            const imageKey = menuItems.find(m => m.name === item.name)?.imageKey;
            setCartItems(prev => {
                const updated = [...prev];
                updated[index] = { ...updated[index], qty: updated[index].qty + 1 };
                return updated;
            });
            setQuantities(prev => ({ ...prev, [imageKey]: item.qty + 1 }));
            }}
            className="text-[#E0DEDE] text-2xl font-light"
        >+</button>
        </div>
    <div className="flex items-center gap-2 mr-[10px]">
    <p className="text-xs text-[#999]">Subtotal</p>
    <p className="font-semibold text-[16px] text-[#3E1F1F]">₱{(item.price * item.qty).toFixed(2)}
</p>
    </div>

    </div>
    </div>


                                            

                                        
                                    ))}
                                </div>
                            )}






                            {/* 2nd Container: */}
                            <div className="relative w-full max-w-[1397px] bg-white border border-[#E0DEDE] rounded-[30px] px-4 sm:px-6 py-6  mx-auto">
                                {/* Pickup Time Title */}
                                <p className="text-[20px] sm:text-[22px] font-medium text-[#3E3E3E] font-[SF Pro Rounded] mb-4">
                                    Pickup Time
                                </p>

                                {/* After I Order Option */}
                                <div
                                    onClick={() => setPickupOption('after')}

                                    className="flex items-center gap-4 mb-4 cursor-pointer"
                                >
                                    <div className="w-[22px] h-[22px] border border-[#E0DEDE] rounded-full flex items-center justify-center">
                                        {pickupOption === 'after' && <div className="w-[11px] h-[11px] bg-[#61D76C] rounded-full" />}
                                    </div>
                                    <p className="text-[15px] sm:text-[16px] text-[#3E3E3E] font-[SF Pro Rounded]">After I Order</p>
                                </div>


                                {/* Divider Line */}
                                <hr className="border-[#E0DEDE]" />

                                {/* Custom Option */}
                                <div
                                    onClick={() => setPickupOption('custom')}
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-[22px] h-[22px] border border-[#E0DEDE] rounded-full flex items-center justify-center">
                                            {pickupOption === 'custom' && <div className="w-[11px] h-[11px] bg-[#61D76C] rounded-full" />}
                                        </div>
                                        <p className="text-[15px] sm:text-[16px] text-[#3E3E3E] font-[SF Pro Rounded]">Custom</p>
                                        {timeWarning && (
                                            <p className="text-red-500 text-sm font-medium mt-1 ml-2 font-[SF Pro Rounded]">
                                                * Please select a custom time
                                            </p>
                                        )}

                                    </div>

                                    <p className="text-[13px] sm:text-[14px] text-[#E0DEDE] font-[SF Pro Rounded]">
                                        Get items estimated time
                                    </p>

                                    <div
                                        onClick={() => document.getElementById('hiddenTimeInput')?.showPicker()}
                                        className="w-full sm:w-auto h-auto flex items-center justify-between sm:justify-center border border-[#E0DEDE] rounded-[13px] px-3 py-2 sm:px-3 sm:py-1 cursor-pointer"
                                    >
                                        <p className="text-[12px] sm:text-[11px] font-semibold text-[#462525] font-[SF Pro Rounded]">
                                            {pickupOption === 'custom' ? customTime : '-- : --'}
                                        </p>

                                        {/* Hidden Time Input (triggered by container click) */}
                                        <input
                                            id="hiddenTimeInput"
                                            type="time"
                                            value={customTime}
                                            onChange={(e) => {
                                                const [hour, minute] = e.target.value.split(':');
                                                const h = parseInt(hour);
                                                const suffix = h >= 12 ? 'PM' : 'AM';
                                                const hour12 = h % 12 === 0 ? 12 : h % 12;
                                                setCustomTime(`${hour12}:${minute} ${suffix}`);
                                            }}

                                            className="absolute opacity-0 pointer-events-none w-0 h-0"
                                        />

                                        {/* Clock Icon */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                        </svg>
                                    </div>



                                </div>

                            </div>



                            {/* 3rd Container: Payment Methods */}
                            <div className="relative w-full max-w-[1397px] bg-white border border-[#E0DEDE] rounded-[28px] px-4 sm:px-6 pt-5 pb-6">
                                {/* Top Row: Title & See More */}
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                    <p className="text-[20px] md:text-[22px] font-medium text-[#3E3E3E] font-[SF Pro Rounded] text-center md:text-left">
                                        Payment Methods
                                    </p>
                                    <p
                                        onClick={() => setShowPaymentPopup(!showPaymentPopup)}
                                        className="text-[14px] leading-[17px] font-medium text-[#1D42C7] font-[SF Pro Rounded] cursor-pointer text-center md:text-right"
                                    >
                                        See more
                                    </p>
                                </div>

                                {/* Default Shown: GCash */}
                                {/* Dynamic Display: Selected Payment Method */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-6 cursor-pointer"
    onClick={() => setShowPaymentPopup(true)}
    >
    <div className="flex items-center gap-3">
        <div className="w-5 h-5 border border-[#E0DEDE] rounded-full flex items-center justify-center">
        {selectedPayment && <div className="w-2.5 h-2.5 bg-[#61D76C] rounded-full" />}
        </div>
        {selectedPayment === 'GCash' ? (
  <img
    src="/src/assets/gcash_logo.svg"
    alt="GCash"
    className="w-[90px] md:w-[100px] h-auto"
  />
) : selectedPayment === 'PayMongo' ? (
  <span className="text-[#3E3E3E] font-[SF Pro Rounded] text-[16px]">
    PayMongo
  </span>
) : (
  <span className="text-[#3E3E3E] font-[SF Pro Rounded] text-[16px]">
    Cash on Pickup
  </span>
)}

    </div>

    <p className="text-[13px] md:text-[14px] text-[#E0DEDE] font-[SF Pro Rounded] font-medium text-center md:text-right">
  {selectedPayment === 'GCash'
    ? '63+9197784657'
    : selectedPayment === 'PayMongo'
    ? 'Secure checkout via credit/debit or e-wallet'
    : 'Pay at store when you pick up'}
</p>

    </div>

                                {/* Payment Popup (See More) */}
                                {showPaymentPopup && (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-[9999] bg-black bg-opacity-50 w-screen h-screen flex items-center justify-center px-4 sm:px-0 overflow-hidden">

                                        <div className="relative w-full max-w-[320px] bg-white border border-[#E0DEDE] rounded-2xl p-6 shadow-xl transform transition-all duration-300 ease-out">
                                            {/* Close */}
                                            <button
                                                onClick={() => setShowPaymentPopup(false)}
                                                className="absolute top-3 right-4 text-[#D91517] text-2xl font-bold hover:scale-110 transition-transform"
                                            >
                                                ×
                                            </button>
                                            <p className="text-[#3E3E3E] text-[18px] font-semibold font-[SF Pro Rounded] mb-4">
                                                Choose a Payment Method
                                            </p>
                                            {['GCash', 'Cash on Pickup', 'PayMongo'].map((opt) => (
    <div
        key={opt}
        onClick={() => {
            setSelectedPayment(opt);
            setShowPaymentPopup(false);
        }}
        className="flex items-center gap-3 mb-3 cursor-pointer hover:text-[#D91517] transition"
    >
        <div className="w-5 h-5 border border-[#E0DEDE] rounded-full flex items-center justify-center">
            {selectedPayment === opt && (
                <div className="w-2.5 h-2.5 bg-[#61D76C] rounded-full" />
            )}
        </div>
        <span className="text-sm font-[SF Pro Rounded]">{opt}</span>
    </div>
))}


                                        </div>


                                    </div>



                                )}



                            </div>

                            <div className="w-full max-w-[1478px] px-4 sm:px-10 mt-3">
                                <button
                                    onClick={() => {
                                        if (cartItems.length === 0) return;

                                        if (pickupOption === 'custom' && (customTime === '--:-- edit' || !customTime.trim())) {
                                            setTimeWarning(true);
                                            return;
                                        }

                                        const estimatedTime =
                                            pickupOption === 'custom' ? customTime : 'After I Order';

                                        setTimeWarning(false);
                                        navigate('/processing');
                                    }}
                                    className={`w-full h-auto sm:h-[88px] rounded-[40px] flex flex-col sm:flex-row items-center justify-between px-4 sm:px-10 gap-2 sm:gap-6 py-4 sm:py-0 transition active:scale-95 ${cartItems.length === 0
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-[#D91517] hover:opacity-90'
                                        }`}
                                >
                                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4 text-center sm:text-left">
                                        <span className="text-white text-[26px] sm:text-[36px] font-semibold font-[SF Pro Rounded]">
                                            Place Order
                                        </span>
                                        <div className="w-[6px] h-[6px] bg-white border-[6px] border-white rounded-full hidden sm:block" />
                                        <span className="text-white text-[18px] sm:text-[24px] font-normal font-[SF Pro Rounded]">
                                            ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                                        </span>
                                    </div>

                                    <div className="text-white text-[26px] sm:text-[36px] font-semibold font-[SF Pro Rounded]">
                                        ₱{cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)}
                                    </div>
                                </button>
                            </div>




                        </div>



                    </div>
                )}



            </div>
        );
    }

    export default Menu;