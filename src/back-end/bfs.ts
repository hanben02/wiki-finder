import { filter, for_each, head, is_null, list, List, pair, tail } from "./list";
import { empty, enqueue, head as qhead, is_empty, dequeue } from "./queue_array";
import { ph_empty, ph_insert, ph_lookup } from "./hashtables"
import { get_links, get_links_manual, get_links_to, get_page, is_valid_page } from "./wiki";

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
    // if(!(await is_valid_page(initial)) || !(await is_valid_page(end))) {
        // console.log("Start or end page could not be found");
        // return list();
    // }
    const pending = empty<string>(); //Queue of pages to process
    const parents = ph_empty<string, string>(250000, simpleHash); //hashtable of parents
    const endings = ph_empty<string, boolean>(550, simpleHash); 

    const end_links = await get_links_to(end);
    end_links.forEach(x => ph_insert(endings, x, true));
    if(ph_lookup(endings, initial) === true) {
        return list(initial, end);
    }
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
        if(current !== end) {
            b = list(end);
        }
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
            if(ph_lookup(endings, x) === true || x === end) {
                found = x;
            }
            if(ph_lookup(parents, x) === undefined) {
                if(!bfs_visit(current)(x)){
                    exit = true;
                }
            }
        })
        if(exit) {
            console.log("ht full");
            return list();
        }
        if(found !== "") {
            return back_track(found);
        }
    }
    console.log("ran out of queue")
    return list(); //no path was found
}

function list_to_path(ls: List<string>): string {
    return is_null(ls) ? "" 
                       : is_null(tail(ls))
                       ? head(ls)
                       : head(ls) + " -> " + list_to_path(tail(ls)); 
}

export async function wiki_search(start: string, end: string): Promise<string> {
    if(start === end) {
        return "Start and end is equal";
    }
    const links_from = await get_links_manual(start);
    if(links_from.length === 0) {
        return "Initial page is invalid or has no links";
    }
    const links_to = await get_links_to(end);
    if(links_to.length === 0) {
        return "End page is invalid or has no page linking to it";
    }
    const result = await bfs_wiki(start, end);
    if(result === null) {
        return "No page found";
    } else {
        return list_to_path(result);
    }
}