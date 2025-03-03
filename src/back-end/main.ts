import { bfs_wiki } from "./bfs";
import { head, is_null, list, List, tail } from "./list";

export default async function wiki_finder(start: string, end: string, options: Array<string>): Promise<string> {
    const result = await bfs_wiki(start, end); 
    return list_to_path(result);
}
function list_to_path(ls: List<string>): string {
    return is_null(ls) ? "" 
                       : is_null(tail(ls))
                       ? head(ls)
                       : head(ls) + " -> " + list_to_path(tail(ls)); 
}