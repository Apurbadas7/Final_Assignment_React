import React from 'react';
import { User, Phone, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="profile-drawer-backdrop">
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="profile-drawer-container"
                    >
                        {/* Header */}
                        <div className="profile-drawer-header">
                            <h3>View Profile Details</h3>
                            <button className="profile-close-btn" onClick={onClose} aria-label="Close Profile">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="profile-drawer-body">
                            {/* Basic Information Card */}
                            <div className="profile-info-card">
                                <div className="profile-card-header">
                                    <h4>Basic Information</h4>
                                </div>
                                <div className="profile-card-body">
                                    <div className="profile-data-row">
                                        <span className="field-label">Name</span>
                                        <span className="field-value">Stebin Ben</span>
                                    </div>
                                    <div className="profile-data-row">
                                        <span className="field-label">Phone</span>
                                        <span className="field-value">+91 9398239231</span>
                                    </div>
                                </div>
                            </div>

                            {/* Device Information Card */}
                            <div className="profile-info-card">
                                <div className="profile-card-header">
                                    <h4>Device Information</h4>
                                </div>
                                <div className="profile-card-body">
                                    <div className="profile-data-row">
                                        <span className="field-label">Device Serial Number</span>
                                        <span className="field-value">456954659876857</span>
                                    </div>
                                    <div className="profile-data-row">
                                        <span className="field-label">Linked Account Number</span>
                                        <span className="field-value">XXXXXX6857</span>
                                    </div>
                                    <div className="profile-data-row">
                                        <span className="field-label">UPI ID</span>
                                        <span className="field-value">rudransh.panigrahi@cbin</span>
                                    </div>
                                    <div className="profile-data-row">
                                        <span className="field-label">IFSC Code</span>
                                        <span className="field-value">CBIN0283896</span>
                                    </div>
                                    <div className="profile-data-row">
                                        <span className="field-label">Device Model Name</span>
                                        <span className="field-value">Morefun ET389</span>
                                    </div>
                                    <div className="profile-data-row">
                                        <span className="field-label">Device Mobile Number</span>
                                        <span className="field-value">+91 9398239231</span>
                                    </div>
                                    <div className="profile-data-row">
                                        <span className="field-label">Network Type</span>
                                        <span className="field-value">BSNL</span>
                                    </div>
                                    <div className="profile-data-row">
                                        <span className="field-label">Device Status</span>
                                        <span className="field-value">Active</span>
                                    </div>
                                    <div className="profile-data-row">
                                        <span className="field-label">Battery Percentage</span>
                                        <span className="field-value">60%</span>
                                    </div>
                                    <div className="profile-data-row">
                                        <span className="field-label">Network Strength</span>
                                        <span className="field-value">Strong</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="profile-drawer-footer">
                            <button className="btn-close-profile" onClick={onClose}>
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Profile;
