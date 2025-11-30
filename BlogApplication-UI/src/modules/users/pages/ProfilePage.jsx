import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Loader2, AlertCircle, FileText, Settings, Lock, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { BlogCard, Pagination } from "@/modules/posts/components";
import { usersApi } from "../api";
import { postsApi } from "@/modules/posts/api";
import { toast } from "sonner";

export const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { register: registerEdit, handleSubmit: handleEditSubmit, reset: resetEdit, formState: { errors: editErrors } } = useForm();
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { errors: passwordErrors }, watch } = useForm();

  const newPassword = watch("newPassword");

  useEffect(() => {
    fetchProfileAndPosts();
  }, [currentPage]);

  const fetchProfileAndPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const profileData = await usersApi.getMyProfile();
      setProfile(profileData);
      resetEdit({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        avatarUrl: profileData.avatarUrl || '',
      });

      const postsData = await postsApi.getPostsByUser(profileData.id, currentPage, 6);
      const transformedPosts = postsData.content.map(post => ({
        id: post.id,
        title: post.postTitle,
        content: post.postContent,
        author: `${post.user.firstName} ${post.user.lastName}`,
        date: post.createdAt,
        image: post.image,
        likesCount: post.likesCount || 0,
        isLiked: post.isLiked || false,
        commentsCount: post.commentsCount || 0,
        userId: post.user.id,
        tags: post.tags || [],
      }));
      setPosts(transformedPosts);
      setTotalPages(postsData.totalPages);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onEditSubmit = async (data) => {
    setEditLoading(true);
    try {
      const updatedProfile = await usersApi.updateProfile(data);
      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setPasswordLoading(true);
    try {
      await usersApi.changePassword(data.currentPassword, data.newPassword);
      toast.success("Password changed successfully!");
      setShowPasswordForm(false);
      resetPassword();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Skeleton className="w-24 h-24 rounded-full mb-4" />
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24 mb-4" />
                  <div className="grid grid-cols-3 gap-4 w-full mt-4">
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="grid gap-px bg-border/40 md:grid-cols-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-background p-4">
                  <Skeleton className="aspect-[16/10] w-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Profile</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button variant="destructive" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 text-3xl mb-4">
                  <AvatarImage src={profile.avatarUrl} alt={profile.firstName} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {profile.firstName?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>

                <h1 className="text-xl font-bold tracking-tight">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-muted-foreground">@{profile.userName}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 gap-2"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit2 className="w-4 h-4" />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>

              <Separator className="my-6" />

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{profile.postsCount}</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-500">{profile.commentsCount}</p>
                  <p className="text-xs text-muted-foreground">Comments</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-500">{profile.likesCount}</p>
                  <p className="text-xs text-muted-foreground">Likes</p>
                </div>
              </div>

              {/* Edit Form */}
              {isEditing && (
                <>
                  <Separator className="my-6" />
                  <form onSubmit={handleEditSubmit(onEditSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name</label>
                      <Input {...registerEdit("firstName", { required: "First name is required" })} className="h-10" />
                      {editErrors.firstName && <p className="text-destructive text-xs">{editErrors.firstName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name</label>
                      <Input {...registerEdit("lastName", { required: "Last name is required" })} className="h-10" />
                      {editErrors.lastName && <p className="text-destructive text-xs">{editErrors.lastName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Avatar URL</label>
                      <Input {...registerEdit("avatarUrl")} placeholder="https://example.com/avatar.jpg" className="h-10" />
                    </div>
                    <Button type="submit" className="w-full" disabled={editLoading}>
                      {editLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {editLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </>
              )}
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card className="border-border/40">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <CardTitle className="text-base">Security</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                >
                  {showPasswordForm ? 'Cancel' : 'Change'}
                </Button>
              </div>
            </CardHeader>

            {showPasswordForm && (
              <CardContent className="pt-0">
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Password</label>
                    <Input
                      type="password"
                      {...registerPassword("currentPassword", { required: "Current password is required" })}
                      className="h-10"
                    />
                    {passwordErrors.currentPassword && <p className="text-destructive text-xs">{passwordErrors.currentPassword.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <Input
                      type="password"
                      {...registerPassword("newPassword", {
                        required: "New password is required",
                        minLength: { value: 8, message: "Password must be at least 8 characters" }
                      })}
                      className="h-10"
                    />
                    {passwordErrors.newPassword && <p className="text-destructive text-xs">{passwordErrors.newPassword.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm Password</label>
                    <Input
                      type="password"
                      {...registerPassword("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) => value === newPassword || "Passwords do not match"
                      })}
                      className="h-10"
                    />
                    {passwordErrors.confirmPassword && <p className="text-destructive text-xs">{passwordErrors.confirmPassword.message}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={passwordLoading}>
                    {passwordLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {passwordLoading ? 'Changing...' : 'Update Password'}
                  </Button>
                </form>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Posts Grid */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            My Posts ({profile.postsCount})
          </h2>

          {posts.length === 0 ? (
            <div className="text-center py-16 bg-muted/50 rounded-lg">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Posts Yet</h3>
              <p className="text-muted-foreground mb-4">Start sharing your thoughts!</p>
              <Link to="/create">
                <Button>Create Your First Post</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-px bg-border/40 md:grid-cols-2 rounded-lg overflow-hidden border border-border/40">
                {posts.map(post => (
                  <div key={post.id} className="bg-background">
                    <BlogCard post={post} showActions={true} onDelete={fetchProfileAndPosts} />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
