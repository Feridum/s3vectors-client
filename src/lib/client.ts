import { QueryClient } from '@tanstack/react-query';
import { fetch } from '@tauri-apps/plugin-http';

// Custom fetch function using Tauri's HTTP client
export const tauriFetch = async <T>(url: string, options?: RequestInit): Promise<T> => {
  try {
    const response = await fetch(url, {
      method: options?.method || 'GET',
      headers: options?.headers as Record<string, string>,
      body: options?.body,
    });

    if (response.status >= 200 && response.status < 300) {
      return response.json();
    }

    throw new Error(`Request failed with status ${response.status}`);
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Create and configure the React Query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 5 * 60 * 1000, // 5 minutes
      // gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 1,
    },
  },
});