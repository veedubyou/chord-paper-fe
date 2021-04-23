import { isLeft } from "fp-ts/lib/Either";
import isOnline from "is-online";
import { useSnackbar } from "notistack";
import React, { useEffect, useRef } from "react";
import { Prompt, useHistory } from "react-router";
import { useErrorMessage } from "../common/backend/errors";
import { updateSong } from "../common/backend/requests";
import { ChordSong } from "../common/ChordModel/ChordSong";
import { SongIDModePath } from "../common/paths";
import { User, UserContext } from "./user/userContext";

interface SongProps {
    song: ChordSong;
    onSongChanged?: (song: ChordSong) => void;
}

export const withCloud = <P extends SongProps>(
    OriginalComponent: React.FC<P>
): React.FC<P> => {
    return (props: P): JSX.Element => {
        const user: User | null = React.useContext(UserContext);
        const showError = useErrorMessage();
        const { enqueueSnackbar } = useSnackbar();
        const dirtyRef = useRef(false);
        const history = useHistory();

        const handleSongChanged = (song: ChordSong) => {
            dirtyRef.current = true;
            props.onSongChanged?.(song);
        };

        useEffect(() => {
            const unloadMessageFn = (event: Event) => {
                if (dirtyRef.current) {
                    event.preventDefault();
                    event.returnValue = true;
                }
            };

            window.addEventListener("beforeunload", unloadMessageFn);

            return () =>
                window.removeEventListener("beforeunload", unloadMessageFn);
        }, []);

        useEffect(() => {
            const shouldSave = async (song: ChordSong): Promise<boolean> => {
                return (
                    dirtyRef.current &&
                    !song.isUnsaved() &&
                    song.isOwner(user) &&
                    (await isOnline())
                );
            };

            const handleError = async (error: Error | string) => {
                if (typeof error === "string") {
                    enqueueSnackbar(error, { variant: "error" });
                } else {
                    await showError(error);
                }
                // set dirty back to true to try again later
                dirtyRef.current = true;
            };

            const saveIfChanged = async (song: ChordSong) => {
                if (user === null) {
                    return;
                }

                if (!(await shouldSave(song))) {
                    return;
                }

                await save(user, song);
            };

            const save = async (user: User, song: ChordSong) => {
                const result = await updateSong(song, user.authToken);
                if (isLeft(result)) {
                    await handleError(result.left);
                    return;
                }

                dirtyRef.current = false;

                const deserializeResult = ChordSong.fromJSONObject(
                    result.right
                );
                if (isLeft(deserializeResult)) {
                    await handleError(
                        "Song results from backend can't be deserialized"
                    );
                    return;
                }

                song.lastSavedAt = deserializeResult.right.lastSavedAt;
                props.onSongChanged?.(song);
            };

            const interval = setInterval(
                () => saveIfChanged(props.song),
                10000
            );
            return () => clearInterval(interval);
        }, [props, user, enqueueSnackbar, showError, dirtyRef]);

        // https://github.com/microsoft/TypeScript/issues/35858
        const originalComponentProps = {
            ...props,
            onSongChanged: handleSongChanged,
        } as P;

        const showLeavingPrompt = () => {
            if (
                dirtyRef.current &&
                SongIDModePath.isEditMode(history.location.pathname)
            ) {
                return "This page is asking you to confirm that you want to leave - data you have entered may not be saved.";
            }

            return true;
        };

        return (
            <>
                <Prompt message={showLeavingPrompt} />
                <OriginalComponent {...originalComponentProps} />
            </>
        );
    };
};
