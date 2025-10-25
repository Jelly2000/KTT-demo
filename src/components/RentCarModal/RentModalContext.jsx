import React, { createContext, useContext, useState } from 'react';
import { sendCarRentalRequest, formatPhoneNumber } from '../../utils/zaloUtils';
import { getVehicleById } from '../../utils/vehicleUtils';

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
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const openRentModal = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsRentModalOpen(true);
        setShowSuccessNotification(false);
        setShowErrorNotification(false);
        setErrorMessage('');
    };

    const closeRentModal = () => {
        setIsRentModalOpen(false);
        setSelectedVehicle(null);
        setIsSubmitting(false);
        setShowSuccessNotification(false);
        setShowErrorNotification(false);
        setErrorMessage('');
    };

    const submitRentalRequest = async (formData) => {
        setIsSubmitting(true);
        
        try {
            // Calculate rental details
            const startDate = new Date(formData.pickupDate);
            const endDate = new Date(formData.returnDate);
            const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            const estimatedCost = totalDays * (selectedVehicle?.pricePerDay || 0);
            
            // Get Vietnamese vehicle name from database
            let vietnameseVehicleName = selectedVehicle?.name || 'Xe không xác định';
            if (selectedVehicle?.id) {
                const vehicleVi = getVehicleById(selectedVehicle.id, 'vi');
                if (vehicleVi) {
                    vietnameseVehicleName = vehicleVi.name;
                }
            }
            
            // Prepare data for Telegram
            const rentalData = {
                vehicleName: vietnameseVehicleName,
                customerName: formData.fullName,
                customerPhone: formatPhoneNumber(formData.phone),
                customerEmail: formData.email,
                startDate: startDate.toLocaleDateString('vi-VN'),
                endDate: endDate.toLocaleDateString('vi-VN'),
                pickupLocation: formData.pickupLocation,
                returnLocation: formData.returnLocation,
                additionalNotes: formData.notes,
                pricePerDay: selectedVehicle?.pricePerDay || 0,
                totalDays: totalDays,
                estimatedCost: estimatedCost,
                source: 'Modal Thuê Xe'
            };
            
            // Send to Zalo
            const result = await sendCarRentalRequest(rentalData);
            
            if (result.success) {
                // Show success notification
                setShowSuccessNotification(true);
                setIsSubmitting(false);
                
                // Auto close after 5 seconds
                setTimeout(() => {
                    closeRentModal();
                }, 5000);
            } else {
                // Show error notification
                setShowErrorNotification(true);
                setErrorMessage(result.error || 'Server error occurred. Please contact us directly.');
                setIsSubmitting(false);
                
                // Auto close after 8 seconds
                setTimeout(() => {
                    setShowErrorNotification(false);
                }, 8000);
            }
        } catch (error) {
            setIsSubmitting(false);
            setShowErrorNotification(true);
            setErrorMessage('Network error occurred. Please try again or contact us directly.');
            
            // Auto close after 8 seconds
            setTimeout(() => {
                setShowErrorNotification(false);
            }, 8000);
        }
    };

    const value = {
        isRentModalOpen,
        selectedVehicle,
        isSubmitting,
        showSuccessNotification,
        showErrorNotification,
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