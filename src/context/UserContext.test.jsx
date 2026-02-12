import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UserProvider, useUser, USER_ROLES } from './UserContext';

const wrapper = ({ children }) => (
  <UserProvider>{children}</UserProvider>
);

describe('UserContext', () => {
  describe('useUser hook', () => {
    it('throws error when used outside UserProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        renderHook(() => useUser());
      }).toThrow('useUser must be used within a UserProvider');
      
      consoleSpy.mockRestore();
    });

    it('returns default values when no user is logged in', () => {
      const { result } = renderHook(() => useUser(), { wrapper });
      
      expect(result.current.currentUser).toBeNull();
      expect(result.current.users).toEqual([]);
      expect(result.current.isOperator()).toBe(false);
    });
  });

  describe('Login functionality', () => {
    it('sets current user when login is called', () => {
      const { result } = renderHook(() => useUser(), { wrapper });
      
      const userData = { id: '1', name: 'John', role: USER_ROLES.USER };
      
      act(() => {
        result.current.login(userData);
      });
      
      expect(result.current.currentUser).toEqual(userData);
    });

    it('clears current user when logout is called', () => {
      const { result } = renderHook(() => useUser(), { wrapper });
      
      const userData = { id: '1', name: 'John', role: USER_ROLES.USER };
      
      act(() => {
        result.current.login(userData);
      });
      
      expect(result.current.currentUser).toEqual(userData);
      
      act(() => {
        result.current.logout();
      });
      
      expect(result.current.currentUser).toBeNull();
    });
  });

  describe('Role checking', () => {
    it('isOperator returns true when user has operator role', () => {
      const { result } = renderHook(() => useUser(), { wrapper });
      
      const operatorUser = { id: '1', name: 'Admin', role: USER_ROLES.OPERATOR };
      
      act(() => {
        result.current.login(operatorUser);
      });
      
      expect(result.current.isOperator()).toBe(true);
    });

    it('isOperator returns false when user has user role', () => {
      const { result } = renderHook(() => useUser(), { wrapper });
      
      const regularUser = { id: '1', name: 'John', role: USER_ROLES.USER };
      
      act(() => {
        result.current.login(regularUser);
      });
      
      expect(result.current.isOperator()).toBe(false);
    });

    it('hasRole correctly checks user role', () => {
      const { result } = renderHook(() => useUser(), { wrapper });
      
      const adminUser = { id: '1', name: 'Admin', role: USER_ROLES.ADMIN };
      
      act(() => {
        result.current.login(adminUser);
      });
      
      expect(result.current.hasRole(USER_ROLES.ADMIN)).toBe(true);
      expect(result.current.hasRole(USER_ROLES.USER)).toBe(false);
      expect(result.current.hasRole(USER_ROLES.OPERATOR)).toBe(false);
    });
  });

  describe('Add user functionality', () => {
    it('allows operators to add new users', () => {
      const { result } = renderHook(() => useUser(), { wrapper });
      
      const operatorUser = { id: '1', name: 'Admin', role: USER_ROLES.OPERATOR };
      
      act(() => {
        result.current.login(operatorUser);
      });
      
      const newUser = { fullName: 'Jane Doe', email: 'jane@example.com', phone: '0901234567', role: USER_ROLES.USER };
      
      let addedUser;
      act(() => {
        addedUser = result.current.addUser(newUser);
      });
      
      expect(addedUser.fullName).toBe('Jane Doe');
      expect(addedUser.email).toBe('jane@example.com');
      expect(addedUser.id).toBeDefined();
      expect(typeof addedUser.id).toBe('string');
      expect(addedUser.createdAt).toBeDefined();
      expect(result.current.users).toHaveLength(1);
    });

    it('throws error when non-operator tries to add user', () => {
      const { result } = renderHook(() => useUser(), { wrapper });
      
      const regularUser = { id: '1', name: 'John', role: USER_ROLES.USER };
      
      act(() => {
        result.current.login(regularUser);
      });
      
      const newUser = { fullName: 'Jane Doe', email: 'jane@example.com', phone: '0901234567', role: USER_ROLES.USER };
      
      expect(() => {
        act(() => {
          result.current.addUser(newUser);
        });
      }).toThrow('Only operators can add new users');
    });

    it('throws error when no user is logged in and trying to add user', () => {
      const { result } = renderHook(() => useUser(), { wrapper });
      
      const newUser = { fullName: 'Jane Doe', email: 'jane@example.com', phone: '0901234567', role: USER_ROLES.USER };
      
      expect(() => {
        act(() => {
          result.current.addUser(newUser);
        });
      }).toThrow('Only operators can add new users');
    });

    it('getAllUsers returns all added users', () => {
      const { result } = renderHook(() => useUser(), { wrapper });
      
      const operatorUser = { id: '1', name: 'Admin', role: USER_ROLES.OPERATOR };
      
      act(() => {
        result.current.login(operatorUser);
      });
      
      const user1 = { fullName: 'Jane Doe', email: 'jane@example.com', phone: '0901234567', role: USER_ROLES.USER };
      const user2 = { fullName: 'Bob Smith', email: 'bob@example.com', phone: '0987654321', role: USER_ROLES.USER };
      
      act(() => {
        result.current.addUser(user1);
        result.current.addUser(user2);
      });
      
      const allUsers = result.current.getAllUsers();
      expect(allUsers).toHaveLength(2);
      expect(allUsers[0].fullName).toBe('Jane Doe');
      expect(allUsers[1].fullName).toBe('Bob Smith');
    });
  });

  describe('USER_ROLES constants', () => {
    it('exposes correct role constants', () => {
      const { result } = renderHook(() => useUser(), { wrapper });
      
      expect(result.current.USER_ROLES.OPERATOR).toBe('operator');
      expect(result.current.USER_ROLES.USER).toBe('user');
      expect(result.current.USER_ROLES.ADMIN).toBe('admin');
    });
  });
});
