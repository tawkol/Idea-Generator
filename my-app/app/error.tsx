"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <Card className="max-w-md w-full shadow-lg border-0 bg-white/80 backdrop-blur">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-800">
            Something went wrong!
          </CardTitle>
          <CardDescription>
            We encountered an unexpected error while loading the Website Idea
            Generator.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800 font-medium">Error Details:</p>
            <p className="text-xs text-red-600 mt-1 break-words">
              {error.message || "An unknown error occurred"}
            </p>
          </div>

          <Button
            onClick={reset}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>

          <div className="text-center">
            <p className="text-xs text-slate-500">
              If the problem persists, please check that the backend is running
              on port 3001.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
