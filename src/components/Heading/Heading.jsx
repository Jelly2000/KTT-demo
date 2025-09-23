import React from 'react';
import './Heading.css';

const Heading = ({ 
    level, 
    children, 
    subtitle, 
    className = '', 
    centered = false,
    withUnderline = false,
    ...props 
}) => {
    let headingTag;
    switch (level) {
        case 1:
            headingTag = 'h1';
            break;
        case 2:
            headingTag = 'h2'; 
            break;
        case 3:
            headingTag = 'h3';
            break;
        case 4:
            headingTag = 'h4';
            break;
        default:
            headingTag = 'h2';
    }

    const wrapperClasses = [
        'heading-wrapper',
        centered && 'heading-centered',
        withUnderline && 'heading-with-underline',
        className
    ].filter(Boolean).join(' ');

    const headingClasses = `heading-${level}`;

    if (subtitle) {
        return (
            <div className={wrapperClasses}>
                {React.createElement(headingTag, { className: headingClasses, ...props }, children)}
                <p className="heading-subtitle">{subtitle}</p>
            </div>
        );
    }

    return (
        <div className={wrapperClasses}>
            {React.createElement(headingTag, { className: headingClasses, ...props }, children)}
        </div>
    );
};

export default Heading;