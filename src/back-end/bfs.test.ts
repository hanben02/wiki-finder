import { bfs_wiki } from "./bfs"
import { list } from "./list";


test("Search from and to invalid page", async () => {
    expect(await bfs_wiki("asdfsdafsadf" , "asdfsdafsadf")).toBe(null);
    expect(await bfs_wiki("Sweden" , "asdfsdafsadf")).toBe(null);
    expect(await bfs_wiki("asdfsdafsadf" , "Sweden")).toBe(null);
});

test("Start and end page are equal", async () => {
    expect(await bfs_wiki("Sweden", "Sweden")).toStrictEqual(list("Sweden"));
});

test("One page apart", async () => {
    expect(await bfs_wiki("Sweden" , "Norway")).toStrictEqual(list("Sweden", "Norway"));
    expect(await bfs_wiki("Sweden" , "Norway")).toStrictEqual(list("Sweden", "Nordic countries"));
    expect(await bfs_wiki("Sweden" , "Norway")).toStrictEqual(list("Sweden", "Denmark"));
});