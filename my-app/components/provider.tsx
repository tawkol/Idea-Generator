"use client";
import { Provider } from "jotai";

interface IdeasProviderProps {
  children: React.ReactNode;
}

export function IdeasProvider({ children }: Readonly<IdeasProviderProps>) {
  return <Provider>{children}</Provider>;
}
