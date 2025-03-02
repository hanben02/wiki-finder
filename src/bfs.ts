import { filter, for_each, list, List, pair } from "../lib/list";
import { empty, enqueue, head as qhead, is_empty, dequeue } from "../lib/queue_array";
import { ph_empty, ph_insert, ph_lookup } from "../lib/hashtables"
import { get_links, get_links_manual, get_page, is_valid_page } from "./wiki";

//Hash function for string, taken from PKD lecture 9A
function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = hash * 31 + str.charCodeAt(i);
    }
    return hash & hash;
}

/**
 * Function that searches for a path between two wikipedia pages by BFS
 * The function is a modified version of the BFS implemented in PKD.
 * @param initial - Title to wikipedia page to look from
 * @param end - Title to wikipedia page to look for
 * @returns list of a path from initial to end or an empty list if no path was found
 */
export async function bfs_wiki(initial: string, end: string): Promise<List<string>> {

    const pending = empty<string>(); //Queue of pages to process
    const parents = ph_empty<string, string>(250000, simpleHash); //hashtable of parents

    //Visits a page by inserting it to the process queue and inserting its parent to hashtable
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

    //Traces back and creates list of the found path
    function back_track(current: string | undefined): List<string> {
        let b: List<string  > = list();
        while(current !== initial) { //trace back to initial
            if(current !== undefined) {
                b = pair(current, b);
                current = ph_lookup(parents, current);
            } else {
                return list();
            }
        }
        return pair(current, b);
    }

    //visit initial node
    bfs_visit("")(initial);

    while (!is_empty(pending)) {
        // dequeue the first page of the queue
        const current = qhead(pending);
        dequeue(pending);

        //Get all links of links of page and visit each of them
        const links = await get_links_manual(current);
        if(links.length === 0) {
            continue;
        }
        let found = "";
        let exit = false;
        links.map((x) => {
            if(x === end) {
                found = x;
            }
            if(ph_lookup(parents, x) === undefined) {
                if(!bfs_visit(current)(x)){
                    exit = true;
                }
            }
        })
        if(exit) {
            return list();
        }
        if(found !== "") {
            return back_track(found);
        }
    }
    return list(); //no path was found
}

