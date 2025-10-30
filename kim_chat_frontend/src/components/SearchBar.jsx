import React, { useState, useEffect } from 'react';
import { searchUser } from '@api/chat';

const SearchBar = ({ onUserFound }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔹 Fetch userId from localStorage
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!searchTerm.trim() || !userId) return;

    const controller = new AbortController();
    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      setError('');

      try {
        const result = await searchUser(userId, searchTerm, { signal: controller.signal });

        if (result.success && result.data?.recipient) {
          onUserFound(result); // ✅ Send full result to parent
          setSearchTerm(''); // ✅ Clear search bar
        } else {
          setError(result.message || 'User not found');
        }
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError('Something went wrong: ' + (err.response?.data?.message || err.message));
        }
      } finally {
        setLoading(false);
      }
    }, 5000);

    return () => {
      clearTimeout(delayDebounce);
      controller.abort();
    };
  }, [searchTerm, userId, onUserFound]);

  return (
    <div className="max-w-md mx-auto relative">
      <input
        type="search"
        id="user-search"
        placeholder="Search by username..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={loading}
        className="block w-full p-4 ps-16 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
      />

      {loading && <p className="text-blue-500 mt-2 text-sm">Searching...</p>}
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
};

export default SearchBar;
