import { useAuth } from "../Context/AuthContext.jsx";
import { useSidebar } from "@/components/ui/sidebar";
import { useNavigate, Link } from "react-router-dom";
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

const FormSchema = z.object({
  first_name: z.string().min(1, {
    message: "Please enter your first name.",
  }),
  last_name: z.string().min(1, {
    message: "Please enter your last name.",
  }),
  username: z.string().min(1, {
    message: "Please enter a username.",
  }),
  email: z.email(),
  password: z.string().min(1, {
    message: "Please enter a password",
  }),
  cc_uname: z.string(),
  cf_uname: z.string(),
  gh_uname: z.string(),
  lt_uname: z.string(),
});

const Register = () => {
  let { SignUpWithGoogle, registerUser } = useAuth();
  const { open, isMobile } = useSidebar();
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      password: "",
      email: "",
      cc_uname: "",
      cf_uname: "",
      gh_uname: "",
      lt_uname: "",
    },
  });

  const handleGoogleRegister = async (e) => {
    e.preventDefault();
    await SignUpWithGoogle();
    navigate("/profile");
  };
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
      <div className="m-auto w-[60%] space-y-2.5 md:w-[40%] lg:w-1/3">
        <div className="flex justify-center font-mono font-extrabold">
          Register
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(registerUser)}
            className="space-y-2.5"
          >
            <div className="flex flex-row space-x-3">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="inline" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="inline" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="gh_uname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Github Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lt_uname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LeetCode Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cf_uname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Codeforces Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cc_uname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CodeChef Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Register</Button>
          </form>
        </Form>
        <Button onClick={handleGoogleRegister}>
          Register with Google
        </Button>
        <div>
          {"Already have an account?"}{" "}
          <Button variant="link" className="p-0 text-blue-500">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Register;
