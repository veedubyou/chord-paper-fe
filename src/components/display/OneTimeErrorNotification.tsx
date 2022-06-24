import {
    Box,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Link,
    styled,
} from "@mui/material";
import { getErrorMessageForUser, RequestError } from "common/backend/errors";
import { PlainFn } from "common/PlainFn";
import { isLeft } from "fp-ts/lib/Either";
import { isRight } from "fp-ts/lib/These";
import React, { useEffect, useState } from "react";

const BoxWithMargin = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
}));

interface OneTimeErrorNotificationProps {
    componentDescription: string;
    error: RequestError;
    onClose?: PlainFn;
}

const feedbackFormURL =
    "https://docs.google.com/forms/d/e/1FAIpQLScL05fGWOVX-l5kqIoKBz4jreVmCJeIVhFu5TT2txVGNrV5rw/viewform?usp=sf_link";

const OneTimeErrorNotification: React.FC<OneTimeErrorNotificationProps> = (
    props: OneTimeErrorNotificationProps
): JSX.Element => {
    const [open, setOpen] = useState(true);

    useEffect(() => {
        if (isRight(props.error)) {
            console.error(props.error.right.msg);
        }
    }, [props.error]);

    const errorMsg: string = (() => {
        if (isLeft(props.error)) {
            return props.error.left;
        }

        return getErrorMessageForUser(props.error.right);
    })();

    const handleCloseDialog = () => {
        setOpen(false);
        props.onClose?.();
    };

    const feedbackLink = (
        <Link
            href={feedbackFormURL}
            target="_blank"
            rel="noopener"
        >
            contact form
        </Link>
    );

    return (
        <Dialog open={open} onClose={handleCloseDialog}>
            <DialogTitle>Error</DialogTitle>
            <DialogContent>
                <BoxWithMargin>
                    <DialogContentText>
                        {`A component failed to render due to an error: ${props.componentDescription}`}
                    </DialogContentText>
                </BoxWithMargin>
                <BoxWithMargin>
                    <DialogContentText>{errorMsg}</DialogContentText>
                </BoxWithMargin>
                <BoxWithMargin>
                    <DialogContentText>
                        {
                            "Try refreshing and the problem may go away. If it sticks around feel free to leave a comment in the "
                        }
                        {feedbackLink}
                    </DialogContentText>
                </BoxWithMargin>
            </DialogContent>
        </Dialog>
    );
};

export default OneTimeErrorNotification;
