type More = {
  downloading: boolean;
  dbPercent: number;
  downloadDb: Function;
};
export default function More({ downloading, dbPercent, downloadDb }: More) {
  let a = new Array(2).fill(0);

  return (
    <div className="more flex flex-col pt-8   pb-4 px-4 md:pl-12 pl-6 more1 bg-bg h-[100dvh]  border-l border-gray    rounded-tl-sm md:w-[40%] w-[80%]  break-words right-0  absolute z-[99]">
      <button
        onClick={() => {
          document.querySelector(".more")?.classList.add("hide");
          document.querySelector(".section1")?.classList.remove("overlay");
          document.querySelector(".section2")?.classList.remove("overlay");
          localStorage.setItem("more", "");
        }}
        className="self-end  text-white flex items-center justify-center  aspect-square rounded-md   w-10 "
      >
        <img src="/cross.svg" className="w-4" alt="" />
      </button>

      <ul className=" text-xs tracking-widest  md:pt-4 leading-loose items-start flex flex-col gap-3 ">
        {dbPercent !== 100 ? (
          <>
            <li className="">
              Downloading database to your device for offline access ✨
            </li>
            <label
              className="text-[.6rem] inline-flex gap-2 items-center"
              htmlFor="file"
            >
              {dbPercent}%
              <progress
                className=""
                id="file"
                value={dbPercent}
                max="100"
              ></progress>
            </label>
            {/* <button
              className={`disabled:opacity-70  rounded-sm border border-gray px-2 `}
              disabled={downloading}
              onClick={() => downloadDb()}
            >
              {downloading ? "Downloading" : "Download"}
            </button> */}
          </>
        ) : (
          <>
            <li className="">
              Database Downloaded.
              <br />
              Now you can search even if you are offline. ✨
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
        <img src="/logo.svg" className="aspect-square  w-10 " alt="" />
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
