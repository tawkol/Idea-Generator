"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lightbulb, Loader2, Send } from "lucide-react";
import { websiteIdeaSchema, type WebsiteIdeaFormData } from "@/lib/validations";
import { useState } from "react";
import { submitIdea } from "@/lib/api";
import { addIdeaAtom } from "@/lib/store";
import { useSetAtom } from "jotai";

export function IdeaForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const addIdea = useSetAtom(addIdeaAtom);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<WebsiteIdeaFormData>({
    resolver: zodResolver(websiteIdeaSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: WebsiteIdeaFormData) => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const results = await submitIdea(data.idea);

      addIdea(results);
      setSuccess("✨ Website sections generated successfully!");

      // Optionally, you can reset the form or perform other actions
      reset();
    } catch (error) {
      console.error("Error submitting idea:", error);
      setError("❌ Failed to generate website sections.");
    } finally {
      setIsLoading(false);
      reset();
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Submit Your Idea
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="idea"
              className="text-sm font-medium text-slate-700"
            >
              Describe your website idea
            </label>
            <Textarea
              id="idea"
              placeholder="e.g., A modern portfolio website for a graphic designer with a gallery section and contact form..."
              {...register("idea")}
              className="min-h-[100px] resize-none"
              disabled={isLoading}
            />
            {errors.idea && (
              <p className="text-sm text-red-600 mt-1">{errors.idea.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || !isValid}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Sections...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Generate Website Sections
              </>
            )}
          </Button>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
