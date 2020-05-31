import React from "react";
import {
    render,
    fireEvent,
    waitForElementToBeRemoved,
    cleanup,
    Matcher,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import ChordPaper from "../components/ChordPaper";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";
import { ChordSong } from "../common/ChordModel";
import { matchLyric, lyricsInElement, findByTestIdChain } from "./matcher";
import { enterKey } from "./userEvent";

afterEach(cleanup);

beforeAll(() => {
    //https://github.com/mui-org/material-ui/issues/15726#issuecomment-493124813
    global.document.createRange = () => ({
        setStart: () => {},
        setEnd: () => {},
        //@ts-ignore
        commonAncestorContainer: {
            nodeName: "BODY",
            ownerDocument: document,
        },
    });
});

const lyrics: string[] = [
    "Never gonna give you up",
    "Never gonna let you down",
    "Never gonna run around",
    //"And desert you"
    "Never gonna make you cry",
    "Never gonna say goodbye",
    "Never gonna tell a lie",
    //"And hurt you"
];

const song = (): ChordSong => {
    return ChordSong.fromLyricsLines(lyrics);
};

const basicChordPaper = () => (
    <ThemeProvider theme={createMuiTheme()}>
        <ChordPaper initialSong={song()} />
    </ThemeProvider>
);

describe("Rendering initial lyrics", () => {
    test("renders all initial lyric lines", () => {
        const { getByText } = render(basicChordPaper());

        lyrics.forEach((lyric: string) => {
            const lineElement: HTMLElement = getByText(matchLyric(lyric));
            expect(lineElement).toBeInTheDocument();
        });
    });

    test("doesn't render an unspecified lyric line", () => {
        const { queryByText } = render(basicChordPaper());

        const lineElement: HTMLElement | null = queryByText(
            matchLyric("And hurt you")
        );
        expect(lineElement).toBeNull();
    });
});

describe("Hover Menu", () => {
    describe("Buttons show on hover", () => {
        let findByTestId: (testID: string) => Promise<HTMLElement>;
        let subject: () => void;

        beforeEach(async () => {
            findByTestId = render(basicChordPaper()).findByTestId;
            const hoverLine = await findByTestIdChain(findByTestId, [
                "Line-2",
                "NoneditableLine",
            ]);
            expect(hoverLine).toBeInTheDocument();

            subject = () => {
                fireEvent.mouseOver(hoverLine);
            };
        });

        it("shows the edit button", async () => {
            subject();
            const editButton = await findByTestId("EditButton");
            expect(editButton).toBeInTheDocument();
        });

        it("shows the add button", async () => {
            subject();
            const addButton = await findByTestId("AddButton");
            expect(addButton).toBeInTheDocument();
        });

        it("shows the remove button", async () => {
            subject();
            const removeButton = await findByTestId("RemoveButton");
            expect(removeButton).toBeInTheDocument();
        });
    });

    describe("Buttons hide when not hovered", () => {
        let queryByTestId: (testID: string) => HTMLElement | null;
        let subject: () => void;

        beforeEach(async () => {
            const rendered = render(basicChordPaper());
            queryByTestId = rendered.queryByTestId;

            const findByTestId = rendered.findByTestId;

            const hoverLine = await findByTestIdChain(findByTestId, [
                "Line-2",
                "NoneditableLine",
            ]);
            expect(hoverLine).toBeInTheDocument();
            fireEvent.mouseOver(hoverLine);

            // need to wait for the element to appear before we can wait for the disappearance
            expect(await findByTestId("EditButton")).toBeInTheDocument();
            expect(await findByTestId("AddButton")).toBeInTheDocument();
            expect(await findByTestId("RemoveButton")).toBeInTheDocument();

            subject = () => {
                fireEvent.mouseOut(hoverLine);
            };
        });

        it("hides the edit button", async () => {
            subject();
            await waitForElementToBeRemoved(() => {
                return queryByTestId("EditButton");
            });
        });

        it("hides the add button", async () => {
            subject();
            await waitForElementToBeRemoved(() => {
                return queryByTestId("AddButton");
            });
        });

        it("hides the remove button", async () => {
            subject();
            await waitForElementToBeRemoved(() => {
                return queryByTestId("RemoveButton");
            });
        });
    });
});

describe("Edit action", () => {
    it("changes the text", async () => {
        const { findByTestId, findByText } = render(basicChordPaper());
        const line = await findByTestIdChain(findByTestId, [
            "Line-2",
            "NoneditableLine",
        ]);
        expect(line).toBeInTheDocument();
        fireEvent.mouseOver(line);

        const editButton = await findByTestId("EditButton");
        expect(editButton).toBeInTheDocument();
        fireEvent.click(editButton);

        const inputElem = await findByTestIdChain(findByTestId, [
            "Line-2",
            "InnerInput",
        ]);
        expect(inputElem).toBeInTheDocument();
        userEvent.type(inputElem, " and desert you");

        const expectedLyric = "Never gonna run around and desert you";

        expect(inputElem).toHaveValue(expectedLyric);

        enterKey(inputElem);

        expect(await findByText(matchLyric(expectedLyric))).toBeInTheDocument();
    });
});

describe("Add action", () => {
    let findByTestId: (testID: string) => Promise<HTMLElement>;
    let subject: () => Promise<void>;

    beforeEach(async () => {
        findByTestId = render(basicChordPaper()).findByTestId;
        const line = await findByTestIdChain(findByTestId, [
            "Line-2",
            "NoneditableLine",
        ]);
        expect(line).toBeInTheDocument();

        subject = async () => {
            fireEvent.mouseOver(line);
            const addButton = await findByTestId("AddButton");
            expect(addButton).toBeInTheDocument();
            fireEvent.click(addButton);
        };
    });

    it("adds a new empty line", async () => {
        await subject();
        const newLine = await findByTestIdChain(findByTestId, [
            "Line-3",
            "NoneditableLine",
        ]);
        expect(newLine).toBeInTheDocument();
        expect(newLine).toHaveTextContent("", { normalizeWhitespace: true });
    });

    it("pushes the next line down", async () => {
        await subject();
        const pushedLine = await findByTestIdChain(findByTestId, [
            "Line-4",
            "NoneditableLine",
        ]);
        expect(pushedLine).toBeInTheDocument();

        const lyrics = lyricsInElement(pushedLine);
        expect(lyrics).toEqual("Never gonna make you cry");
    });
});

describe("Remove action", () => {
    let findByTestId: (testID: string) => Promise<HTMLElement>;
    let queryByText: (matcher: Matcher) => HTMLElement | null;

    let subject: () => Promise<void>;

    beforeEach(async () => {
        const rendered = render(basicChordPaper());
        findByTestId = rendered.findByTestId;
        queryByText = rendered.queryByText;
        const line = await findByTestIdChain(findByTestId, [
            "Line-2",
            "NoneditableLine",
        ]);
        expect(line).toBeInTheDocument();

        expect(line).toHaveTextContent("Never gonna run around");

        subject = async () => {
            fireEvent.mouseOver(line);
            const removeButton = await findByTestId("RemoveButton");
            expect(removeButton).toBeInTheDocument();
            fireEvent.click(removeButton);
        };
    });

    it("removes the line", async () => {
        await subject();
        await waitForElementToBeRemoved(() =>
            queryByText(matchLyric("Never gonna run around"))
        );
    });

    it("shifts the next line up", async () => {
        await subject();
        await waitForElementToBeRemoved(() =>
            queryByText(matchLyric("Never gonna run around"))
        );

        const line = await findByTestIdChain(findByTestId, [
            "Line-2",
            "NoneditableLine",
        ]);
        expect(line).toHaveTextContent("Never gonna make you cry");
    });
});
