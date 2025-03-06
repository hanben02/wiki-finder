import { head, is_null, length, List, tail } from "./list";
import { is_valid_page } from "./wiki";

//These arrays contain data from https://en.wikipedia.org/wiki/Wikipedia:Six_degrees_of_Wikipedia#Three-degree_chains
const one_aprt: Array<[string, string]> = [
    ["Nuclear fusion", "Godzilla"], //19
    ["Colt Single Action Army", "American Dream"], //4
    ["Cobalt", "Sonic the Hedgehog (character)"], //27
    ["Emoji", "World War II"], //5
    ["Touhou Project", "Hecate"], //
    ["xkcd", "IP address"], //2
    ["Trojan.Win32.DNSChanger", "Digital rights management"], //1
    ["Family tree", "PBS"], //36
    ["Microsoft", "Greek language"], //48
    ["Team Fortress 2", "Adolf Hitler"], //18
    ["Megamind", "Adolf Hitler"],  //23
    ["Femboy", "World War II"], //5
    ["Femboy", "Child pornography"], //
    ["Mouthwashing (video game)", "Adolf Hitler"], //12
    ["Sharpie (marker)", "World War II"],
    ["Clickbait", "Countryballs"],
];
const two_aprt: Array<[string, string]> = [
    ["Alice Hathaway Lee Roosevelt", "Diamond"],
    ["Costume", "Prison"], 
    ["Directive on Copyright in the Digital Single Market", "Hillary Clinton"], 
    ["Jesus", "Donald Trump"],
    ["Michael Jackson", "Pope John Paul II"],
    ["Derek Jeter", "Egret"],
    ["Eddsworld", "President of Russia"],
    ["Fire", "Crotch"],
    ["Gagaku", "Brokeback Mountain"],
    ["Howard Keel", "State monopoly capitalism"],
    ["Jeremy Bentham", "Cantopop"],
    ["Jeremy Bentham", "Algonquin language"],
    ["San Jose Youth Symphony", "Thomas Edison"],
    ["Spin (physics)", "Chandler wobble"],
    ["Trigonometry", "Adolf Hitler"],
    ["Ted Danson", "William Brewster (Pilgrim)"],
    ["Yellow-eyed penguin", "The Godfather"],
    ["User:TheBuddy92/Willy on Wheels: A Case Study", "Jesus"],
    ["Jimmy Wales", "God"],
    ["SCP 06F6", "SCP Foundation"],
    ["T-Series (company)", "We choose to go to the Moon"],
    ["Toothpaste", "William Shakespeare"],
    ["The Binding of Isaac: Rebirth", "Sarin"],
    ["I Love Lucy", "Enhanced interrogation techniques"],
    ["Dio Brando", "Racism"],
    ["M&M's", "Sex"],
    ["Suicide", "Roblox"],
    ["Black metal", "Autism"],
    ["Homestuck", "The Holocaust"],
  ];
const three_aprt: Array<[string, string]> = [
    ["Cracker (pejorative)", "AnnaSophia Robb"], //4
    ["The Eagles", "William Jessop"],
    ["Maternal insult", "Wikipedia"],
];
const four_aprt: Array<[string, string]> = [
    ["Ted Kennedy", "King Salmon, Alaska"],
];

const test: Array<[string, string]> = [
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
    ["Neanderthals", "Antique Furniture"],
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
  

async function time_n_apart(fun: (a: string, b:string)=>Promise<List<string>>, arr: Array<[string, string]>, index: number): Promise<void> {
    let sum = 0;
    let acc = 0;
    const wrong_lens: Array<string> = []
    for(let i = 0; i < arr.length; i = i + 1) {
        const first = arr[i][0];
        const second = arr[i][1];
        if(!is_valid_page(first) || !is_valid_page(second)){
            console.log("Invalid start or end");
            continue;
        }
        const start_time = performance.now();
        const a = await fun(first,second);
        const end_time = performance.now();
        if(length(a) !== (index + 2)) {
            //wrong_lens.push(display_list(a));
            //continue;
        }
        console.log("Found in " + ((end_time-start_time)/1000) + " seconds:\n" + display_list(a));
        sum = sum + end_time-start_time;
        acc = acc + 1;

    }
    console.log("Completed " + acc + " tests for an avarage of " + (sum / acc)/1000) + " seconds";
    if(wrong_lens.length > 0) {
        console.log("And " + wrong_lens.length + " with wrong length:");
        wrong_lens.forEach(x=>console.log(x));
    }
}

export function time_paths(fun: (a: string, b:string)=>Promise<List<string>>, index: number): void {
    if(index === 1) {
        time_n_apart(fun, one_aprt, index)
        //0.5 seconds on average
    }
    else if(index === 2) {
        time_n_apart(fun, two_aprt, index);
        //10.15 on average
    }
    else if(index === 3) {
        time_n_apart(fun, three_aprt, index);
    }
    else if(index === 4) {
        time_n_apart(fun, four_aprt, index);
    }
    else if(index === 5) {
        time_n_apart(fun, test, 100);
    }
}
//Display a list of string as a string
function display_list(l: List<string>): string {
    let s = "list(";
    while(!is_null(l)){
        s = s + head(l) +", ";
        l = tail(l);
    }
    return s + ")";
}
