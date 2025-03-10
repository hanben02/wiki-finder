import { useState } from "react";
import { wiki_search } from "../back-end/bfs";

export default function App() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [processingText, setProcessingText] = useState("");
  const [isProcessing, setProcessing] = useState(false);

  function startProcessingText(): void{
    setProcessingText("Processing request...");
  }

  const waitBeforeDoneFade = 3000;
  function stopProcessingText(): void{
    setProcessingText("Done!");
    setTimeout(() => setProcessingText(""), waitBeforeDoneFade);
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
    const result = await wiki_search(mw_capitalize(text1), mw_capitalize(text2));
    if (!is_error_message(result)){
      alert("PATH FOUND:\n" + result);
    } else {
      alert(result);
    }
    setProcessing(false);
    stopProcessingText();
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-md mx-auto text-center items-center min-h-screen justify-center">
      <h1 className="text-xl font-bold">Wiki Finder</h1>
      <h3 className="text-xl font-bold">How does this work?</h3>
      <h4 className="text-xl">By inputting the name of the wikipedia page in the start and endpoint, this program can calculate a path between them. This path
        is the path you would have to go if the only thing you were allowed to do was use the links present in the current wikipedia page, and your job was to go from one page to the next. </h4>
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
        <h2 className="font-semibold">Summary:</h2>
        <p>Start point: {text1}</p>
        <p>End point: {text2}</p>
      </div>
      </div>
      <button id="submit"
        onClick={handleSubmit}
        className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600" //className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Start program
      </button>
      <p>{processingText}</p>
    </div>
  );
}
