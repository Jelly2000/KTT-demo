import React, { useState, useEffect, useRef } from 'react';
import './DatePicker.css';

const DatePicker = ({ 
  id,
  name,
  value,
  onChange,
  placeholder = 'DD/MM/YYYY',
  required = false,
  disabled = false,
  minDate = null,
  maxDate = null,
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const inputRef = useRef(null);
  const calendarRef = useRef(null);

  // Format date to DD/MM/YYYY
  const formatDateToDDMMYYYY = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  // Parse DD/MM/YYYY to Date object
  const parseDateFromDDMMYYYY = (dateString) => {
    if (!dateString) return null;
    
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      
      if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900 && year <= 2100) {
        const date = new Date(year, month - 1, day);
        if (date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year) {
          return date;
        }
      }
    }
    return null;
  };

  // Format input as user types
  const formatInput = (input) => {
    const digits = input.replace(/\D/g, '');
    
    if (digits.length >= 5) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    } else if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else {
      return digits;
    }
  };

  // Check if date is valid according to constraints
  const isDateValidForConstraints = (date) => {
    if (!date) return true;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Cannot pick past dates
    if (date < today) return false;
    
    // Check minDate constraint
    if (minDate) {
      const minDateObj = new Date(minDate);
      minDateObj.setHours(0, 0, 0, 0);
      if (date < minDateObj) return false;
    }
    
    // Check maxDate constraint  
    if (maxDate) {
      const maxDateObj = new Date(maxDate);
      maxDateObj.setHours(0, 0, 0, 0);
      if (date > maxDateObj) return false;
    }
    
    return true;
  };

  // Update display value when value prop changes
  useEffect(() => {
    if (value) {
      setDisplayValue(formatDateToDDMMYYYY(value));
      setIsValid(true);
    } else {
      setDisplayValue('');
      setIsValid(true);
    }
  }, [value]);

  // Handle input change
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const formatted = formatInput(inputValue);
    setDisplayValue(formatted);

    const parsedDate = parseDateFromDDMMYYYY(formatted);
    
    if (formatted === '') {
      setIsValid(true);
      if (onChange) {
        onChange({
          target: { name: name, value: null }
        });
      }
    } else if (parsedDate) {
      const isValidConstraints = isDateValidForConstraints(parsedDate);
      setIsValid(isValidConstraints);
      
      if (isValidConstraints && onChange) {
        onChange({
          target: { name: name, value: parsedDate }
        });
      }
    } else {
      setIsValid(false);
    }
  };

  // Handle calendar date selection
  const handleDateSelect = (date) => {
    if (isDateValidForConstraints(date)) {
      setDisplayValue(formatDateToDDMMYYYY(date));
      setIsValid(true);
      setShowCalendar(false);
      
      if (onChange) {
        onChange({
          target: { name: name, value: date }
        });
      }
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === currentMonth;
      const isToday = date.getTime() === today.getTime();
      const isSelected = value && date.getTime() === new Date(value).getTime();
      const isDisabled = !isDateValidForConstraints(date);
      
      days.push({
        date,
        isCurrentMonth,
        isToday,
        isSelected,
        isDisabled
      });
    }
    
    return days;
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return (
    <div className={`custom-datepicker ${className}`}>
      <div className="datepicker-input-container">
        <input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => setShowCalendar(true)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          maxLength={10}
          className={`datepicker-input ${!isValid ? 'error' : ''}`}
        />
        <button
          type="button"
          className="calendar-icon"
          onClick={() => setShowCalendar(!showCalendar)}
          disabled={disabled}
        >
          📅
        </button>
      </div>

      {!isValid && (
        <span className="error-message">
          Ngày không hợp lệ hoặc đã qua. Vui lòng chọn ngày hợp lệ.
        </span>
      )}

      {showCalendar && (
        <div ref={calendarRef} className="calendar-dropdown">
          <div className="calendar-header">
            <button
              type="button"
              className="nav-button"
              onClick={() => {
                if (currentMonth === 0) {
                  setCurrentMonth(11);
                  setCurrentYear(currentYear - 1);
                } else {
                  setCurrentMonth(currentMonth - 1);
                }
              }}
            >
              ‹
            </button>
            <span className="month-year">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button
              type="button"
              className="nav-button"
              onClick={() => {
                if (currentMonth === 11) {
                  setCurrentMonth(0);
                  setCurrentYear(currentYear + 1);
                } else {
                  setCurrentMonth(currentMonth + 1);
                }
              }}
            >
              ›
            </button>
          </div>

          <div className="calendar-body">
            <div className="day-headers">
              {dayNames.map(day => (
                <div key={day} className="day-header">{day}</div>
              ))}
            </div>

            <div className="days-grid">
              {generateCalendarDays().map((dayObj, index) => (
                <button
                  key={index}
                  type="button"
                  className={`day-cell ${
                    !dayObj.isCurrentMonth ? 'other-month' : ''
                  } ${dayObj.isToday ? 'today' : ''} ${
                    dayObj.isSelected ? 'selected' : ''
                  } ${dayObj.isDisabled ? 'disabled' : ''}`}
                  onClick={() => handleDateSelect(dayObj.date)}
                  disabled={dayObj.isDisabled}
                >
                  {dayObj.date.getDate()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;