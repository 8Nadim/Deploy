const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "react-query";

type CreateUserRequest = {
  auth0Id: string;
  email: string;
};

export const useCreateMyUser = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createMyUserRequest = async (user: CreateUserRequest) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/my/user`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to create user: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    // Handle empty response properly
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  };

  const {
    mutateAsync: createUser,
    isLoading,
    isSuccess,
    isError,
    reset,
  } = useMutation(createMyUserRequest);

  return {
    createUser,
    isLoading,
    isError,
    isSuccess,
    reset,
  };
};
