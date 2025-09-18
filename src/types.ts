export interface Client {
  id: string;
  name: string;
  cpfCnpj: string;
  phone: string;
  email: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Em uma app real, este campo seria um hash seguro
}

export interface LoginData {
  email: string;
  password: string;
}