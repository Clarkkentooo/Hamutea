import { ActionButton } from "@components/common/button"
import Icon from "@components/common/Icon";
import InfoCard from "@features/admin/dashboard/components/InfoCard";
import GraphIcon from "@assets/svg/graph.svg";
import { ProgressBar } from "@components/common/input";


const Orders = () => {
    return (
        <div className="border border-hamutea-border rounded-2xl p-5 w-full md:w-1/2">
            <div className="border-b border-hamutea-border pb-2 flex items-center justify-between gap-10 mb-5">
                <div>
                    <h1 className="text-xl font-bold">Orders</h1>
                </div>
                <ActionButton variant="gray" label="View All" icon="ChevronDown" />
            </div>

            <div className="bg-green-100 rounded-full p-3 flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <p className="rounded-full bg-green-600 px-7 py-3 font-bold text-white">
                        13
                    </p>
                    <div className="inline-flex items-center gap-3">
                        Latest Orders
                        <span className="aspect-square h-2  rounded-full bg-green-600"></span>
                    </div>
                </div>

                <p className="inline-flex items-center gap-1 text-hamutea-blue cursor-pointer text-sm">
                    Manage orders
                    <span><Icon name="ArrowRight" className="h-5 w-5" /></span>
                </p>
            </div>

            <div className="w-full grid grid-cols-2 gap-5 mb-5">
                <InfoCard icon="CircleDollarSign" count={10} desc="Cash" color="text-hamutea-yellow" />
                <InfoCard icon="CreditCard" count={30} desc="E-Payment" color="text-hamutea-blue" />
            </div>

            <h1 className="text-xl font-bold mb-3">Order Pick-up</h1>

            <div className="flex gap-5">
                <img src={GraphIcon} alt="" className="h-[3.375rem]" />
                <div className="flex-grow flex items-center">
                    <table className=" w-full">
                        <tbody className="text-sm">
                            <tr>
                                <td>
                                    After Order
                                </td>
                                <td>
                                    30%
                                </td>
                                <td className="w-[50%] relative">
                                    <ProgressBar color="#6a42e3" progress={30} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Specified Time
                                </td>
                                <td>
                                    45%
                                </td>
                                <td className="w-[50%] relative">
                                    <ProgressBar color="#16b5d9" progress={45} />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    );
}

export default Orders;