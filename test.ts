import wiki from "wikipedia"
//use npm install to install all needed packages

//run using:
//tsc --strict test.ts
//node test.js

//get links from page as an array
function get_links(page: string) {
    return wiki.links(page, {autoSuggest: true});
}

//returns i
async function is_valid_page(page: string) {
    try {
        const a = await wiki.page(page, {autoSuggest: true});
        return true;
    } catch {
        return false;
    }
}

//get link from array of links, returns goal link if it is in the array
//otherwise returns a random link
function get_best_link(A: Array<string>, end: string) {
    if(A.includes(end)) {
        return end;
    }
    const i = Math.floor(Math.random() * A.length)
    return A[i];
}

//traverses one path until reaching goal page or n pages visited
async function traverse(S: string, end: string, n: number) {
    let current = S;
    while(current !== end) {
        if(n === 0) {
            return "**finished branch**";
        }
        const links = await get_links(current);
        const next = get_best_link(links, end);
        if(next === end) {
            return end;
        }
        if(await is_valid_page(next)){
            current = next;
            console.log(n + ")" + " Going to: " + current);
            n = n - 1;
        }
    }
    return current;
}

//Search paths from start
async function main(S: string, E: string) {
    let current = "";
    let i = 5;
    while(current !== E) {
        if(i === 0) {
            return;
        }
        console.log("");
        console.log("PATH "+ (6-i));
        console.log("---------")
        current = await traverse(S, E, 5);
        console.log("Finished branch");
        i = i - 1;
    }
    console.log("Found path from " + S + " to " + E);
}
main("The Great Wall of China", "Bluetooth");