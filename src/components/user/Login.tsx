import {
    Grid,
    Paper as UnstyledPaper,
    StyledComponentProps,
    Theme,
    Typography as UnstyledTypography,
} from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import { makeStyles, withStyles } from "@material-ui/styles";
import { isLeft } from "fp-ts/lib/These";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import SigninIcon from "../../assets/img/google_signin.svg";
import { login } from "../../common/backend";
import { deserializeUser, User, UserContext } from "./userContext";

const Paper = withStyles({
    root: {
        width: "100%",
        cursor: "pointer",
    },
})(UnstyledPaper);

const Typography = withStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(2),
        color: grey[600],
    },
}))(UnstyledTypography);

const googleSignInID = "google-sign-in";
const googleClientID =
    "650853277550-ta69qbfcvdl6tb5ogtnh2d07ae9rcdlf.apps.googleusercontent.com";

const useSigninStyles = makeStyles({
    root: {
        display: "inline-block",
        objectFit: "contain",
    },
});

interface LoginProps extends StyledComponentProps {
    onUserChanged: (user: User) => void;
}

const Login: React.FC<LoginProps> = (props: LoginProps): JSX.Element => {
    const [gapiLoaded, setGapiLoaded] = useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar();
    const signinStyles = useSigninStyles();
    const user: User | null = React.useContext(UserContext);

    const userNotSignedIn = (user: User | null): user is null => {
        return user === null;
    };

    useEffect(() => {
        if (gapiLoaded) {
            return;
        }

        if (window["gapi"] !== undefined) {
            setGapiLoaded(true);
        } else {
            enqueueSnackbar("gapi is not loaded, working offline only", {
                variant: "error",
            });
        }
    }, [gapiLoaded, enqueueSnackbar]);

    useEffect(() => {
        if (!gapiLoaded) {
            return;
        }

        gapi.load("auth2", () => {
            const handleGoogleLogin = async (
                currentUser: gapi.auth2.CurrentUser
            ) => {
                const idToken: string = currentUser.get().getAuthResponse()
                    .id_token;

                let loginResult = await login(idToken);

                if (isLeft(loginResult)) {
                    console.error(
                        "Failed to make login request to BE",
                        loginResult.left
                    );
                    enqueueSnackbar(
                        "Failed to login to backend. Check console for more error details",
                        { variant: "error" }
                    );

                    return;
                }

                const parsedUser = deserializeUser(
                    loginResult.right,
                    currentUser
                );

                if (parsedUser === null) {
                    console.error(
                        "JSON payload is not a user",
                        loginResult.right
                    );
                    enqueueSnackbar(
                        "Failed to login to backend. Check console for more error details",
                        { variant: "error" }
                    );

                    return;
                }

                props.onUserChanged(parsedUser);
            };

            if (!userNotSignedIn(user)) {
                return;
            }

            const handleAuthInit = (authClient: gapi.auth2.GoogleAuth) => {
                authClient.attachClickHandler(
                    document.getElementById(googleSignInID),
                    {},
                    () => handleGoogleLogin(authClient.currentUser),
                    (failureReason: string) => {
                        console.error(
                            "Failed to login to Google",
                            failureReason
                        );
                    }
                );

                if (authClient.isSignedIn.get()) {
                    handleGoogleLogin(authClient.currentUser);
                }
            };

            gapi.auth2
                .init({
                    client_id: googleClientID,
                    scope: "profile email",
                })
                .then(handleAuthInit);
        });
    }, [enqueueSnackbar, user, props, gapiLoaded]);

    if (!gapiLoaded) {
        return <div></div>;
    }

    const userDescription = (user: User | null): string => {
        if (userNotSignedIn(user)) {
            return "Sign In";
        }

        if (user.name === null) {
            return "You Logged In But Who Are You???";
        }

        return user.name;
    };

    return (
        <Paper id={googleSignInID} classes={props.classes}>
            <Grid container alignItems="center" justify="center">
                <Grid item>
                    <img
                        src={SigninIcon}
                        alt="Google Signin"
                        className={signinStyles.root}
                    />
                </Grid>
                <Grid item>
                    <Typography variant="h6" display="inline">
                        {userDescription(user)}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Login;
