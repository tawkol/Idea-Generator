import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <Card className="max-w-md w-full shadow-lg border-0 bg-white/80 backdrop-blur">
        <CardHeader className="text-center">
          <div className="text-6xl font-bold text-blue-600 mb-4">404</div>
          <CardTitle className="text-xl font-bold text-slate-800">
            Page Not Found
          </CardTitle>
          <CardDescription>
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Search className="h-16 w-16 text-slate-300" />
          </div>

          <Button
            asChild
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Generator
            </Link>
          </Button>

          <div className="text-center">
            <p className="text-xs text-slate-500">
              Return to the Website Idea Generator to create amazing website
              sections.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
