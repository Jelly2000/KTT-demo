import React, { createContext, useContext, useState } from 'react';
import { sendCarRentalRequest, formatPhoneNumber } from '../../utils/telegramUtils';
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
            
            // Send to Telegram
            const success = await sendCarRentalRequest(rentalData);
            
            if (success) {
                console.log('Rental request sent to Telegram successfully');
            } else {
                console.log('Failed to send to Telegram, but form was processed');
            }
            
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