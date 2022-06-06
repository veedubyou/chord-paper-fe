import { isWhitespace } from "common/Whitespace";

describe("isWhitespace", () => {
    test("normal space", () => {
        expect(isWhitespace(" ")).toEqual(true);
    });

    test("multiple whitespaces", () => {
        expect(isWhitespace("    ")).toEqual(true);
    });

    test("a character", () => {
        expect(isWhitespace("a")).toEqual(false);
    });

    test("not all whitespace", () => {
        expect(isWhitespace("   a")).toEqual(false);
    });

    test("a tab", () => {
        expect(isWhitespace("\t")).toEqual(true);
    });

    test("a return", () => {
        expect(isWhitespace("\r")).toEqual(true);
    });

    test("a newline", () => {
        expect(isWhitespace("\n")).toEqual(true);
    });

    test("a unicode whitespace", () => {
        expect(isWhitespace("\u2009")).toEqual(true);
    });

    test("another unicode whitespace", () => {
        expect(isWhitespace("\u00A0")).toEqual(true);
    });
});
