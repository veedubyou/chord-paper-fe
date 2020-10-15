import {
    Box as UnstyledBox,
    Grid,
    Paper as UnstyledPaper,
    StyledComponentProps,
    Theme,
    Typography as UnstyledTypography,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/styles";
import { isLeft } from "fp-ts/lib/These";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import SigninIcon from "../../assets/img/google_signin.png";
import { login } from "../../common/backend";
import { deserializeUser, User, UserContext } from "./userContext";

const Paper = withStyles({
    root: {
        width: "100%",
    },
})(UnstyledPaper);

const Box = withStyles({
    root: {
        width: "100%",
    },
})(UnstyledBox);

const Typography = withStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(2),
    },
}))(UnstyledTypography);

const googleSignInID = "google-sign-in";
const googleClientID =
    "650853277550-ta69qbfcvdl6tb5ogtnh2d07ae9rcdlf.apps.googleusercontent.com";

const useSigninStyles = makeStyles({
    root: {
        maxWidth: "100%",
        maxHeight: "100%",
        cursor: "pointer",
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

    const showSigninButton = (user: User | null): user is null => {
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
            const handleGoogleLogin = async (user: gapi.auth2.GoogleUser) => {
                const idToken: string = user.getAuthResponse().id_token;

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

                const parsedUser = deserializeUser(loginResult.right, idToken);

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

            if (!showSigninButton(user)) {
                return;
            }

            const handleAuthInit = (authClient: gapi.auth2.GoogleAuth) => {
                authClient.attachClickHandler(
                    document.getElementById(googleSignInID),
                    {},
                    handleGoogleLogin,
                    (failureReason: string) => {
                        console.error(
                            "Failed to login to Google",
                            failureReason
                        );
                    }
                );

                if (authClient.isSignedIn.get()) {
                    handleGoogleLogin(authClient.currentUser.get());
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

    if (showSigninButton(user)) {
        return (
            <Paper classes={props.classes}>
                <Box id={googleSignInID}>
                    <img
                        src={SigninIcon}
                        alt="Google Signin"
                        className={signinStyles.root}
                    />
                </Box>
            </Paper>
        );
    }

    return (
        <Paper classes={props.classes}>
            <Grid container>
                <Grid item container justify="center">
                    <Typography>Signed in as {user.name}</Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Login;
