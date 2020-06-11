import React from "react";
import {
    render,
    cleanup,
    fireEvent,
    findByTestId,
} from "@testing-library/react";

import { ThemeProvider, createMuiTheme } from "@material-ui/core";

import {
    getExpectChordAndLyric,
    getFindByTestIdChain,
    FindByTestIdChainFn,
    ExpectChordAndLyricFn,
} from "./matcher";
import { enterKey } from "./userEvent";
import ChordPaper from "../components/ChordPaper";
import { SnackbarProvider } from "notistack";
import { ChordSong } from "../common/ChordModel/ChordSong";
import { ChordLine } from "../common/ChordModel/ChordLine";
import { ChordBlock } from "../common/ChordModel/ChordBlock";
import App from "../App";

describe("App side menu", () => {
    let findByTestIdChain: FindByTestIdChainFn;
    beforeEach(async () => {
        const { findByTestId } = render(<App />);
        findByTestIdChain = getFindByTestIdChain(findByTestId);
    });

    test("Music page", async () => {
        // navigate away, and back
        const aboutButton = await findByTestIdChain("Menu-AboutButton");
        expect(aboutButton).toBeInTheDocument();
        fireEvent.click(aboutButton);

        const homeButton = await findByTestIdChain("Menu-HomeButton");
        expect(homeButton).toBeInTheDocument();
        fireEvent.click(homeButton);

        expect(await findByTestIdChain("ChordPaper")).toBeInTheDocument();
    });

    test("About page", async () => {
        // navigate away, and back
        const aboutButton = await findByTestIdChain("Menu-AboutButton");
        expect(aboutButton).toBeInTheDocument();
        fireEvent.click(aboutButton);

        expect(await findByTestIdChain("About")).toBeInTheDocument();
    });
});
