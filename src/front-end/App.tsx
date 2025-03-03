import { useState } from "react";
import wiki_finder from "../back-end/main";

export default function App() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [checkboxes, setCheckboxes] = useState({
    option1: false,
    option2: false,
    option3: false,
  });

  const handleCheckboxChange = (key: string) => {
    setCheckboxes((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof checkboxes],
    }));
  };

  const handleSubmit = async () => {
    const selectedOptions = Object.entries(checkboxes)
      .filter(([_, v]) => v)
      .map(([k]) => k);
    alert("Data submitted"); //Message to user
    const result = await wiki_finder(text1, text2, selectedOptions);
    alert("PATH FOUND:\n" + result);
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-md mx-auto text-center items-center min-h-screen justify-center">
      <h1 className="text-xl font-bold">Wiki Finder</h1>
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
        <h2 className="font-semibold">Select Options:</h2>
        {Object.keys(checkboxes).map((key) => (
          <label key={key} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={checkboxes[key as keyof typeof checkboxes]}
              onChange={() => handleCheckboxChange(key)}
            />
            {key}
          </label>
        ))}

      <div className="p-4 bg-gray-100 rounded w-full">
        <h2 className="font-semibold">Summary:</h2>
        <p>Start point: {text1}</p>
        <p>End point: {text2}</p>
        <p>
          Selected Options:{" "}
          {Object.entries(checkboxes)
            .filter(([_, v]) => v)
            .map(([k]) => k)
            .join(", ") || "None"}
        </p>
      </div>
      </div>
      <button
        onClick={handleSubmit}
        className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600" //className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Start program
      </button>
    </div>
  );
}
