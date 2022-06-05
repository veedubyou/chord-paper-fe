import { Collapse } from "@mui/material";
import React, { useState } from "react";
import { ControlButton } from "../ControlButton";
import { ControlGroupBox, VerticalMiddleDivider } from "../ControlGroup";
import TempoControl from "./TempoControl";
import TransposeControl from "./TransposeControl";

interface AdvancedControlsProps {
    tempo: {
        percentage: number;
        onChange: (newPercentage: number) => void;
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

type MenuTypes = "tempo" | "transpose";
const menuOrder: MenuTypes[] = ["tempo", "transpose"];

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

export default AdvancedControls;

