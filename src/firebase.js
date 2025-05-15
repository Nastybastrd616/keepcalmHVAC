// Firebase setup with mock authentication for development

// Mock user accounts
const mockUsers = {
  admin: {
    uid: 'admin123',
    email: 'admin@example.com',
    displayName: 'Administrator',
    isAdmin: true
  },
  customers: [
    {
      uid: 'customer1',
      email: 'customer1@example.com',
      displayName: 'John Smith',
      isAdmin: false
    },
    {
      uid: 'customer2',
      email: 'customer2@example.com',
      displayName: 'Sarah Johnson',
      isAdmin: false
    },
    {
      uid: 'customer3',
      email: 'customer3@example.com',
      displayName: 'Mike Wilson',
      isAdmin: false
    },
    {
      uid: 'customer4',
      email: 'customer4@example.com',
      displayName: 'Emma Brown',
      isAdmin: false
    },
    {
      uid: 'customer5',
      email: 'customer5@example.com',
      displayName: 'David Lee',
      isAdmin: false
    }
  ]
};

// Mock Auth class with Firebase Auth compatible API
class MockAuth {  constructor() {
    this.currentUser = null;
    this.listeners = [];
    
    // Auto login as admin for development
    this.currentUser = { ...mockUsers.admin, getIdToken: () => Promise.resolve('mock-id-token') };
    
    // Save admin to localStorage for persistence
    localStorage.setItem('mockAuthUser', JSON.stringify({
      email: mockUsers.admin.email,
      uid: mockUsers.admin.uid
    }));
    
    console.log('Automatically logged in as admin:', this.currentUser?.email);
  }
  // Sign in with email and password
  async signInWithEmailAndPassword(email, password) {
    // Find matching user
    let user = null;
    
    if (email === mockUsers.admin.email) {
      user = mockUsers.admin;
    } else {
      user = mockUsers.customers.find(customer => customer.email === email);
    }
    
    if (!user) {
      throw new Error('auth/user-not-found');
    }
    
    // In mock mode, accept any password
    this.currentUser = {
      ...user,
      getIdToken: () => Promise.resolve('mock-id-token')
    };
    
    // Save to localStorage for persistence
    localStorage.setItem('mockAuthUser', JSON.stringify({
      email: user.email,
      uid: user.uid
    }));
    
    // Notify listeners
    this._notifyAuthStateChanged();
    
    return {
      user: this.currentUser,
      operationType: 'signIn',
      providerId: 'password'
    };
  }
  // Create user with email and password
  async createUserWithEmailAndPassword(email, password) {
    // Check if user already exists
    if (email === mockUsers.admin.email || mockUsers.customers.some(customer => customer.email === email)) {
      throw new Error('auth/email-already-in-use');
    }
    
    // Create new user
    const newUser = {
      uid: 'customer' + (mockUsers.customers.length + 1),
      email: email,
      displayName: email.split('@')[0],
      isAdmin: false
    };
    
    // Add to customers array
    mockUsers.customers.push(newUser);
    
    // Set as current user with getIdToken method
    this.currentUser = {
      ...newUser,
      getIdToken: () => Promise.resolve('mock-id-token')
    };
    
    // Save to localStorage for persistence
    localStorage.setItem('mockAuthUser', JSON.stringify({
      email: newUser.email,
      uid: newUser.uid
    }));
    
    // Notify listeners
    this._notifyAuthStateChanged();
    
    return {
      user: this.currentUser,
      operationType: 'signUp',
      providerId: 'password'
    };
  }

  // Sign out
  async signOut() {
    this.currentUser = null;
    this._notifyAuthStateChanged();
    return Promise.resolve();
  }

  // Add auth state change listener
  onAuthStateChanged(callback) {
    this.listeners.push(callback);
    
    // Call immediately with current state
    if (callback) {
      setTimeout(() => callback(this.currentUser), 0);
    }
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  _notifyAuthStateChanged() {
    this.listeners.forEach(callback => {
      if (callback) {
        callback(this.currentUser);
      }
    });
  }
}

// Create mock auth instance
const auth = new MockAuth();

// Export Firebase-compatible API
export { auth };

// Also export these Firebase Auth compatible functions
export function signInWithEmailAndPassword(auth, email, password) {
  return auth.signInWithEmailAndPassword(email, password);
}

export function createUserWithEmailAndPassword(auth, email, password) {
  return auth.createUserWithEmailAndPassword(email, password);
}

export function onAuthStateChanged(auth, callback) {
  return auth.onAuthStateChanged(callback);
}

export function signOut(auth) {
  return auth.signOut();
}

// For debugging
console.log('Mock Firebase Auth initialized with these accounts:');
console.log('Admin:', mockUsers.admin.email);
console.log('Customers:', mockUsers.customers.map(c => c.email).join(', '));
