import { useState, useEffect } from 'react';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial wishlist IDs
  const fetchWishlistIds = async () => {
    try {
      const response = await fetch('/api/wishlist/ids', {
        method: 'GET',
        credentials: 'include', // ✅ WAJIB untuk httpOnly cookies
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        setWishlist(result.data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle wishlist
  const toggleWishlist = async (bookId: number) => {
    try {
      const response = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ✅ WAJIB untuk httpOnly cookies
        body: JSON.stringify({ buku_id: bookId })
      });

      const data = await response.json();
      
      // ✅ Update state berdasarkan response
      if (data.success) {
        if (data.action === 'added') {
          setWishlist(prev => [...prev, bookId]);
        } else if (data.action === 'removed') {
          setWishlist(prev => prev.filter(id => id !== bookId));
        }
      }
      
      // ✅ RETURN DATA - INI YANG PENTING!
      return data;
      
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      // ✅ Return error response dengan format yang sama
      return { 
        success: false, 
        message: 'Network error atau server tidak merespon' 
      };
    }
  };

  useEffect(() => {
    fetchWishlistIds();
  }, []);

  return { 
    wishlist, 
    loading, 
    toggleWishlist, 
    refetchWishlist: fetchWishlistIds 
  };
};