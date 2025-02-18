import { useRegisterTopKeyListener } from "components/GlobalKeyListener";
import { ControlButton } from "components/track_player/internal_player/ControlButton";
import ControlGroup from "components/track_player/internal_player/ControlGroup";
import { TransportActions } from "components/track_player/internal_player/usePlayerControls";
import React, { useEffect } from "react";

interface TransportControlProps {
    showing: boolean;
    playing: boolean;
    transport: TransportActions;
}

const TransportControl: React.FC<TransportControlProps> = (
    props: TransportControlProps
): JSX.Element => {
    const [addTopKeyListener, removeKeyListener] = useRegisterTopKeyListener();

    useEffect(() => {
        if (!props.showing) {
            return;
        }

        const handleKey = (event: KeyboardEvent) => {
            switch (event.code) {
                case "Space": {
                    props.transport.togglePlay();
                    event.preventDefault();

                    break;
                }
                case "ArrowLeft": {
                    if (event.ctrlKey || event.metaKey) {
                        props.transport.skipBack.action();
                    } else {
                        props.transport.jumpBack();
                    }

                    event.preventDefault();
                    break;
                }
                case "ArrowRight": {
                    if (event.ctrlKey || event.metaKey) {
                        props.transport.skipForward.action();
                    } else {
                        props.transport.jumpForward();
                    }

                    event.preventDefault();
                    return;
                }
            }
        };

        addTopKeyListener(handleKey);
        return () => {
            removeKeyListener(handleKey);
        };
    }, [props, addTopKeyListener, removeKeyListener]);

    const playPauseButton = props.playing ? (
        <ControlButton.Pause onClick={props.transport.togglePlay} />
    ) : (
        <ControlButton.Play onClick={props.transport.togglePlay} />
    );

    return (
        <ControlGroup dividers="right">
            <ControlButton.Beginning onClick={props.transport.goToBeginning} />
            <ControlButton.SkipBack
                disabled={!props.transport.skipBack.enabled}
                onClick={props.transport.skipBack.action}
            />
            <ControlButton.JumpBack onClick={props.transport.jumpBack} />
            {playPauseButton}
            <ControlButton.JumpForward onClick={props.transport.jumpForward} />
            <ControlButton.SkipForward
                disabled={!props.transport.skipForward.enabled}
                onClick={props.transport.skipForward.action}
            />
        </ControlGroup>
    );
};

export default React.memo(TransportControl);

