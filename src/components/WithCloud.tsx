import { isLeft } from "fp-ts/lib/Either";
import isOnline from "is-online";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { updateSong } from "../common/backend";
import { ChordSong } from "../common/ChordModel/ChordSong";
import { User, UserContext } from "./user/userContext";

interface SongProps {
    song: ChordSong;
    onSongChanged?: (song: ChordSong) => void;
}

let dirty: boolean = false;

export const withCloud = <P extends SongProps>(
    OriginalComponent: React.FC<P>
): React.FC<P> => {
    return (props: P): JSX.Element => {
        const user: User | null = React.useContext(UserContext);
        const { enqueueSnackbar } = useSnackbar();

        const handleSongChanged = (song: ChordSong) => {
            dirty = true;
            props.onSongChanged?.(song);
        };

        useEffect(() => {
            const shouldSave = async (song: ChordSong): Promise<boolean> => {
                return (
                    dirty &&
                    !song.isUnsaved() &&
                    song.isOwner(user) &&
                    (await isOnline())
                );
            };

            const showError = (msg: string) => {
                enqueueSnackbar(msg, {
                    variant: "error",
                });

                // set dirty back to true to try again later
                dirty = true;
            };

            const save = async (song: ChordSong) => {
                if (user === null) {
                    return;
                }

                if (!(await shouldSave(song))) {
                    return;
                }

                dirty = false;

                const result = await updateSong(song, user.google_auth_token);
                if (isLeft(result)) {
                    //TODO: expose more error detail
                    showError("Failed to auto save the song");
                    return;
                }

                const deserializeResult = ChordSong.fromJSONObject(
                    result.right
                );
                if (isLeft(deserializeResult)) {
                    showError(
                        "Song results from backend can't be deserialized"
                    );
                    return;
                }

                song.lastSavedAt = deserializeResult.right.lastSavedAt;
                props.onSongChanged?.(song);
            };

            const interval = setInterval(() => save(props.song), 10000);
            return () => clearInterval(interval);
        }, [props, user, enqueueSnackbar]);

        // https://github.com/microsoft/TypeScript/issues/35858
        const originalComponentProps = {
            ...props,
            onSongChanged: handleSongChanged,
        } as P;

        return <OriginalComponent {...originalComponentProps} />;
    };
};
