import { LoginForm } from "@/components/example-form";
import { Card, CardHeader } from "@/components/ui/card";

export default function Login() {
  return (
    <>
    <div className="flex items-center justify-center min-h-screen ">
    <Card className="w-full max-w-md">
        <CardHeader>  <div className="flex items-center justify-center "><h1>Login</h1> </div>
        <LoginForm />
      </CardHeader>
      </Card>
      </div>
    </>
  );
}
