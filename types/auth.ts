export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Session {
  user: User;
  expires: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
