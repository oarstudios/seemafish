import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (username, email, password, userType) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://backend.freshimeat.in/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "abcd", username, email, password, userType }),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error || "Signup failed");
        setIsLoading(false);
        return;
      }

      // Save the user to local storage
      localStorage.setItem("user", JSON.stringify(json));

      // Update the auth context
      dispatch({ type: "LOGIN", payload: json });

      setError(false); // Indicates success
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};

export default useSignup;
