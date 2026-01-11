// CustomerDashboard.jsx
import { useEffect, useState } from 'react';
import { getUserById, } from '../../services/api.Customers.js'; // Adjust path as needed
import { NavLink } from 'react-router-dom';

export default function CustomerDashboard() {
    const [customer, setCustomer] = useState(null); // Changed from [] to null
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Get customer ID from somewhere (localStorage, URL params, etc.)
    const customerId = 1; // Replace with actual customer ID

    useEffect(() => {
        fetchCustomer();
    }, []);

    const fetchCustomer = async () => {
        try {
            setLoading(true);
            const data = await getUserById(customerId); // Now using customerId
            setCustomer(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch customer. Please try again.');
            console.error('Error fetching customer:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Customer Dashboard</h1>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading customer information...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Customer Dashboard</h1>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                    <button 
                        onClick={fetchCustomer}
                        className="ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Customer Dashboard</h1>
            
            {customer ? (
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Welcome, {customer.fullName}!
                        </h2>
                        <p className="text-gray-600">
                            This is your customer dashboard. Here's your information:
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium text-gray-700 mb-2">Personal Information</h3>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-sm text-gray-500">Full Name:</span>
                                    <p className="font-medium">{customer.fullName || 'Not provided'}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Email:</span>
                                    <p className="font-medium">{customer.email || 'Not provided'}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Phone:</span>
                                    <p className="font-medium">{customer.phoneNumber || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium text-gray-700 mb-2">Address Information</h3>
                            <div>
                                <span className="text-sm text-gray-500">Address:</span>
                                <p className="font-medium mt-1">{customer.address || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="font-medium text-gray-700 mb-4">Quick Actions</h3>
                        <div className="flex flex-wrap gap-4">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                                Edit Profile
                            </button>
                            <NavLink to={"/customerpage/customerBookings"} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                                View Bookings
                            </NavLink>
                            <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                    No customer data available. Please try again.
                </div>
            )}
        </div>
    );
}