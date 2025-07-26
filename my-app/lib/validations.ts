import { z } from "zod";

export const websiteIdeaSchema = z.object({
  idea: z
    .string()
    .min(10, "Please provide at least 10 characters for your website idea")
    .max(1000, "Website idea must be less than 1000 characters")
    .trim(),
});

export type WebsiteIdeaFormData = z.infer<typeof websiteIdeaSchema>;
