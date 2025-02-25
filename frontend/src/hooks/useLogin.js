import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useLogin = () => {
  const [error2, setError2] = useState(null);
  const [isLoading2, setIsLoading2] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading2(true);
    setError2(null);

    try {
      const response = await fetch('http://localhost:4001/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error || 'Login failed');
      }

      // Save the user to local storage
      localStorage.setItem('user', JSON.stringify(json));

      // Update the auth context
      dispatch({ type: 'LOGIN', payload: json });
      setError2(false);
    } catch (err) {
      setError2(err.message);
    } finally {
      setIsLoading2(false);
    }
  };

  return { login, isLoading2, error2 };
};

export default useLogin;
