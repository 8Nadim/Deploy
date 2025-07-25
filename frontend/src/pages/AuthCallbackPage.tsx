import { useCreateMyUser } from "@/api/MyUserApi";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { createUser, isSuccess } = useCreateMyUser();
  const hasCreatedUser = useRef(false);

  useEffect(() => {
    const createUserIfNeeded = async () => {
      if (user?.sub && user?.email && !hasCreatedUser.current) {
        try {
          await createUser({ auth0Id: user.sub, email: user.email });
          hasCreatedUser.current = true;
        } catch (err) {
          console.error("User creation failed:", err);
        }
      }
    };

    createUserIfNeeded();
  }, [createUser, user]);

  useEffect(() => {
    if (isSuccess) {
      navigate("/"); // Only navigate after successful user creation
    }
  }, [isSuccess, navigate]);

  return <>Loading...</>;
};

export default AuthCallbackPage;
