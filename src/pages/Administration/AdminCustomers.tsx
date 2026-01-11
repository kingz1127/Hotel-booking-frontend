

import React, { useState, useEffect } from 'react';
import { getAllUsers, debugCustomerAPI } from "../../services/api.Customers.js";

export default function AdminCustomers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [debugInfo, setDebugInfo] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            
           
            const debugData = await debugCustomerAPI();
            setDebugInfo(debugData);
            
            const data = await getAllUsers();
            
           
            
            if (Array.isArray(data)) {
                
                const processedCustomers = data.map(customer => {
                    // Normalize field names
                    return {
                        id: customer.id || customer.userId,
                        fullName: customer.fullName || customer.name || 
                                 `${customer.firstName || ''} ${customer.lastName || ''}`.trim() ||
                                 customer.email?.split('@')[0] || 'Customer',
                        email: customer.email || customer.emailAddress || 'No email',
                        phoneNumber: customer.phoneNumber || customer.phone || customer.contactNumber || 'No phone',
                        address: customer.address || customer.location || 'No address',
                        isActive: customer.isActive !== false,
                        createdAt: customer.createdAt || customer.registrationDate
                    };
                });
                
               
                setCustomers(processedCustomers);
            } else {
                console.warn('Data is not an array:', data);
                setCustomers([]);
            }
            
            setError(null);
        } catch (err) {
            setError('Failed to fetch customers. Please try again.');
            console.error('Error fetching customers:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Customers</h1>
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading customers...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Customers</h1>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p className="font-bold">Error:</p>
                    <p>{error}</p>
                    <button 
                        onClick={fetchCustomers}
                        className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
                <div className="flex gap-3">
                    <button 
                        onClick={fetchCustomers}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Refresh
                    </button>
                   
                </div>
            </div> 

            
            {customers.length === 0 ? (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                    <p>No customers found.</p>
                    <p className="text-sm mt-1">Try checking the API endpoint or data format.</p>
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {customers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {customer.fullName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {customer.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {customer.phoneNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                customer.isActive 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {customer.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                                            <button className="text-green-600 hover:text-green-900 mr-3">Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            <div className="mt-4 text-sm text-gray-600">
                <p>Total Customers: {customers.length}</p>
                {customers.length > 0 && (
                    <p className="text-xs mt-1">
                        Showing {customers.length} customer{customers.length !== 1 ? 's' : ''}
                    </p>
                )}
            </div>
        </div>
    );
}