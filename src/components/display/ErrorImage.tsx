import { makeStyles } from "@material-ui/styles";
import React from "react";
import ErrorImg from "../../assets/img/error.jpeg";

const useErrorStyles = makeStyles({
    root: {
        objectFit: "contain",
    },
});

const ErrorImage: React.FC<{}> = (): JSX.Element => {
    const errorStyles = useErrorStyles();

    return (
        <img
            src={ErrorImg}
            className={errorStyles.root}
            alt="Song Loading Error"
        />
    );
};

export default ErrorImage;
