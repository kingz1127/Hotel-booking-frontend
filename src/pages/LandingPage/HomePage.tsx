import AboutUs from "@/components/AboutUs";
import Belt from "@/components/Belt";
import Footer from "@/components/Footer";
import HotelFacilities from "@/components/HotelFacilities";
import RoomsSuites from "@/components/RoomsSuites";

export default function HomePage(){
    return<>
    <div>
        <AboutUs />
        <Belt />
        <RoomsSuites />
        <Belt />
        <HotelFacilities />
        {/* <Belt /> */}

        <Footer />
    </div>
    
    </>
}