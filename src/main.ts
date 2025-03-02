import { bfs_wiki } from "./bfs";
import { dfs_wiki } from "./dfs";
import { time_two_apart } from "../test/time_tests";


async function main(){
    //const a = await bfs_wiki("Information", "Newspaper", get_links);
    time_two_apart(dfs_wiki);
    //time_two_apart(bfs_wiki);
    //console.log(a);
}
main();


