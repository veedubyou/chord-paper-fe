import { fireEvent, render } from "@testing-library/react";
import App from "App";
import React from "react";
import { gapiStub } from "test/common";
import { FindByTestIdChainFn, getFindByTestIdChain } from "test/matcher";

beforeAll(gapiStub);

describe("App side menu", () => {
    let findByTestIdChain: FindByTestIdChainFn;
    beforeEach(async () => {
        const { findAllByTestId } = render(<App />);
        findByTestIdChain = getFindByTestIdChain(findAllByTestId);
    });

    test("Music page", async () => {
        // navigate away, and back
        const aboutButton = await findByTestIdChain(["Menu-AboutButton", 0]);
        expect(aboutButton).toBeInTheDocument();
        fireEvent.click(aboutButton);

        const homeButton = await findByTestIdChain(["Menu-HomeButton", 0]);
        expect(homeButton).toBeInTheDocument();
        fireEvent.click(homeButton);

        expect(await findByTestIdChain(["ChordPaper", 0])).toBeInTheDocument();
    });

    test("About page", async () => {
        // navigate away, and back
        const aboutButton = await findByTestIdChain(["Menu-AboutButton", 0]);
        expect(aboutButton).toBeInTheDocument();
        fireEvent.click(aboutButton);

        expect(await findByTestIdChain(["About", 0])).toBeInTheDocument();
    });
});
