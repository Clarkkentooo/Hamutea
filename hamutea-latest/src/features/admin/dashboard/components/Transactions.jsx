
import { ActionButton } from "@components/common/button"


const Transactions = () => {
    return (
        <div className="border border-hamutea-border rounded-2xl p-5">
            <div className="border-b border-hamutea-border pb-2 flex items-center justify-between gap-10">
                <div>
                    <h1 className="text-xl font-bold">Transactions</h1>
                    <p className="text-hamutea-gray">Latest Overview</p>
                </div>
                <ActionButton variant="danger" label="View All" icon="ArrowRight"  />
            </div>

            <div className="px-2">

                {
                    [1, 2, 3, 4, 5, 6, 7].map((_, index) => (
                        <div key={index} className="flex items-center justify-between py-5 border-b border-hamutea-border">
                            <div>
                                <p className=" text-hamutea-blue font-bold">Kendrick Lamar</p>
                                <p className="text-sm text-hamutea-gray">21 April 2025, 12:15 PM</p>
                            </div>
                            <p className="text-lg">$100</p>
                        </div>
                    ))
                }

            </div>
        </div>
    );
}

export default Transactions;