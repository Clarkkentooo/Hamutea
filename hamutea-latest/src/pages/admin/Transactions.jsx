import GCash from "@assets/svg/gcash.svg"
import Cash from "@assets/svg/cash.svg"
import PageTitle from "@features/admin/components/PageTitle";
import { Select, SearchInput } from "@components/common/input";
import Icon from "@components/common/Icon";



const Transactions = () => {
    const header = [
        "Order Number",
        "Name",
        "Order Date",
        "Order Time",
        "Pick-up Time",
        "Total Price",
        "Mode of Payment",
    ];

    const transactions = [
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
            paymentMethod: "CASH",
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
            paymentMethod: "CASH",
        },

    ]


    return (<>
        <PageTitle title="Transactions" desc="Here’s the Transaction from all the orders" />

        <div className="flex justify-between items-center mt-5">
            <Select
                placeholder="Select Status"
                options={[
                    { label: "All", value: "all" },
                    { label: "Online Payment", value: "online" },
                    { label: "Cash", value: "cash" }
                ]}
            />
            <div className="flex gap-5 items-center">
                <SearchInput placeholder="Search" />
                <Icon name="SlidersHorizontal" className="w-6 h-6 shrink-0" />
            </div>
        </div>

        <div className="grid grid-cols-8 gap-5 mt-5 border-b border-hamutea-border pb-3 p-5">
            {header.map((text, index) => (
                <div key={index} className="text-sm font-bold text-hamutea-gray">{text}</div>
            ))}
        </div>

        {
            transactions.map((transaction, index) => (
                <div key={index} className="border rounded-2xl my-4 p-5">
                    <div className="grid grid-cols-8 gap-5 mb-4">
                        <div className="text-hamutea-red">012334</div>
                        <div>
                            <p>{transaction.user.name}</p>
                            <p className="text-sm text-hamutea-gray">{transaction.user.email}</p>
                            <p className="text-sm text-hamutea-gray">{transaction.user.phone}</p>
                            <p className="text-blue-500 cursor-pointer">See User Details</p>
                        </div>
                        <div>
                            {transaction.orderDate}
                        </div>
                        <div>{transaction.orderTime}</div>
                        <div>{transaction.pickupTime}</div>
                        <div>{transaction.totalPrice}</div>
                        <div>
                            <img src={transaction.paymentMethod === "GCASH" ? GCash : Cash} alt="" className="h-6" />
                        </div>
                        <div>
                            <button className="border-green-500 text-green-500 text-sm border px-3 py-1 rounded-full flex items-center justify-center bg-[#daffd9]">Completed</button>
                        </div>
                    </div>
                </div>
            ))
        }

    </>);
}

export default Transactions;