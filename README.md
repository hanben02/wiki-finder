# Wiki-finder
Wiki finder is an application that finds paths between two articles within the site wikipedia. It is written in typescript and uses a react front-end.

## Installation
Before you can run the program you will need to install Node.js and typescript, then do the following:

1. Download repository
2. Run `npm install` inside the wiki-finder folder

## Usage 
To run the program, run `npm run dev` inside the wiki-finder folder, this will create a link to open up a localhost within the browser that can run the program.
To find a path between two pages, input the page titles of the start and end pages in the appropiate text boxes, and click the "Start program" button. 
The program will then start finding a path. Then when it finds a path, it will give you a pop-up displaying it. If the program fails to find a path,
it will give you a pop-up explaining what went wrong.

## Tests
### Unit tests
There are two files containing unit tests that test the main functionality of the program.
To run them you need to install jest `npm install jest`.
To run all the unit tests, run `jest` inside the wiki-finder folder.

### Timed tests
There are tests that test how fast the program can find paths. There are 48 predefined start and end points that will run when you run the file.
To run these, run `npx tsx src/tests/time_tests.ts` and the results will be printed in the terminal. Each test can run for maximum 30 seconds so,
the whole program can take a while to run.


