import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import i18n from '../../i18n';
import AddNewUser from './AddNewUser';
import { USER_ROLES } from '../../context';
import * as UserContext from '../../context/UserContext';

// Mock the useUser hook
vi.mock('../../context/UserContext', async () => {
  const actual = await vi.importActual('../../context/UserContext');
  return {
    ...actual,
    useUser: vi.fn()
  };
});

// Helper function to set up mock user context
const setupMockUserContext = (overrides = {}) => {
  const defaultMock = {
    currentUser: null,
    users: [],
    isOperator: () => false,
    hasRole: () => false,
    login: vi.fn(),
    logout: vi.fn(),
    addUser: vi.fn((user) => ({ ...user, id: '123', createdAt: new Date().toISOString() })),
    getAllUsers: () => [],
    USER_ROLES
  };
  
  UserContext.useUser.mockReturnValue({ ...defaultMock, ...overrides });
};

// Create a wrapper component for testing
const TestWrapper = ({ children }) => {
  return (
    <I18nextProvider i18n={i18n}>
      <HelmetProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </HelmetProvider>
    </I18nextProvider>
  );
};

// Helper function to render AddNewUser with provider
const renderAddNewUser = () => {
  return render(
    <TestWrapper>
      <AddNewUser />
    </TestWrapper>
  );
};

describe('AddNewUser Component', () => {
  describe('Access Control', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('shows access denied message when user is not logged in', () => {
      setupMockUserContext({
        currentUser: null,
        isOperator: () => false
      });
      
      renderAddNewUser();
      
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
      expect(screen.getByText(/You do not have permission to access this page/)).toBeInTheDocument();
    });

    it('shows access denied message when user is not an operator', () => {
      setupMockUserContext({
        currentUser: { id: '1', name: 'John', role: USER_ROLES.USER },
        isOperator: () => false
      });
      
      renderAddNewUser();
      
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
      expect(screen.getByText(/You do not have permission to access this page/)).toBeInTheDocument();
    });

    it('shows the form when user is an operator', () => {
      setupMockUserContext({
        currentUser: { id: '1', name: 'Admin', role: USER_ROLES.OPERATOR },
        isOperator: () => true
      });
      
      renderAddNewUser();
      
      expect(screen.getByText('User Information')).toBeInTheDocument();
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('displays current role in access denied message', () => {
      setupMockUserContext({
        currentUser: { id: '1', name: 'John', role: USER_ROLES.USER },
        isOperator: () => false
      });
      
      renderAddNewUser();
      
      expect(screen.getByText(/Your current role:/)).toBeInTheDocument();
    });

    it('displays "Not logged in" when user is not authenticated', () => {
      setupMockUserContext({
        currentUser: null,
        isOperator: () => false
      });
      
      renderAddNewUser();
      
      expect(screen.getByText(/Not logged in/)).toBeInTheDocument();
    });
  });

  describe('Form Functionality', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      setupMockUserContext({
        currentUser: { id: '1', name: 'Admin', role: USER_ROLES.OPERATOR },
        isOperator: () => true
      });
    });

    it('renders all form fields when user is an operator', () => {
      renderAddNewUser();
      
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/User Role/i)).toBeInTheDocument();
    });

    it('updates form data when inputs change', () => {
      renderAddNewUser();
      
      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/email/i);
      
      fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
      fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
      
      expect(nameInput.value).toBe('Jane Doe');
      expect(emailInput.value).toBe('jane@example.com');
    });

    it('shows validation error when submitting empty form', async () => {
      renderAddNewUser();
      
      const submitButton = screen.getByRole('button', { name: /Add User/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Full name is required/)).toBeInTheDocument();
      });
    });

    it('resets form when reset button is clicked', () => {
      renderAddNewUser();
      
      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/email/i);
      
      fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
      fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
      
      const resetButton = screen.getByRole('button', { name: /Reset/i });
      fireEvent.click(resetButton);
      
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
    });

    it('shows success message after successful form submission', async () => {
      renderAddNewUser();
      
      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const phoneInput = screen.getByPlaceholderText(/phone/i);
      
      fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
      fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
      fireEvent.change(phoneInput, { target: { value: '0901234567' } });
      
      const submitButton = screen.getByRole('button', { name: /Add User/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/User added successfully!/)).toBeInTheDocument();
      });
    });

    it('clears form after successful submission', async () => {
      renderAddNewUser();
      
      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const phoneInput = screen.getByPlaceholderText(/phone/i);
      
      fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
      fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
      fireEvent.change(phoneInput, { target: { value: '0901234567' } });
      
      const submitButton = screen.getByRole('button', { name: /Add User/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(nameInput.value).toBe('');
        expect(emailInput.value).toBe('');
        expect(phoneInput.value).toBe('');
      });
    });

    it('allows selecting different user roles', () => {
      renderAddNewUser();
      
      const roleSelect = screen.getByLabelText(/User Role/i);
      
      fireEvent.change(roleSelect, { target: { value: USER_ROLES.OPERATOR } });
      expect(roleSelect.value).toBe(USER_ROLES.OPERATOR);
      
      fireEvent.change(roleSelect, { target: { value: USER_ROLES.ADMIN } });
      expect(roleSelect.value).toBe(USER_ROLES.ADMIN);
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('displays back to home button on access denied page', () => {
      setupMockUserContext({
        currentUser: { id: '1', name: 'John', role: USER_ROLES.USER },
        isOperator: () => false
      });
      
      renderAddNewUser();
      
      const backButton = screen.getByRole('button', { name: /Back to Home/i });
      expect(backButton).toBeInTheDocument();
    });
  });
});
