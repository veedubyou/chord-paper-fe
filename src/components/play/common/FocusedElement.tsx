import { RootRef } from "@material-ui/core";
import React, { useEffect } from "react";

interface FocusedElementProps {
    children: React.ReactElement;
}

const FocusedElement: React.FC<FocusedElementProps> = (
    props: FocusedElementProps
): JSX.Element => {
    const ref = React.useRef<HTMLElement>();

    useEffect(() => {
        ref.current?.focus();
    });

    return (
        <RootRef rootRef={ref}>
            {props.children}
        </RootRef>
    );
};

export default FocusedElement;
