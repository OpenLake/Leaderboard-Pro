import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, ThumbsDown, Plus, Trash2 } from "lucide-react";
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
  
  const { userNames, authTokens } = useAuth();
  const currentUsername = userNames?.username;

  const fetchBlogs = async () => {
    try {
      const headers = {};
      if (authTokens?.access) {
        headers["Authorization"] = `Bearer ${authTokens.access}`;
      }
      const response = await fetch(`${BACKEND}/discussionpost/`, { headers });
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
          "Authorization": `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify({
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
    if (!authTokens?.access) {
      alert("Please log in to like or dislike posts.");
      return;
    }

    // Optimistic update
    setBlogs(prevBlogs => prevBlogs.map(b => {
      if (b.id !== post.id) return b;
      const alreadyVoted = b.user_vote === action;
      const swapping = b.user_vote && b.user_vote !== action;
      return {
        ...b,
        likes: action === "like"
          ? alreadyVoted ? b.likes - 1 : b.likes + 1
          : swapping ? Math.max(0, b.likes - 1) : b.likes,
        dislikes: action === "dislike"
          ? alreadyVoted ? b.dislikes - 1 : b.dislikes + 1
          : swapping ? Math.max(0, b.dislikes - 1) : b.dislikes,
        user_vote: alreadyVoted ? null : action,
      };
    }));

    try {
      const response = await fetch(`${BACKEND}/discussionpost/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify({ title: post.title, action }),
      });
      if (!response.ok) fetchBlogs();
      else {
        const updated = await response.json();
        setBlogs(prev => prev.map(b => b.id === post.id ? { ...b, ...updated } : b));
      }
    } catch {
      fetchBlogs();
    }
  };
  const handleDeleteBlog = async (post) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const response = await fetch(`${BACKEND}/discussionpost/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify({
          title: post.title,
        }),
      });

      if (response.ok) {
        fetchBlogs();
      } else {
        console.error("Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
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
                    variant={blog.user_vote === "like" ? "default" : "outline"}
                    size="sm" 
                    className={`gap-2 transition-colors ${blog.user_vote === "like" ? "bg-green-600 hover:bg-green-700 text-white border-green-600" : "hover:bg-green-50 hover:text-green-600 hover:border-green-200 dark:hover:bg-green-950/30"}`}
                    onClick={() => handleInteract(blog, "like")}
                    disabled={!authTokens?.access}
                    title={!authTokens?.access ? "Login to vote" : blog.user_vote === "like" ? "Remove like" : "Like"}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{blog.likes}</span>
                  </Button>
                  <Button 
                    variant={blog.user_vote === "dislike" ? "default" : "outline"}
                    size="sm" 
                    className={`gap-2 transition-colors ${blog.user_vote === "dislike" ? "bg-red-600 hover:bg-red-700 text-white border-red-600" : "hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/30"}`}
                    onClick={() => handleInteract(blog, "dislike")}
                    disabled={!authTokens?.access}
                    title={!authTokens?.access ? "Login to vote" : blog.user_vote === "dislike" ? "Remove dislike" : "Dislike"}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span>{blog.dislikes}</span>
                  </Button>
                </div>
                {currentUsername === blog.username && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteBlog(blog)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
