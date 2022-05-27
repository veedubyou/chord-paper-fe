import ReceiptIcon from "@mui/icons-material/Receipt";
import TuneIcon from "@mui/icons-material/Tune";
import { SpeedDialAction } from "@mui/material";
import React, { useState } from "react";
import { PlainFn } from "../../../common/PlainFn";
import BasePlayMenu from "../common/BasePlayMenu";
import DisplaySettingsDialog from "./DisplaySettingsDialog";
import { PageDisplaySettings } from "./PagePlayContent";

interface PagePlayMenuProps {
    displaySettings: PageDisplaySettings;
    onDisplaySettingsChange?: (displaySettings: PageDisplaySettings) => void;
    onScrollView?: PlainFn;
    onExit?: PlainFn;
}

const PagePlayMenu: React.FC<PagePlayMenuProps> = (
    props: PagePlayMenuProps
): JSX.Element => {
    const [displaySettingsOpen, setDisplaySettingsOpen] = useState(false);

    // returning this instead of shoving it in the same fragment because
    // returning speed dial in a fragment somehow causes some layout changes
    if (displaySettingsOpen) {
        const handleDisplaySettingsChange = (settings: PageDisplaySettings) => {
            props.onDisplaySettingsChange?.(settings);
            setDisplaySettingsOpen(false);
        };

        return (
            <DisplaySettingsDialog
                open
                onClose={() => setDisplaySettingsOpen(false)}
                defaultSettings={props.displaySettings}
                onSubmit={handleDisplaySettingsChange}
            />
        );
    }

    return (
        <BasePlayMenu onExit={props.onExit}>
            <SpeedDialAction
                icon={<ReceiptIcon />}
                tooltipTitle="Scroll View"
                onMouseDownCapture={props.onScrollView}
            />

            <SpeedDialAction
                icon={<TuneIcon />}
                tooltipTitle="Display Settings"
                onMouseDownCapture={() => setDisplaySettingsOpen(true)}
            />
        </BasePlayMenu>
    );
};

export default PagePlayMenu;
