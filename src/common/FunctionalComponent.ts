import React from "react";

export type MultiFC<P> = (props: P) => React.ReactElement[];

// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/41808
// controlled cast to FC to workaround types - this is a known supported cast
// until React.FC supports returning an array of elements
export const transformToFC = <P>(multifc: MultiFC<P>): React.FC<P> => {
    return multifc as unknown as React.FC<P>;
};
