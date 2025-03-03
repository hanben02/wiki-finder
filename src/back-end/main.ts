import { wiki_search } from "./bfs";

export default function wiki_finder(start: string, end: string, options: Array<string>): Promise<string> {
    const result = wiki_search(start, end);
    return result;
}
