import { bfs_wiki, wiki_search } from "./bfs";
import { time_paths } from "./time_tests";
import { get_links_to } from "./wiki";

export default function wiki_finder(start: string, end: string, options: Array<string>): Promise<string> {
    //const result = wiki_search(start, end);
    //return result;
    time_paths(bfs_wiki, 5);
    return Promise.resolve("");
}
