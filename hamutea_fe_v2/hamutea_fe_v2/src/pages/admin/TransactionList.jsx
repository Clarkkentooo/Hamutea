import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SearchInput } from "@components/common/input";
import Icon from "@components/common/Icon";

const TransactionList = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activePaymentFilter, setActivePaymentFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const data = [
        { id: "TRX-001", customer: "Maria Santos", date: "15 June 2023, 10:30 AM", amount: 150, status: "completed", paymentMethod: "ecash" },
        { id: "TRX-002", customer: "Juan Dela Cruz", date: "14 June 2023, 2:45 PM", amount: 220, status: "completed", paymentMethod: "cash" },
        { id: "TRX-003", customer: "Ana Reyes", date: "14 June 2023, 9:15 AM", amount: 85, status: "completed", paymentMethod: "cash" },
        { id: "TRX-004", customer: "Carlos Mendoza", date: "13 June 2023, 4:20 PM", amount: 310, status: "refunded", paymentMethod: "ecash" },
        { id: "TRX-005", customer: "Sofia Garcia", date: "12 June 2023, 11:05 AM", amount: 175, status: "completed", paymentMethod: "cash" },
        { id: "TRX-006", customer: "Miguel Torres", date: "11 June 2023, 3:30 PM", amount: 95, status: "failed", paymentMethod: "ecash" },
        { id: "TRX-007", customer: "Isabella Lim", date: "10 June 2023, 1:45 PM", amount: 260, status: "completed", paymentMethod: "ecash" },
        { id: "TRX-008", customer: "Gabriel Santos", date: "9 June 2023, 5:15 PM", amount: 130, status: "completed", paymentMethod: "cash" },
        { id: "TRX-009", customer: "Olivia Reyes", date: "8 June 2023, 12:30 PM", amount: 195, status: "completed", paymentMethod: "cash" },
        { id: "TRX-010", customer: "Lucas Tan", date: "7 June 2023, 9:45 AM", amount: 280, status: "refunded", paymentMethod: "ecash" }
      ];
      setTransactions(data);
      setFilteredTransactions(data);
      setLoading(false);
    }, 800);
  }, []);
  
  useEffect(() => {
    filterTransactions(activeFilter, activePaymentFilter, searchQuery);
  }, [transactions, activeFilter, activePaymentFilter, searchQuery]);

  const filterTransactions = (filter, paymentFilter, query = '') => {
    let result = transactions;
    
    // Apply status filter
    if (filter !== 'all') {
      result = result.filter(transaction => transaction.status === filter);
    }
    
    // Apply payment method filter
    if (paymentFilter !== 'all') {
      result = result.filter(transaction => transaction.paymentMethod === paymentFilter);
    }
    
    // Apply search query
    if (query) {
      result = result.filter(transaction => 
        transaction.customer.toLowerCase().includes(query.toLowerCase()) ||
        transaction.id.toLowerCase().includes(query.toLowerCase()) ||
        transaction.paymentMethod.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    setFilteredTransactions(result);
  };

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        
        {!loading && (
          <div className="flex gap-4 text-sm">
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <span className="font-medium">Total: </span>
              <span className="text-hamutea-red font-bold">₱{transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}</span>
            </div>
            <div className="bg-blue-100 px-4 py-2 rounded-lg">
              <span className="font-medium">Cash: </span>
              <span className="text-blue-800 font-bold">₱{transactions.filter(t => t.paymentMethod === 'cash').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}</span>
            </div>
            <div className="bg-purple-100 px-4 py-2 rounded-lg">
              <span className="font-medium">E-Cash: </span>
              <span className="text-purple-800 font-bold">₱{transactions.filter(t => t.paymentMethod === 'ecash').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="w-full md:w-1/3">
            <SearchInput 
              placeholder="Search transactions..." 
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 self-center">Status:</span>
              <button 
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${activeFilter === 'all' 
                  ? 'bg-hamutea-red text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveFilter('completed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${activeFilter === 'completed' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
              >
                Completed
              </button>
              <button 
                onClick={() => setActiveFilter('failed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${activeFilter === 'failed' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
              >
                Failed
              </button>
              <button 
                onClick={() => setActiveFilter('refunded')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${activeFilter === 'refunded' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-orange-100 text-orange-800 hover:bg-orange-200'}`}
              >
                Refunded
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 self-center">Payment:</span>
              <button 
                onClick={() => setActivePaymentFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${activePaymentFilter === 'all' 
                  ? 'bg-hamutea-red text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                All
              </button>
              <button 
                onClick={() => setActivePaymentFilter('cash')}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 ${activePaymentFilter === 'cash' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
              >
                <Icon name="CircleDollarSign" className="w-4 h-4" />
                Cash
              </button>
              <button 
                onClick={() => setActivePaymentFilter('ecash')}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 ${activePaymentFilter === 'ecash' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-purple-100 text-purple-800 hover:bg-purple-200'}`}
              >
                <Icon name="Smartphone" className="w-4 h-4" />
                E-Cash
              </button>
            </div>
          </div>
          <button 
            onClick={() => {
              // Create CSV content
              const headers = ["ID", "Customer", "Date", "Amount", "Payment Method", "Status"];
              const rows = filteredTransactions.map(t => 
                [t.id, t.customer, t.date, t.amount, t.paymentMethod, t.status]
              );
              const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
              
              // Create and download file
              const blob = new Blob([csvContent], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = "transactions.csv";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 flex items-center gap-2"
          >
            <Icon name="Download" className="w-4 h-4" />
            Export
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading transactions...</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 text-sm">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <span className="font-medium">Filtered Total: </span>
                  <span className="text-hamutea-red font-bold">₱{filteredTransactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}</span>
                </div>
                <div className="bg-blue-100 px-4 py-2 rounded-lg">
                  <span className="font-medium">Filtered Cash: </span>
                  <span className="text-blue-800 font-bold">₱{filteredTransactions.filter(t => t.paymentMethod === 'cash').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}</span>
                </div>
                <div className="bg-purple-100 px-4 py-2 rounded-lg">
                  <span className="font-medium">Filtered E-Cash: </span>
                  <span className="text-purple-800 font-bold">₱{filteredTransactions.filter(t => t.paymentMethod === 'ecash').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        {transactions.length === 0 ? 'No transactions found' : `No ${activeFilter !== 'all' ? activeFilter : ''} transactions found`}
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.id}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{transaction.customer}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">₱{transaction.amount}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Icon name={getPaymentIcon(transaction.paymentMethod)} className="w-4 h-4" />
                            {transaction.paymentMethod}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <button 
                            className="text-hamutea-blue hover:text-hamutea-red"
                            onClick={() => navigate(`/admin/transactions/${transaction.id}`)}
                          >
                            <Icon name="Eye" className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionList;