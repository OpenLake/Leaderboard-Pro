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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building, Briefcase, MapPin, Globe, Github, Trophy, Code2 } from "lucide-react";

const FormSchema = z.object({
  codechef: z.string(),
  codeforces: z.string(),
  github: z.string(),
  leetcode: z.string(),
  atcoder: z.string(),
  bio: z.string().max(500, { message: "Bio must be less than 500 characters" }),
  organization: z.string().max(100),
  occupation: z.string().max(100),
  location: z.string().max(100),
});

export default function Profile() {
  const { update_addUsernames, userNames } = useAuth();
  
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      codechef: userNames?.codechef?.username || "",
      codeforces: userNames?.codeforces?.username || "",
      github: userNames?.github?.username || "",
      leetcode: userNames?.leetcode?.username || "",
      atcoder: userNames?.atcoder?.username || "",
      bio: userNames?.bio || "",
      organization: userNames?.organization || "",
      occupation: userNames?.occupation || "",
      location: userNames?.location || "",
    },
  });

  const onSubmit = (data) => {
    update_addUsernames(data);
  };

  const displayName = userNames?.first_name 
    ? `${userNames.first_name} ${userNames.last_name || ""}` 
    : userNames?.username || "Guest User";
    
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl text-foreground">
      <div className="flex flex-col gap-8 md:flex-row items-start">
        {/* Sidebar/Profile Summary */}
        <div className="w-full md:w-1/3 space-y-6">
          <Card className="border-none bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700" />
            <div className="px-6 pb-6 text-center">
              <Avatar className="h-24 w-24 mx-auto -mt-12 border-4 border-background shadow-lg">
                <AvatarFallback className="text-2xl font-bold bg-blue-100 text-blue-700">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="mt-4">
                <h2 className="text-2xl font-bold">{displayName}</h2>
                <p className="text-blue-500 font-medium font-mono text-sm tracking-tight text-center">@{userNames?.username || "guest"}</p>
                <div className="mt-4 flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400">
                  {userNames?.occupation && (
                    <div className="flex items-center justify-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>{userNames.occupation}</span>
                    </div>
                  )}
                  {userNames?.organization && (
                    <div className="flex items-center justify-center gap-2">
                      <Building className="h-4 w-4" />
                      <span>{userNames.organization}</span>
                    </div>
                  )}
                  {userNames?.location && (
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{userNames.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="border-none bg-card/50 backdrop-blur-sm shadow-xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-500" />
              Platforms Connected
            </h3>
            <div className="space-y-3">
              {[
                { label: "GitHub", icon: Github, value: userNames?.github?.username },
                { label: "Codeforces", icon: Code2, value: userNames?.codeforces?.username },
                { label: "LeetCode", icon: Trophy, value: userNames?.leetcode?.username },
              ].map((plat, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <plat.icon className="h-3.5 w-3.5" />
                    <span>{plat.label}</span>
                  </div>
                  <span className={plat.value ? "font-medium" : "text-gray-500"}>
                    {plat.value || "Not linked"}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Edit Form Area */}
        <div className="w-full md:w-2/3">
          <Card className="border-none bg-card/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">Profile Settings</CardTitle>
              <CardDescription>
                Customize your public profile and platform integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Basic Info Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-500">Personal Information</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="occupation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Occupation</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Software Engineer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="organization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. IIT Bhilai" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Delhi, India" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about yourself..." 
                              className="min-h-[120px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Tell people about your coding journey (max 500 characters)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Platforms Section */}
                  <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-500">Coding Platforms</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="codeforces"
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
                        name="leetcode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Leetcode Username</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="github"
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
                        name="codechef"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Codechef Username</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="atcoder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Atcoder Username</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <Button 
                      type="submit" 
                      className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
                    >
                      Save Profile
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
