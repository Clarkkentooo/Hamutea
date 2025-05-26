import { useState } from "react";
import PageTitle from "@features/admin/components/PageTitle";
import { Select, SearchInput } from "@components/common/input";
import Icon from "@components/common/Icon";
import { ActionButton } from "@components/common/button";
import ProgressBar from "@assets/progress.svg"

const Orders = () => {
    const header = [
        "Order Number",
        "Name",
        "Items",
        "Total Items",
        "Order Date",
        "Order Time",
        "Pick-up Time",
        "Total Price"
    ];

    const orders = [
        {
            id: "012234",
            user: {
                name: "Kendrick Lamar",
                email: "kendrick@gmail.com",
                phone: "1234567890"
            },
            orderDate: "4/14/25",
            orderTime: "12:00 PM",
            pickupTime: "12:30 PM",
            totalPrice: "$200.00",
            paymentMethod: "GCASH",
            items: [
                {
                    name: "Oolong Pearl",
                    size: "Large",
                    addons: "+ Pearls",
                    sugar: "70% Sugar Level",
                    ice: "20% Ice",
                    qty: 3
                },
                {
                    name: "Brown Sugar Milk Tea",
                    size: "Large",
                    addons: "+ Pearls",
                    sugar: "70% Sugar Level",
                    ice: "20% Ice",
                    qty: 1
                }
            ],
            status: "complete"
        },
        {
            id: "012234",
            user: {
                name: "Kendrick Lamar",
                email: "kendrick@gmail.com",
                phone: "1234567890"
            },
            orderDate: "4/14/25",
            orderTime: "12:00 PM",
            pickupTime: "12:30 PM",
            totalPrice: "$200.00",
            paymentMethod: "GCASH",
            items: [
                {
                    name: "Oolong Pearl",
                    size: "Large",
                    addons: "+ Pearls",
                    sugar: "70% Sugar Level",
                    ice: "20% Ice",
                    qty: 3
                },
                {
                    name: "Brown Sugar Milk Tea",
                    size: "Large",
                    addons: "+ Pearls",
                    sugar: "70% Sugar Level",
                    ice: "20% Ice",
                    qty: 1
                }
            ],
            status: "complete"
        },
        {
            id: "012234",
            user: {
                name: "Kendrick Lamar",
                email: "kendrick@gmail.com",
                phone: "1234567890"
            },
            orderDate: "4/14/25",
            orderTime: "12:00 PM",
            pickupTime: "12:30 PM",
            totalPrice: "$200.00",
            paymentMethod: "GCASH",
            items: [
                {
                    name: "Oolong Pearl",
                    size: "Large",
                    addons: "+ Pearls",
                    sugar: "70% Sugar Level",
                    ice: "20% Ice",
                    qty: 3
                },
                {
                    name: "Brown Sugar Milk Tea",
                    size: "Large",
                    addons: "+ Pearls",
                    sugar: "70% Sugar Level",
                    ice: "20% Ice",
                    qty: 1
                }
            ],
            status: "progress"
        }
    ];

    const [expandedOrders, setExpandedOrders] = useState({});

    const toggleExpand = (id) => {
        setExpandedOrders(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <>
            <PageTitle title="Orders" desc="Here's the Overall Orders" />

            <div className="flex justify-between items-center mt-5">
                <Select
                    placeholder="Select Status"
                    options={[
                        { label: "All", value: "all" },
                        { label: "Customer Order Progress", value: "progress" },
                        { label: "Order Complete", value: "complete" }
                    ]}
                />
                <div className="flex gap-5 items-center">
                    <SearchInput placeholder="Search" />
                    <Icon name="SlidersHorizontal" className="w-6 h-6 shrink-0" />
                </div>
            </div>

            <div className="grid grid-cols-9 gap-5 mt-5 border-b border-hamutea-border pb-3 p-5">
                {header.map((text, index) => (
                    <div key={index} className="text-sm font-bold text-hamutea-gray">{text}</div>
                ))}
            </div>

            {orders.map((order, orderIndex) => {
                const expanded = expandedOrders[`${orderIndex}`] || false;
                const visibleItems = expanded ? order.items : [order.items[0]];

                return (
                    <div key={orderIndex} className="border rounded-2xl my-4 p-5">
                        {visibleItems.map((item, itemIndex) => (
                            <div key={itemIndex} className="grid grid-cols-9 gap-5 mb-4">
                                {itemIndex === 0 ? (
                                    <>
                                        <div className="text-hamutea-red">{order.id}</div>
                                        <div>
                                            <p>{order.user.name}</p>
                                            <p className="text-sm text-hamutea-gray">{order.user.email}</p>
                                            <p className="text-sm text-hamutea-gray">{order.user.phone}</p>
                                            <p className="text-blue-500 cursor-pointer">See User Details</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div></div>
                                        <div></div>
                                    </>
                                )}

                                <div>
                                    <p>{item.name}</p>
                                    <p className="text-sm text-hamutea-gray">{item.size}</p>
                                    <p className="text-sm text-hamutea-gray">{item.addons}</p>
                                    <p className="text-sm text-hamutea-gray">{item.sugar}</p>
                                    <p className="text-sm text-hamutea-gray">{item.ice}</p>
                                </div>
                                <div>{item.qty}</div>
                                <div className="text-hamutea-gray">{itemIndex === 0 ? order.orderDate : ""}</div>
                                <div className="text-hamutea-gray">{itemIndex === 0 ? order.orderTime : ""}</div>
                                <div>{itemIndex === 0 ? order.pickupTime : ""}</div>
                                <div>{itemIndex === 0 ? (<>
                                    <p>{order.totalPrice}</p>
                                    <p className="text-sm text-hamutea-gray">Already Paid Through {order.paymentMethod}</p>
                                </>) : ""}</div>
                                <div>{itemIndex === 0 ? (
                                    <>
                                        <ActionButton variant={order.status === "complete" ? "success" : "danger"} label="Accepted" icon="ChevronDown" />
                                    </>
                                ) : ""}</div>
                            </div>
                        ))}

                        {
                            order.status === "progress" && (
                                <div className="border-t p-5">
                                    <h1 className="font-bold text-lg">Status</h1>

                                    <div className="flex justify-between items-start mt-5">
                                        <div>
                                            <p className="text-blue-500 text-sm cursor-pointer mb-3">Change Pick-up Time</p>
                                            <button className="border-hamutea-brown text-sm border px-3 py-1 rounded-full flex items-center justify-center">{order.orderTime}</button>
                                        </div>
                                        <div>
                                            <img src={ProgressBar} alt="progress bar" />
                                        </div>
                                        <div>
                                            <button className="border-green-500 text-green-500 text-sm border px-3 py-1 rounded-full flex items-center justify-center bg-[#daffd9]">Order Complete</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }



                        {order.items.length > 1 && (
                            <div className="flex items-center justify-center mt-4">
                                <button
                                    onClick={() => toggleExpand(`${orderIndex}`)}
                                    className="text-blue-500"
                                >
                                    {expanded ? "Hide" : "See More"}
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </>
    );
};

export default Orders;