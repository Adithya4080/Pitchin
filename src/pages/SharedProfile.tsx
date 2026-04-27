import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/api/profiles";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SharedProfile() {
  const { userId } = useParams<{ userId: string }>();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["shared-profile", userId],
    queryFn: () => getUserProfile(userId!),
    enabled: !!userId,
  });

  if (isLoading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  if (error || !profile) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Profile not found.</div>;

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center gap-6 mb-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback>{(profile.user_full_name || "U")[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{profile.user_full_name || "Anonymous"}</h1>
                {profile.role && <Badge className="mt-1 capitalize">{profile.role.replace("_", " ")}</Badge>}
              </div>
            </div>
            {profile.bio && <p className="text-muted-foreground mb-4">{profile.bio}</p>}
            {profile.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm">
                View LinkedIn
              </a>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
