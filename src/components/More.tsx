type More = {
  downloading: boolean;
  dbPercent: number;
  downloadDb: Function;
};
export default function More({ downloading, dbPercent, downloadDb }: More) {
  // dbPercent = 100;
  return (
    <div className="more more1  bg-bg  border border-gray  p-8  rounded-md break-words md:max-w-[40vw] max-w-[80vw] md:right-[6.1rem] right-[1.2rem] md:top-[2.2rem] top-[1.1rem] absolute z-[99]">
      <div
        className="flex cursor-pointer absolute top-2 w-4 h-4 justify-center items-center p-0 bg-red-600 rounded-full right-2 z-[999]]  "
        onClick={() => {
          document.querySelector(".more")?.classList.add("hidden");
            document.querySelector(".section1")?.classList.remove("overlay");
            document.querySelector(".section2")?.classList.remove("overlay");
          localStorage.setItem("more", "");
        }}
      ></div>

      <ul className=" text-xs items-start flex flex-col gap-1">
        {dbPercent !== 100 ? (
          <>
            <li>Download database to your device for offline access 💾</li>
            <label className="text-[.6rem]" htmlFor="file">
              {downloading ? "Downloading" : "Downloaded"}
              &nbsp; {dbPercent}%
            </label>
            <progress
              className=""
              id="file"
              value={dbPercent}
              max="100"
            ></progress>

            <button
              className={`disabled:opacity-70 rounded border px-2 py-1`}
              disabled={downloading}
              onClick={() => downloadDb()}
            >
              {downloading ? "Downloading" : "Download"}
            </button>
          </>
        ) : (
          <>
            <li>
              Database Downloaded 💾 <br />
              Now you can search even if you are offline ✨
            </li>
          </>
        )}

        <li className="italic  text-[#757575]   mt-2 text-[.7rem]">
          Found any bugs? <br /> Reach out{" "}
          <a
            href="https://amith.vercel.app"
            target="_blank"
            className=" text-white  cursor-pointer w-[100%]  text-center justify-self-end self-center    "
          >
            @amithjayapraban
            {/* ⚡ */}
          </a>
        </li>
        <li className="mt-1 text-[#757575] text-[.7rem]">
          Database from{" "}
          <a className="text-white" href="https://olam.in/open/">
            Olam
          </a>
        </li>
      </ul>
    </div>
  );
}
