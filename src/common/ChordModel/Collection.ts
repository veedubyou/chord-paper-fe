import { List } from "immutable";

// use the name of the class the ID is describing for T
// e.g. IDable<Person>
export interface IDable<T extends IDable<T>> {
    readonly id: string;
    readonly type: T["type"];
}

export abstract class CollectionMethods<
    B extends CollectionMethods<B, T>,
    T extends IDable<T>
> {
    protected abstract get elements(): Collection<T>;

    abstract updateCollection(
        updater: (collection: Collection<T>) => Collection<T>
    ): B;

    getElement(
        ...params: Parameters<Collection<T>["get"]>
    ): ReturnType<Collection<T>["get"]> {
        return this.elements.get(...params);
    }

    getElementAtIndex(
        ...params: Parameters<Collection<T>["getAtIndex"]>
    ): ReturnType<Collection<T>["getAtIndex"]> {
        return this.elements.getAtIndex(...params);
    }

    setElement(...params: Parameters<Collection<T>["set"]>): B {
        return this.updateCollection((collection) => collection.set(...params));
    }

    replaceElement(...params: Parameters<Collection<T>["replace"]>): B {
        return this.updateCollection((collection) =>
            collection.replace(...params)
        );
    }

    removeElement(...params: Parameters<Collection<T>["remove"]>): B {
        return this.updateCollection((collection) =>
            collection.remove(...params)
        );
    }

    removeMultipleElements(
        ...params: Parameters<Collection<T>["removeMultiple"]>
    ): B {
        return this.updateCollection((collection) =>
            collection.removeMultiple(...params)
        );
    }

    updateElement(...params: Parameters<Collection<T>["update"]>): B {
        return this.updateCollection((collection) =>
            collection.update(...params)
        );
    }

    updateAllElements(...params: Parameters<Collection<T>["updateAll"]>): B {
        return this.updateCollection((collection) =>
            collection.updateAll(...params)
        );
    }

    addBeginning(...params: Parameters<Collection<T>["addBeginning"]>): B {
        return this.updateCollection((collection) =>
            collection.addBeginning(...params)
        );
    }

    addAfter(...params: Parameters<Collection<T>["addAfter"]>): B {
        return this.updateCollection((collection) =>
            collection.addAfter(...params)
        );
    }
}

export class Collection<T extends IDable<T>> {
    readonly list: List<T>;

    constructor(elements?: T[] | List<T>) {
        if (elements === undefined) {
            this.list = List();
            return;
        }

        if (List.isList(elements)) {
            this.list = elements;
        } else {
            this.list = List.of(...elements);
        }
    }

    toJSON(): object {
        return this.list.toJSON();
    }

    private new(maybeNew: List<T>): Collection<T> {
        if (maybeNew === this.list) {
            return this;
        }

        return new Collection(maybeNew);
    }

    get length(): number {
        return this.list.size;
    }

    toArray(): Array<T> {
        return this.list.toArray();
    }

    transform(transformer: (list: List<T>) => List<T>): Collection<T> {
        const newList = transformer(this.list);
        return this.new(newList);
    }

    static indexOf<S extends IDable<S>>(list: List<S>, id: string): number {
        const index = list.findIndex((elem: S) => elem.id === id);

        if (index < 0) {
            throw new Error("Can't find element inside collection");
        }

        return index;
    }

    indexOf(id: string): number {
        return Collection.indexOf(this.list, id);
    }

    multiIndexOf(ids: string[]): number[] {
        return ids.map(this.indexOf);
    }

    set(...params: Parameters<List<T>["set"]>): Collection<T> {
        const newList = this.list.set(...params);
        return this.new(newList);
    }

    update(index: number, updater: (value: T) => T): Collection<T> {
        const wrappedUpdater = (value: T | undefined): T => {
            if (value === undefined) {
                throw new Error("Can't have undefined indices");
            }

            return updater(value);
        };

        const newList = this.list.update(index, wrappedUpdater);
        return this.new(newList);
    }

    updateAll(updater: (value: T, index: number) => T): Collection<T> {
        const wrappedUpdater = (value: T | undefined, index: number): T => {
            if (value === undefined) {
                throw new Error("Can't have undefined indices");
            }

            return updater(value, index);
        };

        const newList = this.list.withMutations((list) => {
            for (let i = 0; i < list.size; i++) {
                list.update(
                    i,
                    (value: T | undefined): T => wrappedUpdater(value, i)
                );
            }
        });

        return this.new(newList);
    }

    // adds a element after the specified id
    addAfter(idable: IDable<T>, ...newElem: T[]): Collection<T> {
        const indexOfBefore = this.indexOf(idable.id);
        const newList = this.list.splice(indexOfBefore + 1, 0, ...newElem);
        return this.new(newList);
    }

    addBeginning(...newElem: T[]): Collection<T> {
        const newList = this.list.splice(0, 0, ...newElem);
        return this.new(newList);
    }

    remove(idable: IDable<T>): Collection<T> {
        const index = this.indexOf(idable.id);
        const newList = this.list.splice(index, 1);
        return this.new(newList);
    }

    removeMultiple(idables: IDable<T>[]): Collection<T> {
        let list = this.list;

        idables.forEach((idable: IDable<T>) => {
            const index = Collection.indexOf(list, idable.id);
            list = list.delete(index);
        });

        return this.new(list);
    }

    splice(
        idable: IDable<T>,
        removeCount: number,
        ...newItems: T[]
    ): Collection<T> {
        const index = this.indexOf(idable.id);
        const newList = this.list.splice(index, removeCount, ...newItems);
        return this.new(newList);
    }

    replace(idable: IDable<T>, replacer: (item: T) => T): Collection<T> {
        const index = this.indexOf(idable.id);
        const updater = (item: T | undefined): T => {
            if (item === undefined) {
                throw new Error(
                    "Item can't be undefined because index is valid"
                );
            }

            return replacer(item);
        };

        const newList = this.list.update(index, updater);
        return this.new(newList);
    }

    forEach(...params: Parameters<List<T>["forEach"]>): void {
        this.list.forEach(...params);
    }

    get(idable: IDable<T>): T {
        const index = this.indexOf(idable.id);
        const item = this.list.get(index);
        if (item === undefined) {
            throw new Error("Index found but item not in list");
        }

        return item;
    }

    getAtIndex(index: number): T {
        const item = this.list.get(index);
        if (item === undefined) {
            throw new Error("Item not in list");
        }

        return item;
    }
}
