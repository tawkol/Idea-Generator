import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <div className="text-center py-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Sparkles className="h-8 w-8 text-blue-600" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Website Idea Generator
        </h1>
      </div>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto">
        Transform your ideas into professional website sections with AI-powered
        intelligence
      </p>
    </div>
  );
}
