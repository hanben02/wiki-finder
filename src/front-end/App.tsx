import { useState } from "react";
import { wiki_search } from "../back-end/bfs";

export default function App() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [processingText, setProcessingText] = useState("No request active");
  const [isProcessing, setProcessing] = useState(false);

  function startProcessingText(): void{
    setProcessingText("Processing request...");
  }

  const waitBeforeDoneFade = 3000;
  function stopProcessingText(): void{
    setProcessingText("Done!");
    setTimeout(() => setProcessingText("No request active"), waitBeforeDoneFade);
  }

  function is_error_message(msg: string): boolean {
    return msg === "Start and end is equal"
      || msg === "Initial page is invalid or has no links"
      || msg === "End page is invalid or has no page linking to it"
      || msg === "No path found"
      || msg === "Timeout reached";
  }

  function mw_capitalize(name: string){
    const c0 = name.charAt(0);
    const theRest = name.slice(1);
    return c0.toUpperCase().concat(theRest);
  }

  const handleSubmit = async () => {
    if (isProcessing) {
      // Prevent multiple requests from being processed in parallel
      alert("Another request of yours is already being processed right now!");
      return;
    }
    alert("Data submitted"); //Message to user
    setProcessing(true);
    startProcessingText();
    const result = await wiki_search(mw_capitalize(text1),
      mw_capitalize(text2));
    if (!is_error_message(result)){
      alert("PATH FOUND:\n" + result);
    } else {
      alert(result);
    }
    setProcessing(false);
    stopProcessingText();
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-md mx-auto text-center
    items-center min-h-screen justify-center">
      <h1 className="text-xl font-bold">Wiki Finder</h1>
      <h2 className="text-xl font-bold">How does this work?</h2>
      <p className="text-xl">
        After inputting the names (titles) of the start and end pages
        on the English Wikipedia in the text boxes below, you can run this 
        program to calculate a path from the start page to the end page.
        The result is a path you could take from the start page to the end page
        if the only thing you were allowed to do was to use the links
        present on each Wikipedia page.
      </p>
      <p className="text-xl font-bold">
        While the program makes a reasonable attempt to produce as short
        of a path as possible, the algorithm cannot guarantee that the
        path it gives is the shortest.
      </p>
      <h2 className="text-xl">Inputs</h2>
      <input
        type="text"
        placeholder="Start point"
        value={text1}
        onChange={(e) => setText1(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="End point"
        value={text2}
        onChange={(e) => setText2(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <div>
      <div className="p-4 bg-gray-100 rounded w-full">
        <h2 className="font-semibold">Summary</h2>
        <p>Start point: {text1}</p>
        <p>End point: {text2}</p>
      </div>
      </div>
      <h2>Run program</h2>
      <button id="submit"
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded
        hover:bg-pink-600"
      >
        Start program
      </button>
      <h2>Status</h2>
      <p>{processingText}</p>
    </div>
  );
}
