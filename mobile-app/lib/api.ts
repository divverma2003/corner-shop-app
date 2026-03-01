import { useAuth } from "@clerk/clerk-expo";
import axios from "axios";
import { useEffect } from "react";

const API_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// on every single request, we would have an auth token so our backend knows we're authenticated
// we're using the useAuth hook to get the token and then attaching it to the headers of every request
// we're including the auth token under the Authorization header as a Bearer token, which is a common convention for sending tokens in HTTP requests
export const useApi = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const interceptor = api.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Cleanup interceptor when component unmounts
    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [getToken]);

  return api;
};
