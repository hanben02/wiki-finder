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
 * Function to get up to 500 leading to a page by calling the wikipedia API
 * @precondition - n >= 1
 * @param page - page title to get links from
 * @param n - number of maximum api requests to make,
 *            each request giving a maximum of 500 links,
 *            function will fetch links n times or until every link
 *            has been fetched.
 * @returns Array of links to page, the array is empty if 
 *          no links exist or page does not exist
 */
export async function get_links_to(page: string, n: number) {
    page = page.replace('&', "%26").replace('?', "%3f");
    try {
        const link = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=linkshere&lhlimit=max&lhnamespace=0&origin=*&titles="+page;
        const request = await fetch(link);
        const result: Array<string> = [];
        let current = await request.json();
        let arr: Array<{ns: number, title: string}> = current.query.pages[Object.keys(current.query.pages)[0]].linkshere;
        arr.forEach(x => result.push(x.title));
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
            arr.forEach(x => result.push(x.title));
            continue_string = current.continue?.continue;
            i = i - 1;
        }
        return result;
        
    } catch(error) {
        return Promise.resolve([]);
    }
}

export async function is_valid_page(page: string): Promise<boolean> {
    try {
        const link = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=links&pllimit=1&plnamespace=0&origin=*&titles=" + page;
        const request = await fetch(link);
        const data = await request.json();
        return data.query.pages[Object.keys(data.query.pages)[0]].links.length === 1;

    } catch {
        return false;
    }
}