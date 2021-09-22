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
                        new SongPath().withID("id-desu").withMode("edit").URL()
                    ).toEqual("/song/id-desu/edit");
                });

                test("play mode", () => {
                    expect(
                        new SongPath().withID("id-desu").withMode("play").URL()
                    ).toEqual("/song/id-desu/play");
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
                        new SongPath().withNew().withMode("edit").URL()
                    ).toEqual("/song/new/edit");
                });

                test("play mode", () => {
                    expect(
                        new SongPath().withNew().withMode("play").URL()
                    ).toEqual("/song/new/play");
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
