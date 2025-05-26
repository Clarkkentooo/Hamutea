
import { ActionButton, ToggleButton } from "@components/common/button"
import { Select } from "@components/common/input";
import TeaPlaceholder from "@assets/svg/tea-plchldr.svg";
import Icon from "@components/common/Icon";

const LatestMenu = () => {
    return (
        <div className="border border-hamutea-border rounded-2xl p-5 w-full md:w-1/2">
            <div className="border-b border-hamutea-border pb-2 flex items-center justify-between gap-10 mb-5">
                <div>
                    <h1 className="text-xl font-bold">Latest Menu</h1>
                </div>
                <ActionButton variant="danger" label="View All" icon="ArrowRight" />
            </div>
            <Select
                color="#d91619"
                placeholder="Category"
                options={[
                    { value: 1, label: "Category 1" },
                    { value: 2, label: "Category 2" },
                    { value: 3, label: "Category 3" },
                    { value: 4, label: "Category 4" },
                    { value: 5, label: "Category 5" },
                ]}
            />

            <div className="mt-5 w-full max-h-[15.25rem] overflow-y-auto">
                <table className=" w-full text-center">
                    <thead>
                        <td className="py-3"></td>
                        <td className="py-3">Menu</td>
                        <td className="py-3">Price</td>
                        <td className="py-3">Availability Status</td>
                    </thead>
                    <tbody>
                        {
                            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
                                <tr key={index}>
                                    <td className="py-3">
                                        <input type="radio" />
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center justify-center gap-3">
                                            <img src={TeaPlaceholder} alt="" className="h-10" />
                                            <p className="text-sm font-bold">No. 1 Milktea</p>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <p className="text-sm">$100</p>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <ToggleButton />
                                            <Icon name="Ellipsis" />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

            </div>

        </div>
    );
}

export default LatestMenu;