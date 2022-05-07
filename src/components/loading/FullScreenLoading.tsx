import { Modal } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import CenteredLayoutWithMenu from "../display/CenteredLayoutWithMenu";
import LoadingSpinner from "./LoadingSpinner";

const FullScreenSpinner = withStyles({
    root: {
        width: "100vw",
        height: "100vh",
    },
})(LoadingSpinner);

const FullScreenLoading: React.FC<{}> = (): JSX.Element => {
    return (
        <CenteredLayoutWithMenu>
            <Modal open>
                <FullScreenSpinner size={200} thickness={2} />
            </Modal>
        </CenteredLayoutWithMenu>
    );
};

export default FullScreenLoading;
