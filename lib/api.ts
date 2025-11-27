const API_BASE_URL = '/api';

// Auth API
export const authApi = {
  me: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },
  
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Logout failed');
    return response.json();
  }
};

// Books API
export const booksApi = {
  getAll: async (limit = 100) => {
    const response = await fetch(`${API_BASE_URL}/books?limit=${limit}`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch books');
    return response.json();
  },
  
  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch book');
    return response.json();
  }
};

// Borrow API
export const borrowApi = {
  // User - Get my borrows
  getMyBorrows: async () => {
    const response = await fetch(`${API_BASE_URL}/borrow`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch borrows');
    return response.json();
  },
  
  // User - Borrow book (Request peminjaman)
  borrowBook: async (bookId: number, tanggalPengembalian: string) => {
    const response = await fetch(`${API_BASE_URL}/borrow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ 
        bookId: bookId,
        tanggalPengembalian: tanggalPengembalian 
      })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to borrow book');
    }
    return response.json();
  },
  
  // User - Extend borrow (Perpanjang)
  extendBorrow: async (borrowId: number) => {
    const response = await fetch(`${API_BASE_URL}/borrow/${borrowId}/extend`, {
      method: 'PUT',
      credentials: 'include'
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to extend borrow');
    }
    return response.json();
  },
  
  // User - Return book (Kembalikan buku)
  returnBook: async (borrowId: number) => {
    const response = await fetch(`${API_BASE_URL}/borrow/${borrowId}/return`, {
      method: 'PUT',
      credentials: 'include'
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to return book');
    }
    return response.json();
  }
};

// User Profile API
export const userApi = {
  // Get current user profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      credentials: 'include'
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get profile');
    }
    return response.json();
  },
  
  // Update user profile
  updateProfile: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }
    return response.json();
  },
  
  // Update password
  updatePassword: async (oldPassword: string, newPassword: string) => {
    const response = await fetch(`${API_BASE_URL}/user/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ 
        old_password: oldPassword, 
        new_password: newPassword 
      })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update password');
    }
    return response.json();
  }
};

// Admin API
export const adminApi = {
  // Get all users
  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },
  
  // Get all borrows
  getAllBorrows: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/borrow`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch borrows');
    return response.json();
  },
  
  // Approve borrow
  approveBorrow: async (borrowId: number) => {
    const response = await fetch(`${API_BASE_URL}/admin/borrow/${borrowId}/approve`, {
      method: 'PUT',
      credentials: 'include'
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to approve borrow');
    }
    return response.json();
  },
  
  // Reject borrow
  rejectBorrow: async (borrowId: number, alasanTolak: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/borrow/${borrowId}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ alasan_tolak: alasanTolak })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reject borrow');
    }
    return response.json();
  }
};