import { Lyric } from "../Lyric";

describe("lyric tokenizer", () => {
    const rawStringGetter = (rawString: string): string => {
        return rawString;
    };

    describe("append", () => {
        let lyric: Lyric;
        beforeEach(() => {
            lyric = new Lyric("The rain pelted cruelly");
        });

        test("appending some content", () => {
            lyric.append(new Lyric(", the wind tore my hood"));
            expect(lyric.get(rawStringGetter)).toEqual(
                "The rain pelted cruelly, the wind tore my hood"
            );
        });

        test("appending no content", () => {
            lyric.append(new Lyric(""));
            expect(lyric.get(rawStringGetter)).toEqual(
                "The rain pelted cruelly"
            );
        });
    });

    describe("join", () => {
        test("multiple lyrics joined together", () => {
            const lyricStrs: string[] = [
                "You must trade me a treasure ",
                "That's of commensurate or greater value ",
                "Than the suggested retail price ",
                "Of this mystical ancient antique",
            ];

            const lyrics: Lyric[] = lyricStrs.map(
                (rawStr: string) => new Lyric(rawStr)
            );

            const joinedLyric = Lyric.join(lyrics, "");
            expect(joinedLyric.get(rawStringGetter)).toEqual(
                "You must trade me a treasure That's of commensurate or greater value Than the suggested retail price Of this mystical ancient antique"
            );
        });
    });

    describe("isEntirelySpace", () => {
        test("single whitespace", () => {
            expect(new Lyric(" ").isEntirelySpace()).toEqual(true);
        });

        test("multiple whitespace", () => {
            expect(new Lyric("  ").isEntirelySpace()).toEqual(true);
        });

        describe("serialized tab", () => {
            test("size 1", () => {
                expect(new Lyric("<⑴>").isEntirelySpace()).toEqual(true);
            });

            test("size 2", () => {
                expect(new Lyric("<⑵>").isEntirelySpace()).toEqual(true);
            });
        });

        test("mixed space and serialized tab", () => {
            expect(new Lyric(" <⑴>").isEntirelySpace()).toEqual(false);
        });

        test("multiple serialized tab", () => {
            expect(new Lyric("<⑵><⑵>").isEntirelySpace()).toEqual(false);
        });

        test("space mixed with letters", () => {
            expect(new Lyric(" a").isEntirelySpace()).toEqual(false);
        });

        test("serialized tab mixed with letters", () => {
            expect(new Lyric("a<⑵>").isEntirelySpace()).toEqual(false);
        });
    });

    describe("tokenize", () => {
        const tokenize = (serializedStr: string): string[] => {
            const lyric = new Lyric(serializedStr);
            const tokens = lyric.tokenize();
            return tokens.map((lyric: Lyric) => lyric.get(rawStringGetter));
        };

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

        describe("serialized tabs", () => {
            describe("broken/invalid tabs", () => {
                test("Missing starting tag", () => {
                    const results = tokenize("Never gonna give you up ⑴>");
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
                        "⑴",
                        ">",
                    ]);
                });

                test("Missing ending tag", () => {
                    const results = tokenize("Never gonna give you up <⑴");
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
                        "<",
                        "⑴",
                    ]);
                });

                test("Missing enclosed content", () => {
                    const results = tokenize("Never gonna give you up <>");
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
                        "<",
                        ">",
                    ]);
                });
            });

            test("size 1 tab", () => {
                const results = tokenize("Never gonna give you up <⑴>");
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
                    "<⑴>",
                ]);
            });

            test("size 2 tab", () => {
                const results = tokenize("Never gonna<⑵>give you up");
                expect(results).toEqual([
                    "Never",
                    " ",
                    "gonna",
                    "<⑵>",
                    "give",
                    " ",
                    "you",
                    " ",
                    "up",
                ]);
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
});
