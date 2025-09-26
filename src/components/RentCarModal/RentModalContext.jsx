import React, { createContext, useContext, useState } from 'react';

const RentModalContext = createContext();

export const useRentModal = () => {
    const context = useContext(RentModalContext);
    if (!context) {
        throw new Error('useRentModal must be used within a RentModalProvider');
    }
    return context;
};

export const RentModalProvider = ({ children }) => {
    const [isRentModalOpen, setIsRentModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const openRentModal = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsRentModalOpen(true);
        setShowSuccessNotification(false);
    };

    const closeRentModal = () => {
        setIsRentModalOpen(false);
        setSelectedVehicle(null);
        setIsSubmitting(false);
        setShowSuccessNotification(false);
    };

    const submitRentalRequest = async (formData) => {
        setIsSubmitting(true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // Show success notification
            setShowSuccessNotification(true);
            setIsSubmitting(false);
            
            // Auto close after 5 seconds
            setTimeout(() => {
                closeRentModal();
            }, 5000);
        } catch (error) {
            setIsSubmitting(false);
            setErrorMessage('Failed to submit rental request. Please try again.' + error.message);
        }
    };

    const value = {
        isRentModalOpen,
        selectedVehicle,
        isSubmitting,
        showSuccessNotification,
        openRentModal,
        closeRentModal,
        errorMessage,
        submitRentalRequest
    };

    return (
        <RentModalContext.Provider value={value}>
            {children}
        </RentModalContext.Provider>
    );
};