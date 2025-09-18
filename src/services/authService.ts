import type { User, LoginData } from '../types';

const USERS_KEY = 'users';
const LOGGED_USER_KEY = 'loggedUser';

// Dados de exemplo para popular a lista se estiver vazia
const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@erp.com', password: btoa('admin') },
  { id: '2', name: 'Yan Developer', email: 'yan@email.com', password: btoa('123456') },
];

// Funções auxiliares para ler e escrever no localStorage, evitando repetição.
const _getUsersFromStorage = (): User[] => {
  const usersStr = localStorage.getItem(USERS_KEY);
  return usersStr ? JSON.parse(usersStr) : [];
};

const _saveUsersToStorage = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const initializeUsers = () => {
  const users = _getUsersFromStorage();
  if (users.length === 0) {
    _saveUsersToStorage(mockUsers);
  }
};

export const authService = {
  register: (userData: Omit<User, 'id'>): void => {
    const users = _getUsersFromStorage();
    
    if (users.find(user => user.email === userData.email)) {
      throw new Error('Email já cadastrado');
    }
    
    // ATENÇÃO: btoa não é seguro para senhas. Em um app real, use um hash (ex: bcrypt).
    const hashedPassword = btoa(userData.password);
    
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      password: hashedPassword
    };
    
    users.push(newUser);
    _saveUsersToStorage(users);
  },
  
  login: (loginData: LoginData): User => {
    const users = _getUsersFromStorage();
    const user = users.find(user => user.email === loginData.email);
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    
    // ATENÇÃO: atob é facilmente reversível. A verificação de senha deve ser feita com um hash.
    const passwordMatch = atob(user.password) === loginData.password;
    
    if (!passwordMatch) {
      throw new Error('Senha incorreta');
    }
    
    // MELHORIA DE SEGURANÇA: Nunca armazene a senha na sessão do usuário.
    const { password, ...userToLog } = user;
    localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(userToLog));
    
    return userToLog;
  },
  
  logout: (): void => {
    localStorage.removeItem(LOGGED_USER_KEY);
  },
  
  getLoggedUser: (): Omit<User, 'password'> | null => {
    const userStr = localStorage.getItem(LOGGED_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },
  
  getUsers: (): User[] => {
    return _getUsersFromStorage();
  }
};

initializeUsers();