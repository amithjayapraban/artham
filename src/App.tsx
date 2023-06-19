import React, { useCallback, useEffect, useState } from "react";
import { db } from "./db";
import { SearchResult } from "./types/SearchResult";
import { supabase } from "./supbase";
import "./App.css";
import More from "./components/More";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [dbPercent, setDbPercent] = useState(0);
  const [downloading, setDownloading] = useState(false);
  let rows = 217563;
  let [s, e] = [0, 999];

  if (localStorage.getItem("start_end")) {
    let se = localStorage.getItem("start_end");
    se ? ([s, e] = JSON.parse(se)) : null;
  }

  useEffect(() => {
    let more = localStorage.getItem("more");
    more != null && document.querySelector(".more")?.classList.add("hidden");
    // e <= rows && downloadDb();
    setDbPercent(Math.floor((e / rows) * 100));
  }, []);

  const downloadDb = useCallback(async () => {
    setDownloading(true);
    const { data, error } = await supabase
      .from("dictionary")
      .select()
      .range(s, e);
    if (error) {
      console.error("Error searching data:", error);
    } else {
      s += 1000;
      e += 1000;
      setDbPercent(Math.floor((e / rows) * 100));
      localStorage.setItem("start_end", JSON.stringify([s, e]));
      data.forEach(
        async ({ english_word, malayalam_definition, part_of_speech }, i) => {
          try {
            // Add to indexedDB
            await db.dictionary.add({
              english_word,
              malayalam_definition,
              part_of_speech,
            });
            // console.log("added");
          } catch (error) {
            console.log("error");
          }
          i == e - s && e < rows && downloadDb();
          i == e - s && console.count("api called");
        }
      );
    }
  }, []);

  const fetchFromStore = (term: string) => {
    console.log(" 🔍 Searching local DB...");
    db.dictionary
      .where("english_word")
      .startsWithAnyOfIgnoreCase(term)
      .limit(15)
      .toArray()
      .then((val: any) => {
        setSearchResults(val ?? []);
        // console.log(val, "result");
      });
  };

  const fetchFromApi = async (term: string) => {
    console.log(" 🔍 Searching DB...");
    const { data, error } = await supabase
      .from("dictionary")
      .select()
      .ilike("english_word", `${term}%`)
      .limit(15);
    if (error) {
      console.error("Error searching data:", error);
    } else {
      setSearchResults(data ?? []);
    }
  };

  const Search = async (term: string) => {
    if (term.length > 0) {
      try {
        db.dictionary.count().then((c) => {
          c > 215000 ? fetchFromStore(term) : fetchFromApi(term);
        });
      } catch {}
    } else {
      setSearchResults([]);
    }
  };

  let debounceTimer: ReturnType<typeof setTimeout>;
  const debounce = useCallback((fn: Function, delay: number) => {
    return (arg: string) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        fn(arg);
      }, delay);
    };
  }, []);

  const delayedSearch = debounce(Search, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    delayedSearch(term);
  };

  return (
    <div className="h-[100dvh] overflow-h idden   grid gap-2 grid-rows-[.5fr,2fr]">
      <section className="w-full  flex items-center  md:pt-8  pt-4 pb-4 px-4 md:px-24 justify-between">
        <img src="/logo.svg" className="aspect-square md:w-8  w-6 " alt="" />

        {/* <p className="italic font-extrabold md:text-xl font-mono">Artham</p> */}
        <button
          onClick={() =>
            document.querySelector(".more")?.classList.remove("hidden")
          }
          className="bg-gray text-white aspect-square rounded-md md:w-8  w-6 "
        >
          ?
        </button>
      </section>
      <More
        downloadDb={downloadDb}
        downloading={downloading}
        dbPercent={dbPercent}
      />
      {/* <div className="absolute hidd en flex flex-col items-start gap-2 bottom-2 right-4 rounded-xl">
        <label className="text-[.6rem]" htmlFor="file">
          {downloading ? "Downloading" : "Downloaded"}
          &nbsp; {dbPercent}%
        </label>
        <progress className="" id="file" value={dbPercent} max="100"></progress>
        <button
          className={`disabled:opacity-70 rounded border px-2 py-1`}
          disabled={downloading}
          onClick={downloadDb}
        >
          {downloading ? "Downloading" : "Download"}
        </button>
      </div> */}

      <section className=" w-full px-4 md:px-24 pb-8  grid gap-2  grid-rows-[.1fr,.1fr,2fr] md:grid-rows-[.1fr,2fr]  ">
        <input
          className="px-4 md:hidden md:justify-self-center justify-self-start  py-3  w-full md:w-[60%] rounded-md"
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search..."
        />
        <h3
          className={`md:justify-self-center self-center mt-4 w-full md:w-[60%]   ${
            searchResults.length > 0 ? "opacity-1" : "opacity-0"
          }`}
        >
          Search Results
        </h3>

        <ul className="h-[70dvh]  w-full  flex flex-col gap-3 items-center overflow-y-auto ">
          {searchResults.map((result, i) => (
            <li
              className="bg-gray w-full md:w-[60%]   py-2 px-4 rounded-md"
              key={i}
            >
              <p className="text-[.9rem]  opacity-80"> {result.english_word}</p>
              <i className="pl-1">{result.malayalam_definition}</i>
            </li>
          ))}
        </ul>
        <input
          className="px-4 md:flex hidden md:justify-self-center justify-self-start  py-3  w-full md:w-[60%] rounded-md"
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search..."
        />
      </section>
    </div>
  );
}

export default App;
