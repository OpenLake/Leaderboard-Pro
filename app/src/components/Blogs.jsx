import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, ThumbsDown, Plus } from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

const BACKEND = import.meta.env.VITE_BACKEND;

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { userNames } = useAuth();
  const currentUsername = userNames?.username;

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${BACKEND}/discussionpost/`);
      const data = await response.json();
      // Sort newest to oldest
      data.sort((a, b) => new Date(b.posted) - new Date(a.posted));
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreateBlog = async () => {
    if (!title.trim() || !description.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND}/discussionpost/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: currentUsername || "anonymous",
          title: title,
          discription: description, // Matches backend spelling
        }),
      });
      
      if (response.ok) {
        setTitle("");
        setDescription("");
        setOpen(false);
        fetchBlogs();
      } else {
        console.error("Failed to create blog", await response.json());
      }
    } catch (error) {
      console.error("Error creating blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInteract = async (post, action) => {
    let updatedLikes = post.likes;
    let updatedDislikes = post.dislikes;
    
    if (action === "like") updatedLikes += 1;
    if (action === "dislike") updatedDislikes += 1;

    try {
      // Optimistic update for speedy UI
      setBlogs(prevBlogs => prevBlogs.map(b => 
        b.id === post.id 
          ? { ...b, likes: updatedLikes, dislikes: updatedDislikes }
          : b
      ));

      const response = await fetch(`${BACKEND}/discussionpost/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: post.title,
          likes: updatedLikes,
          dislikes: updatedDislikes,
        }),
      });
      
      if (!response.ok) {
        // Revert on failure
        fetchBlogs(); 
      }
    } catch (error) {
      console.error("Error updating interaction:", error);
      fetchBlogs();
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl pt-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Community Blogs</h1>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Write Blog
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create a New Blog Post</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Input
                  id="title"
                  placeholder="Title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="font-semibold text-lg"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Textarea
                  id="description"
                  placeholder="Share your thoughts, contest experiences, or tutorials here..."
                  className="min-h-[200px] resize-y"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateBlog} disabled={loading || !title || !description}>
                {loading ? "Publishing..." : "Publish Blog"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {blogs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
            No blogs yet. Be the first to share something!
          </div>
        ) : (
          blogs.map((blog) => (
            <Card key={blog.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 border-b bg-muted/20">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-1">{blog.title}</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      Posted by <span className="font-semibold text-foreground">@{blog.username || 'unknown'}</span> • {blog.posted ? formatDistanceToNow(new Date(blog.posted), {addSuffix: true}) : 'recently'}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 text-base whitespace-pre-wrap leading-relaxed">
                {blog.discription}
              </CardContent>
              <CardFooter className="pt-2 pb-4 flex justify-between">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 hover:bg-green-50 hover:text-green-600 hover:border-green-200 dark:hover:bg-green-950/30"
                    onClick={() => handleInteract(blog, "like")}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{blog.likes}</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/30"
                    onClick={() => handleInteract(blog, "dislike")}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span>{blog.dislikes}</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
