import { simpleHash } from "./bfs";
import { ph_empty, ph_insert, ProbingHashtable } from "./lib/hashtables";

/**
 * Function to get up to 500 from a page by calling the wikipedia API
 * @param page - page title to get links from
 * @returns Array of links of page, the array is empty if 
 *          no links exist or page does not exist
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
 * Function to get links to a page by calling the wikipedia API,
 * number of maximum api calls can be changed
 * @precondition - n >= 1
 * @param page - page title to get links from
 * @param n - number of maximum api requests to make,
 *            each request giving a maximum of 500 links,
 *            function will fetch links n times or until every link
 *            has been fetched.
 * @returns Hashtable of page titles of links as keys, and a boolean as value (which is always true)
 */
export async function get_links_to(page: string, n: number): Promise<ProbingHashtable<string,boolean>> {
    page = page.replace('&', "%26").replace('?', "%3f");
    const result: ProbingHashtable<string, boolean> = ph_empty(500*n, simpleHash);
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
 * Checks if a wikipedia page is valid by calling the API
 * @param page - page title to check
 * @returns True if page is valid, false otherwise
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