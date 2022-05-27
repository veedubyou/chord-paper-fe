import { DemoPath, SongPath } from "../paths";

describe("paths", () => {
    describe("song paths", () => {
        test("root song path", () => {
            expect(new SongPath().URL()).toEqual("/song");
        });

        describe("with ID", () => {
            test("id song path", () => {
                expect(new SongPath().withID("id-desu").URL()).toEqual(
                    "/song/id-desu"
                );
            });

            describe("with mode", () => {
                test("edit mode", () => {
                    expect(
                        new SongPath().withID("id-desu").withEditMode().URL()
                    ).toEqual("/song/id-desu/edit");
                });

                describe("play mode", () => {
                    test("root of play mode", () => {
                        expect(
                            new SongPath()
                                .withID("id-desu")
                                .withPlayMode()
                                .URL()
                        ).toEqual("/song/id-desu/play");
                    });

                    test("page view", () => {
                        expect(
                            new SongPath()
                                .withID("id-desu")
                                .withPlayMode()
                                .withPageView()
                                .URL()
                        ).toEqual("/song/id-desu/play/page");
                    });

                    test("scroll view", () => {
                        expect(
                            new SongPath()
                                .withID("id-desu")
                                .withPlayMode()
                                .withScrollView()
                                .URL()
                        ).toEqual("/song/id-desu/play/scroll");
                    });
                });
            });
        });

        describe("with new", () => {
            test("new song path", () => {
                expect(new SongPath().withNew().URL()).toEqual("/song/new");
            });

            describe("with mode", () => {
                test("edit mode", () => {
                    expect(
                        new SongPath().withNew().withEditMode().URL()
                    ).toEqual("/song/new/edit");
                });

                describe("play mode", () => {
                    test("root of play mode", () => {
                        expect(
                            new SongPath().withNew().withPlayMode().URL()
                        ).toEqual("/song/new/play");
                    });

                    test("page view", () => {
                        expect(
                            new SongPath()
                                .withNew()
                                .withPlayMode()
                                .withPageView()
                                .URL()
                        ).toEqual("/song/new/play/page");
                    });

                    test("scroll view", () => {
                        expect(
                            new SongPath()
                                .withNew()
                                .withPlayMode()
                                .withScrollView()
                                .URL()
                        ).toEqual("/song/new/play/scroll");
                    });
                });
            });
        });
    });

    describe("demo paths", () => {
        test("root song path", () => {
            expect(new DemoPath().URL()).toEqual(
                "/song/c531c0fe-6e8d-4cfe-9c5f-120e3402ccd9"
            );
        });
    });
});
