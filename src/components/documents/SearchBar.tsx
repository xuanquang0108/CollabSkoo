// components/SearchBar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SearchBar.module.css';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = async (value: string) => {
    setQuery(value);

    // Clear the previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Set a new timeout
    searchTimeout.current = setTimeout(async () => {
      if (value.length > 2) {
        setIsLoading(true);
        try {
          // Replace with your actual API call
          const response = await fetch(`/api/search?q=${value}`);
          const data = await response.json();
          setSuggestions(data);
        } catch (error) {
          console.error('Search error:', error);
        }
        setIsLoading(false);
      } else {
        setSuggestions([]);
      }
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchContainer}>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Tìm kiếm tài liệu..."
        className={styles.searchInput}
      />
      <div className={styles.searchIcon}>
        {isLoading ? '🔄':''}
      </div>
      {suggestions.length > 0 && (
        <div className={styles.liveSuggestions}>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={styles.suggestionItem}
              onClick={() => {
                setQuery(suggestion);
                router.push(`/search?q=${encodeURIComponent(suggestion)}`);
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </form>
  );
}