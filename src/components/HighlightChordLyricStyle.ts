import { Theme, withStyles } from "@material-ui/core";
import { CSSProperties } from "@material-ui/styles";

export const spaceClassName = "LyricTokenSpace";
export const wordClassName = "LyricTokenWord";
export const firstTokenClassName = "FirstLyricToken";

export const chordTargetClassName = "ChordTarget";
export const chordSymbolClassName = "ChordSymbol";

const highlightedSpaceStyle = (theme: Theme): CSSProperties => ({
    backgroundColor: theme.palette.primary.main,
});

const highlightedWordStyle = (theme: Theme): CSSProperties => ({
    color: theme.palette.primary.main,
});

const outlineStyle = (theme: Theme): CSSProperties => ({
    borderStyle: "solid",
    borderColor: theme.palette.primary.main,
    borderRadius: "0.3em",
    borderWidth: "0.075em",
    // color: theme.palette.primary.dark,
});

// const ChordGridItem = withStyles((theme: Theme) => {
//     const chordSymbolOnHover = `&:hover .${chordSymbolClassName}`;
//     const firstWordOnHover = `&:hover ~ * .${firstTokenClassName}.${wordClassName}`;
//     const firstSpaceOnHover = `&:hover ~ * .${firstTokenClassName}.${spaceClassName}`;

//     return {
//         root: {
//             [chordSymbolOnHover]: {
//                 ...outline(theme),
//                 color: theme.palette.primary.dark,
//             },
//             [firstWordOnHover]: highlightedWordStyle(theme),
//             [firstSpaceOnHover]: highlightedSpaceStyle(theme),
//         },
//     };
// })(Grid);

// const HighlightBox = withStyles((theme: Theme) => {
//     const spaceWhenHover = `& :hover ~ .${spaceClassName}`;
//     const wordWhenHover = `& :hover ~ .${wordClassName}`;

//     return {
//         root: {
//             [spaceWhenHover]: highlightedSpaceStyle(theme),
//             [wordWhenHover]: highlightedWordStyle(theme),
//         },
//     };
// })(Box);

interface HighlightChordLyricStyleOptions {
    outline?: (theme: Theme) => CSSProperties;
    customLyricClassSelector?: string;
    customChordTargetClassSelector?: string;
    customChordSymbolClassSelector?: string;
}

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

export const highlightedChordLyricStyle = (
    options?: HighlightChordLyricStyleOptions
) => {
    return (theme: Theme) => {
        const highlightedSpace = highlightedSpaceStyle(theme);
        const highlightedWord = highlightedWordStyle(theme);

        const customOutlineStyles: CSSProperties | undefined =
            options?.outline !== undefined ? options.outline(theme) : undefined;

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
            root: {
                [`& ${spaceClassSelector}`]: highlightedSpace,
                [`& ${wordClassSelector}`]: highlightedWord,
                [`& ${chordSymbolSelector}`]: outline,
            },
        };
    };
};

export const highlightableChordLyricStyle = (
    options?: HighlightChordLyricStyleOptions
) => {
    return (theme: Theme) => {
        const highlightedSpace = highlightedSpaceStyle(theme);
        const highlightedWord = highlightedWordStyle(theme);

        const customOutlineStyles: CSSProperties | undefined =
            options?.outline !== undefined ? options.outline(theme) : undefined;

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
            root: {
                [`& ${chordTargetSelector}:hover ~ ${spaceClassSelector}`]: highlightedSpace,
                [`& ${chordTargetSelector}:hover ~ * ${spaceClassSelector}`]: highlightedSpace,

                [`& ${chordTargetSelector}:hover ~ ${wordClassSelector}`]: highlightedWord,
                [`& ${chordTargetSelector}:hover ~ * ${wordClassSelector}`]: highlightedWord,

                [`& ${chordTargetSelector}${chordSymbolSelector}:hover`]: outline,
                [`& ${chordTargetSelector}:hover ${chordSymbolSelector}`]: outline,
            },
        };
    };
};

export const withChordLyricStyle = (
    options?: HighlightChordLyricStyleOptions
) => withStyles(highlightableChordLyricStyle(options));

export const withHighlightedChordLyricStyle = (
    options?: HighlightChordLyricStyleOptions
) => withStyles(highlightedChordLyricStyle(options));
