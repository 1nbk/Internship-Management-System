import React from 'react';
import './Button.css';

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
    const classes = `btn btn-${variant} btn-${size} ${className}`;
    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
};

export default Button;
