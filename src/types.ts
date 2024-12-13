export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  balance: number;
  isAdmin: boolean;
}

export interface LoanRequest {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: number;
}

export interface Transaction {
  id: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  type: 'transfer' | 'loan';
  timestamp: number;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  loanRequests: LoanRequest[];
  transactions: Transaction[];
  isRegistering: boolean;
}