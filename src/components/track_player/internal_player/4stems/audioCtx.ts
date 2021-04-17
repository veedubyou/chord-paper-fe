let audioCtx: AudioContext | null = null;

export const getAudioCtx = (): AudioContext => {
    if (audioCtx === null) {
        audioCtx = new window.AudioContext();
    }

    return audioCtx;
};
