import Icon from "@components/common/Icon";
import { useState } from "react";


// menu items data
const menuItems = [
    { name: 'Signature Pudding Dodol', category: 'Classic Milktea Series', price: '₱110', imageKey: 'sig_pudding_dodol' },
    { name: 'No.3 Milk Tea', category: 'Classic Milktea Series', price: '₱110', imageKey: 'no_3_milktea' },
    { name: 'Black Sugar Pearl Milk Tea', category: 'Classic Milktea Series', price: '₱110', imageKey: 'black_sugar_pearl_milk_tea' },
    { name: 'Red Bean Milk Tea', category: 'Classic Milktea Series', price: '₱90', imageKey: 'red_bean_milk_tea' },
    { name: 'Coconut Jelly Milk Tea', category: 'Classic Milktea Series', price: '₱90', imageKey: 'coconut_jelly_milk_tea' },
    { name: 'Pudding Milk Tea', category: 'Classic Milktea Series', price: '₱90', imageKey: 'pudding_milk_tea' },
    { name: 'Highland Barley Milk Tea', category: 'Classic Milktea Series', price: '₱90', imageKey: 'highland_barley_milk_tea' },
    { name: 'Pearl Milk Tea', category: 'Classic Milktea Series', price: '₱90', imageKey: 'pearl_milk_tea' },
    { name: 'Oolong Milk Tea', category: 'Classic Milktea Series', price: '₱90', imageKey: 'oolong_milk_tea' },
    { name: 'Pearl Green Milk Tea', category: 'Classic Milktea Series', price: '₱90', imageKey: 'pearl_green_milk_tea' },
    { name: 'Grand Slam', category: 'Classic Milktea Series', price: '₱140', imageKey: 'grand_slam' },

    { name: 'Black Sugar Pearl Fresh Milk', category: 'Fresh Milk Tea', price: '₱120', imageKey: 'black_sugar_pearl_fresh_milk' },
    { name: 'Black Sugar Matcha Fresh Milk', category: 'Fresh Milk Tea', price: '₱120', imageKey: 'black_sugar_matcha_fresh_milk' },

    { name: 'Passion QQ', category: 'Fresh Fruit Tea', price: '₱100', imageKey: 'passion_qq' },
    { name: 'Mighty Sunshine Orange', category: 'Fresh Fruit Tea', price: '₱110', imageKey: 'mighty_sunshine_orange' },
    { name: 'Iced Lemon Water', category: 'Fresh Fruit Tea', price: '₱60', imageKey: 'iced_lemon_water' },
    { name: 'Lemon Black/Green Tea', category: 'Fresh Fruit Tea', price: '₱60', imageKey: 'lemon_black_green_tea' },

    { name: 'Yogurt Shake', category: 'MilkShake', price: '₱100', imageKey: 'yogurt_shake' },
    { name: 'Black Tea Milkshake', category: 'MilkShake', price: '₱90', imageKey: 'black_tea_milkshake' },

    { name: 'Black Tea', category: 'Pure Tea', price: '₱60', imageKey: 'black_tea' },
    { name: 'Green Tea', category: 'Pure Tea', price: '₱60', imageKey: 'green_tea' },
    { name: 'Oolong Tea', category: 'Pure Tea', price: '₱60', imageKey: 'oolong_tea' }
]
// derive unique categories in defined order
const categories = [
    'Classic Milktea Series',
    'Fresh Milk Tea',
    'Fresh Fruit Tea',
    'MilkShake',
    'Pure Tea'
]


const Menu = () => {
    const [statusFilter, setStatusFilter] = useState('Available')
    const [selectedCategory, setSelectedCategory] = useState(categories[0])

    // filter items by selected category
    const filteredItems = menuItems.filter(item => item.category === selectedCategory)
    return (
        <div className="">
            {/* Header & toolbar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h1 className="text-[32px] font-medium text-[#4D3434]">Menu</h1>
                    <p className="mt-1 text-[13px] font-medium text-[#8F8888]">
                        Here's the Overall Menu List
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
                    <button className="flex items-center px-3 py-2 bg-[#FF9E9F] border border-[#D91517] rounded-full text-[#A31113] font-medium hover:bg-[#FFC0C2]">
                        <Icon name="Plus" className="w-4 h-4 mr-1 text-[#A31113]" /> Add Product
                    </button>
                    <div className="relative w-full sm:w-64 md:w-80 lg:w-96">
                        <Icon name="Search" className="absolute left-3 top-1/2 w-5 h-5 -translate-y-1/2 text-[#848484]" />
                        <input
                            type="search"
                            placeholder="Search"
                            className="pl-10 pr-3 py-2 w-full bg-[#F8F8F8] rounded-full placeholder-[#848484] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#D91517]"
                        />
                    </div>

                    <button className="flex items-center justify-center p-2 bg-white border border-[#E8E8E8] rounded-full hover:bg-gray-100">
                        <Icon name="SlidersHorizontal" className="w-6 h-6 shrink-0" />
                    </button>
                </div>
            </div>

            {/* Products dropdown */}
            <div className="flex items-center mb-4 cursor-pointer">
                <span className="text-[#A31113] text-[25px] font-medium">Products</span>
                <Icon name="ChevronDown" className="w-6 h-6 ml-1 text-[#A31113]" />
            </div>

            {/* Status pills */}
            <div className="flex flex-wrap items-center gap-3 border-b border-[#E8E8E8] pb-4 mb-6">
                {['Available', 'Currently Available', 'Not Available'].map(label => (
                    <button
                        key={label}
                        onClick={() => setStatusFilter(label)}
                        className={`px-4 py-1 rounded-full text-sm font-medium ${statusFilter === label ? 'bg-[#FF9E9F] text-white' : 'text-[#462525] opacity-60'
                            }`}
                    >{label}</button>
                ))}
            </div>

            {/* Categories + Products */}
            <div className="flex flex-col lg:flex-row lg:gap-8">
                {/* Sidebar */}
                <aside className="w-full sm:w-1/3 md:w-1/4 lg:w-1/5 mb-6 lg:mb-0">
                    {categories.map(cat => (
                        <div key={cat} className="mb-4">
                            <h2
                                className="text-[20px] font-semibold text-[#462525] mb-2 cursor-pointer"
                                onClick={() => setSelectedCategory(cat)}
                            >
                                <span className={`whitespace-nowrap ${selectedCategory === cat ? 'bg-[#FF9E9F] text-white px-2 rounded-full' : ''}`}>
                                    {cat}
                                </span>
                            </h2>

                            <ul className="space-y-1 ml-2">
                                {menuItems.filter(item => item.category === cat).map((item, i) => (
                                    <li key={i} className="text-[#462525] text-sm opacity-80">
                                        {item.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </aside>

                {/* Product grid */}
                <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredItems.map((item, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col border border-[#E0DEDE] rounded-2xl p-4 overflow-hidden text-left hover:shadow-lg transition w-full h-[260px] sm:h-[300px] md:h-[340px] lg:h-[250px]"
                        >

                            <div className="h-32 flex items-center justify-center mb-4">
                                
                            </div>
                            <h3 className="text-base font-semibold text-[#462525] mb-2">{item.name}</h3>
                            <p className="text-xs text-[#462525] mb-4">{item.price}</p>
                            <div className="mt-auto">
                                <div className="mt-auto flex justify-end">
                                    <label className="relative inline-block w-10 h-6 cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        {/* track */}
                                        <span
                                            className="block w-10 h-6 bg-[#E0DEDE] rounded-full
                 peer-checked:bg-[#61D76C]
                 transition-colors duration-200"
                                        />
                                        {/* thumb */}
                                        <span
                                            className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full
                 transition-transform duration-200
                 peer-checked:translate-x-4"
                                        />
                                    </label>
                                </div>

                            </div>
                        </div>
                    ))}

                </section>
            </div>
        </div>
    );
}

export default Menu;