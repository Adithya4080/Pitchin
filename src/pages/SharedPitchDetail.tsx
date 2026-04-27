import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPost } from "@/api/feed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export default function SharedPitchDetail() {
  const { pitchId } = useParams<{ userId: string; pitchId: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["shared-pitch", pitchId],
    queryFn: () => getPost(Number(pitchId)),
    enabled: !!pitchId,
  });

  if (isLoading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  if (error || !post) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Pitch not found.</div>;

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="capitalize">{post.post_type}</Badge>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </span>
            </div>
            <CardTitle className="mt-3">{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{post.content}</p>
            {post.image_url && (
              <img src={post.image_url} alt="Pitch" className="mt-4 rounded-lg w-full object-cover max-h-64" />
            )}
            <div className="mt-6 pt-6 border-t flex items-center gap-3">
              <div>
                <p className="text-sm font-medium">{post.author_name}</p>
                <p className="text-xs text-muted-foreground capitalize">{post.author_role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
