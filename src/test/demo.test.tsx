import { cleanup, render } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Redirect, Route, Switch } from "react-router-dom";
import Demo from "../components/Demo";
import { withProviders } from "./common";
import { getExpectChordAndLyric } from "./matcher";

afterEach(cleanup);

const demo = () => {
    return withProviders(
        <MemoryRouter initialEntries={["/demo"]}>
            <Switch>
                <Redirect from="/demo" to="/demo/edit" exact />
                <Route key="/demo" path="/demo">
                    <Demo />
                </Route>
            </Switch>
        </MemoryRouter>
    );
};

describe("Renders", () => {
    test("renders the title", () => {
        const { getByText } = render(demo());

        expect(
            getByText("Never Gonna Give You Up x Plastic Love")
        ).toBeTruthy();
    });

    test("renders at least a line", async () => {
        const { findAllByTestId } = render(demo());
        const expectChordAndLyric = getExpectChordAndLyric(findAllByTestId);

        await expectChordAndLyric("Em7", "We're no strangers to ", [
            ["Line", 4],
            ["NoneditableLine", 0],
            ["Block", 0],
        ]);

        await expectChordAndLyric("A7", "love", [
            ["Line", 4],
            ["NoneditableLine", 0],
            ["Block", 1],
        ]);
    });
});
