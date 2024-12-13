import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, XCircle } from 'lucide-react';

export const AdminPanel = () => {
  const { state, handleLoanRequest } = useApp();
  const pendingLoans = state.loanRequests.filter(
    (loan) => loan.status === 'pending'
  );

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Pending Loan Requests
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {pendingLoans.map((loan) => {
            const user = state.users.find((u) => u.id === loan.userId);
            return (
              <li key={loan.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Amount: ${loan.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Current Balance: ${user?.balance.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleLoanRequest(loan.id, true)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleLoanRequest(loan.id, false)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
          {pendingLoans.length === 0 && (
            <li className="px-4 py-4 sm:px-6 text-sm text-gray-500">
              No pending loan requests
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};