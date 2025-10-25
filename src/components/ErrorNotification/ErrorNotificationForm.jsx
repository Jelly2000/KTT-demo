import React from 'react';
import { useTranslation } from 'react-i18next';

const ErrorNotificationForm = ({ showError }) => {
    const { t } = useTranslation();

    return showError && (
        <div className="error-notification">
            <div className="error-icon">✕</div>
            <h3>{t('request_failed')}</h3>

            <p><strong>{t('contact_us_directly')}</strong></p>

            <small>
                {t('notification_auto_close')}
            </small>
        </div>
    )
};

export default ErrorNotificationForm;
