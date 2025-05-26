
const CartBar = ({cartItems, total, onClick}) => {
  if (cartItems.length === 0) return null;

  return (
    <div className="w-full mt-10 px-4 sm:px-6 md:px-8">
      <div className="bg-white shadow-[0_-20px_50px_rgba(217,21,23,0.21)] w-full mx-auto p-6 sm:p-8 md:p-10 relative rounded-t-lg">

        <div className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2 bg-gray-300 rounded-full" style={{width:'60px', height:'5px'}}></div>

        <div onClick={onClick} className="bg-[#D91517] rounded-[51px] flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 md:px-12 py-4 sm:py-5 cursor-pointer space-y-3 sm:space-y-0">

          <div className="flex items-center gap-2 sm:gap-4 text-white">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Basket</h2>
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <span className="text-sm sm:text-base md:text-lg">{cartItems.length} Items</span>
          </div>

          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            ₱{total}
          </div>

        </div>

      </div>
    </div>
  )
}

export default CartBar;
