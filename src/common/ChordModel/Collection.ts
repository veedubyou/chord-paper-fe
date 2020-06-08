// use the name of the class the ID is describing for T
// e.g. IDable<"Person">
export interface IDable<T extends string> {
    id: string;
    type: T;
}

export const stringifyIgnoreID = (obj: unknown): string => {
    return JSON.stringify(obj, (key: string, value: string) => {
        if (key === "id") {
            return undefined;
        }

        return value;
    });
};

export abstract class Collection<T extends IDable<U>, U extends string> {
    elements: T[];

    constructor(elements?: T[]) {
        if (elements !== undefined) {
            this.elements = elements; //TODO: consider whether this needs to be a shallow copy
        } else {
            this.elements = [];
        }
    }

    protected indexOf(id: string): number {
        const index = this.elements.findIndex((elem: T) => elem.id === id);

        if (index < 0) {
            throw new Error("Can't find element inside collection");
        }

        return index;
    }

    abstract clone(): Collection<T, U>;

    // adds a element after the specified id
    addAfter(idable: IDable<U>, ...newElem: T[]): void {
        const indexOfBefore = this.indexOf(idable.id);
        this.elements.splice(indexOfBefore + 1, 0, ...newElem);
    }

    remove(idable: IDable<U>): T {
        const index = this.indexOf(idable.id);
        const removed = this.elements.splice(index, 1);
        return removed[0];
    }
}
