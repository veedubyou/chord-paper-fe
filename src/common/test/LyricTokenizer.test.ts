import { tokenize } from "../LyricTokenizer";

describe("lyric tokenizer", () => {
    describe("whitespace", () => {
        test("a bunch of words with spaces in between", () => {
            const results = tokenize("Never gonna give you up");
            expect(results).toEqual([
                "Never",
                " ",
                "gonna",
                " ",
                "give",
                " ",
                "you",
                " ",
                "up",
            ]);
        });

        test("a bunch of words with spaces after", () => {
            const results = tokenize("Never gonna give you up  ");
            expect(results).toEqual([
                "Never",
                " ",
                "gonna",
                " ",
                "give",
                " ",
                "you",
                " ",
                "up",
                " ",
                " ",
            ]);
        });

        test("a bunch of words with spaces before", () => {
            const results = tokenize("  Never gonna give you up");
            expect(results).toEqual([
                " ",
                " ",
                "Never",
                " ",
                "gonna",
                " ",
                "give",
                " ",
                "you",
                " ",
                "up",
            ]);
        });

        test("a bunch of words with spaces everywhere", () => {
            const results = tokenize("  Never   gonna give you up ");
            expect(results).toEqual([
                " ",
                " ",
                "Never",
                " ",
                " ",
                " ",
                "gonna",
                " ",
                "give",
                " ",
                "you",
                " ",
                "up",
                " ",
            ]);
        });

        test("just a single space", () => {
            const results = tokenize(" ");
            expect(results).toEqual([" "]);
        });

        test("a bunch of single spaces", () => {
            const results = tokenize("     ");
            expect(results).toEqual([" ", " ", " ", " ", " "]);
        });
    });

    describe("punctuation", () => {
        test("words with dashes separating", () => {
            const results = tokenize("Ne-ver gonna");
            expect(results).toEqual(["Ne", "-", "ver", " ", "gonna"]);
        });

        test("words with comma separating", () => {
            const results = tokenize("Ne,ver gonna");
            expect(results).toEqual(["Ne", ",", "ver", " ", "gonna"]);
        });

        test("apostrophes don't break the word", () => {
            const results = tokenize(
                "A full commitment's what I'm thinking of"
            );
            expect(results).toEqual([
                "A",
                " ",
                "full",
                " ",
                "commitment's",
                " ",
                "what",
                " ",
                "I'm",
                " ",
                "thinking",
                " ",
                "of",
            ]);
        });
    });

    describe("unicode", () => {
        test("japanese", () => {
            const results = tokenize("二人でdistance縮めて");
            expect(results).toEqual([
                "二",
                "人",
                "で",
                "distance",
                "縮",
                "め",
                "て",
            ]);
        });

        test("chinese", () => {
            const results = tokenize("你可以慫恿三月的悶雷");
            expect(results).toEqual([
                "你",
                "可",
                "以",
                "慫",
                "恿",
                "三",
                "月",
                "的",
                "悶",
                "雷",
            ]);
        });
    });
});
