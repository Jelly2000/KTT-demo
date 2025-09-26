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

    const openRentModal = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsRentModalOpen(true);
    };

    const closeRentModal = () => {
        setIsRentModalOpen(false);
        setSelectedVehicle(null);
    };

    const value = {
        isRentModalOpen,
        selectedVehicle,
        openRentModal,
        closeRentModal
    };

    return (
        <RentModalContext.Provider value={value}>
            {children}
        </RentModalContext.Provider>
    );
};