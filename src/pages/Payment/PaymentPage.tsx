// pages/Payment/PaymentPage.jsx - UPDATED
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { confirmPayment, getBookingById } from "../../services/api.Booking.js"; 
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  // Get user name from sessionStorage
  const getUserName = () => {
    try {
      const userSession = sessionStorage.getItem("user");
      if (userSession) {
        const userData = JSON.parse(userSession);
        return userData.fullName || userData.name || userData.username || "Guest";
      }
      return "Guest";
    } catch (error) {
      console.error("Error parsing user session:", error);
      return "Guest";
    }
  };
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: "4242 4242 4242 4242", // Test card for demo
    cardName: getUserName(),
    expiryDate: "12/28",
    cvv: "123",
    saveCard: false
  });

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        toast.error("No booking found");
        navigate("/rooms");
        return;
      }

      try {
        // Fetch booking details from backend
        const bookingData = await getBookingById(bookingId);
        setBooking(bookingData);
      } catch (error) {
        toast.error("Failed to load booking details");
        navigate("/customerpage/customerBookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, navigate]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!booking) return;
    
    // Validate payment data
    if (!paymentData.cardNumber || !paymentData.cardName || !paymentData.expiryDate || !paymentData.cvv) {
      toast.error("Please fill in all payment details");
      return;
    }

    // Validate card number (basic validation for demo)
    const cardNumber = paymentData.cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cardNumber)) {
      toast.error("Please enter a valid 16-digit card number");
      return;
    }

    // Validate expiry date
    if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      toast.error("Please enter expiry date in MM/YY format");
      return;
    }

    // Validate CVV
    if (!/^\d{3,4}$/.test(paymentData.cvv)) {
      toast.error("Please enter a valid 3 or 4-digit CVV");
      return;
    }

    try {
      setProcessing(true);
      toast.info("Processing payment...");
      
      // Call backend to confirm payment
      const confirmedBooking = await confirmPayment(bookingId);
      
      // Update local booking state
      setBooking(confirmedBooking);
      
      toast.success("Payment successful! Booking confirmed.");
      
      // Clean up sessionStorage (not localStorage)
      sessionStorage.removeItem('pendingPaymentBookingId');
      sessionStorage.removeItem('pendingPaymentAmount');
      sessionStorage.removeItem('selectedRoomId');
      sessionStorage.removeItem('redirectAfterLogin');
      
      // Show success message and redirect
      setTimeout(() => {
        navigate("/customerpage/customerBookings");
      }, 2000);
      
    } catch (error) {
      toast.error(`Payment failed: ${error.message}`);
      console.error("Payment error:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelPayment = () => {
    if (window.confirm("Are you sure you want to cancel payment? Your booking will remain pending.")) {
      // Navigate back to booking page
      if (booking?.roomId) {
        navigate(`/booking/${booking.roomId}`);
      } else {
        navigate("/rooms");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-700 mb-4">Booking not found</h3>
          <button
            onClick={() => navigate("/rooms")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Browse Rooms
          </button>
        </div>
      </div>
    );
  }

  // Calculate number of nights
  const checkInDate = new Date(booking.checkInDate);
  const checkOutDate = new Date(booking.checkOutDate);
  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Payment</h1>
          <p className="text-gray-600 mt-2">Booking ID: {booking.id}</p>
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
            booking.status === 'PENDING_PAYMENT' ? 'bg-yellow-100 text-yellow-800' :
            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            Status: {booking.status.replace('_', ' ')}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Room</p>
                  <p className="font-semibold">{booking.roomName}</p>
                  <p className="text-sm text-gray-600">{booking.roomCategory}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check-in</p>
                  <p className="font-semibold">{checkInDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check-out</p>
                  <p className="font-semibold">{checkOutDate.toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">({nights} night{nights !== 1 ? 's' : ''})</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Guests</p>
                  <p className="font-semibold">{booking.numberOfGuests} {booking.numberOfGuests === 1 ? 'guest' : 'guests'}</p>
                </div>
                
                {booking.specialRequests && (
                  <div>
                    <p className="text-sm text-gray-500">Special Requests</p>
                    <p className="text-sm italic text-gray-600">{booking.specialRequests}</p>
                  </div>
                )}
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Room price</span>
                    <span>${(booking.totalAmount / nights).toFixed(2)} × {nights} nights</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span className="text-green-600">${booking.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                {/* Card Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                      required
                      disabled={processing || booking.status === 'CONFIRMED'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      type="text"
                      placeholder="John Doe"
                      value={paymentData.cardName}
                      onChange={(e) => setPaymentData({...paymentData, cardName: e.target.value})}
                      required
                      disabled={processing || booking.status === 'CONFIRMED'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      type="text"
                      placeholder="MM/YY"
                      value={paymentData.expiryDate}
                      onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})}
                      required
                      disabled={processing || booking.status === 'CONFIRMED'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="text"
                      placeholder="123"
                      value={paymentData.cvv}
                      onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                      required
                      disabled={processing || booking.status === 'CONFIRMED'}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="saveCard"
                    checked={paymentData.saveCard}
                    onChange={(e) => setPaymentData({...paymentData, saveCard: e.target.checked})}
                    className="rounded"
                    disabled={processing || booking.status === 'CONFIRMED'}
                  />
                  <Label htmlFor="saveCard">Save card for future payments</Label>
                </div>

                {/* Demo Notice */}
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    💳 <strong>Demo Payment Notice:</strong> This is a test environment. Use card number <code>4242 4242 4242 4242</code> with any future expiry date and any 3-digit CVV for successful payment.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelPayment}
                    disabled={processing}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  
                  {booking.status === 'PENDING_PAYMENT' ? (
                    <Button
                      type="submit"
                      disabled={processing}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {processing ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                          Processing...
                        </>
                      ) : (
                        `Pay $${booking.totalAmount.toFixed(2)}`
                      )}
                    </Button>
                  ) : (
                    <div className="flex-1">
                      <div className="text-center p-3 bg-green-100 text-green-800 rounded-lg">
                        <p className="font-semibold">✓ Payment Confirmed</p>
                        <p className="text-sm">Your booking is now active</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Info */}
                {booking.status === 'PENDING_PAYMENT' && (
                  <div className="text-sm text-gray-600 mt-4">
                    <p className="font-medium mb-1">Booking Status: Pending Payment</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Your room is temporarily reserved for 1 hour</li>
                      <li>Complete payment to confirm your booking</li>
                      <li>Room quantity will decrease upon payment confirmation</li>
                    </ul>
                  </div>
                )}

                {booking.status === 'CONFIRMED' && (
                  <div className="text-sm text-green-600 mt-4">
                    <p className="font-medium">✓ Payment successfully confirmed!</p>
                    <p>Your booking is now active. The room has been reserved for you.</p>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Important Information */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <h3 className="font-semibold text-blue-800 mb-2">Important Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-blue-700 mb-1">Payment Confirmation</h4>
              <p className="text-sm text-blue-600">
                Once payment is confirmed, the room quantity will immediately decrease in the system.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-700 mb-1">Cancellation Policy</h4>
              <p className="text-sm text-blue-600">
                Free cancellation up to 24 hours before check-in. After that, a 50% fee applies.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-700 mb-1">Room Availability</h4>
              <p className="text-sm text-blue-600">
                After check-out, the room quantity will automatically increase back in the system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}