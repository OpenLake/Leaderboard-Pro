import { useAuth } from "../Context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSidebar } from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  codechef: z.string(),
  codeforces: z.string(),
  github: z.string(),
  leetcode: z.string(),
});

let fields = [
  { label: "CodeChef Username", tag: "codechef" },
  { label: "Codeforces Username", tag: "codeforces" },
  { label: "LeetCode Username", tag: "leetcode" },
  { label: "Github Username", tag: "github" },
];

export default function Profile() {
  let { update_addUsernames, userNames } = useAuth();
  const { open, isMobile } = useSidebar();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      codechef: "",
      codeforces: "",
      github: "",
      leetcode: "",
    },
  });
  if (userNames) {
    fields.forEach((x) => {
      x["helperText"] = userNames[x["tag"]]?.username
        ? `Currently ${userNames[x["tag"]].username}`
        : `Currently not set`;
    });
  } else {
    fields.forEach((x) => {
      x["helperText"] = `Currently not set`;
    });
  }
  let elems = fields.map((x) => (
    <FormField
      key={x["tag"]}
      control={form.control}
      name={x["tag"]}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{x["label"]}</FormLabel>
          <FormControl>
            <Input {...field} className="inline" />
          </FormControl>
          <FormDescription>{x["helperText"]}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  ));
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
        <div className="mb-5 flex justify-center text-2xl font-extrabold">
          Profile
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(update_addUsernames)}
            className="space-y-2.5"
          >
            {elems}
            <Button type="submit">Update</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
