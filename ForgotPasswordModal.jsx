import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPasswordModal.css';

export default function ForgotPasswordModal({ onClose, onSuccess }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState('email'); // 'email' or 'reset'
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Step 1: Request reset code
    async function handleSendReset(e) {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Please enter your email');
            return;
        }

        setLoading(true);
        try {
            // Updated port to 8080 to match your backend
            await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
            setStep('reset');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    // Step 2: Reset password with code
    async function handleResetPassword(e) {
        e.preventDefault();
        setError('');

        if (!resetCode || !newPassword || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            // Updated port to 8080 to match your backend
            await axios.post('http://localhost:8080/api/auth/reset-password', {
                resetCode,
                newPassword
            });
            onSuccess('Password reset successfully! You can now log in.');
            onClose(); // Close modal on success
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>

                {step === 'email' ? (
                    <>
                        <h2 className="modal-title">Forgot Your Password?</h2>
                        <p className="modal-subtitle">
                            Enter your email address and we'll send you instructions to reset your password.
                        </p>

                        {error && <div className="alert alert-error">{error}</div>}

                        <form onSubmit={handleSendReset} className="modal-form">
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    className="form-input"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                className="modal-btn primary"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Reset Code'}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <h2 className="modal-title">Reset Your Password</h2>
                        <p className="modal-subtitle">
                            Check your email for the reset code and enter your new password.
                        </p>

                        {error && <div className="alert alert-error">{error}</div>}

                        <form onSubmit={handleResetPassword} className="modal-form">
                            <div className="form-group">
                                <label className="form-label">Reset Code</label>
                                <input
                                    className="form-input"
                                    type="text"
                                    value={resetCode}
                                    onChange={e => setResetCode(e.target.value)}
                                    placeholder="Enter code from email"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">New Password</label>
                                <input
                                    className="form-input"
                                    type="password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    placeholder="Minimum 6 characters"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Confirm Password</label>
                                <input
                                    className="form-input"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder="Re-type password"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                className="modal-btn primary"
                                disabled={loading}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>

                            <button
                                type="button"
                                className="modal-btn secondary"
                                onClick={() => setStep('email')}
                                disabled={loading}
                            >
                                Back
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}