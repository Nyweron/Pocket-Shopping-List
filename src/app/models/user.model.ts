export interface User {
  id: string;
  email: string;
  username: string;
  password: string; // Should be hashed in production
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

