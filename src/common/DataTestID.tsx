export interface DataTestID {
    "data-testid": string;
}

export const generateTestID = (props: DataTestID, suffix: string): string => {
    return `${props["data-testid"]}-${suffix}`;
};
