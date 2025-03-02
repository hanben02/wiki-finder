import { ph_empty, ph_insert, ph_lookup, ProbingHashtable } from "../lib/hashtables";
import { list, List, pair } from "../lib/list";
import { get_links, get_links_manual, is_valid_page } from "./wiki";

async function get_random_link(A: Array<string>, end: string): Promise<string> {
    if(A.includes(end)) {
        return end;
    }
    while(true) {
        const i = Math.floor(Math.random() * A.length);
        if(await is_valid_page(A[i])) {
            return A[i];
        }
    }
}

//Hash function for string, taken from PKD lecture 9A
function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = hash * 31 + str.charCodeAt(i);
    }
    return hash & hash;
}

//traverses one path until reaching goal page or n pages visited
async function traverse(initial: string, end: string, parents: ProbingHashtable<string, string>): Promise<string> {
    let current = initial;
    for(let i = 0; i < 3; i = i + 1) {
        const links = await get_links_manual(current);
        const next = await get_random_link(links, end);
        if(!ph_insert(parents, next, current)){
            return "**FULL**";
        }
        if(next === end) {
            return end;
        }
        console.log("Visiting " + current);
        current = next;
    }
    return "";
}

//Search paths from start
export async function dfs_wiki(S: string, E: string): Promise<List<string>> {
    let current = "";
    const parents = ph_empty<string, string>(250000, simpleHash);
    ph_insert(parents, S, "");
    while(current !== E) {
        current = await traverse(S, E, parents);
        if(current === "**FULL**") {
            return list();
        }
    }
    return back_track(S, E, parents);
}

//Traces back and creates list of the found path
    function back_track(initial: string, current: string | undefined, parents: ProbingHashtable<string, string>): List<string> {
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