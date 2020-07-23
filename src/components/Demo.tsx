import { Either, isLeft } from "fp-ts/lib/Either";
import React from "react";
import NeverGonnaGiveYouPlasticLove from "../assets/songs/never_gonna_give_you_up_plastic_love.json";
import { ChordSong } from "../common/ChordModel/ChordSong";
import ErrorPage from "./display/ErrorPage";
import SongRouter from "./SongRouter";
import { withSongContext } from "./WithSongContext";

interface DemoProps {
    basePath: string;
}

const DemoSong = withSongContext(SongRouter);

const Demo: React.FC<DemoProps> = (props: DemoProps): JSX.Element => {
    const loadSongResults: Either<Error, ChordSong> = ChordSong.fromJSONObject(
        NeverGonnaGiveYouPlasticLove
    );

    if (isLeft(loadSongResults)) {
        return <ErrorPage />;
    }

    const song = loadSongResults.right;

    return <DemoSong basePath={props.basePath} song={song} />;
};

export default Demo;
