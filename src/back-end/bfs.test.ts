import { bfs_wiki, simpleHash } from "./bfs"
import { ph_empty, ph_insert, ProbingHashtable } from "./hashtables";
import { length, list } from "./list";

//function that returns a function that "mimics" getting links
// from wikipedia API to use in BFS function to use with test graphs
const get_adjacent_nodes = (graph: Array<Array<string>>) => 
                           ((s: string, _: number = 0) => parseInt(s) < graph.length && parseInt(s) >= 0
                                                          ? Promise.resolve(graph[parseInt(s)])
                                                          : Promise.resolve([]));
                                                          
//function that returns a function that "mimics" getting links leading to
//a page from wikipedia API to use in BFS function to use with test graphs
const adjacent_nodes_to_ht = (graph: Array<Array<string>>) => ((s: string, _: number = 0) => {
    const ht: ProbingHashtable<string, boolean> = ph_empty(10, simpleHash);
    let result = null
    if(parseInt(s) < graph.length && parseInt(s) >= 0) {
        graph[parseInt(s)].forEach((x: string) => ph_insert(ht, x, true))
    }
    return Promise.resolve(result);
});
test("Directly linked pages", async () => {
    const links = [["1", "2", "3"], ["3"], ["3"], []]; 
    const backlinks = [[], ["0"], ["0"], ["0", "1", "2"]];
    expect(await bfs_wiki("0", "1", 
                    get_adjacent_nodes(links),
                    adjacent_nodes_to_ht(backlinks))).toStrictEqual(list("0", "1"));
    expect(await bfs_wiki("2", "3", 
                    get_adjacent_nodes(links),
                    adjacent_nodes_to_ht(backlinks))).toStrictEqual(list("2", "3"));
    expect(await bfs_wiki("0", "3", 
                    get_adjacent_nodes(links),
                    adjacent_nodes_to_ht(backlinks))).toStrictEqual(list("0", "3"));
});

test("No path exists", async () => {
    const links = [["0", "1", "2"], ["2"], ["0", "1"], ["4"], ["3"]];
    const backlinks = [["2"], ["0", "2"], ["0", "1"], ["4"], ["3"]];
    expect(await bfs_wiki("0", "4", get_adjacent_nodes(links),
                          adjacent_nodes_to_ht(backlinks)
    )).toBe(list());

    expect(await bfs_wiki("4", "0", get_adjacent_nodes(links),
                          adjacent_nodes_to_ht(backlinks)
    )).toBe(list());

    expect(await bfs_wiki("2", "3", get_adjacent_nodes(links),
                          adjacent_nodes_to_ht(backlinks)
    )).toBe(list());
});

test("Start and initial are equal", async () => {
    const links = [["0", "1", "2"], ["2"], ["0", "1"], ["4"], ["3"]];
    const backlinks = [["2"], ["0", "2"], ["0", "1"], ["4"], ["3"]];
    expect(await bfs_wiki("0", "0", get_adjacent_nodes(links),
                          adjacent_nodes_to_ht(backlinks)
    )).toStrictEqual(list("0"));

    expect(await bfs_wiki("1", "1", get_adjacent_nodes(links),
                          adjacent_nodes_to_ht(backlinks)
    )).toStrictEqual(list("1"));

    expect(await bfs_wiki("2", "2", get_adjacent_nodes(links),
                          adjacent_nodes_to_ht(backlinks)
    )).toStrictEqual(list("2"));
});

test("Invalid pages", async () => {
    const links = [["0", "1", "2"], ["2"], ["0", "1"], ["4"], ["3"]];
    const backlinks = [["2"], ["0", "2"], ["0", "1"], ["4"], ["3"]]; 
    expect(await bfs_wiki("5", "0", get_adjacent_nodes(links),
                          adjacent_nodes_to_ht(backlinks)
    )).toBe(list());
    expect(await bfs_wiki("0", "5", get_adjacent_nodes(links),
                          adjacent_nodes_to_ht(backlinks)
    )).toBe(list());
    expect(await bfs_wiki("5", "6", get_adjacent_nodes(links),
                          adjacent_nodes_to_ht(backlinks)
    )).toBe(list());
});

