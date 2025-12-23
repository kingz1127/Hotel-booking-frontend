import { RegisterForm } from "@/components/example-form";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


export default function Register() {
    return<>
    
<div className="flex items-center justify-center mt-12 ">


    <Card className="w-full max-w-md">
        <CardHeader> <h1 className="flex items-center justify-center text-4xl ">Register</h1>
        <CardContent className="flex justify-center flex-col  ">
    <RegisterForm />
    </CardContent>
    </CardHeader>
    </Card>  
    </div>
    <Footer />
    </>
}