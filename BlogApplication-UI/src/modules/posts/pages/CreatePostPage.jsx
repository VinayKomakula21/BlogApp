import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { postsApi } from "../api";
import { toast } from "sonner";

export const CreatePostPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const onSubmit = async (data) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const userName = localStorage.getItem('username') || '';
      const payload = {
        postTitle: data.title,
        postContent: data.content,
        image: imageFile,
        user: {
          userName: userName,
        }
      };

      const res = await postsApi.createPost(payload);
      toast.success("Post created successfully!");

      if (res?.id) {
        navigate(`/blog/${res.id}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      toast.error('Failed to create post');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Create a New Blog Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                {...register("title", { required: "Title is required" })}
                placeholder="Enter blog title"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <Textarea
                {...register("content", { required: "Content is required" })}
                placeholder="Write your blog content here..."
                rows={10}
              />
              {errors.content && (
                <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Image (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-200"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {submitting ? 'Creating...' : 'Create Blog Post'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePostPage;
