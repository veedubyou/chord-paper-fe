import React, { useState } from "react";
import Line from "./Line";

interface StatefulEditableLineProps {
    initialText?: string;
}

const StatefulEditableLine: React.FC<StatefulEditableLineProps> = (
    props: StatefulEditableLineProps
): JSX.Element => {
    let initialText = "";
    if (props.initialText) {
        initialText = props.initialText;
    }

    const [text, setText] = useState(initialText);

    const changeFn = (newValue: string): void => {
        setText(newValue);
    };

    return <Line text={text} onChange={changeFn} />;
};

export default StatefulEditableLine;
