import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { HighlightedButton } from '../../components';
import SEO from '../../components/SEO/SEO';
import '../shared-styles.css';
import './styles.css';

const Procedures = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="procedures-page">
      <SEO 
        titleKey="seo_procedure_title"
        descriptionKey="seo_procedure_description"
        canonicalUrl="https://ktt-rentcar.netlify.app/thu-tuc"
      />      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{t('procedures_title')}</h1>
          <p className="page-subtitle">{t('procedures_subtitle')}</p>
          <HighlightedButton
            onClick={() => navigate('/thue-xe')}
          >
            {t('rent_now')}
          </HighlightedButton>
        </div>
      </section>

      {/* Required Documents Section */}
      <section className="documents-section">
        <div className="container">
          <h2 className="section-title">{t('required_documents')}</h2>
          <div className="documents-grid">
            <div className="document-card">
              <div className="doc-icon">📄</div>
              <h3>{t('citizen_id')}</h3>
              <ul className="doc-details">
                <li>{t('citizen_id_details_1')}</li>
                <li>{t('citizen_id_details_2')}</li>
                <li>{t('citizen_id_details_3')}</li>
              </ul>
            </div>

            <div className="document-card">
              <div className="doc-icon">🪪</div>
              <h3>{t('drivers_license')}</h3>
              <ul className="doc-details">
                <li>{t('drivers_license_details_1')}</li>
                <li>{t('drivers_license_details_2')}</li>
                <li>{t('drivers_license_details_3')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Deposit Options Section */}
      <section className="deposit-section">
        <div className="container">
          <h2 className="section-title">{t('deposit_options')}</h2>
          <div className="deposit-grid">
            <div className="deposit-card recommended">
              <div className="deposit-badge">{t('recommended')}</div>
              <div className="deposit-icon">🛵</div>
              <h3>{t('motorbike_deposit')}</h3>
              <div className="deposit-details">
                <p><strong>{t('conditions')}</strong></p>
                <ul>
                  <li>{t('motorbike_conditions_1')}</li>
                  <li>{t('motorbike_conditions_2')}</li>
                  <li>{t('motorbike_conditions_3')}</li>
                </ul>
                <p className="deposit-benefit">{t('deposit_benefit')}</p>
              </div>
            </div>

            <div className="deposit-card">
              <div className="deposit-icon">💰</div>
              <h3>{t('cash_deposit')}</h3>
              <div className="deposit-details">
                <p><strong>{t('amount')}</strong></p>
                <ul>
                  <li>{t('cash_conditions_1')}</li>
                  <li>{t('cash_conditions_2')}</li>
                  <li>{t('cash_conditions_3')}</li>
                </ul>
                <p className="deposit-note">{t('cash_note')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timing Schedule Section */}
      <section className="timing-section">
        <div className="container">
          <h2 className="section-title">{t('time_schedule')}</h2>
          <div className="timing-grid">
            <div className="timing-card pickup">
              <div className="timing-icon">⏰</div>
              <h3>{t('pickup_time')}</h3>
              <div className="timing-details">
                <div className="time-slot">
                  <span className="time">{t('pickup_time_detail')}</span>
                  <span className="day">{t('pickup_day')}</span>
                </div>
                <div className="timing-notes">
                  <p>{t('pickup_note_1')}</p>
                  <p>{t('pickup_note_2')}</p>
                </div>
              </div>
            </div>

            <div className="timing-card return">
              <div className="timing-icon">
                🕗</div>
              <h3>{t('return_time')}</h3>
              <div className="timing-details">
                <div className="time-slot">
                  <span className="time fixed">{t('return_time_detail')}</span>
                  <span className="day">{t('fixed')}</span>
                </div>
                <div className="timing-notes">
                  <p>{t('return_note_1')}</p>
                  <p>{t('return_note_2')}</p>
                </div>
              </div>
            </div>

            <div className="timing-card extension">
              <div className="timing-icon">📞</div>
              <h3>{t('extension')}</h3>
              <div className="timing-details">
                <div className="time-slot">
                  <span className="time">{t('extension_time')}</span>
                  <span className="day">{t('must_notify')}</span>
                </div>
                <div className="timing-notes">
                  <p>{t('extension_note_1')}</p>
                  <p>{t('extension_note_2')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps Section */}
      <section className="process-section">
        <div className="container">
          <h2 className="section-title">{t('rental_process')}</h2>
          <div className="process-timeline">
            <div className="process-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>{t('step_1_title')}</h3>
                <p>{t('step_1_desc')}</p>
              </div>
            </div>

            <div className="process-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>{t('step_2_title')}</h3>
                <p>{t('step_2_desc')}</p>
              </div>
            </div>

            <div className="process-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>{t('step_3_title')}</h3>
                <p>{t('step_3_desc')}</p>
              </div>
            </div>

            <div className="process-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>{t('step_4_title')}</h3>
                <p>{t('step_4_desc')}</p>
              </div>
            </div>

            <div className="process-step">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3>{t('step_5_title')}</h3>
                <p>{t('step_5_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notes Section */}
      <section className="notes-section">
        <div className="container">
          <h2 className="section-title">{t('important_notes')}</h2>
          <div className="notes-grid">
            <div className="note-card warning">
              <div className="note-icon">⚠️</div>
              <h3>{t('time_regulations')}</h3>
              <ul>
                <li>{t('time_reg_1')}</li>
                <li>{t('time_reg_2')}</li>
                <li>{t('time_reg_3')}</li>
              </ul>
            </div>

            <div className="note-card info">
              <div className="note-icon">ℹ️</div>
              <h3>{t('usage_conditions')}</h3>
              <ul>
                <li>{t('usage_cond_1')}</li>
                <li>{t('usage_cond_2')}</li>
                <li>{t('usage_cond_3')}</li>
              </ul>
            </div>

            <div className="note-card success">
              <div className="note-icon">✅</div>
              <h3>{t('support_247')}</h3>
              <ul>
                <li>{t('support_hotline')}</li>
                <li>{t('support_emergency')}</li>
                <li>{t('support_consultation')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Procedures;