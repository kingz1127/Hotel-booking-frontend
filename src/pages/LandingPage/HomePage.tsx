import AboutUs from "@/components/AboutUs";
import Belt from "@/components/Belt";
import CheckIns from "@/components/CheckIns";
import Footer from "@/components/Footer";
import HotelFacilities from "@/components/HotelFacilities";
import RoomsSuites from "@/components/RoomsSuites";

export default function HomePage(){
    return<>
    
        <CheckIns />
        <AboutUs />
        <Belt />
        <RoomsSuites />
        <Belt />
        <HotelFacilities />
        {/* <Belt /> */}

        <Footer />
    
    </>
}

