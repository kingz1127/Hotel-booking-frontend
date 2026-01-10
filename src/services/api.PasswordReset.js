// services/api.PasswordReset.js
const API_URL = "http://localhost:8080/api/v1";

export const checkEmailExists = async (email) => {
    try {
        const response = await fetch(`${API_URL}/register/check-email?email=${encodeURIComponent(email)}`);
        
        if (!response.ok) {
            throw new Error("Failed to check email");
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error checking email:", error);
        throw error;
    }
};

export const sendPasswordResetCode = async (email) => {
    try {
        const response = await fetch(`${API_URL}/password/forgot`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to send reset code");
        }

        return await response.json();
    } catch (error) {
        console.error("Error sending reset code:", error);
        throw error;
    }
};

export const verifyResetCode = async (email, code) => {
    try {
        const response = await fetch(`${API_URL}/password/verify-code`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, code }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to verify code");
        }

        return await response.json();
    } catch (error) {
        console.error("Error verifying code:", error);
        throw error;
    }
};

export const resetPassword = async (email, code, newPassword) => {
    try {
        const response = await fetch(`${API_URL}/password/reset`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, code, newPassword }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to reset password");
        }

        return await response.json();
    } catch (error) {
        console.error("Error resetting password:", error);
        throw error;
    }
};