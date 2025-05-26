import Desktop from "@assets/backgroundimage/circle-desktop.svg";
import Mobile from "@assets/backgroundimage/circle-mobile.svg";
import RedBear from "@assets/backgroundimage/redbear.svg";
import { Outlet } from "react-router-dom";


const AuthLayout = () => {
    return (
        <div className="h-screen w-screen bg-hamutea-red relative overflow-hidden">
            <img src={Desktop} alt="" className="h-screen w-screen sm:block hidden" />
            <img src={Mobile} alt="" className="h-screen w-screen sm:hidden block" />

            <div className="absolute bottom-0 right-0">
                <img src={RedBear} alt="" className="h-[50vh] sm:h-[90vh] sm:w-[70vw]" />
            </div>

            <div className="absolute inset-0 z-50">
                <Outlet />
            </div>

        </div>
    );
}

export default AuthLayout;