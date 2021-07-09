import { IDable, Collection } from "../Collection";

describe("Collection", () => {
    class Item implements IDable<Item> {
        id: string;
        type: "Item";
        value: string;

        constructor(id: string, value: string) {
            this.id = id;
            this.value = value;
            this.type = "Item";
        }
    }

    class ItemCollection extends Collection<Item> {}

    const testItems = () => [
        new Item("1", "a"),
        new Item("2", "b"),
        new Item("3", "c"),
    ];

    let c: ItemCollection;
    beforeEach(() => {
        c = new ItemCollection(testItems());
    });

    test("constructor", () => {
        expect(c.list.toJS()).toEqual(testItems());
    });

    test("remove", () => {
        c = c.remove({ id: "2", type: "Item" });
        expect(c.list.toJS()).toEqual([new Item("1", "a"), new Item("3", "c")]);
    });

    test("removeMultiple", () => {
        c = c.removeMultiple([
            { id: "2", type: "Item" },
            { id: "3", type: "Item" },
        ]);
        expect(c.list.toJS()).toEqual([new Item("1", "a")]);
    });

    test("replace", () => {
        c = c.replace({ id: "2", type: "Item" }, () => {
            return { id: "2", value: "d", type: "Item" };
        });
        expect(c.list.toJS()).toEqual([
            new Item("1", "a"),
            new Item("2", "d"),
            new Item("3", "c"),
        ]);
    });

    test("update", () => {
        c = c.update(2, (item) => {
            item.value += " updated";
            return item;
        });
        expect(c.list.toJS()).toEqual([
            new Item("1", "a"),
            new Item("2", "b"),
            new Item("3", "c updated"),
        ]);
    });

    test("updateAll", () => {
        c = c.updateAll((item) => {
            item.value += " updated";
            return item;
        });
        expect(c.list.toJS()).toEqual([
            new Item("1", "a updated"),
            new Item("2", "b updated"),
            new Item("3", "c updated"),
        ]);
    });

    test("addAfter", () => {
        c = c.addAfter({ id: "1", type: "Item" }, new Item("4", "d"));
        expect(c.list.toJS()).toEqual([
            new Item("1", "a"),
            new Item("4", "d"),
            new Item("2", "b"),
            new Item("3", "c"),
        ]);
    });

    test("addBeginning", () => {
        c = c.addBeginning(new Item("4", "d"));
        expect(c.list.toJS()).toEqual([
            new Item("4", "d"),
            new Item("1", "a"),
            new Item("2", "b"),
            new Item("3", "c"),
        ]);
    });
});
