import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientContext } from '@context/ClientContext';
import images from '@utils/imageLoader';

const OrderHistory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('processing');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would be an API call to fetch user's orders
    const mockOrders = [
      {
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
        pickupTime: 'After Order'
      },
      {
        id: '123457',
        orderNumber: '100235',
        date: '2023-06-14T10:15:00',
        status: 'completed',
        items: [
          {
            name: 'Black Sugar Pearl Milk Tea',
            size: 'Large',
            sugar: '100%',
            ice: 'Regular Ice',
            addOns: ['Pudding (+₱25)'],
            price: 145,
            qty: 1,
            imageKey: 'black_sugar_pearl_milk_tea'
          }
        ],
        total: 145,
        paymentMethod: 'E-wallet',
        pickupTime: '2:30 PM'
      },
      {
        id: '123458',
        orderNumber: '100236',
        date: '2023-06-13T16:45:00',
        status: 'completed',
        items: [
          {
            name: 'Passion QQ',
            size: 'Medium',
            sugar: '25%',
            ice: 'Extra Ice',
            addOns: [],
            price: 100,
            qty: 3,
            imageKey: 'passion_qq'
          }
        ],
        total: 300,
        paymentMethod: 'Cash on Pickup',
        pickupTime: 'After Order'
      }
    ];
    
    // Simulate API delay
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => 
    activeTab === 'processing' ? order.status === 'processing' : order.status === 'completed'
  );
  
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
  
  return (
    <div className="relative w-full min-h-screen bg-[#FDF8F8] font-[SF Pro Rounded] overflow-x-hidden flex flex-col px-4 pt-[100px] pb-20">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/menu')}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F8F8F8] mr-4"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#462525" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="font-semibold text-xl sm:text-2xl text-[#462525]">Order History</h1>
        </div>
        
        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-200">
          <button
            className={`py-3 px-6 font-medium text-sm ${activeTab === 'processing' ? 'text-[#D91517] border-b-2 border-[#D91517]' : 'text-gray-500'}`}
            onClick={() => setActiveTab('processing')}
          >
            Processing
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm ${activeTab === 'completed' ? 'text-[#D91517] border-b-2 border-[#D91517]' : 'text-gray-500'}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
        </div>
        
        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D91517]"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-[20px] shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No orders found</h3>
            <p className="text-gray-500 text-sm mb-6">
              {activeTab === 'processing' 
                ? "You don't have any orders in processing." 
                : "You haven't completed any orders yet."}
            </p>
            <button
              onClick={() => navigate('/menu')}
              className="bg-[#D91517] text-white py-2 px-6 rounded-full text-sm font-medium hover:bg-[#c41315] transition-colors"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-[20px] shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-[#462525]">Order #{order.orderNumber}</h3>
                      <p className="text-xs text-gray-500">{formatDate(order.date)}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'processing' 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'bg-green-50 text-green-700'
                    }`}>
                      {order.status === 'processing' ? 'Processing' : 'Completed'}
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Payment Method:</span>
                    <span className="font-medium">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Pickup Time:</span>
                    <span className="font-medium">{order.pickupTime}</span>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="p-4 sm:p-6">
                  <h4 className="font-medium text-sm text-gray-500 mb-4">Items</h4>
                  
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
                  
                  {/* Actions */}
                  <div className="mt-6 flex justify-end">
                    {order.status === 'processing' ? (
                      <button 
                        onClick={() => navigate(`/order-tracking/${order.id}`)}
                        className="bg-[#D91517] text-white py-2 px-6 rounded-full text-sm font-medium hover:bg-[#c41315] transition-colors"
                      >
                        Track Order
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          // Add to cart functionality
                          alert('Reorder functionality would be implemented here');
                        }}
                        className="bg-white border border-[#D91517] text-[#D91517] py-2 px-6 rounded-full text-sm font-medium hover:bg-[#FEF2F2] transition-colors"
                      >
                        Reorder
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;