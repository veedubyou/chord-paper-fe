// use the name of the class the ID is describing for T
// e.g. IDable<"Person">
export interface IDable<T extends string> {
    id: string;
    type: T;
}

export abstract class Collection<T extends IDable<U>, U extends string> {
    elements: T[];

    constructor(elements?: T[]) {
        if (elements !== undefined) {
            this.elements = elements; //TODO: consider whether this needs to be a shallow copy
        } else {
            this.elements = [];
        }
    }

    private indexOf(id: string): number {
        const index = this.elements.findIndex((elem: T) => elem.id === id);

        if (index < 0) {
            throw new Error("Can't find element inside collection");
        }

        return index;
    }

    abstract clone(): Collection<T, U>;

    push(newElem: T): void {
        this.elements.push(newElem);
    }

    // adds a element after the specified id
    addAfter(idable: IDable<U>, newElem: T): void {
        const indexOfBefore = this.indexOf(idable.id);
        this.elements.splice(indexOfBefore + 1, 0, newElem);
    }

    remove(idable: IDable<U>): T {
        const index = this.indexOf(idable.id);
        const removed = this.elements.splice(index, 1);
        return removed[0];
    }

    clear(): void {
        this.elements = [];
    }

    modify(idable: IDable<U>, replacementElem: T): void {
        if (idable.id !== replacementElem.id) {
            throw new Error("Unexpected id mismatch");
        }

        const index = this.indexOf(idable.id);
        this.elements[index] = replacementElem;
    }
}
