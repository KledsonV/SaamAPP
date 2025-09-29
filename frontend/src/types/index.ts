export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  createdAt: Date;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  quantity: number;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthStore {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<true | ResponseLogin>;
  registerUser: (payload: RegisterCredentials) => Promise<true | ResponseLogin>;
  logout: () => void;
}

export interface ResponseLogin {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface ProductStore {
  products: Product[];
  addProduct: (product: ProductFormData) => void;
  isLoading: boolean;
  error: string | null;
}