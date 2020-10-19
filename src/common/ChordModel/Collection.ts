// use the name of the class the ID is describing for T
// e.g. IDable<Person>
export interface IDable<T extends IDable<T>> {
    id: string;
    type: T["type"];
}

export abstract class Collection<T extends IDable<T>> {
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

    protected multiIndexOf(ids: string[]): number[] {
        return ids.map(this.indexOf);
    }

    abstract clone(): Collection<T>;

    // adds a element after the specified id
    addAfter(idable: IDable<T>, ...newElem: T[]): void {
        const indexOfBefore = this.indexOf(idable.id);
        this.elements.splice(indexOfBefore + 1, 0, ...newElem);
    }

    addBeginning(...newElem: T[]): void {
        this.elements.splice(0, 0, ...newElem);
    }

    remove(idable: IDable<T>): T {
        const index = this.indexOf(idable.id);
        const removed = this.elements.splice(index, 1);
        return removed[0];
    }

    removeMultiple(idables: IDable<T>[]): T[] {
        const removed = idables.map(
            (idable: IDable<T>): T => {
                const index = this.indexOf(idable.id);
                const removedElement = this.elements.splice(index, 1);
                return removedElement[0];
            }
        );

        return removed;
    }

    get(idable: IDable<T>): T {
        const index = this.indexOf(idable.id);
        return this.elements[index];
    }
}
