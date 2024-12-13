import React from 'react';
import { useApp } from '../context/AppContext';
import { LoanRequest } from './LoanRequest';
import { Transfer } from './Transfer';
import { TransactionHistory } from './TransactionHistory';
import { AdminPanel } from './AdminPanel';
import { LogOut } from 'lucide-react';

export const Dashboard = () => {
  const { state, logout } = useApp();
  const { currentUser } = state;

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Welcome, {currentUser.name}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-lg font-medium text-gray-900">
                Balance: ${currentUser.balance.toFixed(2)}
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {!currentUser.isAdmin && (
              <>
                <LoanRequest />
                <Transfer />
              </>
            )}
            {currentUser.isAdmin && <AdminPanel />}
            <div className="lg:col-span-2">
              <TransactionHistory />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};