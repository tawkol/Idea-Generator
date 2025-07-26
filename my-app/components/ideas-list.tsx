"use client";
import { useAtom, useSetAtom } from "jotai";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Eye, Trash, Loader2 } from "lucide-react";
import {
  ideasAtom,
  removeIdeaAtom,
  selectedIdeaAtom,
  selectIdeaAtom,
} from "@/lib/store";
import { WebsiteIdea } from "@/lib/types";
import { useEffect, useState } from "react";
import { deleteIdea } from "@/lib/api";

export function IdeasList({
  initialIdeas,
}: Readonly<{ initialIdeas?: WebsiteIdea[] }>) {
  const [ideas, setIdeas] = useAtom(ideasAtom);
  const [selectedIdea] = useAtom(selectedIdeaAtom);
  const [, selectIdea] = useAtom(selectIdeaAtom);
  const removeIdea = useSetAtom(removeIdeaAtom);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Initialize ideas from props if provided
  useEffect(() => {
    if (initialIdeas && initialIdeas.length > 0) {
      setIdeas(initialIdeas);
    }
  }, [initialIdeas, setIdeas]);

  const handleDelete = async (ideaId: string) => {
    try {
      setLoading(true);
      await deleteIdea(ideaId);
      removeIdea(ideaId);
      if (ideaId === selectedIdea?._id) selectIdea(null);
    } catch (error) {
      console.error("Error deleting idea:", error);
      alert("Failed to delete idea. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card className="mt-6 shadow-lg border-0 bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          Recent Ideas ({ideas.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {ideas.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Clock className="h-12 w-12 mx-auto mb-3 text-slate-300" />
            <p>No ideas yet!</p>
            <p className="text-sm">Create your first website idea above.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {ideas.map((websiteIdea: WebsiteIdea) => (
              <CardAction
                key={websiteIdea._id}
                className={`w-full p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md text-left ${
                  selectedIdea?._id === websiteIdea._id
                    ? "border-blue-300 bg-blue-50 shadow-sm"
                    : "border-slate-200 hover:border-slate-300"
                }`}
                onClick={() => selectIdea(websiteIdea)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 line-clamp-2">
                      {websiteIdea.idea}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {websiteIdea.sections.length} sections
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {formatDate(websiteIdea.createdAt)}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectIdea(websiteIdea);
                    }}
                  >
                    <Eye className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingId(websiteIdea._id);
                      handleDelete(websiteIdea._id);
                    }}
                  >
                    {loading && deletingId === websiteIdea._id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash className="size-4" />
                    )}
                  </Button>
                </div>
              </CardAction>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
