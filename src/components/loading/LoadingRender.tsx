import FullScreenLoading from "components/loading/FullScreenLoading";
import React, { useEffect, useState } from "react";

interface LoadingRenderProps {
    children: React.ReactElement;
}

const LoadingRender: React.FC<LoadingRenderProps> = (
    props: LoadingRenderProps
): JSX.Element => {
    const [initialRender, setInitialRender] = useState(false);

    useEffect(() => {
        if (!initialRender) {
            // setTimeout gives a render cycle to allows the initial spinner to render
            const timerID = setTimeout(() => setInitialRender(true));
            return () => clearTimeout(timerID);
        }
    }, [initialRender, setInitialRender]);

    if (!initialRender) {
        return <FullScreenLoading />;
    }

    return props.children;
};

export default LoadingRender;
