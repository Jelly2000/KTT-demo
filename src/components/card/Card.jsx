import React from 'react';
import './styles.css';

const Card = ({ icon, heading = '', subheading, content, uiContext }) => {
    return (
        <div className={`${uiContext}-card`}>
            {icon && <div className="card-icon">{icon}</div>}
            <p className='card-heading'>{heading.toUpperCase()}</p>
            <p className='card-subheading'>{subheading}</p>
            <p className='card-content'>{content}</p>
        </div>
    );
}

export default Card;
