import { isLeft } from "fp-ts/lib/Either";
import isOnline from "is-online";
import { useSnackbar } from "notistack";
import React, { useCallback, useEffect, useRef } from "react";
import { Prompt, useHistory } from "react-router";
import { useErrorMessage } from "../common/backend/errors";
import { updateSong } from "../common/backend/requests";
import { ChordSong } from "../common/ChordModel/ChordSong";
import { SongIDModePath } from "../common/paths";
import { User, UserContext } from "./user/userContext";

const saveInterval = 10000;

export const useCloud = (): [() => void, (song: ChordSong) => JSX.Element] => {
    const dirtyRef = useRef(false);

    const handleSongChanged = useCallback(() => {
        dirtyRef.current = true;
    }, []);

    const useSave = (song: ChordSong): JSX.Element => {
        const user: User | null = React.useContext(UserContext);
        const showError = useErrorMessage();
        const { enqueueSnackbar } = useSnackbar();
        const history = useHistory();

        const shouldSave = useCallback(
            (newSong: ChordSong): boolean => {
                return (
                    dirtyRef.current &&
                    !newSong.isUnsaved() &&
                    newSong.isOwner(user)
                );
            },
            [user]
        );

        useEffect(() => {
            const handleError = async (error: Error | string) => {
                if (typeof error === "string") {
                    enqueueSnackbar(error, { variant: "error" });
                } else {
                    await showError(error);
                }
                // set dirty back to true to try again later
                dirtyRef.current = true;
            };

            const save = async (user: User, newSong: ChordSong) => {
                const result = await updateSong(newSong, user.authToken);
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

                //TODO: how to update song before dispatch is finished? hook?
                newSong.lastSavedAt = deserializeResult.right.lastSavedAt;
            };

            const saveIfChanged = async (newSong: ChordSong) => {
                if (user === null) {
                    return;
                }

                if (!(await isOnline())) {
                    return;
                }

                if (!shouldSave(newSong)) {
                    return;
                }

                await save(user, newSong);
            };

            const interval = setInterval(
                () => saveIfChanged(song),
                saveInterval
            );
            return () => clearInterval(interval);
        }, [song, user, enqueueSnackbar, showError, shouldSave]);

        useEffect(() => {
            const unloadMessageFn = (event: Event) => {
                if (shouldSave(song)) {
                    event.preventDefault();
                    event.returnValue = true;
                }
            };

            window.addEventListener("beforeunload", unloadMessageFn);

            return () =>
                window.removeEventListener("beforeunload", unloadMessageFn);
        }, [song, shouldSave]);

        const showLeavingPrompt = () => {
            if (
                shouldSave(song) &&
                SongIDModePath.isEditMode(history.location.pathname)
            ) {
                return "This page is asking you to confirm that you want to leave - data you have entered may not be saved.";
            }

            return true;
        };

        return <Prompt message={showLeavingPrompt} />;
    };

    return [handleSongChanged, useSave];
};
