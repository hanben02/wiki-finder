import { simpleHash } from "./bfs";
import { ph_empty, ph_insert, ProbingHashtable } from "./lib/hashtables";

/**
 * Get up to 500 outgoing links from a Wikipedia page
 * by calling the MediaWiki API
 * @param page - page title to get links from
 * @returns an array of links from the page, or an empty array if 
 *          no links exist or the page does not exist
 */
export async function get_links(page: string): Promise<Array<string>> {
    page = page.replace('&', "%26").replace('?', "%3f");
    try {
        const link = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=links&pllimit=500&plnamespace=0&origin=*&titles="+page;
        const request = await fetch(link);
        const data = await request.json();

        const process: Array<{ns: number, title: string}> = data.query.pages[Object.keys(data.query.pages)[0]].links;
        const titles = process.map(x => x.title);
        return titles;
    } catch {
        return Promise.resolve([]);
    }
}



/**
 * Get up to a given number of links to a Wikipedia page
 * (so-called <i>backlinks</i>) by calling the MediaWiki API.
 * Backlinks are fetched in batches of 500.
 * @precondition n >= 1
 * @param page page title to get links from
 * @param n maximum number of API requests to make
 * (maximum number of batches of backlinks)
 * @returns a hashtable of page titles of links as keys,
 * and a boolean as value (which is always true)
 */
export async function get_links_to(page: string, n: number): Promise<ProbingHashtable<string, true>> {
    // '&' and '?' are allowed in page titles,
    // but they interfere with HTTP request URLs and must be escaped
    page = page.replace('&', "%26").replace('?', "%3f");
    const result: ProbingHashtable<string, true> = ph_empty(500*n, simpleHash);
    try {
        const link = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=linkshere&lhlimit=max&lhnamespace=0&origin=*&titles="+page;
        const request = await fetch(link);
        let current = await request.json();
        let arr: Array<{ns: number, title: string}> = current.query.pages[Object.keys(current.query.pages)[0]].linkshere;
        if(arr.length === 0) {
            return result;
        }
        arr.forEach(x => ph_insert(result, x.title, true));
        let i = n - 1;
        let continue_string = current.continue?.continue;
        while(continue_string === "||") {
            if(i <= 0) {
                break;
            }
            const new_link = link + "&lhcontinue=" + current.continue.lhcontinue;
            const new_request = await fetch(new_link);
            current = await new_request.json();
            arr = current.query.pages[Object.keys(current.query.pages)[0]].linkshere;
            arr.forEach(x => ph_insert(result, x.title, true));
            continue_string = current.continue?.continue;
            i = i - 1;
        }
        return result;
        
    } catch(error) {
        setTimeout(() => {
           get_links_to(page, n); 
        }, 1000);
        return result;
    }
}
/**
 * Checks if a wikipedia page has outgoing links by calling the API.
 * Invalid and nonexistent page titles are treated as not having links.
 * @example
 * await is_valid_page("Ginger"); // true
 * await is_valid_page("[0]") // false, as '[' and ']' are invalid in titles
 * @param page - page title to check
 * @returns whether the page has outgoing links
 */
export async function is_valid_page(page: string): Promise<boolean> {
    try {
        const link = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=links&pllimit=1&plnamespace=0&origin=*&titles=" + page;
        const request = await fetch(link);
        const data = await request.json();
        return data.query.pages[Object.keys(data.query.pages)[0]].links.length >= 1;
    } catch {
        return false;
    }
}