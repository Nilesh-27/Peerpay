import React, { useState } from "react";
import { useApp } from "../context/AppContext";

export const LoanRequest = () => {
  const [amount, setAmount] = useState("");
  const { state, requestLoan } = useApp();
  const { currentUser } = state;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loanAmount = parseFloat(amount);

    if (!currentUser || loanAmount <= 0) return;

    if (currentUser.balance >= loanAmount * 0.0001) {
      requestLoan(loanAmount);
      setAmount("");
    } else {
      alert("Amount greater than loan limit");
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Request a Loan
        </h3>
        <div className="mt-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Amount
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="amount"
                  id="amount"
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
              Request Loan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
