import {
    Box,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    styled,
} from "@mui/material";
import React, { useState } from "react";
import { MobileView } from "react-device-detect";

const BoxWithMargin = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
}));

const OneTimeMobileNotification: React.FC<{}> = (): JSX.Element => {
    const [open, setOpen] = useState(true);

    const handleCloseDialog = () => {
        setOpen(false);
    };

    return (
        <MobileView>
            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>Mobile not supported</DialogTitle>
                <DialogContent>
                    <BoxWithMargin>
                        <DialogContentText>
                            Thanks for coming by to check out Chord Paper, but
                            only desktop is supported right now.
                        </DialogContentText>
                    </BoxWithMargin>
                    <BoxWithMargin>
                        <DialogContentText>
                            <sub>Seriously don't try it, the mobile experience is awful.</sub>
                        </DialogContentText>
                    </BoxWithMargin>
                </DialogContent>
            </Dialog>
        </MobileView>
    );
};

export default OneTimeMobileNotification;

