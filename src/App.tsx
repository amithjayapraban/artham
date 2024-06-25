import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { db } from "./db";
import { SearchResult } from "./types/SearchResult";
import { supabase } from "./supbase";
import "./App.css";
import More from "./components/More";
import Head from "./components/Head";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [dbPercent, setDbPercent] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [moreShown, setMoreShown] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  let rows = 217563;
  let [s, e] = [0, 999];

  if (localStorage.getItem("start_end")) {
    let se = localStorage.getItem("start_end");
    se ? ([s, e] = JSON.parse(se)) : null;
  }

  let synth;
  const speak = (text: string) => {
    synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);
    let voice = synth.getVoices();
    u.voice = voice[52];
    u.rate = 0.81;
    synth.speak(u);
  };

  useEffect(() => {
    let percentage = Math.floor((e / rows) * 100);
    percentage !== 100 && downloadDb();
    synth = window.speechSynthesis;
    // let more = localStorage.getItem("more");
    // more != null && document.querySelector(".more")?.classList.add("hide");
    // if (more === null) {
    //   document.querySelector(".section1")?.classList.add("overlay");
    //   document.querySelector(".section2")?.classList.add("overlay");
    //   setMoreShown(true);
    // }
    inputRef.current && inputRef.current.focus();
    setDbPercent(percentage);
  }, []);

  useLayoutEffect(() => {
    let more = localStorage.getItem("more");
    more != null && document.querySelector(".more")?.classList.add("hide");
    if (more === null) {
      document.querySelector(".section1")?.classList.add("overlay");
      document.querySelector(".section2")?.classList.add("overlay");
      setMoreShown(true);
    }
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
          // i == e - s && console.count("Api called");
        }
      );
    }
  }, []);

  const fetchFromStore = (term: string) => {
    console.log(" 🔍 Searching local database");
    db.dictionary
      .where("english_word")
      .startsWithAnyOfIgnoreCase(term)
      // .limit(15)
      .toArray()
      .then((val: any) => {
        setSearchResults(val ?? []);
        // console.log(val, "result");
      });
  };

  const fetchFromApi = async (term: string) => {
    console.log(" 🔍 Searching database");
    const { data, error } = await supabase
      .from("dictionary")
      .select()
      .ilike("english_word", `${term}%`)
      .limit(15);
    if (error) {
      console.error("Error searching data from API", error);
    } else {
      setSearchResults(data ?? []);
    }
  };

  const Search = async (term: string) => {
    if (term.length > 0) {
      try {
        db.dictionary.count().then((c) => {
          c > 215000 ? fetchFromStore(term.trim()) : fetchFromApi(term.trim());
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

  const delayedSearch = debounce(Search,500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    delayedSearch(term);
  };

  return (
    <div
      onClick={() => {
        if (moreShown) {
          document.querySelector(".more")?.classList.add("hide");
          document.querySelector(".section1")?.classList.remove("overlay");
          document.querySelector(".section2")?.classList.remove("overlay");
          setMoreShown(false);
          localStorage.setItem("more", "");
        }
      }}
      className="fixed left-0 right-0 w-full h-[100dvh] overflow-hidden    App  items-start  grid gap-2 grid-rows-[.1fr,auto]"
    >
      <span className="relative">
        <Head moreShown={moreShown} setMoreShown={setMoreShown} />
      </span>

      <More
        downloadDb={downloadDb}
        downloading={downloading}
        dbPercent={dbPercent}
      />

      <section className=" w-full h-full  md:pb-8  pb-4 px-4 md:px-24 md:self-start   section2  grid gap-2  grid-rows-[.1fr,.1fr,1fr] md:grid-rows-[.1fr,1fr,.1fr]  ">
        <span className="md:hidden relative  flex w-full justify-center">
          <input
            ref={inputRef}
            className="px-6 h-16 md:h-auto pr-12 md:hidden md:justify-self-center justify-self-start  py-3  w-full md:w-[60%] rounded-md"
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search..."
          />
          {searchTerm == "" ? (
            <img
              className="absolute w-5 right-[5%] top-[33%]"
              src="/search.svg"
              alt="search"
            />
          ) : (
            <img
              onClick={() => {
                setSearchTerm("");
                setSearchResults([]);
              }}
              className="absolute  cursor-pointer w-5 right-[5%] top-[33%]"
              src="/clear.svg"
              alt="search"
            />
          )}
        </span>
        <h3
          className={`md:justify-self-center self-center mt-4 w-full   md:w-[60%]   ${
            searchResults.length > 0 ? "opacity-1" : "opacity-0"
          }`}
        >
          Search Results
        </h3>
        {/* md:max-h-[68vh] h-[68dvh] */}
        <ul className="w-full   md:px-0  h-[70dvh] md:pb-4 md:bottom-0  flex flex-col gap-3 items-center overflow-y-auto ">
          {searchResults.map((result, i) => (
            <li
              onClick={() => speak(result.english_word)}
              className=" cursor-pointer bg-gray w-full md:w-[60%]   py-2 px-4 rounded-md"
              key={result.id}
            >
              <p className="text-[.9rem]  opacity-80"> {result.english_word}</p>
              <i className="pl-1">{result.malayalam_definition}</i>
            </li>
          ))}
        </ul>
        <span className="relative md:flex hidden w-full  justify-center">
          <input
            ref={inputRef}
            className="px-6 pr-12   w-full md:w-[60%]  md:justify-self-center justify-self-start  py-3   rounded-md"
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search..."
          />
          {searchTerm == "" ? (
            <img
              className="absolute  w-5 right-[22%] top-[29.5%]"
              src="/search.svg"
              alt="search"
            />
          ) : (
            <img
              onClick={() => {
                setSearchTerm("");
                setSearchResults([]);
              }}
              className="absolute cursor-pointer w-5 right-[22%] top-[29.5%]"
              src="/clear.svg"
              alt="clear"
            />
          )}
        </span>
      </section>
    </div>
  );
}

export default App;
