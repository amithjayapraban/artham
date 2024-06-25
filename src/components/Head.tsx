type Head = {
  setMoreShown: Function;
  moreShown: boolean;
};
export default function Head({ setMoreShown, moreShown }: Head) {
  // let a = new Array(3).fill(0);
  let a = [1,2,3];
  return (
    <section className="w-full section1  flex items-center md:static    md:pt-8  pt-4  px-4 md:px-24 justify-between">
      <img src="/logo.svg" className="aspect-square opacity-0 w-10 " alt="" />
      <button
        onClick={() => {
          if (!moreShown) {
            document.querySelector(".more1")?.classList.remove("hide");
            document.querySelector(".section1")?.classList.add("overlay");
            document.querySelector(".section2")?.classList.add("overlay");
            setMoreShown(true);
          }
        }}
        className="text-white flex items-center justify-center gap-1 aspect-square rounded-full   w-10 "
      >
        {a.map((i) => (
          <div  key={i} className="w-1 h-1 rounded-full bg-white"></div>
        ))}
      </button>
    </section>
  );
}
