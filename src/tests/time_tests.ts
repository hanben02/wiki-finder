import { bfs_wiki } from "../back-end/bfs";
import { head, is_null, length, List, tail } from "../back-end/lib/list";
import { is_valid_page } from "../back-end/wiki";


//array with 48 test cases
const test_cases: Array<[string, string]> = [
    ["Fish", "Tobacco"],
    ["Shakespeare", "Quantum Mechanics"],
    ["Antarctica", "Pizza"],
    ["Oxygen", "Ancient Rome"],
    ["Basketball", "Mona Lisa"],
    ["Mars", "Jazz"],
    ["Volcano", "Viking"],
    ["Electricity", "Catherine the Great"],
    ["Fibonacci Sequence", "Pyramids of Giza"],
    ["Chess", "Kangaroo"],
    ["Watermelon", "The Eiffel Tower"],
    ["Bacteria", "Skyscraper"],
    ["Coffee", "Mount Everest"],
    ["Penguin", "Louvre"],
    ["Ocean", "Einstein"],
    ["Fire", "Wright Brothers"],
    ["Lava", "Hemingway"],
    ["Bees", "Television"],
    ["Dinosaurs", "The Great Wall of China"],
    ["Guitar", "Sharks"],
    ["Cucumber", "Saturn"],
    ["Sushi", "Napoleon Bonaparte"],
    ["Meteor", "Opera"],
    ["Crocodile", "The Beatles"],
    ["Ballet", "The Moon Landing"],
    ["Autism", "Great Barrier Reef"],
    ["Science Fiction", "China"],
    ["Chocolate", "Lions"],
    ["Jazz", "Stonehenge"],
    ["Mammals", "Nuclear Reactor"],
    ["Oceans", "World War II"],
    ["Neanderthals", "Antique furniture"],
    ["Beethoven", "Google"],
    ["Hurricanes", "Machu Picchu"],
    ["Piano", "Barack Obama"],
    ["Cheetah", "Machu Picchu"],
    ["Hemingway", "Artificial Intelligence"],
    ["World War I", "Eiffel Tower"],
    ["Solar System", "Clocks"],
    ["Renaissance", "Las Vegas"],
    ["Lighthouse", "Mozart"],
    ["Dragons", "Starbucks"],
    ["Skiing", "Pyramids"],
    ["Camel", "Vladimir Putin"],
    ["Wine", "Roman Empire"],
    ["Coffee", "The Internet"],
    ["Sharks", "World Cup"],
    ["Ozone Layer", "Gandhi"]
  ];
  
/**
 * Runs test cases by finding paths between several pages
 * from an array and logs statistics to the console. 
 * @param arr an array containing tuples with strings
 * that represent the page title of start and end of paths to find,
 * by default set to an array with 48 test cases
 */
async function run_timed_tests(arr: Array<[string, string]> = test_cases): Promise<void> {
    let amnt_completed_tests = 0;
    let amnt_timedout_tests = 0;
    let accumulated_time = 0;
    let accumulated_path_len = 0;
    
    for(let i = 0; i < arr.length; i = i + 1) {
        const first = arr[i][0];
        const second = arr[i][1];
        if(!is_valid_page(first) || !is_valid_page(second)){
            console.log("Invalid start or end");
            continue;
        }
        const start_time = performance.now();
        let a: List<string>;
        try {
            a = await run_test(first, second, bfs_wiki);
        } catch {
            const end_time = performance.now();
            console.log("Did not find path in 30 seconds:\n");
            accumulated_time = accumulated_time + (end_time - start_time);
            amnt_timedout_tests = amnt_timedout_tests + 1;
            continue;
        }
        const end_time = performance.now();
        if(a === null) {
            // Some error occurred that did not cause the promise to be rejected
            continue;
        }
        console.log("Found in " + ((end_time-start_time)/1000)
            + " seconds:\n" + display_list(a) + "\n");
        accumulated_time = accumulated_time + (end_time - start_time);
        amnt_completed_tests = amnt_completed_tests + 1;
        accumulated_path_len = accumulated_path_len + length(a);
    }
    const avg_total_time =
        (accumulated_time / (amnt_timedout_tests + amnt_completed_tests))
        / 1000;
    const avg_time_completed =
        ((accumulated_time - 30000 * amnt_timedout_tests)
            / amnt_completed_tests) / 1000;
    const avg_len = accumulated_path_len / amnt_completed_tests;
    console.log("Did " + (amnt_completed_tests + amnt_timedout_tests)
        + "tests, with " + amnt_completed_tests
        + "successful and " + amnt_timedout_tests + "timed out");
    console.log("Average total search time for all tests: "
        + avg_total_time + " s");
    console.log("Average search time for successful tests: "
        + avg_time_completed + " s");
    console.log("Average length of paths found: " + avg_len + " pages");
    return;
}

// Display a list of strings as a string
function display_list(l: List<string>): string {
    let s = "list(";
    while(!is_null(l)){
        if(is_null(tail(l))) {
            s = s + head(l);
            break;
        }
        s = s + head(l) + ", ";
        l = tail(l);
    }
    return s + ")";
}

// Constrain the running time of an async function, such as a search,
// within 30 seconds (for testing purposes)
async function run_test(start: string, end: string,
    fun: (a: string, b:string) => Promise<List<string>>):
    Promise<List<string>> {
    return new Promise(async (resolve, reject) => {
        setTimeout(() => {
            reject("Timeout reached");
        }, 30000);
        resolve(await fun(start, end));
    });
}

run_timed_tests();