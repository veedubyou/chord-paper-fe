import { css, cx } from "@emotion/css";
import { Theme, useTheme } from "@mui/material";

export const spaceClassName = "LyricTokenSpace";
export const wordClassName = "LyricTokenWord";
export const firstTokenClassName = "FirstLyricToken";

export const chordTargetClassName = "ChordTarget";
export const chordSymbolClassName = "ChordSymbol";

const highlightedSpaceStyle = (theme: Theme) => ({
    backgroundColor: theme.palette.primary.main,
    borderRadius: "0.3em",
});

const highlightedWordStyle = (theme: Theme) => ({
    color: theme.palette.primary.main,
});

const outlineStyle = (theme: Theme) => ({
    borderStyle: "solid",
    borderColor: theme.palette.primary.main,
    borderRadius: "0.3em",
    borderWidth: "0.075em",
});

export interface HighlightChordLyricStyleOptions {
    dragOverOutline?: (theme: Theme) => {
        color?: string;
        borderColor?: string;
    };
    hoverOutline?: (theme: Theme) => { color?: string; borderColor?: string };
    customLyricClassSelector?: string;
    customChordTargetClassSelector?: string;
    customChordSymbolClassSelector?: string;
}

export interface HighlightableBlockStyles {
    dragOver: string;
    hoverable: string;
}

export const makeHighlightableBlockStyles = (
    options?: HighlightChordLyricStyleOptions
) => {
    const dragOverStyleForTheme = dragOverChordLyricStyle(options);
    const hoverStyleForTheme = hoverChordLyricStyle(options);

    return (): HighlightableBlockStyles => {
        const theme = useTheme();
        const dragOverStyle = dragOverStyleForTheme(theme);
        const hoverStyle = hoverStyleForTheme(theme);

        return {
            dragOver: cx(css(dragOverStyle)),
            hoverable: cx(css(hoverStyle)),
        };
    };
};

const withCustomLyricSelector = (
    selector: string,
    options?: HighlightChordLyricStyleOptions
): string => {
    if (options?.customLyricClassSelector === undefined) {
        return selector;
    }

    return `${selector}.${options.customLyricClassSelector}`;
};

const withCustomChordTargetSelector = (
    selector: string,
    options?: HighlightChordLyricStyleOptions
): string => {
    if (options?.customChordTargetClassSelector === undefined) {
        return selector;
    }

    return `${selector}.${options.customChordTargetClassSelector}`;
};

const withCustomChordSymbolSelector = (
    selector: string,
    options?: HighlightChordLyricStyleOptions
): string => {
    if (options?.customChordSymbolClassSelector === undefined) {
        return selector;
    }

    return `${selector}.${options.customChordSymbolClassSelector}`;
};

const dragOverChordLyricStyle = (options?: HighlightChordLyricStyleOptions) => {
    return (theme: Theme) => {
        const highlightedSpace = highlightedSpaceStyle(theme);
        const highlightedWord = highlightedWordStyle(theme);

        const customOutlineStyles =
            options?.dragOverOutline !== undefined
                ? options.dragOverOutline(theme)
                : undefined;

        const outline = {
            ...outlineStyle(theme),
            ...customOutlineStyles,
        };

        const spaceClassSelector = withCustomLyricSelector(
            `.${spaceClassName}`,
            options
        );
        const wordClassSelector = withCustomLyricSelector(
            `.${wordClassName}`,
            options
        );

        const chordSymbolSelector = withCustomChordSymbolSelector(
            `.${chordSymbolClassName}`,
            options
        );

        return {
            [`& ${spaceClassSelector}`]: highlightedSpace,
            [`& ${wordClassSelector}`]: highlightedWord,
            [`& ${chordSymbolSelector}`]: outline,
        };
    };
};

export const hoverChordLyricStyle = (
    options?: HighlightChordLyricStyleOptions
) => {
    return (theme: Theme) => {
        const highlightedSpace = highlightedSpaceStyle(theme);
        const highlightedWord = highlightedWordStyle(theme);

        const customOutlineStyles =
            options?.hoverOutline !== undefined
                ? options.hoverOutline(theme)
                : undefined;

        const outline = {
            ...outlineStyle(theme),
            ...customOutlineStyles,
        };

        const spaceClassSelector = withCustomLyricSelector(
            `.${spaceClassName}`,
            options
        );
        const wordClassSelector = withCustomLyricSelector(
            `.${wordClassName}`,
            options
        );
        const chordTargetSelector = withCustomChordTargetSelector(
            `.${chordTargetClassName}`,
            options
        );
        const chordSymbolSelector = withCustomChordSymbolSelector(
            `.${chordSymbolClassName}`,
            options
        );

        return {
            [`& ${chordTargetSelector}:hover ~ ${spaceClassSelector}`]:
                highlightedSpace,
            [`& ${chordTargetSelector}:hover ~ * ${spaceClassSelector}`]:
                highlightedSpace,

            [`& ${chordTargetSelector}:hover ~ ${wordClassSelector}`]:
                highlightedWord,
            [`& ${chordTargetSelector}:hover ~ * ${wordClassSelector}`]:
                highlightedWord,

            [`& ${chordTargetSelector}${chordSymbolSelector}:hover`]: outline,
            [`& ${chordTargetSelector}:hover ${chordSymbolSelector}`]: outline,
        };
    };
};
