import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const Transfer = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const { state, transfer } = useApp();
  const { users, currentUser } = state;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const transferAmount = parseFloat(amount);
    
    if (!currentUser || transferAmount <= 0 || transferAmount > currentUser.balance) return;
    
    transfer(recipient, transferAmount);
    setAmount('');
    setRecipient('');
  };

  const availableRecipients = users.filter(
    (user) => user.id !== currentUser?.id && !user.isAdmin
  );

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Transfer Money
        </h3>
        <div className="mt-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
                Recipient
              </label>
              <select
                id="recipient"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
              >
                <option value="">Select recipient</option>
                {availableRecipients.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="transfer-amount" className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="transfer-amount"
                  id="transfer-amount"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Transfer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};