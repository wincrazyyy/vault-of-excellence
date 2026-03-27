"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  MessageSquareQuote, Star, Plus, Loader2, X, 
  Trash2, Pencil, Check, Info, ShieldCheck, AlertCircle, Calendar, EyeOff, CheckCircle2 
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { ImageUploadEditor } from "@/components/tutors/edit/image-upload-editor";
import { 
  toggleReviewVisibility, 
  deleteLegacyReview, 
  updateLegacyReview, 
  addLegacyReview 
} from "@/lib/actions/reviews";

export function ReviewsManager({ initialReviews }: { initialReviews: any[] }) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    school_name: "",
    image_url: "",
    comment: ""
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    firstname: "",
    lastname: "",
    school_name: "",
    image_url: "",
    comment: ""
  });

  const pendingReviews = initialReviews.filter(r => !r.is_visible && !r.is_legacy);
  const processedReviews = initialReviews.filter(r => r.is_visible || r.is_legacy);
  const visibleCount = initialReviews.filter((r) => r.is_visible).length;

  const handleAddLegacyReview = async () => {
    if (!formData.firstname.trim() || !formData.lastname.trim()) {
      toast.error("First and Last name are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      await addLegacyReview({
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
        school_name: formData.school_name.trim() || null,
        image_url: formData.image_url || null, 
        comment: formData.comment.trim() || null,
      });
      toast.success("Legacy review added!");
      setFormData({ firstname: "", lastname: "", school_name: "", image_url: "", comment: "" });
      setIsAdding(false);
      router.refresh();
    } catch (error: any) {
      toast.error("Error adding review", { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleVisibility = async (reviewId: string, currentVisibility: boolean) => {
    setTogglingId(reviewId);
    const newVisibility = !currentVisibility;
    try {
      await toggleReviewVisibility(reviewId, newVisibility);
      toast.success(newVisibility ? "Review published!" : "Review hidden.");
      router.refresh();
    } catch (error: any) {
      toast.error("Failed to update status", { description: error.message });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteLegacyReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this imported review? This cannot be undone.")) return;
    setDeletingId(reviewId);
    try {
      await deleteLegacyReview(reviewId);
      toast.success("Review deleted.");
      router.refresh();
    } catch (error: any) {
      toast.error("Failed to delete review", { description: error.message });
    } finally {
      setDeletingId(null);
    }
  };
  
  const startEditing = (review: any) => {
    setEditingId(review.id);
    setEditFormData({
      firstname: review.guest_firstname || "",
      lastname: review.guest_lastname || "",
      school_name: review.guest_school_name || "",
      image_url: review.guest_image_url || "",
      comment: review.comment || ""
    });
  };

  const saveEditedReview = async (reviewId: string) => {
    if (!editFormData.firstname.trim() || !editFormData.lastname.trim()) {
      toast.error("First and Last name are required.");
      return;
    }
    setIsSavingEdit(true);
    try {
      await updateLegacyReview(reviewId, {
        guest_firstname: editFormData.firstname.trim(),
        guest_lastname: editFormData.lastname.trim(),
        guest_school_name: editFormData.school_name.trim() || null,
        guest_image_url: editFormData.image_url || null,
        comment: editFormData.comment.trim() || null,
      });
      toast.success("Review updated!");
      setEditingId(null);
      router.refresh();
    } catch (error: any) {
      toast.error("Failed to update review", { description: error.message });
    } finally {
      setIsSavingEdit(false);
    }
  };

  const renderReviewCard = (review: any) => {
    const isEditing = editingId === review.id;
    const isLegacy = review.is_legacy;
    const displayName = review.guest_firstname ? `${review.guest_firstname} ${review.guest_lastname}` : "Anonymous Student";
    const initial = review.guest_firstname?.[0] || "?";

    return (
      <Card key={review.id} className={cn(
        "w-full overflow-hidden transition-all duration-200",
        !review.is_visible && !isLegacy ? "border-amber-200 dark:border-amber-900/50 shadow-md ring-1 ring-amber-500/10" : "border-border shadow-sm",
        !review.is_visible && isLegacy ? "grayscale-[0.5] opacity-70" : ""
      )}>
        {isEditing ? (
          <CardContent className="p-4 sm:p-6 bg-muted/10">
            <div className="space-y-4 animate-in fade-in flex flex-col sm:flex-row gap-4">
              <div className="shrink-0">
                <Label className="text-xs mb-2 block">Photo</Label>
                <div className="w-24">
                  <ImageUploadEditor 
                    currentImage={editFormData.image_url}
                    aspectRatio={1} lockAspectRatio={true} size="sm"
                    onImageUploaded={(url) => setEditFormData({...editFormData, image_url: url})}
                  />
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1"><Label className="text-xs">First Name</Label><Input className="h-8 text-xs" value={editFormData.firstname} onChange={(e) => setEditFormData({...editFormData, firstname: e.target.value})} /></div>
                  <div className="space-y-1"><Label className="text-xs">Last Name</Label><Input className="h-8 text-xs" value={editFormData.lastname} onChange={(e) => setEditFormData({...editFormData, lastname: e.target.value})} /></div>
                </div>
                <div className="space-y-1"><Label className="text-xs">School (Optional)</Label><Input className="h-8 text-xs" value={editFormData.school_name} onChange={(e) => setEditFormData({...editFormData, school_name: e.target.value})} /></div>
                <div className="space-y-1"><Label className="text-xs">Testimonial</Label><Textarea value={editFormData.comment} onChange={(e) => setEditFormData({...editFormData, comment: e.target.value})} className="min-h-20 text-xs resize-none" /></div>
                
                <div className="flex gap-2 justify-end pt-1">
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setEditingId(null)} disabled={isSavingEdit}>Cancel</Button>
                  <Button size="sm" className="h-7 text-xs bg-violet-600 hover:bg-violet-700 text-white" onClick={() => saveEditedReview(review.id)} disabled={isSavingEdit}>
                    {isSavingEdit ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Check className="h-3 w-3 mr-1" />} Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        ) : (
          <>
            <CardHeader className={cn("pb-4 border-b", !review.is_visible && !isLegacy ? "bg-amber-50/50 dark:bg-amber-900/10" : "bg-muted/30")}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    {review.guest_image_url ? (
                      <div className="relative h-10 w-10 rounded-full overflow-hidden border border-border">
                        <Image src={review.guest_image_url} alt={displayName} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted border border-border">
                        <span className="text-sm font-bold text-muted-foreground uppercase">{initial}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {displayName}
                      {!review.is_visible && !isLegacy ? <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400">Needs Approval</Badge>
                      : review.is_visible ? <Badge variant="default" className="bg-green-600">Published</Badge>
                      : <Badge variant="outline" className="text-muted-foreground">Hidden</Badge>}
                      
                      {isLegacy && <Badge variant="secondary" className="text-[10px] uppercase bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">Legacy Import</Badge>}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-3 mt-1">
                      {review.rating && !isLegacy && (
                        <span className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn("h-3 w-3", i < review.rating ? "fill-orange-400 text-orange-400" : "text-muted-foreground/30")} />
                          ))}
                        </span>
                      )}
                      {review.guest_school_name && <span className="text-xs font-medium">• {review.guest_school_name}</span>}
                      <span className="flex items-center gap-1 text-xs">
                        <Calendar className="h-3 w-3 ml-1" /> {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  {isLegacy && (
                    <>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-violet-600 bg-muted/50" onClick={() => startEditing(review)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" disabled={deletingId === review.id} className="h-8 w-8 text-muted-foreground hover:text-red-600 bg-muted/50" onClick={() => handleDeleteLegacyReview(review.id)}>
                        {deletingId === review.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </>
                  )}
                  <Button 
                    size="sm" 
                    disabled={togglingId === review.id}
                    onClick={() => handleToggleVisibility(review.id, review.is_visible)}
                    variant={review.is_visible ? "outline" : "default"}
                    className={!review.is_visible ? "bg-green-600 hover:bg-green-700 text-white" : "text-muted-foreground hover:text-red-600 hover:bg-red-50"}
                  >
                    {togglingId === review.id ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : !review.is_visible ? <CheckCircle2 className="mr-1.5 h-4 w-4" /> : <EyeOff className="mr-1.5 h-4 w-4" />}
                    {!review.is_visible ? "Approve & Publish" : "Hide Review"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-foreground whitespace-pre-wrap italic leading-relaxed">
                "{review.comment || (isLegacy ? "No text provided." : "Rating only.")}"
              </p>
            </CardContent>
          </>
        )}
      </Card>
    );
  };

  return (
    <>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Reviews</h1>
          <p className="text-muted-foreground mt-2">Approve incoming testimonials and manage your public reputation.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="font-mono text-xs py-1.5">
            VISIBLE: {visibleCount} / {initialReviews.length}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setIsAdding(!isAdding)} className="border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300">
            {isAdding ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            {isAdding ? "Cancel" : "Add Legacy Review"}
          </Button>
        </div>
      </div>

      {isAdding && (
        <div className="mb-8 p-6 rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-900/10 space-y-6 animate-in fade-in slide-in-from-top-4">
          <div>
              <h4 className="text-sm font-bold flex items-center gap-2">
                Import a Past Testimonial <Badge variant="secondary" className="text-[9px] uppercase">Legacy</Badge>
              </h4>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5"><Info className="h-3 w-3" />Legacy testimonials do not impact your official platform rating.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="shrink-0 space-y-2">
              <Label className="text-xs">Reviewer Photo</Label>
              <div className="w-24">
                <ImageUploadEditor currentImage={formData.image_url} aspectRatio={1} lockAspectRatio={true} size="sm" onImageUploaded={(url) => setFormData({...formData, image_url: url})} />
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label className="text-xs">Guest First Name *</Label><Input placeholder="e.g. Sarah" value={formData.firstname} onChange={e => setFormData({...formData, firstname: e.target.value})} /></div>
                <div className="space-y-1.5"><Label className="text-xs">Guest Last Name *</Label><Input placeholder="e.g. M." value={formData.lastname} onChange={e => setFormData({...formData, lastname: e.target.value})} /></div>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">School Name (Optional)</Label><Input placeholder="e.g. Oxford University" value={formData.school_name} onChange={e => setFormData({...formData, school_name: e.target.value})} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Testimonial *</Label><Textarea placeholder="What did the student say?" value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})} className="min-h-25" /></div>
            </div>
          </div>
          <Button onClick={handleAddLegacyReview} disabled={isSubmitting} className="w-full bg-violet-600 hover:bg-violet-700 text-white">
            {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null} {isSubmitting ? "Saving..." : "Save Legacy Review"}
          </Button>
        </div>
      )}

      {initialReviews.length === 0 ? (
        <Card className="w-full bg-muted/20 border-dashed shadow-none mt-8">
          <CardContent className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <MessageSquareQuote className="h-8 w-8 text-muted-foreground/70" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No reviews yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Click "Add Legacy Review" above to import past testimonials, or wait for students to review you here!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-10 mt-8">
          {pendingReviews.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-amber-600 dark:text-amber-500">
                <AlertCircle className="h-5 w-5" />
                Action Required: Pending Approval ({pendingReviews.length})
              </h2>
              <div className="grid gap-4">
                {pendingReviews.map(renderReviewCard)}
              </div>
            </div>
          )}

          {processedReviews.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                Live & Processed Reviews
              </h2>
              <div className="grid gap-4">
                {processedReviews.map(renderReviewCard)}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
