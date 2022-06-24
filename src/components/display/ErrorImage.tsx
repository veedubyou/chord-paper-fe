import ErrorImg from "assets/img/error.jpeg";
import React from "react";

const ErrorImage: React.FC<{}> = (): JSX.Element => {
    return (
        <img
            src={ErrorImg}
            alt="Song Loading Error"
            style={{
                objectFit: "scale-down",
            }}
        />
    );
};

export default ErrorImage;
