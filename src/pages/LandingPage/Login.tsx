import { LoginForm } from "@/components/example-form";
import { Card, CardHeader } from "@/components/ui/card";

export default function Login() {
  return (
    <>

    <Card>
        <CardHeader>  <div className="flex items-center justify-center "><h1>Login</h1> </div>
        <LoginForm />
      </CardHeader>
      </Card>
    </>
  );
}
