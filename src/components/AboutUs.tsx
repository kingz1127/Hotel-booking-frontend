
export default function AboutUs() {
  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-center w-full pt-15 gap-x-15 gap-y-8 pb-10 px-4 md:px-8 ">
        <div className="relative ">
          <div className="absolute font-serif bg-my-Bg mt-7 text-white flex items-center gap-3 p-2 -ml-2 rounded-tl-[5px] rounded-tr-[5px] rounded-br-[5px] rounded-bl-0 z-10">
            <p className="text-2xl sm:text-3xl md:text-4xl">16</p>
            <div>
              <p className="text-base sm:text-lg md:text-[1.2rem]">Years</p>
              <p className="text-xs sm:text-sm md:text-[0.8rem]">of Services</p>
            </div>
          </div>

          <img
            src="src/Images/hotel service.jpg"
            alt="Hotel service"
            className="w-full sm:w-80 md:w-90 h-80 sm:h-100 md:h-120 rounded-2xl object-cover "
          />
        </div>

        <div className="flex flex-col gap-4 text-center lg:text-left max-w-xl">
          <p className="text-xl sm:text-2xl text-[#c1bd3f]">About Us</p>
          <p className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">
            Luxurious Comfort, <br className="hidden sm:block" /> Timeless Elegance Awaits
          </p>
          <p className="text-[grey] text-sm sm:text-base">
            Excepteur quis ullamco quis amet ut proident duis. Lorem enim
            commodo amet ullamco adipisicing occaecat tempor irure esse ea
            pariatur cupidatat. Laboris aliquip
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 sm:gap-8">
            <div>
              <p className="font-mono text-3xl sm:text-4xl text-[#49c049]">50+</p>
              <p className="text-[grey] text-sm sm:text-base">Luxury Rooms</p>
            </div>

            <div>
              <p className="font-mono text-3xl sm:text-4xl text-[#49c049]">60,000+</p>
              <p className="text-[grey] text-sm sm:text-base">Happy Guests</p>
            </div>

            <div>
              <p className="font-mono text-3xl sm:text-4xl text-[#49c049]">99%</p>
              <p className="text-[grey] text-sm sm:text-base">Guest Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}




