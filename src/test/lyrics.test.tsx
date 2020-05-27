import React from "react";
import { render } from "@testing-library/react";
import ChordPaper from "../components/ChordPaper";

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

test("renders all initial lyric lines", () => {
    const { getByText } = render(<ChordPaper initialLyrics={lyrics} />);

    lyrics.forEach((lyric: string) => {
        const lineElement: HTMLElement = getByText(lyric);
        expect(lineElement).toBeInTheDocument();
    });
});

test("doesn't render an unspecified lyric line", () => {
    const { queryByText } = render(<ChordPaper initialLyrics={lyrics} />);

    const lineElement: HTMLElement | null = queryByText("And hurt you");
    expect(lineElement).toBeNull();
});
