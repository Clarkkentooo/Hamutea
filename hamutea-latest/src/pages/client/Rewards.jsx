import HeroBG from "@assets/rewards/hero_bg.png"
import Bear from "@assets/rewards/bear.png"
import images from "@utils/imageLoader";


const Rewards = () => {
 
    return (<>

        <img src={HeroBG} alt="" className="w-full h-[70vh] object-cover" />
        <div className="px-10 md:px-20">
            <div className="flex  items-center justify-center flex-col mb-5">
                <h1 className="text-5xl max-w-lg text-center font-bold mb-3">Join our Daily Free-Drink Raffle</h1>
                <p className="max-w-2xl text-center">Every cup comes with a little excitement! Join our Lucky Draw for a chance to win a free drink. Every purchase gives you an entry—just place your order, draw a card, and see if luck is on your side! Whether you win a free upgrade, a discount, or a full drink on us, it’s our way of adding a little fun to your milk tea experience.</p>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 my-10 text-white">
                <div className="lg:col-span-2 flex flex-col gap-5">
                    <div className="w-full bg-[#ff7930] rounded-2xl h-[17.0625rem] relative p-10 flex flex-col justify-end">
                        <div className="absolute -top-12 left-0 ">
                            <img src={images.one} alt="" className="" />
                        </div>
                        <h1 className="font-bold text-2xl">Go to the Store</h1>
                        <p>Hand-peeled juice from onl ine sources presents chal lenges with grape</p>
                    </div>
                    <div className="w-full bg-[#ff7930] rounded-2xl h-[20rem] md:h-[25.1875rem] relative p-10 flex flex-col justify-end">
                        <div className="absolute -top-5 left-20 ">
                            <img src={images.two} alt="" className="" />
                        </div>
                        <div className="absolute bottom-0 right-0 z-0 h-full  flex flex-col justify-end">
                            <img src={Bear} alt="" className="w-full h-[90%] object-cover" />
                        </div>
                        <div className="z-10">
                            <h1 className="font-bold text-2xl">Buy the Product</h1>
                            <p>Hand-peeled juice from onl ine sources presents chal lenges with grape</p>
                        </div>

                    </div>
                </div>
                <div className="bg-white flex flex-col gap-5">
                    <div className="w-full bg-[#ff7930] rounded-2xl h-[22.6875rem] relative p-10 flex flex-col justify-end">
                        <div className="absolute bottom-10 -right-5">
                            <img src={images.three} alt="" className="" />
                        </div>
                        <h1 className="font-bold text-2xl">Check the Daily Winners</h1>
                        <p>Hand-peeled juice from onl ine sources presents chal lenges with grape</p>

                    </div>
                    <div className="w-full bg-[#ff7930] rounded-2xl h-[19.6875rem] relative p-10 flex flex-col justify-end">
                        <div className="absolute -bottom-7 right-10">
                            <img src={images.four} alt="" className="" />
                        </div>
                        <h1 className="font-bold text-2xl">Redeem the Item</h1>
                        <p>Hand-peeled juice from onl ine sources presents chal lenges with grape</p>

                    </div>
                </div>
            </div>



        </div>


    </>);
}

export default Rewards;