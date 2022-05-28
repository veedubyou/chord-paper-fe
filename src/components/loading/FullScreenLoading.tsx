import { Modal } from "@mui/material";
import React from "react";
import CenteredLayoutWithMenu from "../display/CenteredLayoutWithMenu";
import { CollapsedSideMenu } from "../SideMenu";
import LoadingSpinner from "./LoadingSpinner";

const FullScreenLoading: React.FC<{}> = (): JSX.Element => {
    const collapsedMenu = <CollapsedSideMenu open />;

    return (
        <CenteredLayoutWithMenu menuElement={collapsedMenu}>
            <Modal open>
                <LoadingSpinner
                    size={200}
                    thickness={2}
                    sx={{ width: "100vw", height: "100vh" }}
                />
            </Modal>
        </CenteredLayoutWithMenu>
    );
};

export default FullScreenLoading;
