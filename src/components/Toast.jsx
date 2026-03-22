import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import './Toast.css';

const Toast = ({ message, type, onClose }) => {
    const icons = {
        success: <CheckCircle className="toast-icon success" size={20} />,
        error: <XCircle className="toast-icon error" size={20} />,
        info: <Info className="toast-icon info" size={20} />,
        warning: <AlertTriangle className="toast-icon warning" size={20} />
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`toast-item ${type}`}
        >
            <div className="toast-content">
                {icons[type]}
                <span className="toast-message">{message}</span>
            </div>
            <button className="toast-close" onClick={onClose} aria-label="Close">
                <X size={16} />
            </button>
        </motion.div>
    );
};

export default Toast;
