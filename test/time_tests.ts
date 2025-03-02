import { head, is_null, List, tail } from "../lib/list";
import { is_valid_page } from "../src/wiki";

const two_apart = [
    ["Nuclear fusion", "Godzilla"], //19
    ["Colt Single Action Army", "American Dream"], //4
    ["Michael Jackson", "Pope John Paul II"], //50
    ["Cobalt", "Sonic the Hedgehog (character)"], //27
    ["Jesus", "Donald Trump"], //59
    ["Emoji", "World War II"], //5
    ["Directive on Copyright in the Digital Single Market", "Hillary Clinton"], //4
    ["Touhou Project", "Hecate"], //
    ["Costume", "Prison"], //90
    ["xkcd", "IP address"], //2
    ["Trojan.Win32.DNSChanger", "Digital rights management"], //1
    ["Family tree", "PBS"], //36
    ["Microsoft", "Greek language"], //48
    ["Team Fortress 2", "Adolf Hitler"], //18
    ["Megamind", "Adolf Hitler"],  //23
    ["Femboy", "World War II"], //5
    ["Femboy", "Child pornography"], //
    ["Mouthwashing (video game)", "Adolf Hitler"], //12
];

export async function time_two_apart(fun: (a: string, b:string)=>Promise<List<string>>) {
    let sum = 0;
    let acc = 0;
    for(let i = 0; i < two_apart.length; i = i + 1) {
        const first = two_apart[i][0];
        const second = two_apart[i][1];
        if(!is_valid_page(first) || !is_valid_page(second)){
            console.log("Invalid start or end");
            continue;
        }
        const start_time = performance.now();
        const a = await fun(first,second);
        const end_time = performance.now();
        console.log("Found in " + ((end_time-start_time)/1000) + " seconds:\n" + display_list(a));
        acc = acc + 1;
        sum = sum + end_time-start_time;

    }
    console.log("Completed " + acc + " tests for an avarage of " + (sum / acc)/1000) + " seconds";
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
