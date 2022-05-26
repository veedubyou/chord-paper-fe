import React, { useEffect } from "react";
import ErrorImg from "../../assets/img/error.jpeg";
import { useErrorSnackbar } from "../../common/backend/errors";

interface ErrorImageProps {
    error: unknown;
}

const ErrorImage: React.FC<ErrorImageProps> = (
    props: ErrorImageProps
): JSX.Element => {
    const showError = useErrorSnackbar();

    useEffect(() => {
        showError(props.error);
    }, [props, showError]);

    return (
        <img
            src={ErrorImg}
            alt="Song Loading Error"
            style={{
                objectFit: "contain",
            }}
        />
    );
};

export default ErrorImage;
