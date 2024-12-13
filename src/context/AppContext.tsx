import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, User, LoanRequest, Transaction } from '../types';

const initialState: AppState = {
  currentUser: null,
  users: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      balance: 1000,
      isAdmin: false,
    },
    {
      id: '2',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      balance: 10000,
      isAdmin: true,
    },
  ],
  loanRequests: [],
  transactions: [],
  isRegistering: false,
};

const AppContext = createContext<{
  state: AppState;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string) => boolean;
  requestLoan: (amount: number) => void;
  handleLoanRequest: (loanId: string, approved: boolean) => void;
  transfer: (toUserId: string, amount: number) => void;
  switchToRegister: () => void;
  switchToLogin: () => void;
} | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('bankingApp');
    return saved ? JSON.parse(saved) : initialState;
  });

  useEffect(() => {
    localStorage.setItem('bankingApp', JSON.stringify(state));
  }, [state]);

  const login = (email: string, password: string) => {
    const user = state.users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      setState({ ...state, currentUser: user });
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, password: string) => {
    if (state.users.some((u) => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      balance: 100, // Starting balance for new users
      isAdmin: false,
    };

    setState({
      ...state,
      users: [...state.users, newUser],
      currentUser: newUser,
      isRegistering: false,
    });

    return true;
  };

  const logout = () => {
    setState({ ...state, currentUser: null });
  };

  const switchToRegister = () => {
    setState({ ...state, isRegistering: true });
  };

  const switchToLogin = () => {
    setState({ ...state, isRegistering: false });
  };

  const requestLoan = (amount: number) => {
    if (!state.currentUser) return;

    const newLoan: LoanRequest = {
      id: crypto.randomUUID(),
      userId: state.currentUser.id,
      amount,
      status: 'pending',
      timestamp: Date.now(),
    };

    setState({
      ...state,
      loanRequests: [...state.loanRequests, newLoan],
    });
  };

  const handleLoanRequest = (loanId: string, approved: boolean) => {
    const loanRequest = state.loanRequests.find((l) => l.id === loanId);
    if (!loanRequest) return;

    const updatedLoanRequests = state.loanRequests.map((loan) =>
      loan.id === loanId
        ? { ...loan, status: approved ? 'approved' : 'rejected' }
        : loan
    );

    const updatedUsers = state.users.map((user) =>
      user.id === loanRequest.userId && approved
        ? { ...user, balance: user.balance + loanRequest.amount }
        : user
    );

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      fromUserId: 'BANK',
      toUserId: loanRequest.userId,
      amount: loanRequest.amount,
      type: 'loan',
      timestamp: Date.now(),
    };

    setState({
      ...state,
      users: updatedUsers,
      loanRequests: updatedLoanRequests,
      transactions: approved ? [...state.transactions, newTransaction] : state.transactions,
      currentUser: state.currentUser
        ? {
            ...state.currentUser,
            balance:
              state.currentUser.id === loanRequest.userId && approved
                ? state.currentUser.balance + loanRequest.amount
                : state.currentUser.balance,
          }
        : null,
    });
  };

  const transfer = (toUserId: string, amount: number) => {
    if (!state.currentUser) return;

    const updatedUsers = state.users.map((user) => {
      if (user.id === state.currentUser?.id) {
        return { ...user, balance: user.balance - amount };
      }
      if (user.id === toUserId) {
        return { ...user, balance: user.balance + amount };
      }
      return user;
    });

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      fromUserId: state.currentUser.id,
      toUserId,
      amount,
      type: 'transfer',
      timestamp: Date.now(),
    };

    setState({
      ...state,
      users: updatedUsers,
      transactions: [...state.transactions, newTransaction],
      currentUser: {
        ...state.currentUser,
        balance: state.currentUser.balance - amount,
      },
    });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        login,
        logout,
        register,
        requestLoan,
        handleLoanRequest,
        transfer,
        switchToRegister,
        switchToLogin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};