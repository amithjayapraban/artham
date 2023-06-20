export default function Head() {
  let a = new Array(3).fill(0);
  console.log(a);
  return (
    <section className="w-full section1  flex items-center  md:pt-8  pt-4 pb-4 px-4 md:px-24 justify-between">
      <img src="/logo.svg" className="aspect-square  w-10 " alt="" />
      <button
        onClick={() => {
          document.querySelector(".more1")?.classList.remove("hidden");
          document.querySelector(".section1")?.classList.add("overlay");
          document.querySelector(".section2")?.classList.add("overlay");
        }}
        className="text-white flex items-center justify-center gap-1 aspect-square rounded-full   w-10 "
      >
        {a.map(() => (
          <div className="w-1 h-1 rounded-full bg-white"></div>
        ))}
      </button>
    </section>
  );
}
