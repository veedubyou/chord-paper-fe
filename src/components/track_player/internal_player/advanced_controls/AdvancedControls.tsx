import { Collapse } from "@mui/material";
import ABLoopControl from "components/track_player/internal_player/advanced_controls/ABLoopControl";
import TempoControl from "components/track_player/internal_player/advanced_controls/TempoControl";
import TransposeControl from "components/track_player/internal_player/advanced_controls/TransposeControl";
import { ControlButton } from "components/track_player/internal_player/ControlButton";
import {
    ControlGroupBox,
    VerticalMiddleDivider,
} from "components/track_player/internal_player/ControlGroup";
import { ABLoop } from "components/track_player/internal_player/ABLoop";
import React, { useState } from "react";

interface AdvancedControlsProps {
    tempo: {
        percentage: number;
        onChange: (newPercentage: number) => void;
    };
    abLoop: {
        abLoop: ABLoop;
        onChange: (newABLoop: ABLoop) => void;
    };
    transpose?: {
        level: number;
        onChange: (newLevel: number) => void;
    };
}

interface Menu {
    icon: React.ReactElement;
    controls: React.ReactElement;
}

type MenuTypes = "tempo" | "transpose" | "abLoop";
const menuOrder: MenuTypes[] = ["tempo", "transpose", "abLoop"];

const AdvancedControls: React.FC<AdvancedControlsProps> = (
    props: AdvancedControlsProps
): JSX.Element => {
    const [currentMenu, setCurrentMenu] = useState<MenuTypes | null>(null);

    const transposeMenu: Menu | null = (() => {
        if (props.transpose === undefined) {
            return null;
        }

        return {
            icon: (
                <ControlButton.TransposeMenu
                    onClick={() => setCurrentMenu("transpose")}
                />
            ),
            controls: (
                <TransposeControl
                    transposeLevel={props.transpose.level}
                    onTransposeChange={props.transpose.onChange}
                />
            ),
        };
    })();

    const tempoMenu: Menu = {
        icon: (
            <ControlButton.TempoMenu onClick={() => setCurrentMenu("tempo")} />
        ),
        controls: (
            <TempoControl
                tempoPercentage={props.tempo.percentage}
                onTempoChange={props.tempo.onChange}
            />
        ),
    };

    const abLoopMenu: Menu = {
        icon: (
            <ControlButton.ABLoopMenu
                onClick={() => setCurrentMenu("abLoop")}
            />
        ),
        controls: (
            <ABLoopControl
                abLoop={props.abLoop.abLoop}
                onABLoopChange={props.abLoop.onChange}
            />
        ),
    };

    const showCloseButton = currentMenu !== null;
    const closeButton = (
        <Collapse
            key="menu-close-button"
            in={showCloseButton}
            orientation="horizontal"
        >
            <ControlButton.CloseMenu onClick={() => setCurrentMenu(null)} />
        </Collapse>
    );

    const menus: Record<MenuTypes, Menu | null> = {
        tempo: tempoMenu,
        transpose: transposeMenu,
        abLoop: abLoopMenu,
    };

    const makeCollapsibleMenu = (menuType: MenuTypes): React.ReactElement[] => {
        const menu = menus[menuType];
        if (menu === null) {
            return [];
        }

        const showControl = currentMenu === menuType;
        const control = (
            <Collapse
                key={`${menuType}-control`}
                in={showControl}
                orientation="horizontal"
            >
                <ControlGroupBox>
                    {menu.controls}
                    <VerticalMiddleDivider orientation="vertical" flexItem />
                </ControlGroupBox>
            </Collapse>
        );

        const showIconButton = currentMenu === menuType || currentMenu === null;
        const iconButton = (
            <Collapse
                key={`${menuType}-open-button`}
                in={showIconButton}
                orientation="horizontal"
            >
                {menu.icon}
            </Collapse>
        );

        return [control, iconButton];
    };

    let menuElements: React.ReactElement[] = [];
    for (const menuKey of menuOrder) {
        const collapsibleMenuElements = makeCollapsibleMenu(menuKey);
        menuElements = menuElements.concat(collapsibleMenuElements);
    }

    menuElements.push(closeButton);

    return <>{menuElements}</>;
};

export default React.memo(AdvancedControls);
