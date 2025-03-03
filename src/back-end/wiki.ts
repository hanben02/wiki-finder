import wiki, { Page } from "wikipedia";


/**
 * Function to get up to 500 from a page by calling the wikipedia API
 * @param page - page title to get links from
 * @returns Array of links of page, the array is empty if 
 *          no links exist or page does not exist
 */
export async function get_links_manual(page: string): Promise<Array<string>> {
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
 * Function to get up to 500 from a page using wikipedia API module
 * @param page - page title to get links from
 * @returns Array of links of page, the array is empty if 
 *          no links exist or page does not exist
 */
export async function get_links(page: string): Promise<Array<string>> {
    try{
        const a = await wiki.links(page, {autoSuggest: true, limit: 700, redirect: true});
        return a
    } catch {
        return Promise.resolve([]);
    }
}

/**
 * Function to get page information from a page title using wikipedia API module
 * @param page - page title to get links from
 * @returns a Page object with information of a
 *          page if the page exists, undefined otherwise
 */
export async function get_page(page: string): Promise<Page | undefined> {
    try{
        const a = await wiki.page(page, {autoSuggest: true, redirect: true});
        return a
    } catch { }
}

/**
 * Function to check if a page exists
 * @param page - page title to get links from
 * @returns true if page exists, false otherwise
 */
export async function is_valid_page(page: string): Promise<boolean> {
    try {
        const a = await wiki.page(page, {autoSuggest: true});
        return true;
    } catch {
        return false;
    }
}


/**
 * Function to get up to 500 leading to a page by calling the wikipedia API
 * @param page - page title to get links from
 * @returns Array of links to page, the array is empty if 
 *          no links exist or page does not exist
 */
export async function get_links_to(page: string) {
    page = page.replace('&', "%26").replace('?', "%3f");
    try {
        const link = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=linkshere&lhlimit=max&lhnamespace=0&origin=*&titles="+page;
        const request = await fetch(link);
        const data = await request.json();
        const process: Array<{ns: number, title: string}> = data.query.pages[Object.keys(data.query.pages)[0]].linkshere;
        const titles = process.map(x => x.title);
        return titles;
    } catch(error) {
        console.log(error);
        return Promise.resolve([]);
    }
}

export async function get_link_text(from: string, page: string): Promise<string> {
    const formatted = from.replace('&', "%26").replace('?', "%3f");
    const link = "https://en.wikipedia.org/w/api.php?action=parse&prop=text&format=json&origin=*&page=" + formatted;
    try {
        const request = await fetch(link);
        const data = await request.json();
        const html: string = data.parse.text["*"];
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const links = doc.querySelectorAll('a[href^="/wiki/"]');
        let result = page;
        links.forEach(link => {
            const title = link.getAttribute("title");
            if(title === page) {
                const text = link.textContent;
                if(!(text === null)) {
                    result = text;
                }
            }
        })
        console.log(result);
        return result;

    } catch {
        return page;
    }
}