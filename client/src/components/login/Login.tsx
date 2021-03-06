import { FC, useContext, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Fade,
  IconButton,
} from "@mui/material";
import {
  AlternateEmail,
  Close,
  Password,
  ReportGmailerrorred,
} from "@mui/icons-material";

import { USER } from "../../globals";
import { AuthContext } from "../../context/auth.context";
import { useLoginMutation } from "../../generated/graphql";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "../../context/actions/auth.actions";

interface LoginProps {
  goToRegister: () => void;
}

export const Login: FC<LoginProps> = ({ goToRegister }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const [errorOpened, setErrorOpened] = useState(false);

  const [login] = useLoginMutation();
  const { dispatch } = useContext(AuthContext);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setIsFetching(true);
    setErrorOpened(false);
    setError("");

    let usernameOrEmailToLowerCase = usernameOrEmail.toLowerCase();

    // Start the login process by dispatching the loginStart action
    dispatch(loginStart());
    try {
      // Send the GraphQL login request to the server
      const res = await login({
        variables: {
          usernameOrEmail: usernameOrEmailToLowerCase,
          password,
        },
      });

      if (res.data?.login.user) {
        // Dispatch the login response by dispatching the loginSuccess action
        dispatch(loginSuccess(res.data?.login.user));
        localStorage.setItem(USER, JSON.stringify(res.data?.login.user));
      } else if (res.data?.login.errors) {
        // Handle known errors and show them to the user
        setError(res.data.login.errors[0].message as string);
        setErrorOpened(true);
      } else if (res.errors) {
        // Handle unknown errors and show them to the user
        setError(
          `${
            res.errors[0].message as string
          }. Please report this error to the support.`
        );
        setErrorOpened(true);
      }
    } catch (err: unknown) {
      // Dispatch the login failure by dispatching the loginFailure action
      dispatch(loginFailure());
    }
    setIsFetching(false);
  };

  return (
    <div className="login">
      <div className="loginError">
        <Fade in={errorOpened} className="loginErrorAlert">
          <Alert
            severity="error"
            icon={<ReportGmailerrorred fontSize="medium" />}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setErrorOpened(false);
                }}
              >
                <Close fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        </Fade>
      </div>
      <form className="loginBox" onSubmit={handleSubmit}>
        <div className="loginBoxInput">
          <AlternateEmail />
          <input
            placeholder="Email address or username"
            type="text"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
          />
        </div>
        <div className="loginBoxInput">
          <Password />
          <input
            placeholder="Password"
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {isFetching ? (
          <Button className="loginBoxButton" disabled>
            <CircularProgress size="32px" />
          </Button>
        ) : (
          <Button type="submit" variant="contained" className="loginBoxButton">
            Log In
          </Button>
        )}
        <span className="loginBoxForgot">Forgot Password?</span>
        <span className="loginBoxRegisterBox">
          {isFetching ? (
            <Button variant="text" className="loginBoxRegister" disabled>
              Create an Account
            </Button>
          ) : (
            <Button
              variant="text"
              className="loginBoxRegister"
              onClick={goToRegister}
            >
              Create an Account
            </Button>
          )}
        </span>
      </form>
    </div>
  );
};
