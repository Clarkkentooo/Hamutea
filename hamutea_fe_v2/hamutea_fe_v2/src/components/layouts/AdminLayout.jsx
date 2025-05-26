import { useState } from "react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import HamuteaLogo from "@assets/svg/logo-text.svg"
import Icon from "@components/common/Icon";

const AdminLayout = () => {
    const [isOpen, setIsOpen] = useState(false);

    const NAVIGATION = [
        { name: "Dashboard", icon: "ChartColumnBig", href: "/admin/dashboard" },
        { name: "Menu", icon: "LayoutGrid", href: "/admin/menu" },
        { name: "Orders", icon: "ShoppingCart", href: "/admin/orders" },
        { name: "Transactions", icon: "ReceiptText", href: "/admin/transactions" },
    ]


    console.log(isOpen)

    return (
        <div className="w-screen h-screen relative flex">
            <div className={`w-full h-full lg:max-w-[18rem] transform lg:translate-x-0 border border-hamutea-border absolute lg:relative flex bg-white  flex-col justify-between z-50 ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-all duration-300 ease-in-out`}>
                <div className="flex items-center justify-center mt-10 relative">
                    <img src={HamuteaLogo} alt="" className="h-[4.6875rem]" />
                    <div className="absolute top-0 right-5 p-2 flex items-center gap-2">
                        <Icon name="X" className="text-hamutea-red w-6 h-6 block lg:hidden" onClick={() => setIsOpen(false)} />
                    </div>
                </div>
                <div className="flex-1 py-10 px-5 flex gap-4">
                    <div className="w-full">
                        {
                            NAVIGATION.map((nav, index) => (
                                <Link to={nav.href} key={index} className="mb-2 flex gap-5 w-full items-center p-3 rounded-2xl transition-all duration-300 ease-in-out hover:bg-gray-100 cursor-pointer">
                                    <Icon name={nav.icon} className="text-hamutea-red w-6 h-6" />
                                    <p >{nav.name}</p>
                                </Link>
                            ))
                        }

                    </div>
                </div>
                <div className="px-3 cursor-pointer">
                    <div className="flex justify-between items-center border-t p-5 border-hamutea-border">
                        <div className="flex items-center gap-2 ">
                            <Icon name="SquareUser" className="text-hamutea-red w-8 h-8" />
                            <div className="text-hamutea-gray ">
                                <h2 className="font-bold">Admin</h2>
                                <p className="text-sm -mt-2">admin_hamutea@gmail.com</p>
                            </div>
                        </div>
                        <Icon name="ChevronsUpDown" className="text-hamutea-gray shrink-0" />
                    </div>
                </div>
            </div>
            <div className="flex-1 flex flex-col">
                <div className="p-5 border-b border-hamutea-border flex justify-between items-center px-7">
                    <div>
                        <Icon
                            onClick={() => setIsOpen(true)}
                            name="Menu"
                            className="text-hamutea-red w-6 h-6 cursor-pointer lg:hidden block" />
                    </div>
                    <p className="inline-flex gap-2 text-hamutea-red cursor-pointer">
                        Go to the Main Website
                        <span><Icon name="ArrowRight" /></span>
                    </p>
                </div>

                <div className="p-10 flex-1 overflow-y-scroll">
                    <Outlet />
                </div>
            </div>

        </div>
    );
}

export default AdminLayout;