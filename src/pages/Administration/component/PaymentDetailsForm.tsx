import { CheckCircle, Clock, DollarSign, RefreshCw } from "lucide-react";
import { useState } from "react";

interface PaymentDetailsFormProps {
  bookingDetails: {
    paymentMethod: string;
    paymentStatus: string;
  };
  setBookingDetails: React.Dispatch<React.SetStateAction<any>>;
  calculateTotalAmount: () => number;
  formatCurrency: (amount: number) => string;
}

const PaymentDetailsForm: React.FC<PaymentDetailsFormProps> = ({
  bookingDetails,
  setBookingDetails,
  calculateTotalAmount,
  formatCurrency,
}) => {
  const [partialAmount, setPartialAmount] = useState(0);
  const [transactionId, setTransactionId] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");

  const totalAmount = calculateTotalAmount();

  // Add more payment method options
  const paymentMethods = [
    {
      value: "CASH",
      label: "Cash",
      icon: "💵",
      description: "Customer paid in cash",
      color: "bg-green-100 text-green-700 border-green-300"
    },
    {
      value: "CARD",
      label: "Credit/Debit Card",
      icon: "💳",
      description: "Card payment processed",
      color: "bg-blue-100 text-blue-700 border-blue-300"
    },
    {
      value: "BANK_TRANSFER",
      label: "Bank Transfer",
      icon: "🏦",
      description: "Bank transfer received",
      color: "bg-purple-100 text-purple-700 border-purple-300"
    },
    {
      value: "MOBILE_MONEY",
      label: "Mobile Money",
      icon: "📱",
      description: "Mobile payment (M-Pesa, etc.)",
      color: "bg-orange-100 text-orange-700 border-orange-300"
    },
    {
      value: "CHECK",
      label: "Check",
      icon: "🧾",
      description: "Payment by check",
      color: "bg-yellow-100 text-yellow-700 border-yellow-300"
    },
    {
      value: "OTHER",
      label: "Other",
      icon: "💰",
      description: "Other payment method",
      color: "bg-gray-100 text-gray-700 border-gray-300"
    }
  ];

  // Enhanced payment status options
  const paymentStatuses = [
    {
      value: "PAID",
      label: "Paid",
      icon: <CheckCircle className="h-4 w-4" />,
      description: "Full payment received",
      color: "bg-green-100 text-green-700 border-green-300"
    },
    {
      value: "PENDING",
      label: "Pending",
      icon: <Clock className="h-4 w-4" />,
      description: "Awaiting payment",
      color: "bg-yellow-100 text-yellow-700 border-yellow-300"
    },
    {
      value: "PARTIAL",
      label: "Partial",
      icon: <DollarSign className="h-4 w-4" />,
      description: "Partial payment received",
      color: "bg-blue-100 text-blue-700 border-blue-300"
    },
    {
      value: "REFUNDED",
      label: "Refunded",
      icon: <RefreshCw className="h-4 w-4" />,
      description: "Payment refunded",
      color: "bg-purple-100 text-purple-700 border-purple-300"
    }
  ];
  
  // Calculate partial payment percentage
  const partialPercentage = totalAmount > 0 
    ? Math.round((partialAmount / totalAmount) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Payment Method
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {paymentMethods.map((method) => (
            <button
              key={method.value}
              type="button"
              onClick={() =>
                setBookingDetails((prev) => ({
                  ...prev,
                  paymentMethod: method.value,
                }))
              }
              className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-200 ${
                bookingDetails.paymentMethod === method.value
                  ? method.color + " ring-2 ring-offset-2 ring-opacity-50"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span className="text-2xl mb-2">{method.icon}</span>
              <span className="text-sm font-medium">{method.label}</span>
              <span className="text-xs text-gray-500 mt-1 text-center">
                {method.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Status Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Payment Status
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {paymentStatuses.map((status) => (
            <button
              key={status.value}
              type="button"
              onClick={() =>
                setBookingDetails((prev) => ({
                  ...prev,
                  paymentStatus: status.value,
                }))
              }
              className={`flex items-center justify-center p-3 rounded-lg border transition-all duration-200 ${
                bookingDetails.paymentStatus === status.value
                  ? status.color + " ring-2 ring-offset-2 ring-opacity-50"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span className="mr-2">{status.icon}</span>
              <span className="text-sm font-medium">{status.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Partial Payment Details */}
      {bookingDetails.paymentStatus === "PARTIAL" && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-medium text-yellow-900 mb-3 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Partial Payment Details
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount Paid
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  max={totalAmount}
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter amount paid"
                />
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-sm">
                  <span>Payment Progress</span>
                  <span className="font-medium">{partialPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, partialPercentage)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Paid: {formatCurrency(partialAmount)}</span>
                  <span>Remaining: {formatCurrency(totalAmount - partialAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Details */}
      {bookingDetails.paymentMethod !== "CASH" && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-3">
            Transaction Details
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction ID / Reference
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="TRX-123456789"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Notes
              </label>
              <textarea
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any additional payment information..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Payment Summary */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h4 className="font-medium text-gray-900 mb-3">Payment Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Amount Due</span>
            <span className="font-semibold">{formatCurrency(totalAmount)}</span>
          </div>
          
          {bookingDetails.paymentStatus === "PARTIAL" && (
            <>
              <div className="flex justify-between items-center text-green-600">
                <span>Amount Paid</span>
                <span>-{formatCurrency(partialAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-red-600">
                <span>Balance Due</span>
                <span className="font-bold">
                  {formatCurrency(totalAmount - partialAmount)}
                </span>
              </div>
            </>
          )}
          
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium text-gray-700">Status: </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  bookingDetails.paymentStatus === "PAID"
                    ? "bg-green-100 text-green-800"
                    : bookingDetails.paymentStatus === "PARTIAL"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {bookingDetails.paymentStatus}
                </span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {bookingDetails.paymentStatus === "PARTIAL"
                    ? formatCurrency(totalAmount - partialAmount)
                    : formatCurrency(totalAmount)}
                </div>
                <div className="text-sm text-gray-500">
                  {bookingDetails.paymentMethod.replace("_", " ")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsForm;