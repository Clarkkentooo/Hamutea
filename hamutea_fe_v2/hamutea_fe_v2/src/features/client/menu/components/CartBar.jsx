const CartBar = ({cartItems, total, onClick}) => {
  if (cartItems.length === 0) return null;

  return (
    <div className="w-full mt-6 px-4 sm:px-6 md:px-8">
      <div className="w-full mx-auto p-3 sm:p-4 md:p-5 relative rounded-t-lg">
        <div onClick={onClick} className="bg-[#D91517] rounded-[51px] flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 cursor-pointer space-y-2 sm:space-y-0 shadow-md">
          <div className="flex items-center gap-2 sm:gap-3 text-white">
            <h2 className="text-base sm:text-lg md:text-xl font-bold">Basket</h2>
            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
            <span className="text-xs sm:text-sm">{cartItems.length} Items</span>
          </div>

          <div className="text-base sm:text-lg md:text-xl font-bold text-white">
            ₱{total.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartBar;