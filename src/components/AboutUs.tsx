import CheckIns from "./CheckIns";

export default function AboutUs() {
  return (
    <>
      <div>
        <h1>
          <CheckIns />
        </h1>
        <div className=" flex items-center justify-center w-full pt-25 gap-x-15 pb-10 ">
          <div>

           <div className="absolute font-serif bg-my-Bg mt-7 text-white flex items-center gap-3 p-2 -ml-2 rounded-tl-[5px] rounded-tr-[5px] rounded-br-[5px] rounded-bl-0">
            <p className="text-4xl ">16</p>
            <div >
            <p className="text-[1.2rem]">Years</p>
            <p className="text-[0.8rem]">of Services</p>
            </div>
           </div>

            <img
              src="src/Images/hotel service.jpg"
              alt=""
              className="w-90 h-120 rounded-2xl "
            />
          </div>

          <div className="flex flex-col gap-4 ">
            <p className="text-2xl text-[#c1bd3f]">About Us</p>
            <p className="text-5xl font-serif">
              Luxurious Comfort, <br /> Timeless Elegance Awaits
            </p>
            <p className="text-[grey]">
            Excepteur quis ullamco quis amet ut proident <br /> duis. Lorem enim
            commodo amet ullamco adipisicing <br /> occaecat tempor irure esse ea
            pariatur cupidatat. Laboris aliquip <br /> 
            </p>

            <div className="flex items-center gap-5">
                <div>
                    <p className="font-mono text-4xl text-[#49c049] ">50+</p>
                    <p className="text-[grey]">Luxury Rooms</p>
                </div>

                <div>
                    <p className="font-mono text-4xl text-[#49c049] ">60,000+</p>
                    <p className="text-[grey]">Happy Guests</p>
                </div>

                <div>
                    <p className="font-mono text-4xl text-[#49c049] ">99%</p>
                    <p className="text-[grey]">Guest Satisfaction</p>
                </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
