import React from "react";

interface TitleComponent {
    title: string;
}

export type TutorialComponent = React.FC<{}> & TitleComponent;

export const convertToTutorialComponent = (
    fc: React.FC<{}>,
    title: string
): TutorialComponent => {
    const tutorialComponent: TutorialComponent = fc as TutorialComponent;
    tutorialComponent.title = title;
    return tutorialComponent;
};
