import { DialogContent, Modal } from "@mui/material";
import CenteredLayoutWithMenu from "components/display/CenteredLayoutWithMenu";
import LoadingSpinner from "components/loading/LoadingSpinner";
import { CollapsedSideMenu } from "components/SideMenu";
import React from "react";

const FullScreenLoading: React.FC<{}> = (): JSX.Element => {
    const collapsedMenu = <CollapsedSideMenu open />;

    return (
        <CenteredLayoutWithMenu menuElement={collapsedMenu}>
            <Modal open>
                <DialogContent>
                    <LoadingSpinner
                        size={200}
                        thickness={2}
                        sx={{ width: "100vw", height: "100vh" }}
                    />
                </DialogContent>
            </Modal>
        </CenteredLayoutWithMenu>
    );
};

export default FullScreenLoading;
