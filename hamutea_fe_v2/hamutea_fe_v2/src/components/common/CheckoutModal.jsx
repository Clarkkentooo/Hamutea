import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientContext } from '@context/ClientContext';
import images from '@utils/imageLoader';
import Icon from '@components/common/Icon';
import QRCodeImage from '@assets/menu_assets/HAMUTEA_QRPH.jpg';

const CheckoutModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useClientContext();
  const [animateIn, setAnimateIn] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('QR Code');
  const [pickupOption, setPickupOption] = useState('after');
  const [customTime, setCustomTime] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [receipt, setReceipt] = useState(null);
  
  // Animation effect
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimateIn(true), 10);
      document.body.style.overflow = 'hidden';
    } else {
      setAnimateIn(false);
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Handle close with animation
  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => onClose(), 300);
  };
  
  // Set default payment method to QR Code
  useEffect(() => {
    if (isOpen) {
      setSelectedPayment('QR Code');
    }
  }, [isOpen]);
  
  // Handle edit item
  const handleEditItem = (item, index) => {
    // Store edit info in localStorage to pass to Menu component
    localStorage.setItem('hamutea_edit_item', JSON.stringify({
      item,
      index
    }));
    
    // Close modal and navigate to menu
    handleClose();
    navigate('/menu');
  };
  
  // Handle remove item
  const handleRemoveItem = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };
  
  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const total = subtotal; // No delivery fee
  
  // Process checkout
  const handleCheckout = async () => {
    try {
      // Custom pickup time validation for E-wallet
      if (selectedPayment === 'E-wallet' && (pickupOption !== 'custom' || !customTime)) {
        alert('Please set a custom pickup time for E-wallet payment');
        return;
      }
      
      const finalCustomTime = pickupOption === 'custom' ? customTime : "After Order";
      
      // Create order data
      const orderData = {
        customTime: finalCustomTime,
        items: cartItems,
        subtotal: subtotal,
        total: total,
        paymentMethod: selectedPayment,
        pickupOption: pickupOption
      };
      
      // Store order in localStorage
      localStorage.setItem('hamutea_order', JSON.stringify(orderData));
      
      // Handle different payment methods
      if (selectedPayment === 'QR Code') {
        // Show QR code modal
        setShowQRModal(true);
        return;
      } else if (selectedPayment === 'E-wallet') {
        // Close modal and navigate to payment page
        handleClose();
        navigate('/payment', { 
          state: orderData,
          autoProcess: true
        });
      } else {
        // For cash payments, go directly to success page
        handleClose();
        navigate('/payment-success', { 
          state: { 
            orderDetails: orderData
          }
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your checkout. Please try again.');
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${animateIn ? 'opacity-50' : 'opacity-0'}`}
        onClick={handleClose}
      ></div>
      
      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
          <div className="absolute inset-0 bg-black bg-opacity-70" onClick={() => setShowQRModal(false)}></div>
          <div className="bg-white rounded-[20px] shadow-xl p-2 w-full max-w-xl relative z-[101]">
            <h3 className="font-medium text-sm text-[#462525] mb-1 text-center">QR Code Payment</h3>
            
            <div className="flex flex-col items-center">
              {/* QR Code - Kept large and made downloadable */}
              <div className="mb-2 flex flex-col items-center">
                <img 
                  src={QRCodeImage} 
                  alt="Payment QR Code" 
                  className="w-full max-w-[450px] h-auto"
                />
                <a 
                  href={QRCodeImage} 
                  download="HAMUTEA_QRPH.jpg"
                  className="text-xs text-blue-500 mt-1 underline"
                >
                  Download QR Code
                </a>
              </div>
              
              {/* Minimized text */}
              <div className="text-center mb-2">
                <p className="text-xs">Total: ₱{subtotal.toFixed(2)} • QR ID: gLXtvL • CODE: code_xjdVPSLN9on8XAawLXuiU2Vc</p>
              </div>
              
              {/* Minimized receipt upload */}
              <div className="w-full">
                <div className="border border-gray-300 rounded p-2 text-center">
                  {receipt ? (
                    <div className="flex items-center justify-between">
                      <img 
                        src={URL.createObjectURL(receipt)} 
                        alt="Receipt" 
                        className="h-10 object-contain" 
                      />
                      <button 
                        onClick={() => setReceipt(null)}
                        className="text-xs text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setReceipt(e.target.files[0])}
                      className="w-full text-xs"
                    />
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-2">
              <button 
                onClick={() => setShowQRModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded text-xs"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (!receipt) {
                    alert('Please upload your payment receipt');
                    return;
                  }
                  
                  setShowQRModal(false);
                  
                  // Get order data
                  const orderData = {
                    customTime: pickupOption === 'custom' ? customTime : "After Order",
                    items: cartItems,
                    subtotal: subtotal,
                    total: subtotal,
                    paymentMethod: 'QR Code Payment',
                    pickupOption: pickupOption
                  };
                  
                  // Close modal and navigate to success page
                  handleClose();
                  navigate('/payment-success', { 
                    state: { 
                      orderDetails: orderData
                    }
                  });
                }}
                disabled={!receipt}
                className={`flex-1 py-2 rounded text-white text-xs ${!receipt ? 'bg-gray-400' : 'bg-[#D91517]'}`}
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal */}
      <div 
        className={`bg-white rounded-[30px] shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto transition-all duration-300 transform ${animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-[SF Pro Rounded] font-semibold text-xl text-[#462525]">Order Summary</h2>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-[#D91517] transition-colors"
          >
            <Icon name="X" className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-5">
          {cartItems.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <button 
                onClick={() => {
                  handleClose();
                  navigate('/menu');
                }}
                className="bg-[#D91517] text-white font-medium py-2 px-6 rounded-full hover:bg-[#c41315] transition-colors"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                <h3 className="font-[SF Pro Rounded] font-medium text-[#462525] mb-2">Your Items</h3>
                
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center">
                      <div className="w-14 h-14 bg-[#F8F8F8] rounded-lg flex items-center justify-center mr-3">
                        <img 
                          src={item.imageKey ? images[item.imageKey] : item.image} 
                          alt={item.name} 
                          className="w-10 h-10 object-contain" 
                        />
                      </div>
                      <div>
                        <h4 className="font-[SF Pro Rounded] font-medium text-[#462525] text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-500">
                          {item.size} • {item.sugar} Sugar • {item.ice}
                          {item.addOns && item.addOns.length > 0 && (
                            <span> • {item.addOns.join(', ')}</span>
                          )}
                        </p>
                        {item.note && (
                          <p className="text-xs text-gray-500 italic mt-1">
                            Note: {item.note}
                          </p>
                        )}
                        <div className="flex items-center mt-1">
                          <span className="text-[#D91517] font-medium text-xs">₱{item.price.toFixed(2)}</span>
                          <span className="mx-1 text-gray-400 text-xs">×</span>
                          <span className="text-xs">{item.qty}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <button 
                        className="text-gray-400 hover:text-[#D91517] mr-3"
                        onClick={() => handleEditItem(item, index)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button 
                        className="text-gray-400 hover:text-[#D91517]"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Summary */}
              <div className="bg-[#F8F8F8] rounded-lg p-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Subtotal</span>
                  <span>₱{subtotal.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span className="text-[#D91517]">₱{subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="font-[SF Pro Rounded] font-medium text-[#462525] mb-3">Payment Method</h3>
                
                <div className="space-y-3">
                  {/* QR Code Payment Option */}
                  <div 
                    onClick={() => setSelectedPayment('QR Code')}
                    className="flex items-center justify-between cursor-pointer border border-[#D91517] rounded-lg p-3 bg-[#FEF2F2]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border border-gray-300 rounded-full flex items-center justify-center">
                        {selectedPayment === 'QR Code' && <div className="w-3 h-3 bg-[#D91517] rounded-full" />}
                      </div>
                      <div>
                        <p className="text-sm text-[#3E3E3E] font-[SF Pro Rounded]">QR Code Payment</p>
                        <p className="text-xs text-[#D91517]">Recommended</p>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 font-[SF Pro Rounded]">
                      Scan & Pay
                    </p>
                  </div>
                
                  {['E-wallet', 'Cash on Pickup'].map((method) => (
                    <div 
                      key={method}
                      onClick={() => {
                        setSelectedPayment(method);
                        // Reset to "After Order" if switching from E-wallet to Cash on Pickup
                        if (method === 'Cash on Pickup' && pickupOption === 'custom') {
                          setPickupOption('after');
                        }
                      }}
                      className="flex items-center justify-between cursor-pointer border border-gray-200 rounded-lg p-3 hover:border-[#D91517] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border border-gray-300 rounded-full flex items-center justify-center">
                          {selectedPayment === method && <div className="w-3 h-3 bg-[#D91517] rounded-full" />}
                        </div>
                        <p className="text-sm text-[#3E3E3E] font-[SF Pro Rounded]">{method}</p>
                      </div>
                      
                      <p className="text-xs text-gray-500 font-[SF Pro Rounded]">
                        {method === 'E-wallet' ? 'Online Payment' : 'Pay at store'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Pickup Time */}
              <div className="mb-6">
                <h3 className="font-[SF Pro Rounded] font-medium text-[#462525] mb-3">Pickup Time</h3>
                
                <div className="space-y-3">
                  {/* After Order Option */}
                  <div 
                    onClick={() => setPickupOption('after')}
                    className="flex items-center gap-3 cursor-pointer border border-gray-200 rounded-lg p-3 hover:border-[#D91517] transition-colors"
                  >
                    <div className="w-5 h-5 border border-gray-300 rounded-full flex items-center justify-center">
                      {pickupOption === 'after' && <div className="w-3 h-3 bg-[#D91517] rounded-full" />}
                    </div>
                    <p className="text-sm text-[#3E3E3E] font-[SF Pro Rounded]">After I Order</p>
                  </div>
                  
                  {/* Custom Time Option */}
                  <div className="flex items-center justify-between border border-gray-200 rounded-lg p-3 hover:border-[#D91517] transition-colors">
                    <div className="flex items-center gap-3">
                      <div 
                        onClick={() => selectedPayment === 'E-wallet' ? setPickupOption('custom') : null}
                        className={`w-5 h-5 border border-gray-300 rounded-full flex items-center justify-center ${selectedPayment === 'E-wallet' ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                      >
                        {pickupOption === 'custom' && selectedPayment === 'E-wallet' && <div className="w-3 h-3 bg-[#D91517] rounded-full" />}
                      </div>
                      <div>
                        <p className={`text-sm font-[SF Pro Rounded] ${selectedPayment === 'E-wallet' ? 'text-[#3E3E3E]' : 'text-gray-400'}`}>
                          Custom Time
                        </p>
                        {selectedPayment !== 'E-wallet' && (
                          <p className="text-xs text-gray-400">(E-wallet payments only)</p>
                        )}
                      </div>
                    </div>
                    
                    <input 
                      type="time" 
                      className={`border border-gray-200 rounded-md px-2 py-1 text-sm ${pickupOption !== 'custom' || selectedPayment !== 'E-wallet' ? 'opacity-50' : ''}`}
                      disabled={pickupOption !== 'custom' || selectedPayment !== 'E-wallet'}
                      onChange={(e) => {
                        const [hour, minute] = e.target.value.split(':');
                        const h = parseInt(hour);
                        const suffix = h >= 12 ? 'PM' : 'AM';
                        const hour12 = h % 12 === 0 ? 12 : h % 12;
                        setCustomTime(`${hour12}:${minute} ${suffix}`);
                      }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Checkout Button */}
              <div className="flex justify-center">
                <button 
                  className="bg-[#D91517] text-white font-medium py-3 px-10 rounded-full hover:bg-[#c41315] transition-colors w-full"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;