import { IDable, Collection } from "../Collection";

describe("Collection", () => {
    class Item implements IDable<"Item"> {
        id: string;
        type: "Item";
        value: string;

        constructor(id: string, value: string) {
            this.id = id;
            this.value = value;
            this.type = "Item";
        }
    }

    class ItemCollection extends Collection<Item, "Item"> {
        clone(): ItemCollection {
            return new ItemCollection(this.elements);
        }
    }

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
        expect(c.elements).toEqual(testItems());
    });

    test("clear", () => {
        c.clear();
        expect(c.elements).toEqual([]);
    });

    test("remove", () => {
        c.remove({ id: "2", type: "Item" });
        expect(c.elements).toEqual([new Item("1", "a"), new Item("3", "c")]);
    });

    test("addAfter", () => {
        c.addAfter({ id: "1", type: "Item" }, new Item("4", "d"));
        expect(c.elements).toEqual([
            new Item("1", "a"),
            new Item("4", "d"),
            new Item("2", "b"),
            new Item("3", "c"),
        ]);
    });

    test("push", () => {
        c.push(new Item("4", "d"));
        expect(c.elements).toEqual([
            new Item("1", "a"),
            new Item("2", "b"),
            new Item("3", "c"),
            new Item("4", "d"),
        ]);
    });

    test("modify", () => {
        c.modify({ id: "2", type: "Item" }, new Item("2", "d"));
        expect(c.elements).toEqual([
            new Item("1", "a"),
            new Item("2", "d"),
            new Item("3", "c"),
        ]);
    });
});
