// AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch customer on initial load (if logged in)
    useEffect(() => {
        const customerId = localStorage.getItem('customerId');
        
        if (customerId) {
            fetchCustomer(customerId);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchCustomer = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/customers/${id}`);
            if (response.ok) {
                const data = await response.json();
                setCustomer(data);
            }
        } catch (error) {
            console.error('Error fetching customer:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        // Implement login logic here
        // After successful login:
        // const customerId = response.id;
        // localStorage.setItem('customerId', customerId);
        // fetchCustomer(customerId);
    };

    const logout = () => {
        localStorage.removeItem('customerId');
        setCustomer(null);
    };

    return (
        <AuthContext.Provider value={{ customer, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};