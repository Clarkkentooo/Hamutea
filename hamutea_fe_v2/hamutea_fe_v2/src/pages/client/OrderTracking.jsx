import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import images from '@utils/imageLoader';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would be an API call to fetch the specific order
    const fetchOrder = () => {
      // Mock data for demonstration
      const mockOrder = {
        id: '123456',
        orderNumber: '100234',
        date: '2023-06-15T14:30:00',
        status: 'processing',
        items: [
          {
            name: 'Signature Pudding Dodol',
            size: 'Medium',
            sugar: '50%',
            ice: 'Regular Ice',
            addOns: ['Pearl (+₱20)'],
            note: 'Extra pearls please',
            price: 130,
            qty: 1,
            imageKey: 'sig_pudding_dodol'
          },
          {
            name: 'Pearl Milk Tea',
            size: 'Large',
            sugar: '75%',
            ice: 'Less Ice',
            addOns: [],
            price: 110,
            qty: 2,
            imageKey: 'pearl_milk_tea'
          }
        ],
        total: 350,
        paymentMethod: 'QR Code Payment',
        pickupTime: 'After Order',
        currentStep: 2,
        estimatedReadyTime: '15 minutes'
      };
      
      setTimeout(() => {
        setOrder(mockOrder);
        setLoading(false);
      }, 1000);
    };
    
    fetchOrder();
  }, [orderId]);
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Order tracking steps
  const steps = [
    { id: 1, name: 'Order Placed', description: 'Your order has been received' },
    { id: 2, name: 'Preparing', description: 'Your drinks are being prepared' },
    { id: 3, name: 'Ready for Pickup', description: 'Your order is ready for pickup' },
    { id: 4, name: 'Completed', description: 'Order has been picked up' }
  ];
  
  return (
    <div className="relative w-full min-h-screen bg-[#FDF8F8] font-[SF Pro Rounded] overflow-x-hidden flex flex-col px-4 pt-[100px] pb-20">
      <div className="max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/order-history')}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F8F8F8] mr-4"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#462525" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="font-semibold text-xl sm:text-2xl text-[#462525]">Track Order</h1>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D91517]"></div>
          </div>
        ) : order ? (
          <>
            {/* Order Info */}
            <div className="bg-white rounded-[20px] shadow-sm p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-[#462525]">Order #{order.orderNumber}</h3>
                  <p className="text-xs text-gray-500">{formatDate(order.date)}</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  Processing
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Payment Method</p>
                  <p className="font-medium">{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-gray-500">Pickup Time</p>
                  <p className="font-medium">{order.pickupTime}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Amount</p>
                  <p className="font-medium text-[#D91517]">₱{order.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Estimated Ready In</p>
                  <p className="font-medium text-green-600">{order.estimatedReadyTime}</p>
                </div>
              </div>
            </div>
            
            {/* Tracking Progress */}
            <div className="bg-white rounded-[20px] shadow-sm p-6 mb-6">
              <h3 className="font-medium text-[#462525] mb-6">Order Status</h3>
              
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 z-0"></div>
                
                {/* Steps */}
                <div className="space-y-8 relative z-10">
                  {steps.map((step) => (
                    <div key={step.id} className="flex">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.id <= order.currentStep 
                          ? 'bg-[#D91517] text-white' 
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        {step.id < order.currentStep ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          step.id
                        )}
                      </div>
                      <div className="ml-4">
                        <h4 className={`font-medium ${
                          step.id <= order.currentStep ? 'text-[#462525]' : 'text-gray-400'
                        }`}>
                          {step.name}
                        </h4>
                        <p className={`text-xs ${
                          step.id <= order.currentStep ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {step.description}
                        </p>
                        {step.id === order.currentStep && (
                          <p className="text-xs text-[#D91517] mt-1 animate-pulse">Current status</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Order Items */}
            <div className="bg-white rounded-[20px] shadow-sm p-6">
              <h3 className="font-medium text-[#462525] mb-4">Order Items</h3>
              
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-start">
                    <div className="w-12 h-12 bg-[#F8F8F8] rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <img 
                        src={item.imageKey ? images[item.imageKey] : ''} 
                        alt={item.name} 
                        className="w-8 h-8 object-contain" 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h5 className="font-medium text-sm">{item.name}</h5>
                        <span className="text-[#D91517] text-sm font-medium">₱{(item.price * item.qty).toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {item.size} • {item.sugar} Sugar • {item.ice}
                        {item.addOns && item.addOns.length > 0 && (
                          <span> • {item.addOns.join(', ')}</span>
                        )}
                      </p>
                      {item.note && (
                        <p className="text-xs text-gray-500 italic">
                          Note: {item.note}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">Qty: {item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Total */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-semibold text-[#D91517]">₱{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-[20px] shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Order Not Found</h3>
            <p className="text-gray-500 text-sm mb-6">
              We couldn't find the order you're looking for.
            </p>
            <button
              onClick={() => navigate('/order-history')}
              className="bg-[#D91517] text-white py-2 px-6 rounded-full text-sm font-medium hover:bg-[#c41315] transition-colors"
            >
              Back to Order History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;