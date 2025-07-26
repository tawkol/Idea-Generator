import { fetchWebsiteIdeas } from "@/lib/api";
import { WebsiteIdea } from "@/lib/types";
import { IdeasList } from "@/components/ideas-list";

export async function IdeasServerWrapper() {
  let ideas: WebsiteIdea[] = [];

  try {
    ideas = await fetchWebsiteIdeas();
  } catch (error) {
    console.error("Failed to fetch ideas on server:", error);
    // Return empty array on server error - client can retry
  }

  return <IdeasList initialIdeas={ideas} />;
}
