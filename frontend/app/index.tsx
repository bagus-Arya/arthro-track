import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import { isLoggedIn } from "@/services/apiAuth";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedInState, setIsLoggedInState] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const loggedIn = await isLoggedIn();
        setIsLoggedInState(loggedIn);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsLoggedInState(false); 
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return null;
  }

  if (isLoggedInState) {
    return <Redirect href="/(tabs)/home" />;
  } else {
    return <Redirect href="/login" />; 
  }
};

export default Index;