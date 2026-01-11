// import React, { useState } from 'react';
// import { sendPasswordResetCode, verifyResetCode, resetPassword } from '../../services/api.PasswordReset';

// export default function ForgotPassword() {
//     const [step, setStep] = useState(1);
//     const [email, setEmail] = useState('');
//     const [code, setCode] = useState('');
//     const [newPassword, setNewPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');

//     const handleSendCode = async () => {
//         setLoading(true);
//         setError('');
        
//         try {
//             await sendPasswordResetCode(email);
//             setSuccess('Reset code sent to your email!');
//             setStep(2);
//         } catch (err) {
//             setError(err.message || 'Failed to send reset code');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleVerifyCode = async () => {
//         setLoading(true);
//         setError('');
        
//         try {
//             const result = await verifyResetCode(email, code);
//             if (result.valid) {
//                 setSuccess('Code verified! Please set your new password.');
//                 setStep(3);
//             } else {
//                 setError('Invalid or expired code');
//             }
//         } catch (err) {
//             setError(err.message || 'Failed to verify code');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleResetPassword = async () => {
//         if (newPassword !== confirmPassword) {
//             setError('Passwords do not match');
//             return;
//         }
        
//         if (newPassword.length < 6) {
//             setError('Password must be at least 6 characters');
//             return;
//         }
        
//         setLoading(true);
//         setError('');
        
//         try {
//             await resetPassword(email, code, newPassword);
//             setSuccess('Password reset successfully! You can now login.');
//             setTimeout(() => {
//                 window.location.href = '/login';
//             }, 2000);
//         } catch (err) {
//             setError(err.message || 'Failed to reset password');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
//                 <div>
//                     <h2 className="text-center text-3xl font-extrabold text-gray-900">
//                         Reset Your Password
//                     </h2>
//                     <p className="mt-2 text-center text-sm text-gray-600">
//                         {step === 1 && 'Enter your email to receive a reset code'}
//                         {step === 2 && 'Enter the 4-digit code sent to your email'}
//                         {step === 3 && 'Create a new password'}
//                     </p>
//                 </div>

//                 {error && (
//                     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//                         {error}
//                     </div>
//                 )}

//                 {success && (
//                     <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
//                         {success}
//                     </div>
//                 )}

//                 {step === 1 && (
//                     <div className="mt-8 space-y-6">
//                         <div>
//                             <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                                 Email Address
//                             </label>
//                             <input
//                                 id="email"
//                                 type="email"
//                                 required
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="you@example.com"
//                             />
//                         </div>

//                         <button
//                             onClick={handleSendCode}
//                             disabled={loading || !email}
//                             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//                         >
//                             {loading ? 'Sending...' : 'Send Reset Code'}
//                         </button>
//                     </div>
//                 )}

//                 {step === 2 && (
//                     <div className="mt-8 space-y-6">
//                         <div>
//                             <label htmlFor="code" className="block text-sm font-medium text-gray-700">
//                                 4-Digit Code
//                             </label>
//                             <input
//                                 id="code"
//                                 type="text"
//                                 required
//                                 maxLength="4"
//                                 value={code}
//                                 onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
//                                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest"
//                                 placeholder="0000"
//                             />
//                         </div>

//                         <button
//                             onClick={handleVerifyCode}
//                             disabled={loading || code.length !== 4}
//                             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//                         >
//                             {loading ? 'Verifying...' : 'Verify Code'}
//                         </button>

//                         <button
//                             onClick={() => setStep(1)}
//                             className="w-full text-sm text-blue-600 hover:text-blue-500"
//                         >
//                             Back to email entry
//                         </button>
//                     </div>
//                 )}

//                 {step === 3 && (
//                     <div className="mt-8 space-y-6">
//                         <div>
//                             <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
//                                 New Password
//                             </label>
//                             <input
//                                 id="newPassword"
//                                 type="password"
//                                 required
//                                 value={newPassword}
//                                 onChange={(e) => setNewPassword(e.target.value)}
//                                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="Enter new password"
//                             />
//                         </div>

//                         <div>
//                             <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
//                                 Confirm Password
//                             </label>
//                             <input
//                                 id="confirmPassword"
//                                 type="password"
//                                 required
//                                 value={confirmPassword}
//                                 onChange={(e) => setConfirmPassword(e.target.value)}
//                                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="Confirm new password"
//                             />
//                         </div>

//                         <button
//                             onClick={handleResetPassword}
//                             disabled={loading || !newPassword || !confirmPassword}
//                             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//                         >
//                             {loading ? 'Resetting...' : 'Reset Password'}
//                         </button>
//                     </div>
//                 )}

//                 <div className="text-center">
//                     <a href="/login" className="text-sm text-blue-600 hover:text-blue-500">
//                         Back to Login
//                     </a>
//                 </div>
//             </div>
//         </div>
//     );
// }


import React, { useState } from 'react';
import { sendPasswordResetCode, verifyResetCode, resetPassword, checkEmailExists } from '../../services/api.PasswordReset';

export default function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isWalkIn, setIsWalkIn] = useState(false);

    const handleEmailCheck = async () => {
        setLoading(true);
        setError('');
        
        try {
            // First check if email exists
            const emailCheck = await checkEmailExists(email);
            
            if (!emailCheck.exists) {
                setError('No account found with this email address');
                setLoading(false);
                return;
            }
            
            setIsWalkIn(emailCheck.isWalkIn || false);
            
            // Send reset code
            await sendPasswordResetCode(email);
            
            if (emailCheck.isWalkIn) {
                setSuccess('Welcome! A verification code has been sent to set up your password.');
            } else {
                setSuccess('Reset code sent to your email!');
            }
            
            setStep(2);
        } catch (err) {
            setError(err.message || 'Failed to send reset code');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        setLoading(true);
        setError('');
        
        try {
            const result = await verifyResetCode(email, code);
            if (result.valid) {
                if (isWalkIn) {
                    setSuccess('Code verified! Please create your password.');
                } else {
                    setSuccess('Code verified! Please set your new password.');
                }
                setStep(3);
            } else {
                setError('Invalid or expired code');
            }
        } catch (err) {
            setError(err.message || 'Failed to verify code');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            await resetPassword(email, code, newPassword);
            
            if (isWalkIn) {
                setSuccess('Password created successfully! You can now login to manage your bookings.');
            } else {
                setSuccess('Password reset successfully! You can now login.');
            }
            
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } catch (err) {
            setError(err.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        {isWalkIn ? 'Set Up Your Password' : 'Reset Your Password'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {step === 1 && (isWalkIn ? 'Enter your email to activate your account' : 'Enter your email to receive a reset code')}
                        {step === 2 && 'Enter the 4-digit code sent to your email'}
                        {step === 3 && (isWalkIn ? 'Create a password for your account' : 'Create a new password')}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {success}
                    </div>
                )}

                {isWalkIn && step === 1 && (
                    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                        <p className="font-medium">Walk-in Customer Detected!</p>
                        <p className="text-sm mt-1">
                            Set up your password to access your booking history and manage your profile.
                        </p>
                    </div>
                )}

                {step === 1 && (
                    <div className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleEmailCheck()}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="you@example.com"
                            />
                        </div>

                        <button
                            onClick={handleEmailCheck}
                            disabled={loading || !email}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send Verification Code'}
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                                4-Digit Code
                            </label>
                            <input
                                id="code"
                                type="text"
                                required
                                maxLength="4"
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                onKeyPress={(e) => e.key === 'Enter' && code.length === 4 && handleVerifyCode()}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest"
                                placeholder="0000"
                            />
                        </div>

                        <button
                            onClick={handleVerifyCode}
                            disabled={loading || code.length !== 4}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Verify Code'}
                        </button>

                        <button
                            onClick={() => setStep(1)}
                            className="w-full text-sm text-blue-600 hover:text-blue-500"
                        >
                            Back to email entry
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                {isWalkIn ? 'Create Password' : 'New Password'}
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter password (min 6 characters)"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && newPassword && confirmPassword && handleResetPassword()}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Confirm password"
                            />
                        </div>

                        {newPassword && newPassword.length < 6 && (
                            <p className="text-sm text-yellow-600">
                                Password should be at least 6 characters
                            </p>
                        )}

                        {newPassword && confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-sm text-red-600">
                                Passwords do not match
                            </p>
                        )}

                        <button
                            onClick={handleResetPassword} 
                            disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : (isWalkIn ? 'Create Password & Activate Account' : 'Reset Password')}
                        </button>
                    </div>
                )}

                <div className="text-center">
                    <a href="/login" className="text-sm text-blue-600 hover:text-blue-500">
                        Back to Login
                    </a>
                </div>
            </div>
        </div>
    );
}