import { Modal } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import CenteredLayoutWithMenu from "../display/CenteredLayoutWithMenu";
import { CollapsedSideMenu } from "../SideMenu";
import LoadingSpinner from "./LoadingSpinner";

const FullScreenSpinner = withStyles({
    root: {
        width: "100vw",
        height: "100vh",
    },
})(LoadingSpinner);

const FullScreenLoading: React.FC<{}> = (): JSX.Element => {
    const collapsedMenu = <CollapsedSideMenu open />;

    // div is inserted after Modal so that a ref can be taken
    // otherwise some invariant warning is tripped
    return (
        <CenteredLayoutWithMenu menuElement={collapsedMenu}>
            <Modal open>
                <div>
                    <FullScreenSpinner size={200} thickness={2} />
                </div>
            </Modal>
        </CenteredLayoutWithMenu>
    );
};

export default FullScreenLoading;
