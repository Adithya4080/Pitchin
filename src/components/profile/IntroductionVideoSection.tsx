import { useState, useRef } from 'react';
import { Video, Upload, Trash2, Edit2, Play, Loader2, Image, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ProfileSectionWrapper } from './ProfileSectionWrapper';

interface IntroductionVideoSectionProps {
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  title?: string | null;
  description?: string | null;
  isEditable?: boolean;
  isOwner?: boolean;
  isMobile?: boolean;
  userId?: string;
  role?: 'innovator' | 'startup' | null;
  onVideoChange?: (data: { 
    intro_video_url: string | null; 
    intro_video_title: string; 
    intro_video_description: string | null;
    intro_video_thumbnail_url: string | null;
  }) => void;
}

// Video duration validation (60-90 seconds)
const MIN_DURATION = 60;
const MAX_DURATION = 90;

export function IntroductionVideoSection({
  videoUrl,
  thumbnailUrl,
  title = 'Introduction',
  description,
  isEditable = false,
  isOwner = false,
  isMobile = false,
  userId,
  role,
  onVideoChange,
}: IntroductionVideoSectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [localTitle, setLocalTitle] = useState(title || 'Introduction');
  const [localDescription, setLocalDescription] = useState(description || '');
  const [localThumbnail, setLocalThumbnail] = useState(thumbnailUrl || null);
  const [isEditingText, setIsEditingText] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Only show for innovator and startup profiles
  if (role && role !== 'innovator' && role !== 'startup') {
    return null;
  }
  
  // Check if section has content
  const hasContent = !!videoUrl;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid video file (MP4, WebM, MOV, or AVI)');
      return;
    }

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('Video must be less than 50MB');
      return;
    }

    // Validate duration
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    const durationPromise = new Promise<number>((resolve, reject) => {
      video.onloadedmetadata = () => {
        resolve(video.duration);
      };
      video.onerror = () => {
        reject(new Error('Failed to load video metadata'));
      };
    });

    video.src = URL.createObjectURL(file);

    try {
      const duration = await durationPromise;
      URL.revokeObjectURL(video.src);

      if (duration < MIN_DURATION || duration > MAX_DURATION) {
        toast.error(`Video must be between ${MIN_DURATION} and ${MAX_DURATION} seconds. Your video is ${Math.round(duration)} seconds.`);
        return;
      }

      // Upload video
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/intro-video-${Date.now()}.${fileExt}`;

      // File upload: store as base64 until backend storage is configured
      const publicUrl = URL.createObjectURL(file)

      onVideoChange?.({
        intro_video_url: publicUrl,
        intro_video_title: localTitle,
        intro_video_description: localDescription || null,
        intro_video_thumbnail_url: localThumbnail,
      });

      toast.success('Introduction video uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload video');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleThumbnailSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, WebP, or GIF)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Thumbnail must be less than 5MB');
      return;
    }

    try {
      setIsUploadingThumbnail(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/intro-thumbnail-${Date.now()}.${fileExt}`;

      // File upload: store as base64 until backend storage is configured
      const publicUrl = URL.createObjectURL(file)

      setLocalThumbnail(publicUrl);
      
      onVideoChange?.({
        intro_video_url: videoUrl || null,
        intro_video_title: localTitle,
        intro_video_description: localDescription || null,
        intro_video_thumbnail_url: publicUrl,
      });

      toast.success('Thumbnail uploaded successfully!');
    } catch (error: any) {
      console.error('Thumbnail upload error:', error);
      toast.error(error.message || 'Failed to upload thumbnail');
    } finally {
      setIsUploadingThumbnail(false);
      if (thumbnailInputRef.current) {
        thumbnailInputRef.current.value = '';
      }
    }
  };

  const handleRemoveThumbnail = () => {
    setLocalThumbnail(null);
    onVideoChange?.({
      intro_video_url: videoUrl || null,
      intro_video_title: localTitle,
      intro_video_description: localDescription || null,
      intro_video_thumbnail_url: null,
    });
    toast.success('Thumbnail removed');
  };

  const handleRemoveVideo = () => {
    onVideoChange?.({
      intro_video_url: null,
      intro_video_title: localTitle,
      intro_video_description: localDescription || null,
      intro_video_thumbnail_url: localThumbnail,
    });
    toast.success('Video removed');
  };

  const handleSaveText = () => {
    onVideoChange?.({
      intro_video_url: videoUrl || null,
      intro_video_title: localTitle,
      intro_video_description: localDescription || null,
      intro_video_thumbnail_url: localThumbnail,
    });
    setIsEditingText(false);
  };

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  // Handle wrapper for empty state (when NOT in edit mode)
  // When empty: public view = hidden, owner view = placeholder CTA
  // When populated: show content normally

  // Render video player or thumbnail with play button
  const renderVideoPlayer = () => {
    if (isPlaying || !localThumbnail) {
      return (
        <video
          ref={videoRef}
          src={videoUrl!}
          controls
          autoPlay={isPlaying}
          className="w-full h-full object-cover"
          playsInline
        />
      );
    }

    return (
      <div 
        className="relative w-full h-full cursor-pointer group"
        onClick={handlePlayClick}
      >
        <img 
          src={localThumbnail} 
          alt="Video thumbnail" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="h-8 w-8 text-foreground ml-1" fill="currentColor" />
          </div>
        </div>
      </div>
    );
  };

  // Mobile Layout content
  const mobileContent = (
    <div className="bg-card w-full border-t border-border/30">
      <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-foreground">
            Introduction
          </h3>
          {isOwner && isEditable && videoUrl && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingText(!isEditingText)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveVideo}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>

        {isEditingText && isOwner && (
          <div className="space-y-3 mb-4">
            <div>
              <Label className="text-xs">Title</Label>
              <Input
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                placeholder="Introduction"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Caption (optional)</Label>
              <Textarea
                value={localDescription}
                onChange={(e) => setLocalDescription(e.target.value)}
                placeholder="A short description about your video..."
                className="mt-1 resize-none"
                rows={2}
              />
            </div>
            {/* Thumbnail Upload */}
            <div>
              <Label className="text-xs">Video Thumbnail</Label>
              <div className="mt-1">
                {localThumbnail ? (
                  <div className="relative inline-block">
                    <img 
                      src={localThumbnail} 
                      alt="Thumbnail preview" 
                      className="h-20 w-36 object-cover rounded-md border border-border"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveThumbnail}
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleThumbnailSelect}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => thumbnailInputRef.current?.click()}
                      disabled={isUploadingThumbnail}
                    >
                      {isUploadingThumbnail ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Image className="h-3.5 w-3.5 mr-1.5" />
                          Upload Thumbnail
                        </>
                      )}
                    </Button>
                  </>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Upload a custom thumbnail for your video
                </p>
              </div>
            </div>
            <Button size="sm" onClick={handleSaveText}>
              Save
            </Button>
          </div>
        )}

        {localDescription && !isEditingText && (
          <p className="text-sm text-muted-foreground mb-3">{localDescription}</p>
        )}

        {videoUrl ? (
          <div className="relative rounded-lg overflow-hidden bg-muted aspect-video">
            {renderVideoPlayer()}
          </div>
        ) : isOwner && isEditable ? (
          <div className="space-y-4">
            {/* Video Upload Section */}
            <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
                <Video className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Add a short introduction video to help people understand you faster.
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Recommended length: {MIN_DURATION}-{MAX_DURATION} seconds. Keep it clear and professional.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Introduction Video
                  </>
                )}
              </Button>
            </div>

            {/* Thumbnail Upload Section - Always visible in edit mode */}
            <div className="p-3 bg-muted/30 rounded-lg">
              <Label className="text-xs font-medium">Video Thumbnail (Optional)</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Upload a custom thumbnail for your video
              </p>
              <div>
                {localThumbnail ? (
                  <div className="relative inline-block">
                    <img 
                      src={localThumbnail} 
                      alt="Thumbnail preview" 
                      className="h-20 w-36 object-cover rounded-md border border-border"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveThumbnail}
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleThumbnailSelect}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => thumbnailInputRef.current?.click()}
                      disabled={isUploadingThumbnail}
                    >
                      {isUploadingThumbnail ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Image className="h-3.5 w-3.5 mr-1.5" />
                          Upload Thumbnail
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {isOwner && isEditable && videoUrl && (
          <div className="mt-3 space-y-3">
            {/* Replace Video Button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Replace Video
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  // Desktop Layout content
  const desktopContent = (
    <Card className="border-border/50">
      <CardContent className="p-0">
        {isOwner && isEditable ? (
          <div className="p-5">
            {/* Edit Mode Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground">Introduction</h3>
              {isOwner && isEditable && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={isEditingText ? handleSaveText : () => setIsEditingText(true)}
                    className="h-8 w-8 p-0"
                  >
                    {isEditingText ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                  </Button>
                  {videoUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveVideo}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Description editing */}
            {isEditingText && (
              <div className="mb-4">
                <Label className="text-xs">Caption (optional)</Label>
                <Textarea
                  value={localDescription}
                  onChange={(e) => setLocalDescription(e.target.value)}
                  placeholder="A short description about your video..."
                  className="mt-1 resize-none"
                  rows={2}
                />
              </div>
            )}

            {videoUrl ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Video Preview */}
                <div className="relative rounded-lg overflow-hidden bg-muted aspect-video">
                  {renderVideoPlayer()}
                </div>

                {/* Right side - Description & Controls */}
                <div className="flex flex-col justify-between">
                  {localDescription && !isEditingText && (
                    <p className="text-sm text-muted-foreground">{localDescription}</p>
                  )}

                  <div className="space-y-3 mt-auto">
                    {/* Thumbnail Upload */}
                    <div>
                      <Label className="text-xs">Video Thumbnail</Label>
                      <div className="mt-1">
                        {localThumbnail ? (
                          <div className="relative inline-block">
                            <img 
                              src={localThumbnail} 
                              alt="Thumbnail preview" 
                              className="h-16 w-28 object-cover rounded-md border border-border"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={handleRemoveThumbnail}
                              className="absolute -top-2 -right-2 h-5 w-5 p-0 rounded-full"
                            >
                              <X className="h-2.5 w-2.5" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <input
                              ref={thumbnailInputRef}
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/gif"
                              onChange={handleThumbnailSelect}
                              className="hidden"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => thumbnailInputRef.current?.click()}
                              disabled={isUploadingThumbnail}
                            >
                              {isUploadingThumbnail ? (
                                <>
                                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Image className="h-3.5 w-3.5 mr-1.5" />
                                  Add Thumbnail
                                </>
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Replace Video */}
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-full"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Replace Video
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // No video - show upload prompt
              <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted mb-4">
                  <Video className="h-7 w-7 text-muted-foreground" />
                </div>
                <h4 className="font-bold text-foreground mb-2">Add an Introduction Video</h4>
                <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                  A short video helps people connect with you faster. Keep it between {MIN_DURATION}-{MAX_DURATION} seconds and make it count!
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Video
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : videoUrl ? (
          // Public view with video
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Left - Video/Thumbnail */}
            <div className="relative aspect-video md:aspect-auto">
              {renderVideoPlayer()}
            </div>

            {/* Right - Title & Description */}
            <div className="p-5 flex flex-col justify-center">
              <h3 className="text-sm font-bold text-foreground mb-2">Introduction</h3>
              {localDescription && (
                <p className="text-sm text-muted-foreground">{localDescription}</p>
              )}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );

  // For non-editable views, wrap with ProfileSectionWrapper for empty state handling
  if (!isEditable) {
    return (
      <ProfileSectionWrapper
        title="Introduction"
        isEmpty={!hasContent}
        isOwner={isOwner}
        sectionKey="introduction"
        isMobile={isMobile}
        emptyMessage="Add a short introduction video to help people understand you faster."
        ctaText="Add Introduction"
      >
        {isMobile ? mobileContent : desktopContent}
      </ProfileSectionWrapper>
    );
  }

  // In edit mode, render directly (edit mode has its own empty state UI)
  return isMobile ? mobileContent : desktopContent;
}