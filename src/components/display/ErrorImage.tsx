import { makeStyles } from "@material-ui/styles";
import React, { useEffect } from "react";
import ErrorImg from "../../assets/img/error.jpeg";
import { useErrorMessage } from "../../common/backend/errors";

const useErrorStyles = makeStyles({
    root: {
        objectFit: "contain",
    },
});

interface ErrorImageProps {
    error: unknown;
}

const ErrorImage: React.FC<ErrorImageProps> = (
    props: ErrorImageProps
): JSX.Element => {
    const errorStyles = useErrorStyles();
    const showError = useErrorMessage();

    useEffect(() => {
        showError(props.error);
    }, [props, showError]);

    return (
        <img
            src={ErrorImg}
            className={errorStyles.root}
            alt="Song Loading Error"
        />
    );
};

export default ErrorImage;
