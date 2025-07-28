import { useAuth } from "../Context/AuthContext.jsx";
import { useSidebar } from "@/components/ui/sidebar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";

const FormSchema = z.object({
  username: z.string().min(1, {
    message: "Please enter your username.",
  }),
  password: z.string().min(1, {
    message: "Please enter your password",
  }),
});

const Login = () => {
  let { SignInWithGoogle, loginUser } = useAuth();
  const { open, isMobile } = useSidebar();
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  async function handleGoogleAuth(e) {
    e.preventDefault();
    await SignInWithGoogle();
    navigate("/");
  }

  return (
    <div
      className="text-foreground flex h-full flex-col"
      style={{
        width:
          open && !isMobile
            ? "calc(100vw - var(--sidebar-width))"
            : "100vw",
      }}
    >
      <div className="m-auto w-1/5 space-y-2">
        <div className="flex justify-center font-mono font-extrabold">
          Login
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(loginUser)}
            className="space-y-3"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Login</Button>
          </form>
        </Form>
        <Button onClick={handleGoogleAuth}>Login with Google</Button>
        <div>
          {"Don't have an account?"}{" "}
          <Button variant="link" className="p-0 text-blue-500">
            <Link to="/register">Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Login;
