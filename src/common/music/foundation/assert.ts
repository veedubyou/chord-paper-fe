export const assertFound = (index: number) => {
    if (index === -1) {
        throw new Error("Thing that should be found is not found");
    }
};
