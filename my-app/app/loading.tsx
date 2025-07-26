import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-700 mb-2">
          Loading Website Generator
        </h2>
        <p className="text-slate-500">
          Preparing your AI-powered website creation experience...
        </p>
      </div>
    </div>
  );
}
