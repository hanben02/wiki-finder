import { head, is_null, list, List, pair, tail } from "./list";
import { empty, enqueue, head as qhead, is_empty, dequeue } from "./queue_array";
import { ph_empty, ph_insert, ph_lookup, ProbingHashtable } from "./hashtables"
import { get_links, get_links_to } from "./wiki";

/** 
 * A simple deterministic hash function for strings.
 * @copyright Modified version of a function from PKD lecture 9A.
 * @param str the string to compute a hash of
 * @returns a hash value of the given string
 */
export function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        // Constrain the hash value's growth
        // to avoid long strings all hashing to 0
        hash = (hash * 31 + str.charCodeAt(i)) % 2**45;
        if (hash >= 2**44){
            hash = hash - 2**45;
        }
    }
    return hash;
}

/**
 * Function that searches for a path between two wikipedia pages by BFS
 * The function is a modified version of the BFS implemented in PKD.
 * All page titles are assumed to be in mainspace.
 * @param initial - Title of the Wikipedia page to start from
 * @param end - Title of the Wikipedia page to search for a path to
 * @returns list of a path from initial to end or an empty list if no path was found
 */
export async function bfs_wiki(initial: string, end: string,
                               fetch_links: (page: string) => Promise<Array<string>> = get_links,
                               fetch_back_links: (page: string, n: number) => Promise<ProbingHashtable<string, boolean>> = get_links_to): Promise<List<string>> {
    if(initial === end) {
        return list(initial);
    }
    // Queue of pages to process
    const pending = empty<string>(); 
    // Hashtable of parents
    const parents = ph_empty<string, string>(100000, simpleHash);
    const end_links = await fetch_back_links(end, 1);
    if(end_links.entries === 0) {
        return list();
    }
    if(ph_lookup(end_links, initial) === true) {
        return list(initial, end);
    }
    // Visits a page by inserting it to the process queue
    // and inserting its parent to the hashtable
    function bfs_visit(parent: string): (current: string) => boolean {
        function helper(current: string) {
            if(!ph_insert(parents, current, parent)){
                return false;
            }
            enqueue(current, pending);
            return true;
        }
        return helper;
    }

    // Traces back and creates list of the found path
    function back_track(current: string | undefined): List<string> {
        let b: List<string  > = list();
        if(current !== end) {
            b = list(end);
        }
        while(current !== initial) {
            // Trace back to initial
            if(current !== undefined) {
                b = pair(current, b);
                current = ph_lookup(parents, current);
            } else {
                return list();
            }
        }
        return pair(current, b);
    }

    // Visit the initial page
    bfs_visit("")(initial);

    while (!is_empty(pending)) {
        // Get and dequeue the first page of the queue
        const current = qhead(pending);
        dequeue(pending);

        // Get all links from the page and visit each of them
        const links = await fetch_links(current);
        if(links.length === 0) {
            continue;
        }
        let found = "";
        let exit = false;
        links.map((x: string) => {
            if(ph_lookup(end_links, x) === true || x === end) {
                found = x;
            }
            if(ph_lookup(parents, x) === undefined) {
                if(!bfs_visit(current)(x)){
                    exit = true;
                }
            }
        })
        if(exit) {
            // No more space in parents
            return list();
        }
        if(found !== "") {
            // end page found
            return back_track(found);
        }
    }
    return list(); // No path was found
}

//Creates a path string from a list of strings
function list_to_path(ls: List<string>): string {
    return is_null(ls) ? "" 
                       : is_null(tail(ls))
                       ? head(ls)
                       : head(ls) + " -> " + list_to_path(tail(ls)); 
}

/**
 * Checks if two pages are valid, then attempts to find a path
 * from one to the other for a limited amount of time.
 * All page titles are assumed to be in mainspace.
 * @param start - Wikipedia page title to search from
 * @param end - Wikipedia page title to find
 * @param timeout - time to search for in milliseconds. Default is 30 seconds 
 * @returns - a string representing the found path, or some error message,
 *            if failed
 * @see {@link bfs_wiki} for information on the algorithm used
 */
export async function wiki_search(start: string, end: string, timeout: number = 30000): Promise<string> {
    if(start === end) {
        return "Start and end is equal";
    }
    const links_from = await get_links(start);
    if(links_from.length === 0) {
        return "Initial page is invalid or has no links";
    }
    const links_to = await get_links_to(end, 1);
    if(links_to.entries === 0) {
        return "End page is invalid or has no page linking to it";
    }
    let result: List<string>;
    try {
        result = await new Promise(async (resolve, reject) => {
            setTimeout(() => {
                reject("Timeout reached");
            }, timeout);
            resolve(await bfs_wiki(start, end));
        });
    }
    catch {
        return "Timeout reached"
    }
    if(result === null) {
        return "No path found";
    } else {
        return list_to_path(result);
    }
}