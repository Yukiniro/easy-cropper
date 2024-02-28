export function GridView() {
  return (
    <>
      <div className="w-[1px] h-full bg-white opacity-60 absolute left-1/3"></div>
      <div className="w-[1px] h-full bg-white opacity-60 absolute left-2/3"></div>
      <div className="w-full h-[1px] bg-white opacity-60 absolute top-1/3"></div>
      <div className="w-full h-[1px] bg-white opacity-60 absolute top-2/3"></div>
    </>
  );
}
