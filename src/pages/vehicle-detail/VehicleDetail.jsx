import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useRentModal } from '../../components/RentCarModal';
import {
    fetchVehicleBySlug,
    selectVehicleBySlug,
    selectVehicleDetail,
    selectVehicleDetailError,
    selectVehicleDetailLoading,
} from '../../store/vehicleSlice';
import SEO from '../../components/SEO/SEO';
import './VehicleDetail.css';

const VehicleDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { openRentModal } = useRentModal();
    const listVehicle = useSelector((state) => selectVehicleBySlug(state, slug));
    const detailVehicle = useSelector(selectVehicleDetail);
    const loading = useSelector(selectVehicleDetailLoading);
    const detailError = useSelector(selectVehicleDetailError);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const activeLanguage = i18n.language === 'en' ? 'en' : 'vi';
    const vehicle = detailVehicle?.slug === slug ? detailVehicle : listVehicle;

    useEffect(() => {
        if (slug) {
            dispatch(fetchVehicleBySlug(slug));
        }
    }, [dispatch, slug]);

    useEffect(() => {
        setCurrentImageIndex(0);
    }, [i18n.language, slug]);

    // Define all modal-related functions
    const nextImage = () => {
        if (vehicle && vehicle.gallery && vehicle.gallery.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % vehicle.gallery.length);
        }
    };

    const prevImage = () => {
        if (vehicle && vehicle.gallery && vehicle.gallery.length > 1) {
            setCurrentImageIndex((prev) => (prev - 1 + vehicle.gallery.length) % vehicle.gallery.length);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const nextImageModal = useCallback(() => {
        if (vehicle && vehicle.gallery && vehicle.gallery.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % vehicle.gallery.length);
        }
    }, [vehicle]);

    const prevImageModal = useCallback(() => {
        if (vehicle && vehicle.gallery && vehicle.gallery.length > 1) {
            setCurrentImageIndex((prev) => (prev - 1 + vehicle.gallery.length) % vehicle.gallery.length);
        }
    }, [vehicle]);

    // Keyboard navigation for modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isModalOpen) return;
            
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                prevImageModal();
            } else if (e.key === 'ArrowRight') {
                nextImageModal();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen, nextImageModal, prevImageModal]);

    if (loading && !vehicle) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '3rem 0' }}>
                <p>{t('loading_text')}</p>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '3rem 0', marginTop: '5rem' }}>
                <h2>{t('vehicle_not_found_title')}</h2>
                {detailError && <p>{detailError}</p>}
                <button onClick={() => navigate('/thue-xe')} style={{ marginTop: '1rem' }}>
                    {t('back_to_list_button')}
                </button>
            </div>
        );
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getVideoEmbedUrl = (url) => {
        if (!url) return '';

        try {
            const parsedUrl = new URL(url);
            const host = parsedUrl.hostname.replace('www.', '');

            if (host.includes('youtu.be')) {
                const id = parsedUrl.pathname.replace('/', '');
                return id ? `https://www.youtube.com/embed/${id}` : '';
            }

            if (host.includes('youtube.com')) {
                const id = parsedUrl.searchParams.get('v');
                if (id) {
                    return `https://www.youtube.com/embed/${id}`;
                }

                if (parsedUrl.pathname.startsWith('/embed/')) {
                    return url;
                }
            }

            if (host.includes('tiktok.com')) {
                if (parsedUrl.pathname.startsWith('/embed/')) {
                    return url;
                }

                const parts = parsedUrl.pathname.split('/').filter(Boolean);
                const videoIndex = parts.indexOf('video');
                const videoId = videoIndex >= 0 ? parts[videoIndex + 1] : '';

                if (videoId) {
                    return `https://www.tiktok.com/player/v1/${videoId}`;
                }
            }
        } catch {
            return '';
        }

        return '';
    };

    // Get vehicle-specific features for SEO
    const getVehicleFeatures = (vehicleName) => {
        const name = vehicleName.toLowerCase();
        if (name.includes('accent')) return t('vehicle_hyundai_accent_features');
        if (name.includes('elantra')) return t('vehicle_hyundai_elantra_features');
        if (name.includes('santafe') || name.includes('santa fe')) return t('vehicle_hyundai_santafe_features');
        if (name.includes('venue')) return t('vehicle_hyundai_venue_features');
        if (name.includes('custin')) return t('vehicle_hyundai_custin_features');
        if (name.includes('carnival')) return t('vehicle_kia_carnival_features');
        if (name.includes('sedona')) return t('vehicle_kia_sedona_features');
        if (name.includes('c300') || name.includes('mercedes')) return t('vehicle_mercedes_c300_features');
        if (name.includes('mg5')) return t('vehicle_mg5_features');
        if (name.includes('xpander')) return t('vehicle_mitsubishi_xpander_features');
        return 'xe đời mới, chất lượng cao';
    };

    const vehicleFeatures = getVehicleFeatures(vehicle.name);
    const videoEmbedUrl = getVideoEmbedUrl(vehicle.videoLink);
    const isTikTokVideo = videoEmbedUrl.includes('tiktok.com');
    const vehicleDescription = typeof vehicle.description === 'string'
        ? vehicle.description
        : vehicle.description?.[activeLanguage] || vehicle.description?.vi || vehicle.description?.en || '';

    const localizedFeatures = (vehicle.features || []).map((feature) => {
        if (typeof feature === 'string') return feature;
        if (feature && typeof feature === 'object') {
            return feature[activeLanguage] || feature.vi || feature.en || '';
        }
        return '';
    }).filter(Boolean);

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": vehicle.name,
        "description": `${vehicleDescription} - ${vehicleFeatures}`,
        "image": vehicle.image,
        "brand": {
            "@type": "Brand",
            "name": vehicle.name.split(' ')[0]
        },
        "offers": {
            "@type": "Offer",
            "price": vehicle.pricePerDay,
            "priceCurrency": "VND",
            "availability": vehicle.availability ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
                "@type": "Organization",
                "name": "KTT Car Rental"
            }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "127"
        }
    };

    return (
        <>
            <SEO 
                titleKey="seo_vehicle_detail_title"
                descriptionKey="seo_vehicle_detail_description"
                variables={{
                    vehicleName: vehicle.name,
                    price: formatPrice(vehicle.pricePerDay),
                    vehicleFeatures: vehicleFeatures,
                    vehicleDescription: vehicleFeatures
                }}
                structuredData={structuredData}
                ogImage={vehicle.image}
                ogType="product"
            />
            
            {/* Vehicle Details Section - matching demo structure */}
            <section className="vehicle-detail-section">
                <div className="container">
                    <div className="vehicle-detail-grid">
                        {/* Vehicle Image with carousel */}
                        <div className="vehicle-image-container">
                            <div className="vehicle-image" id="vehicle-image">
                                <img 
                                    src={vehicle.gallery && vehicle.gallery.length > 0 ? vehicle.gallery[currentImageIndex] : vehicle.image}
                                    alt={`Thuê xe ${vehicle.name} tự lái tại TP.HCM - Hình ${currentImageIndex + 1} - KTT Car`}
                                    loading="lazy"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px', cursor: 'pointer' }}
                                    onClick={openModal}
                                />
                                
                                {/* Carousel navigation - only show if multiple images */}
                                {vehicle.gallery && vehicle.gallery.length > 1 && (
                                    <>
                                        <button 
                                            className="carousel-nav carousel-prev" 
                                            onClick={prevImage}
                                            style={{
                                                position: 'absolute',
                                                left: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'rgba(0,0,0,0.5)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '40px',
                                                height: '40px',
                                                cursor: 'pointer',
                                                fontSize: '18px',
                                                zIndex: 2
                                            }}
                                        >
                                            ❮
                                        </button>
                                        <button 
                                            className="carousel-nav carousel-next" 
                                            onClick={nextImage}
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'rgba(0,0,0,0.5)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '40px',
                                                height: '40px',
                                                cursor: 'pointer',
                                                fontSize: '18px',
                                                zIndex: 2
                                            }}
                                        >
                                            ❯
                                        </button>
                                    </>
                                )}
                            </div>
                            
                            {/* Image gallery thumbnails - only show if multiple images */}
                            {vehicle.gallery && vehicle.gallery.length > 1 && (
                                <div className="image-gallery" id="image-gallery">
                                    {vehicle.gallery.map((image, index) => (
                                        <div 
                                            key={index}
                                            className={`gallery-thumb ${currentImageIndex === index ? 'active' : ''}`}
                                            onClick={() => setCurrentImageIndex(index)}
                                        >
                                            <img 
                                                src={image} 
                                                alt={`Xe ${vehicle.name} cho thuê tự lái - Ảnh chi tiết ${index + 1}`} 
                                                loading="lazy"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} 
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Vehicle Info - exact demo structure */}
                        <div className="vehicle-info">
                            <div className="vehicle-header">
                                <h2 className="vehicle-title" id="vehicle-title">{vehicle.name}</h2>
                                {vehicle.plateNumber && (
                                    <div className="vehicle-plate-number">{vehicle.plateNumber}</div>
                                )}
                                <div className="vehicle-price" id="vehicle-price">{formatPrice(vehicle.pricePerDay)}{t('per_day')}</div>
                                <div className="vehicle-rating">
                                    <span className="stars">⭐⭐⭐⭐⭐</span>
                                    <span className="rating-text">
                                        {t('excellent_rating_text')}
                                    </span>
                                </div>
                            </div>

                            <div className="vehicle-description">
                                <h3>{t('description_title')}</h3>
                                <p id="vehicle-description">{vehicleDescription}</p>
                            </div>

                            <div className="vehicle-features">
                                <h3>{t('key_features_title')}</h3>
                                <ul id="vehicle-features-list">
                                    {localizedFeatures.map((feature, index) => (
                                        <li key={index}>• {feature}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="vehicle-actions">
                                <button 
                                    className="rent-button primary"
                                    onClick={() => openRentModal(vehicle)}
                                >
                                    {t('rent_now_button')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vehicle Specifications - matching demo */}
            <section className="vehicle-specs-section">
                <div className="container">

                    {videoEmbedUrl && (
                        <div className="vehicle-video">
                            <h2 className="section-title">{t('vehicle_video_title')}</h2>
                            <div className={`vehicle-video-wrapper ${isTikTokVideo ? 'tiktok-video-wrapper' : ''}`}>
                                <iframe
                                    src={videoEmbedUrl}
                                    title={`${vehicle.name} video`}
                                    loading="lazy"
                                    scrolling="no"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    )}

                    <h2 className="section-title">
                        {t('technical_specifications_title')}
                    </h2>
                    <div className="specs-grid" id="specs-grid">
                        <div className="spec-card">
                            <div className="spec-icon">🚗</div>
                            <div className="spec-content">
                                <div className="spec-label">{t('seats_label')}</div>
                                <div className="spec-value">{vehicle.seats} chỗ</div>
                            </div>
                        </div>
                        <div className="spec-card">
                            <div className="spec-icon">⚙️</div>
                            <div className="spec-content">
                                <div className="spec-label">{t('transmission_label')}</div>
                                <div className="spec-value">{vehicle.transmission === 'automatic' ? 'Tự động' : 'Số sàn'}</div>
                            </div>
                        </div>
                        <div className="spec-card">
                            <div className="spec-icon">⛽</div>
                            <div className="spec-content">
                                <div className="spec-label">{t('fuel_label')}</div>
                                <div className="spec-value">{vehicle.fuel === 'gasoline' || vehicle.fuel === 'petrol' ? 'Xăng' : vehicle.fuel}</div>
                            </div>
                        </div>
                        {vehicle.specifications && (
                            <>
                                <div className="spec-card">
                                    <div className="spec-icon">🔧</div>
                                    <div className="spec-content">
                                        <div className="spec-label">{t('engine_label')}</div>
                                        <div className="spec-value">{vehicle.specifications.engine}</div>
                                    </div>
                                </div>
                                <div className="spec-card">
                                    <div className="spec-icon">💨</div>
                                    <div className="spec-content">
                                        <div className="spec-label">{t('power_label')}</div>
                                        <div className="spec-value">{vehicle.specifications.power}</div>
                                    </div>
                                </div>
                                <div className="spec-card">
                                    <div className="spec-icon">📊</div>
                                    <div className="spec-content">
                                        <div className="spec-label">{t('fuel_consumption_label')}</div>
                                        <div className="spec-value">{vehicle.specifications.fuelConsumption}</div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Image Modal */}
            {isModalOpen && (
                <div className="image-modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>
                            ✕
                        </button>
                        <img 
                            src={vehicle.gallery && vehicle.gallery.length > 0 ? vehicle.gallery[currentImageIndex] : vehicle.image}
                            alt={`Thuê xe ${vehicle.name} tự lái tại TP.HCM - Xem chi tiết đầy đủ - KTT Car`}
                            loading="lazy"
                            className="modal-image"
                        />
                        {vehicle.gallery && vehicle.gallery.length > 1 && (
                            <>
                                <button className="modal-nav-btn modal-prev" onClick={prevImageModal}>
                                    ❮
                                </button>
                                <button className="modal-nav-btn modal-next" onClick={nextImageModal}>
                                    ❯
                                </button>
                                <div className="modal-counter">
                                    {currentImageIndex + 1} / {vehicle.gallery.length}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default VehicleDetail;