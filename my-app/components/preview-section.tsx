"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, Code, Eye, EyeOff, Copy, Check } from "lucide-react";
import { useAtomValue, useSetAtom } from "jotai";
import { selectedIdeaAtom, updateIdeaAtom } from "@/lib/store";
import { updateIdea } from "@/lib/api";
import { useForm } from "react-hook-form";

export function PreviewSection() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const selectedIdea = useAtomValue(selectedIdeaAtom);
  const setUpdateIdea = useSetAtom(updateIdeaAtom);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<{ html: string }>({
    defaultValues: { html: "" },
  });

  const handleCopyCode = async (html: string, sectionName: string) => {
    try {
      await navigator.clipboard.writeText(html);
      setCopiedSection(sectionName);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const toggleSectionExpansion = (sectionName: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionName)) {
      newExpanded.delete(sectionName);
    } else {
      newExpanded.add(sectionName);
    }
    setExpandedSections(newExpanded);
  };

  const handleEditSection = (sectionName: string, html: string) => {
    setEditingSection(sectionName);
    reset({ html });
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
  };

  const handleSaveSection = async (data: { html: string }) => {
    if (!selectedIdea || !editingSection) return;
    try {
      setSaving(true);
      const updatedSections = selectedIdea.sections.map((section) =>
        section.name === editingSection
          ? { ...section, html: data.html }
          : section
      );
      console.log(updatedSections);

      const result = await updateIdea(selectedIdea._id, updatedSections);
      setUpdateIdea(result);
      setEditingSection(null);
    } catch (err) {
      console.error("Error updating section:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!selectedIdea) {
    return (
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur min-h-[600px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-green-500" />
            Website Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96 text-center">
            <div>
              <Monitor className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">
                No Website Selected
              </h3>
              <p className="text-slate-500">
                Submit an idea or select from your recent ideas to see the
                generated website sections.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur min-h-[600px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-green-500" />
            Website Preview
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "preview" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("preview")}
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
            <Button
              variant={viewMode === "code" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("code")}
            >
              <Code className="h-4 w-4 mr-1" />
              Code
            </Button>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-sm text-slate-600 line-clamp-2">
            {selectedIdea.idea}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">
              {selectedIdea.sections.length} sections
            </Badge>
            <span className="text-xs text-slate-500">
              Generated {new Date(selectedIdea.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "preview" ? (
          <div className="space-y-6">
            {selectedIdea.sections.map((section) => (
              <div
                key={section.name}
                className="border rounded-lg overflow-hidden"
              >
                <div className="bg-slate-50 px-4 py-2 border-b flex items-center justify-between">
                  <h3 className="font-medium text-slate-700">{section.name}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleEditSection(section.name, section.html)
                    }
                  >
                    Edit
                  </Button>
                </div>
                <div className="p-4 bg-white">
                  {editingSection === section.name ? (
                    <form
                      onSubmit={handleSubmit(handleSaveSection)}
                      className="space-y-2"
                    >
                      <textarea
                        className="w-full min-h-[120px] border rounded p-2 text-sm font-mono"
                        {...register("html", { required: true })}
                        disabled={isSubmitting || saving}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          type="submit"
                          disabled={isSubmitting || saving}
                        >
                          {isSubmitting || saving ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          type="button"
                          onClick={handleCancelEdit}
                          disabled={isSubmitting || saving}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: section.html }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {selectedIdea.sections.map((section) => {
              const isExpanded = expandedSections.has(section.name);
              const truncatedHtml =
                section.html.length > 200
                  ? section.html.substring(0, 200) + "..."
                  : section.html;

              return (
                <div key={section.name} className="border rounded-lg">
                  <div className="bg-slate-50 px-4 py-3 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-slate-700">
                        {section.name}
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSectionExpansion(section.name)}
                        >
                          {isExpanded ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleCopyCode(section.html, section.name)
                          }
                        >
                          {copiedSection === section.name ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded text-sm overflow-x-auto">
                      <code>{isExpanded ? section.html : truncatedHtml}</code>
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
