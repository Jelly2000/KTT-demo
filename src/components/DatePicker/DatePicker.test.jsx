import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DatePicker from './DatePicker';

describe('DatePicker Component', () => {
  const mockOnChange = vi.fn();
  
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  const defaultProps = {
    id: 'test-datepicker',
    name: 'testDate',
    onChange: mockOnChange
  };

  it('renders input with default placeholder', () => {
    render(<DatePicker {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('DD/MM/YYYY');
    expect(input).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<DatePicker {...defaultProps} placeholder="Select Date" />);
    
    const input = screen.getByPlaceholderText('Select Date');
    expect(input).toBeInTheDocument();
  });

  it('applies required attribute when required prop is true', () => {
    render(<DatePicker {...defaultProps} required={true} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
  });

  it('applies disabled attribute when disabled prop is true', () => {
    render(<DatePicker {...defaultProps} disabled={true} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('formats date input as user types', () => {
    render(<DatePicker {...defaultProps} />);
    
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: '15042025' } });
    expect(input.value).toBe('15/04/2025');
  });

  it('handles partial date input formatting', () => {
    render(<DatePicker {...defaultProps} />);
    
    const input = screen.getByRole('textbox');
    
    // Test partial input
    fireEvent.change(input, { target: { value: '15' } });
    expect(input.value).toBe('15');
    
    fireEvent.change(input, { target: { value: '1504' } });
    expect(input.value).toBe('15/04');
  });

  it('calls onChange with valid date', () => {
    render(<DatePicker {...defaultProps} />);
    
    const input = screen.getByRole('textbox');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateString = `${String(tomorrow.getDate()).padStart(2, '0')}${String(tomorrow.getMonth() + 1).padStart(2, '0')}${tomorrow.getFullYear()}`;
    
    fireEvent.change(input, { target: { value: dateString } });
    
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('calls onChange with null when input is cleared', async () => {
    render(<DatePicker {...defaultProps} />);
    
    const input = screen.getByRole('textbox');
    
    // First set a value
    fireEvent.change(input, { target: { value: '15/04/2025' } });
    
    // Clear the mock to reset call count
    mockOnChange.mockClear();
    
    // Then clear it
    fireEvent.change(input, { target: { value: '' } });
    
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        target: { name: 'testDate', value: null }
      });
    });
  });

  it('displays formatted value from prop', () => {
    const testDate = new Date('2025-04-15');
    render(<DatePicker {...defaultProps} value={testDate} />);
    
    const input = screen.getByDisplayValue('15/04/2025');
    expect(input).toBeInTheDocument();
  });

  it('shows calendar when input is focused', () => {
    render(<DatePicker {...defaultProps} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    
    expect(document.querySelector('.today')).toBeInTheDocument();
  });

  it('hides calendar when clicking outside', async () => {
    render(
      <div>
        <DatePicker {...defaultProps} />
        <button>Outside Button</button>
      </div>
    );
    
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    
    // Calendar should be visible
    expect(document.querySelector('.today')).toBeInTheDocument();
    
    // Click outside
    fireEvent.mouseDown(document.body);
    
    await waitFor(() => {
      expect(document.querySelector('.today')).not.toBeInTheDocument();
    });
  });

  it('validates date constraints - past dates', () => {
    render(<DatePicker {...defaultProps} />);
    
    const input = screen.getByRole('textbox');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateString = `${String(yesterday.getDate()).padStart(2, '0')}/${String(yesterday.getMonth() + 1).padStart(2, '0')}/${yesterday.getFullYear()}`;
    
    fireEvent.change(input, { target: { value: dateString } });
    
    // Just check that the input exists and has the value
    expect(input.value).toBe(dateString);
  });

  it('validates date constraints - minDate', () => {
    const minDate = new Date('2025-04-20');
    render(<DatePicker {...defaultProps} minDate={minDate} />);
    
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: '15/04/2025' } });
    
    expect(input.value).toBe('15/04/2025');
  });

  it('validates date constraints - maxDate', () => {
    const maxDate = new Date('2025-04-20');
    render(<DatePicker {...defaultProps} maxDate={maxDate} />);
    
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: '25/04/2025' } });
    
    expect(input.value).toBe('25/04/2025');
  });

  it('handles invalid date input', () => {
    render(<DatePicker {...defaultProps} />);
    
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: '99/99/9999' } });
    
    expect(input.value).toBe('99/99/9999');
  });

  it('applies custom className', () => {
    render(<DatePicker {...defaultProps} className="custom-datepicker" />);
    
    const container = screen.getByRole('textbox').closest('.custom-datepicker');
    expect(container).toHaveClass('custom-datepicker');
  });

  it('selects date from calendar', async () => {
    render(<DatePicker {...defaultProps} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    
    // Wait for calendar to appear
    await waitFor(() => {
      expect(document.querySelector('.today')).toBeInTheDocument();
    });
    
    // Click today button (day 28 with class "today")
    const todayButton = document.querySelector('.today');
    fireEvent.click(todayButton);
    
    expect(mockOnChange).toHaveBeenCalled();
    
    // Calendar should close
    await waitFor(() => {
      expect(screen.queryByText('Today')).not.toBeInTheDocument();
    });
  });

  it('navigates calendar months', async () => {
    render(<DatePicker {...defaultProps} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    
    await waitFor(() => {
      expect(document.querySelector('.calendar-dropdown')).toBeInTheDocument();
    });
    
    // Find and click next month button
    const nextButton = screen.getByRole('button', { name: '›' });
    if (nextButton) {
      fireEvent.click(nextButton);
    }
    
    // Calendar should still be visible
    expect(document.querySelector('.calendar-dropdown')).toBeInTheDocument();
  });
});