import { WebsiteIdea } from "@/lib/types";

export async function submitIdea(idea: string): Promise<WebsiteIdea> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/ideas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idea: idea.trim() }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function fetchWebsiteIdeas(): Promise<WebsiteIdea[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/ideas`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function updateIdea(
  ideaId: string,
  sections: WebsiteIdea["sections"]
): Promise<WebsiteIdea> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/ideas/${ideaId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sections }),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function deleteIdea(ideaId: string): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/ideas/${ideaId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}
