
import PageTitle from "@features/admin/components/PageTitle";
import Transactions from "@features/admin/dashboard/components/Transactions";
import InfoCard from "@features/admin/dashboard/components/InfoCard";
import { SearchInput } from "@components/common/input";
import Orders from "@features/admin/dashboard/components/Orders";
import LatestMenu from "@features/admin/dashboard/components/LatestMenu";


const Dashboard = () => {
    return (
        <div className="flex lg:flex-row flex-col  gap-5">
            <div className="flex-grow flex flex-col gap-5">
                <div className="flex flex-col md:flex-row  gap-5 justify-between">
                    <PageTitle title="Dashboard" desc="Here's the Overall Overview of the System" />
                    <SearchInput />
                </div>
                <div className="flex gap-5">
                    <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            <InfoCard icon="CupSoda" count={34} desc="Total Menus" color="text-hamutea-yellow" />
                            <InfoCard icon="ReceiptText" count={30} desc="Total Orders" color="text-hamutea-blue" />
                            <InfoCard icon="Wallet" count="10k" desc="Total Revenues" color="text-hamutea-green" />
                            <InfoCard icon="Users" count={100} desc="Total Users" color="text-hamutea-red" />
                        </div>
                        <h1 className="text-xl font-bold my-5">Order Summary</h1>
                        <div className="flex gap-5 flex-col md:flex-row">
                            <Orders />
                            <LatestMenu />
                        </div>
                    </div>
                </div>
            </div>
            <Transactions />
        </div>
    );
}

export default Dashboard;