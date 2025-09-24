const HighlightedButton = ({ children, onClick, className }) => {
    return (
        <div className={className}>
            <button className='cta-button' onClick={onClick}>
                {children}
            </button>
        </div>
    );
};

export default HighlightedButton;