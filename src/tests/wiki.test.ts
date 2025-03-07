import { get_links, get_links_to } from "../back-end/wiki";


test("Stops after n times, if there is links left", async () => {
    //This makes so when the fetch() function is called inside
    //get_links_to it returns this fake response that looks like
    //what the response would look like. The continue = "||" means there
    //is data left to be fetched
    global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            continue: {
                continue: "||",
                lhcontinue: "124"
            },
            query: {
              pages: {
                "123": { linkshere: [{ns:0, title: "Page " + performance.now().toString()}] } //adds current time to the page title to make them all unique 
              }                                                                                //so they all get added to hashtable
            }
          })
        })
      ) as jest.Mock;
    //here we wish to call the api 5 times, since continue will equal "||"
    //for every call, it will do all 5 calls, and each will add the title of the
    //linkshere array to the resulting hashtable.
    expect((await get_links_to("", 5)).entries).toBe(5);
});

test("Stops when runs out of links to fetch", async () => {
    //This makes so when the fetch() function is called inside
    //get_links_to it returns this fake response that looks like
    //what the response would look like. The continue = "" means there
    //is no data left to be fetched.
    global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            continue: {
                continue: ""
            },
            query: {
              pages: {
                "123": { linkshere: [{ns: 0, title: "Page" + performance.now().toString()}] } //adds current time to the page title to make them all unique 
              }                                                                               //so they all get added to hashtable
            }
          })
        })
      ) as jest.Mock;
      
      //here we want to make 100 api calls but there is only one needed to get all links
      //so the function stops after first call
      expect((await get_links_to("", 100)).entries).toBe(1);
});