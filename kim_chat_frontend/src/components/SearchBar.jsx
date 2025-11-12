// src/components/SearchBar.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { searchUsers, clearSearchResults } from '@store/slices/userSlice';

const SearchBar = ({ onUserFound }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const dispatch = useAppDispatch();
  // derive userId from redux auth state first, fall back to persisted localStorage 'user'
  const authUser = useAppSelector((state) => state.auth?.user);
  const persistedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const userId = authUser?._id || authUser?.id || persistedUser?._id || persistedUser?.id || null;
  const { searchResults, searchLoading, searchError } = useAppSelector((state) => state.user);
  const abortRef = useRef(null);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    if (!searchTerm.trim() || !userId) {
      dispatch(clearSearchResults());
      return;
    }

    const id = setTimeout(() => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      // pass controller.signal to enable request cancellation in the API
      dispatch(searchUsers({ userId, username: searchTerm, signal: controller.signal }));
    }, 500);

    return () => {
      clearTimeout(id);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [searchTerm, userId, dispatch]);

  const handleSelectUser = useCallback(
    (user) => {
      if (onUserFound) {
        onUserFound(user);
      }
      setSearchTerm('');
      dispatch(clearSearchResults());
      setIsFocused(false);
    },
    [onUserFound, dispatch]
  );

  useEffect(() => {
    // Automatically select if only one result
    if (searchResults && searchResults.length === 1 && searchTerm.trim()) {
      handleSelectUser(searchResults[0]);
    }
  }, [searchResults, handleSelectUser, searchTerm]);

  // Handle clicks outside the search bar to close results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsFocused(false);
        dispatch(clearSearchResults());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dispatch]);

  return (
    <div className="max-w-md mx-auto relative" ref={searchContainerRef}>
      <input
        type="search"
        id="user-search"
        placeholder="Search by username..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsFocused(true)}
        disabled={searchLoading}
        className="block w-full p-4 ps-16 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
      />
      {isFocused && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
          {searchLoading && <p className="p-3 text-gray-500">Searching...</p>}
          {searchError && <p className="p-3 text-red-500">{searchError}</p>}
          {searchResults && searchResults.length > 1 && (
            <ul>
              {searchResults.map((user) => (
                <li
                  key={user._id}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleSelectUser(user)}
                >
                  {user.name} (@{user.username})
                </li>
              ))}
            </ul>
          )}
          {searchResults?.length === 0 && searchTerm && !searchLoading && (
            <p className="p-3 text-gray-500">No users found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
