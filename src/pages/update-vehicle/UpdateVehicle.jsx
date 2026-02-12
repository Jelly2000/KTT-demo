import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { getVehicles, getVehicleById } from '../../utils/vehicleUtils';
import SEO from '../../components/SEO/SEO';
import '../shared-styles.css';
import './UpdateVehicle.css';

const UpdateVehicle = () => {
    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const vehicleIdParam = searchParams.get('id');
    
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicleId, setSelectedVehicleId] = useState(vehicleIdParam ? parseInt(vehicleIdParam) : '');
    const [formData, setFormData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [showErrorNotification, setShowErrorNotification] = useState(false);

    // Load vehicles list
    useEffect(() => {
        const vehiclesList = getVehicles(i18n.language);
        setVehicles(vehiclesList);
    }, [i18n.language]);

    // Load selected vehicle data
    useEffect(() => {
        if (selectedVehicleId) {
            const vehicle = getVehicleById(parseInt(selectedVehicleId), i18n.language);
            if (vehicle) {
                setFormData({
                    id: vehicle.id,
                    name: vehicle.name,
                    slug: vehicle.slug,
                    category: vehicle.category,
                    seats: vehicle.seats,
                    transmission: vehicle.transmission,
                    fuel: vehicle.fuel,
                    pricePerDay: vehicle.pricePerDay,
                    description: vehicle.description,
                    availability: vehicle.availability,
                    // Number plate is read-only - cannot be edited
                    numberPlate: vehicle.numberPlate || 'N/A',
                    features: vehicle.features ? vehicle.features.join('\n') : '',
                    engine: vehicle.specifications?.engine || '',
                    power: vehicle.specifications?.power || '',
                    torque: vehicle.specifications?.torque || '',
                    fuelConsumption: vehicle.specifications?.fuelConsumption || '',
                    tankCapacity: vehicle.specifications?.tankCapacity || '',
                    transmissionSpec: vehicle.specifications?.transmission || ''
                });
            }
        } else {
            setFormData(null);
        }
    }, [selectedVehicleId, i18n.language]);

    const handleVehicleSelect = (e) => {
        setSelectedVehicleId(e.target.value);
        setShowSuccessNotification(false);
        setShowErrorNotification(false);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulate API call - in real app, this would send to backend
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Log the update data (for demo purposes)
            console.log('Vehicle update data:', {
                ...formData,
                features: formData.features.split('\n').filter(f => f.trim()),
                specifications: {
                    engine: formData.engine,
                    power: formData.power,
                    torque: formData.torque,
                    fuelConsumption: formData.fuelConsumption,
                    tankCapacity: formData.tankCapacity,
                    transmission: formData.transmissionSpec
                }
            });

            setShowSuccessNotification(true);
            setIsSubmitting(false);

            // Auto close after 3 seconds
            setTimeout(() => {
                setShowSuccessNotification(false);
            }, 3000);
        } catch (error) {
            setIsSubmitting(false);
            setShowErrorNotification(true);
            console.error('Failed to update vehicle:', error);

            // Auto close after 3 seconds
            setTimeout(() => {
                setShowErrorNotification(false);
            }, 3000);
        }
    };

    const handleReset = () => {
        if (selectedVehicleId) {
            const vehicle = getVehicleById(parseInt(selectedVehicleId), i18n.language);
            if (vehicle) {
                setFormData({
                    id: vehicle.id,
                    name: vehicle.name,
                    slug: vehicle.slug,
                    category: vehicle.category,
                    seats: vehicle.seats,
                    transmission: vehicle.transmission,
                    fuel: vehicle.fuel,
                    pricePerDay: vehicle.pricePerDay,
                    description: vehicle.description,
                    availability: vehicle.availability,
                    numberPlate: vehicle.numberPlate || 'N/A',
                    features: vehicle.features ? vehicle.features.join('\n') : '',
                    engine: vehicle.specifications?.engine || '',
                    power: vehicle.specifications?.power || '',
                    torque: vehicle.specifications?.torque || '',
                    fuelConsumption: vehicle.specifications?.fuelConsumption || '',
                    tankCapacity: vehicle.specifications?.tankCapacity || '',
                    transmissionSpec: vehicle.specifications?.transmission || ''
                });
            }
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <div className="update-vehicle-page">
            <SEO 
                titleKey="update_vehicle_title"
                descriptionKey="update_vehicle_description"
            />
            
            {/* Notification Modal */}
            {(isSubmitting || showSuccessNotification || showErrorNotification) && (
                <div className="update-modal">
                    <div className="update-modal-content">
                        {/* Loading State */}
                        {isSubmitting && (
                            <div className="update-loading-overlay">
                                <div className="update-loading-spinner"></div>
                                <p className="update-loading-text">
                                    {t('update_vehicle_submitting')}
                                </p>
                            </div>
                        )}

                        {/* Success Notification */}
                        {showSuccessNotification && (
                            <div className="update-success-notification">
                                <div className="update-success-icon">✓</div>
                                <h3>{t('update_vehicle_success')}</h3>
                                <p>{t('update_vehicle_success_message')}</p>
                                <small>{t('notification_auto_close')}</small>
                            </div>
                        )}

                        {/* Error Notification */}
                        {showErrorNotification && (
                            <div className="update-error-notification">
                                <div className="update-error-icon">✕</div>
                                <h3>{t('update_vehicle_failed')}</h3>
                                <p>{t('update_vehicle_failed_message')}</p>
                                <small>{t('notification_auto_close')}</small>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Page Header */}
            <section className="page-header">
                <div className="container">
                    <h1 className="page-title">{t('update_vehicle_title')}</h1>
                    <p className="page-subtitle">{t('update_vehicle_subtitle')}</p>
                </div>
            </section>

            {/* Update Form Section */}
            <section className="update-form-section">
                <div className="container">
                    <div className="update-form-container">
                        {/* Vehicle Selection */}
                        <div className="vehicle-selection">
                            <label htmlFor="vehicleSelect" className="field-label">
                                <span className="label-text">{t('select_vehicle')}</span>
                                <span className="required-asterisk">*</span>
                            </label>
                            <div className="select-wrapper">
                                <select
                                    id="vehicleSelect"
                                    value={selectedVehicleId}
                                    onChange={handleVehicleSelect}
                                    className="field-input select-input"
                                    required
                                >
                                    <option value="">{t('select_vehicle_placeholder')}</option>
                                    {vehicles.map(vehicle => (
                                        <option key={vehicle.id} value={vehicle.id}>
                                            {vehicle.name} - {formatPrice(vehicle.pricePerDay)}/{t('day_unit')}
                                        </option>
                                    ))}
                                </select>
                                <div className="select-arrow">
                                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                                        <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Update Form - Only show when vehicle is selected */}
                        {formData && (
                            <form className="modern-form update-form" onSubmit={handleSubmit}>
                                <div className="form-container">
                                    {/* Basic Information Section */}
                                    <div className="form-section-header">
                                        <h3>{t('basic_information')}</h3>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-field">
                                            <label htmlFor="name" className="field-label">
                                                <span className="label-text">{t('vehicle_name')}</span>
                                                <span className="required-asterisk">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="field-input"
                                                required
                                            />
                                        </div>

                                        <div className="form-field">
                                            <label htmlFor="numberPlate" className="field-label">
                                                <span className="label-text">{t('number_plate')}</span>
                                                <span className="readonly-badge">{t('readonly')}</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="numberPlate"
                                                name="numberPlate"
                                                value={formData.numberPlate}
                                                className="field-input readonly-input"
                                                disabled
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-field">
                                            <label htmlFor="category" className="field-label">
                                                <span className="label-text">{t('category')}</span>
                                                <span className="required-asterisk">*</span>
                                            </label>
                                            <div className="select-wrapper">
                                                <select
                                                    id="category"
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleInputChange}
                                                    className="field-input select-input"
                                                    required
                                                >
                                                    <option value="sedan">{t('sedan')}</option>
                                                    <option value="suv">{t('suv')}</option>
                                                    <option value="hatchback">{t('hatchback')}</option>
                                                    <option value="minivan">{t('minivan')}</option>
                                                    <option value="luxury">{t('luxury')}</option>
                                                </select>
                                                <div className="select-arrow">
                                                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                                                        <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-field">
                                            <label htmlFor="seats" className="field-label">
                                                <span className="label-text">{t('seats_label')}</span>
                                                <span className="required-asterisk">*</span>
                                            </label>
                                            <div className="select-wrapper">
                                                <select
                                                    id="seats"
                                                    name="seats"
                                                    value={formData.seats}
                                                    onChange={handleInputChange}
                                                    className="field-input select-input"
                                                    required
                                                >
                                                    <option value={4}>4</option>
                                                    <option value={5}>5</option>
                                                    <option value={7}>7</option>
                                                    <option value={8}>8</option>
                                                    <option value={16}>16</option>
                                                </select>
                                                <div className="select-arrow">
                                                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                                                        <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-field">
                                            <label htmlFor="transmission" className="field-label">
                                                <span className="label-text">{t('transmission_label')}</span>
                                                <span className="required-asterisk">*</span>
                                            </label>
                                            <div className="select-wrapper">
                                                <select
                                                    id="transmission"
                                                    name="transmission"
                                                    value={formData.transmission}
                                                    onChange={handleInputChange}
                                                    className="field-input select-input"
                                                    required
                                                >
                                                    <option value="automatic">{t('automatic')}</option>
                                                    <option value="manual">{t('manual')}</option>
                                                </select>
                                                <div className="select-arrow">
                                                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                                                        <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-field">
                                            <label htmlFor="fuel" className="field-label">
                                                <span className="label-text">{t('fuel_label')}</span>
                                                <span className="required-asterisk">*</span>
                                            </label>
                                            <div className="select-wrapper">
                                                <select
                                                    id="fuel"
                                                    name="fuel"
                                                    value={formData.fuel}
                                                    onChange={handleInputChange}
                                                    className="field-input select-input"
                                                    required
                                                >
                                                    <option value="gasoline">{t('gasoline')}</option>
                                                    <option value="diesel">{t('diesel')}</option>
                                                    <option value="electric">{t('electric')}</option>
                                                    <option value="hybrid">{t('hybrid')}</option>
                                                </select>
                                                <div className="select-arrow">
                                                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                                                        <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-field">
                                            <label htmlFor="pricePerDay" className="field-label">
                                                <span className="label-text">{t('price_per_day')}</span>
                                                <span className="required-asterisk">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                id="pricePerDay"
                                                name="pricePerDay"
                                                value={formData.pricePerDay}
                                                onChange={handleInputChange}
                                                className="field-input"
                                                min="0"
                                                step="10000"
                                                required
                                            />
                                        </div>

                                        <div className="form-field availability-field">
                                            <label className="field-label">
                                                <span className="label-text">{t('availability')}</span>
                                            </label>
                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    name="availability"
                                                    checked={formData.availability}
                                                    onChange={handleInputChange}
                                                    className="checkbox-input"
                                                />
                                                <span className="checkbox-text">{t('vehicle_available')}</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Description Section */}
                                    <div className="form-section-header">
                                        <h3>{t('description_title')}</h3>
                                    </div>

                                    <div className="form-field">
                                        <label htmlFor="description" className="field-label">
                                            <span className="label-text">{t('vehicle_description')}</span>
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className="field-input field-textarea"
                                            rows="4"
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label htmlFor="features" className="field-label">
                                            <span className="label-text">{t('features')}</span>
                                            <span className="hint-text">({t('one_per_line')})</span>
                                        </label>
                                        <textarea
                                            id="features"
                                            name="features"
                                            value={formData.features}
                                            onChange={handleInputChange}
                                            className="field-input field-textarea"
                                            rows="5"
                                            placeholder={t('features_placeholder')}
                                        />
                                    </div>

                                    {/* Specifications Section */}
                                    <div className="form-section-header">
                                        <h3>{t('technical_specifications_title')}</h3>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-field">
                                            <label htmlFor="engine" className="field-label">
                                                <span className="label-text">{t('engine_label')}</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="engine"
                                                name="engine"
                                                value={formData.engine}
                                                onChange={handleInputChange}
                                                className="field-input"
                                                placeholder="e.g., 1.4L Gamma MPI"
                                            />
                                        </div>

                                        <div className="form-field">
                                            <label htmlFor="power" className="field-label">
                                                <span className="label-text">{t('power_label')}</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="power"
                                                name="power"
                                                value={formData.power}
                                                onChange={handleInputChange}
                                                className="field-input"
                                                placeholder="e.g., 100 HP @ 6,000 rpm"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-field">
                                            <label htmlFor="torque" className="field-label">
                                                <span className="label-text">{t('torque_label')}</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="torque"
                                                name="torque"
                                                value={formData.torque}
                                                onChange={handleInputChange}
                                                className="field-input"
                                                placeholder="e.g., 132 Nm @ 4,000 rpm"
                                            />
                                        </div>

                                        <div className="form-field">
                                            <label htmlFor="fuelConsumption" className="field-label">
                                                <span className="label-text">{t('fuel_consumption_label')}</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="fuelConsumption"
                                                name="fuelConsumption"
                                                value={formData.fuelConsumption}
                                                onChange={handleInputChange}
                                                className="field-input"
                                                placeholder="e.g., 5.8L/100km"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-field">
                                            <label htmlFor="tankCapacity" className="field-label">
                                                <span className="label-text">{t('tank_capacity_label')}</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="tankCapacity"
                                                name="tankCapacity"
                                                value={formData.tankCapacity}
                                                onChange={handleInputChange}
                                                className="field-input"
                                                placeholder="e.g., 45L"
                                            />
                                        </div>

                                        <div className="form-field">
                                            <label htmlFor="transmissionSpec" className="field-label">
                                                <span className="label-text">{t('transmission_spec_label')}</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="transmissionSpec"
                                                name="transmissionSpec"
                                                value={formData.transmissionSpec}
                                                onChange={handleInputChange}
                                                className="field-input"
                                                placeholder="e.g., 6-speed Automatic"
                                            />
                                        </div>
                                    </div>

                                    {/* Form Actions */}
                                    <div className="form-actions">
                                        <button 
                                            type="button" 
                                            onClick={handleReset} 
                                            className="reset-btn" 
                                            disabled={isSubmitting}
                                        >
                                            <span className="btn-text">{t('reset')}</span>
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="submit-btn" 
                                            disabled={isSubmitting}
                                        >
                                            <span className="btn-text">
                                                {isSubmitting ? t('submitting') : t('update_vehicle_btn')}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* No vehicle selected message */}
                        {!formData && selectedVehicleId === '' && (
                            <div className="no-vehicle-selected">
                                <div className="empty-icon">🚗</div>
                                <p>{t('select_vehicle_to_update')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UpdateVehicle;
