import { atom } from "jotai";
import { WebsiteIdea } from "@/lib/types";

// Atoms for ideas management
export const ideasAtom = atom<WebsiteIdea[]>([]);
export const selectedIdeaAtom = atom<WebsiteIdea | null>(null);

// Derived atoms
export const ideasCountAtom = atom((get) => get(ideasAtom).length);

// Action atoms
export const addIdeaAtom = atom(null, (get, set, newIdea: WebsiteIdea) => {
  const currentIdeas = get(ideasAtom);
  set(ideasAtom, [newIdea, ...currentIdeas]);
  set(selectedIdeaAtom, newIdea);
});

export const selectIdeaAtom = atom(
  null,
  (get, set, idea: WebsiteIdea | null) => {
    set(selectedIdeaAtom, idea);
  }
);

export const removeIdeaAtom = atom(
  null,
  (get, set, ideaId: string) => {
    const currentIdeas = get(ideasAtom);
    set(
      ideasAtom,
      currentIdeas.filter((idea) => idea._id !== ideaId)
    );
    if (get(selectedIdeaAtom)?._id === ideaId) {
      set(selectedIdeaAtom, null);
    }
  }
);

export const updateIdeaAtom = atom(
  null,
  (get, set, updatedIdea: WebsiteIdea) => {
    const currentIdeas = get(ideasAtom);
    const updatedIdeas = currentIdeas.map((idea) =>
      idea._id === updatedIdea._id ? updatedIdea : idea
    );
    set(ideasAtom, updatedIdeas);
    if (get(selectedIdeaAtom)?._id === updatedIdea._id) {
      set(selectedIdeaAtom, updatedIdea);
    }
  }
);
