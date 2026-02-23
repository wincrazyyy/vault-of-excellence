"use client";

import { useState } from "react";
import { MessageSquareQuote, Star, Plus, Loader2, X, Trash2, Pencil, Check } from "lucide-react";
import type { TutorProfile, Review } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface ReviewsEditorProps {
  tutor: TutorProfile;
  updateTutor: (tutor: TutorProfile) => void;
}

export function ReviewsEditor({ tutor, updateTutor }: ReviewsEditorProps) {
  const supabase = createClient();
  const { reviews } = tutor;
  
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstname: "",
    lastname: "",
    school_name: "",
    rating: 5,
    comment: ""
  });

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    school_name: "",
    rating: 5,
    comment: ""
  });

  const toggleReviewVisibility = async (reviewId: string, isVisible: boolean) => {
    const updatedReviews = reviews.map((r) =>
      r.id === reviewId ? { ...r, is_visible: isVisible } : r
    );
    updateTutor({ ...tutor, reviews: updatedReviews });

    const { error } = await supabase
      .from("reviews")
      .update({ is_visible: isVisible })
      .eq("id", reviewId);

    if (error) {
      alert("Failed to update visibility: " + error.message);
      updateTutor({ ...tutor, reviews }); 
    }
  };

  const handleDeleteLegacyReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this imported review? This cannot be undone.")) {
      return;
    }

    setDeletingId(reviewId);

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId);

    if (error) {
      alert("Failed to delete review: " + error.message);
      setDeletingId(null);
      return;
    }

    const updatedReviews = reviews.filter((r) => r.id !== reviewId);
    updateTutor({ ...tutor, reviews: updatedReviews });
    setDeletingId(null);
  };
  
  const startEditing = (review: Review) => {
    setEditingId(review.id);
    setEditFormData({
      firstname: review.firstname || "",
      lastname: review.lastname || "",
      school_name: review.school_name || "",
      rating: review.rating || 5,
      comment: review.comment || ""
    });
  };
  
  const cancelEditing = () => {
    setEditingId(null);
    setEditFormData({ firstname: "", lastname: "", school_name: "", rating: 5, comment: "" });
  };

  const saveEditedReview = async (reviewId: string) => {
    if (!editFormData.firstname.trim() || !editFormData.lastname.trim()) {
      alert("First and Last name are required.");
      return;
    }

    setIsSavingEdit(true);

    const updates = {
      guest_firstname: editFormData.firstname.trim(),
      guest_lastname: editFormData.lastname.trim(),
      guest_school_name: editFormData.school_name.trim() || null,
      rating: editFormData.rating,
      comment: editFormData.comment.trim() || null,
    };

    const { error } = await supabase
      .from("reviews")
      .update(updates)
      .eq("id", reviewId);
      
    setIsSavingEdit(false);
      
    if (error) {
      alert("Failed to update review: " + error.message);
      return;
    }

    const updatedReviews = reviews.map((r) =>
      r.id === reviewId ? { 
        ...r, 
        firstname: updates.guest_firstname,
        lastname: updates.guest_lastname,
        school_name: updates.guest_school_name,
        rating: updates.rating,
        comment: updates.comment
      } : r
    );
    
    updateTutor({ ...tutor, reviews: updatedReviews });
    setEditingId(null);
  };

  const handleAddLegacyReview = async () => {
    if (!formData.firstname.trim() || !formData.lastname.trim()) {
      alert("First and Last name are required.");
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        tutor_id: tutor.id,
        guest_firstname: formData.firstname.trim(),
        guest_lastname: formData.lastname.trim(),
        guest_school_name: formData.school_name.trim() || null,
        rating: formData.rating,
        comment: formData.comment.trim() || null,
        is_legacy: true,
        is_visible: true
      })
      .select()
      .single();

    setIsSubmitting(false);

    if (error) {
      alert("Error adding review: " + error.message);
      return;
    }

    const newReview: Review = {
      id: data.id,
      firstname: data.guest_firstname,
      lastname: data.guest_lastname,
      school_name: data.guest_school_name,
      image_url: data.guest_image_url,
      is_legacy: true,
      rating: data.rating,
      comment: data.comment,
      is_visible: data.is_visible,
      created_at: data.created_at
    };

    updateTutor({
      ...tutor,
      reviews: [newReview, ...tutor.reviews]
    });

    setFormData({ firstname: "", lastname: "", school_name: "", rating: 5, comment: "" });
    setIsAdding(false);
  };

  const totalReviews = reviews.length;
  const visibleCount = reviews.filter((r) => r.is_visible).length;

  return (
    <Card className="border-violet-200 dark:border-violet-500/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
          <MessageSquareQuote className="h-4 w-4 text-violet-500" />
          Review Management
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAdding(!isAdding)}
          className="h-8 border-violet-200 dark:border-violet-800"
        >
          {isAdding ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {isAdding ? "Cancel" : "Add Legacy Review"}
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {isAdding && (
          <div className="p-5 rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-900/10 space-y-4 animate-in fade-in slide-in-from-top-4">
            <h4 className="text-sm font-bold flex items-center gap-2">
              Import a Past Review
              <Badge variant="secondary" className="text-[9px] uppercase">Legacy</Badge>
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Guest First Name *</Label>
                <Input 
                  placeholder="e.g. Sarah" 
                  value={formData.firstname} 
                  onChange={e => setFormData({...formData, firstname: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Guest Last Name *</Label>
                <Input 
                  placeholder="e.g. M." 
                  value={formData.lastname} 
                  onChange={e => setFormData({...formData, lastname: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-xs">School Name (Optional)</Label>
              <Input 
                placeholder="e.g. Oxford University" 
                value={formData.school_name} 
                onChange={e => setFormData({...formData, school_name: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onClick={() => setFormData({...formData, rating: star})}
                    className={cn(
                      "h-6 w-6 cursor-pointer transition-colors",
                      star <= formData.rating ? "fill-orange-400 text-orange-400" : "text-muted-foreground/30 hover:text-orange-200"
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Comment (Optional)</Label>
              <Textarea 
                placeholder="What did the student say?" 
                value={formData.comment} 
                onChange={e => setFormData({...formData, comment: e.target.value})}
              />
            </div>

            <Button onClick={handleAddLegacyReview} disabled={isSubmitting} className="w-full bg-violet-600 hover:bg-violet-700 text-white">
              {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              {isSubmitting ? "Saving..." : "Save Legacy Review"}
            </Button>
          </div>
        )}

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 space-y-4">
            <div className="rounded-xl border border-dashed border-violet-200 dark:border-violet-800 p-6 bg-violet-50/30 dark:bg-violet-900/10">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Star className="h-4 w-4 text-orange-400 fill-orange-400" />
                Moderation Policy
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Reviews are written by students and cannot be edited. You can, however, 
                choose to hide specific reviews if you feel they are no longer relevant 
                or to curate your public profile. Imported Legacy reviews can be edited or deleted.
              </p>
              <div className="mt-4 pt-4 border-t border-violet-100 dark:border-violet-800">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                  Pro Tip:
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Keeping a mix of reviews shows authenticity and builds higher trust with new students.
                </p>
              </div>
            </div>
          </div>

          <div className="flex-2 space-y-4 min-w-[50%]">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase text-muted-foreground">
                Your Reviews
              </Label>
              <Badge variant="secondary" className="font-mono text-[10px]">
                VISIBLE: {visibleCount} / {totalReviews}
              </Badge>
            </div>

            <div className="rounded-lg border bg-card max-h-100 overflow-y-auto custom-scrollbar">
              {reviews.length > 0 ? (
                <div className="divide-y divide-border">
                  {reviews.map((review) => {
                    const studentName = `${review.firstname} ${review.lastname}`;
                    const isEditing = editingId === review.id;
                    
                    return (
                      <div
                        key={review.id}
                        className={cn(
                          "flex items-start justify-between gap-4 p-4 transition-all",
                          !review.is_visible && "bg-muted/50 grayscale-[0.5]"
                        )}
                      >
                        <div className="space-y-2 min-w-0 flex-1">
                          {isEditing ? (
                            <div className="space-y-3 pr-4 animate-in fade-in">
                              <div className="grid grid-cols-2 gap-2">
                                <Input 
                                  className="h-8 text-xs" 
                                  placeholder="First Name" 
                                  value={editFormData.firstname}
                                  onChange={(e) => setEditFormData({...editFormData, firstname: e.target.value})}
                                />
                                <Input 
                                  className="h-8 text-xs" 
                                  placeholder="Last Name" 
                                  value={editFormData.lastname}
                                  onChange={(e) => setEditFormData({...editFormData, lastname: e.target.value})}
                                />
                              </div>
                              
                              <Input 
                                className="h-8 text-xs" 
                                placeholder="School (Optional)" 
                                value={editFormData.school_name}
                                onChange={(e) => setEditFormData({...editFormData, school_name: e.target.value})}
                              />

                              <div className="flex gap-1 py-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    onClick={() => setEditFormData({...editFormData, rating: star})}
                                    className={cn(
                                      "h-4 w-4 cursor-pointer transition-colors",
                                      star <= editFormData.rating ? "fill-orange-400 text-orange-400" : "text-muted-foreground/30 hover:text-orange-200"
                                    )}
                                  />
                                ))}
                              </div>

                              <Textarea 
                                value={editFormData.comment}
                                onChange={(e) => setEditFormData({...editFormData, comment: e.target.value})}
                                className="min-h-15 text-xs resize-none"
                                placeholder="Write the review text here..."
                              />
                              
                              <div className="flex gap-2 justify-end pt-1">
                                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={cancelEditing} disabled={isSavingEdit}>
                                  Cancel
                                </Button>
                                <Button size="sm" className="h-7 text-xs bg-violet-600 hover:bg-violet-700 text-white" onClick={() => saveEditedReview(review.id)} disabled={isSavingEdit}>
                                  {isSavingEdit ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Check className="h-3 w-3 mr-1" />}
                                  Save Changes
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-sm truncate">
                                  {studentName}
                                </span>
                                
                                {review.is_legacy && (
                                  <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 uppercase tracking-wider">
                                    Imported
                                  </Badge>
                                )}

                                <div className="flex gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={cn(
                                        "h-2.5 w-2.5",
                                        i < review.rating 
                                          ? "fill-orange-400 text-orange-400" 
                                          : "text-muted-foreground/20"
                                      )}
                                    />
                                  ))}
                                </div>
                                {!review.is_visible && (
                                  <Badge variant="outline" className="h-4 px-1 text-[8px] uppercase border-red-200 text-red-600 bg-red-50 dark:bg-red-900/20">
                                    Hidden
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="text-xs text-muted-foreground italic line-clamp-3 leading-normal">
                                "{review.comment || "Rating only."}"
                              </p>
                              
                              {review.school_name && (
                                <p className="text-[10px] text-muted-foreground">
                                  School: <span className="font-medium text-foreground">{review.school_name}</span>
                                </p>
                              )}

                              <p className="text-[9px] text-muted-foreground uppercase font-medium">
                                {new Date(review.created_at).toLocaleDateString()}
                              </p>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-1 self-center shrink-0">
                          {review.is_legacy && !isEditing && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                                onClick={() => startEditing(review)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={() => handleDeleteLegacyReview(review.id)}
                                disabled={deletingId === review.id}
                              >
                                {deletingId === review.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </>
                          )}
                          
                          <div className="ml-2 pl-2 border-l">
                            <Switch
                              checked={review.is_visible}
                              onCheckedChange={(checked) =>
                                toggleReviewVisibility(review.id, checked)
                              }
                              aria-label={`Toggle review visibility`}
                              disabled={isEditing}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <MessageSquareQuote className="h-8 w-8 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    You haven&apos;t received any reviews yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
