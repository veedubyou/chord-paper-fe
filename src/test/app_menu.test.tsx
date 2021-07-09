import { fireEvent, render } from "@testing-library/react";
import React from "react";
import App from "../App";
import { FindByTestIdChainFn, getFindByTestIdChain } from "./matcher";
import { gapiStub } from "./common";

beforeAll(gapiStub);

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
