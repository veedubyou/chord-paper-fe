import { isLeft } from "fp-ts/lib/Either";
import { ProviderContext } from "notistack";
import { ChordSong } from "../../../common/ChordModel/ChordSong";

type EnqueueSnackbarType = ProviderContext["enqueueSnackbar"];

const createFilePickerHandler = (
    onLoad: (song: ChordSong) => void,
    enqueueSnackbar: EnqueueSnackbarType
) => {
    return function (this: HTMLInputElement) {
        const fileList = this.files;
        if (fileList === null) {
            return;
        }

        if (fileList.length > 1) {
            enqueueSnackbar("Multiple files selected, only one file expected", {
                variant: "error",
            });
            return;
        }

        const file = fileList.item(0);
        if (file === null) {
            enqueueSnackbar("Could not retrieve file from file dialog", {
                variant: "error",
            });
            return;
        }

        const fileReader = new FileReader();
        fileReader.onload = (ev: ProgressEvent<FileReader>) => {
            if (
                ev.target === null ||
                ev.target.result === null ||
                ev.target.result instanceof ArrayBuffer
            ) {
                return;
            }

            const results = ChordSong.deserialize(ev.target.result);
            if (isLeft(results)) {
                enqueueSnackbar(
                    "Can't load file, Song file failed validation",
                    {
                        variant: "error",
                    }
                );
                return;
            }

            onLoad(results.right);
        };

        fileReader.readAsText(file);
    };
};

export const useLoadMenuAction = (
    onLoad: (song: ChordSong) => void,
    enqueueSnackbar: EnqueueSnackbarType
) => {
    return () => {
        const inputElem: HTMLInputElement = document.createElement("input");
        inputElem.type = "file";

        const filePickerHandler = createFilePickerHandler(
            onLoad,
            enqueueSnackbar
        );
        inputElem.addEventListener("change", filePickerHandler);

        inputElem.click();
    };
};
