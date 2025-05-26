import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Icon from "@components/common/Icon";

const TransactionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Mock data based on transaction ID
      const mockTransaction = {
        id: id,
        customer: "Maria Santos",
        email: "maria.santos@example.com",
        phone: "+63 912 345 6789",
        date: "15 June 2023, 10:30 AM",
        amount: 150,
        status: "completed",
        paymentMethod: "ecash",
        reference: "REF-" + id.substring(4),
        items: [
          { name: "Pearl Milk Tea", quantity: 1, price: 90, total: 90 },
          { name: "Add-on: Pearls", quantity: 1, price: 20, total: 20 },
          { name: "Oolong Milk Tea", quantity: 1, price: 90, total: 90 }
        ],
        subtotal: 200,
        discount: 50,
        total: 150
      };
      
      setTransaction(mockTransaction);
      setLoading(false);
    }, 800);
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "refunded": return "bg-orange-100 text-orange-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentIcon = (method) => {
    switch (method) {
      case "ecash": return "Smartphone";
      case "cash": return "CircleDollarSign";
      default: return "CircleDollarSign";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading transaction details...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/admin/transactions')}
          className="text-gray-600 hover:text-gray-900"
        >
          <Icon name="ArrowLeft" className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Transaction Details</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between mb-6 pb-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">{transaction.id}</h2>
            <p className="text-gray-500">{transaction.date}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
              {transaction.status}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Customer Information</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {transaction.customer}</p>
              <p><span className="font-medium">Email:</span> {transaction.email}</p>
              <p><span className="font-medium">Phone:</span> {transaction.phone}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Payment Information</h3>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span className="font-medium">Method:</span> 
                <Icon name={getPaymentIcon(transaction.paymentMethod)} className="w-4 h-4" />
                {transaction.paymentMethod}
              </p>
              <p><span className="font-medium">Reference:</span> {transaction.reference}</p>
              <p><span className="font-medium">Total Amount:</span> ₱{transaction.amount}</p>
            </div>
          </div>
        </div>
        
        <h3 className="text-lg font-medium mb-3">Order Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full mb-6">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transaction.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{item.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center">{item.quantity}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right">₱{item.price}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right">₱{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-end">
            <div className="w-full md:w-1/3">
              <div className="flex justify-between py-2">
                <span className="font-medium">Subtotal:</span>
                <span>₱{transaction.subtotal}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Discount:</span>
                <span>-₱{transaction.discount}</span>
              </div>
              <div className="flex justify-between py-2 text-lg font-bold">
                <span>Total:</span>
                <span>₱{transaction.total}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => navigate('/admin/transactions')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back to Transactions
          </button>
          <button
            onClick={() => {
              // Create a printable version of the receipt
              const printContent = `
                <html>
                <head>
                  <title>Receipt - ${transaction.id}</title>
                  <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                    .receipt { max-width: 800px; margin: 0 auto; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .logo { font-size: 24px; font-weight: bold; color: #D91517; }
                    .info { display: flex; justify-content: space-between; margin-bottom: 20px; }
                    .info-block { flex: 1; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                    th { background-color: #f2f2f2; }
                    .total { text-align: right; font-weight: bold; }
                    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
                  </style>
                </head>
                <body>
                  <div class="receipt">
                    <div class="header">
                      <div class="logo">HAMUTEA</div>
                      <p>Transaction Receipt</p>
                    </div>
                    
                    <div class="info">
                      <div class="info-block">
                        <p><strong>Transaction ID:</strong> ${transaction.id}</p>
                        <p><strong>Date:</strong> ${transaction.date}</p>
                        <p><strong>Payment Method:</strong> ${transaction.paymentMethod}</p>
                      </div>
                      <div class="info-block">
                        <p><strong>Customer:</strong> ${transaction.customer}</p>
                        <p><strong>Email:</strong> ${transaction.email}</p>
                        <p><strong>Phone:</strong> ${transaction.phone}</p>
                      </div>
                    </div>
                    
                    <table>
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${transaction.items.map(item => `
                          <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>₱${item.price}</td>
                            <td>₱${item.total}</td>
                          </tr>
                        `).join('')}
                        <tr>
                          <td colspan="3" class="total">Subtotal:</td>
                          <td>₱${transaction.subtotal}</td>
                        </tr>
                        <tr>
                          <td colspan="3" class="total">Discount:</td>
                          <td>-₱${transaction.discount}</td>
                        </tr>
                        <tr>
                          <td colspan="3" class="total">Total:</td>
                          <td>₱${transaction.total}</td>
                        </tr>
                      </tbody>
                    </table>
                    
                    <div class="footer">
                      <p>Thank you for your purchase!</p>
                      <p>For any inquiries, please contact us at support@hamutea.com</p>
                    </div>
                  </div>
                </body>
                </html>
              `;
              
              // Create a new window for printing
              const printWindow = window.open('', '_blank');
              printWindow.document.write(printContent);
              printWindow.document.close();
              
              // Wait for content to load then print
              printWindow.onload = function() {
                printWindow.print();
                // printWindow.close(); // Uncomment to auto-close after print dialog
              };
            }}
            className="px-4 py-2 bg-hamutea-red hover:bg-red-700 text-white rounded-md flex items-center gap-2"
          >
            <Icon name="Printer" className="w-4 h-4" />
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;