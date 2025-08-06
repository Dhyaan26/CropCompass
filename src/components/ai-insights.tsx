"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText } from 'lucide-react';

export default function AiInsights() {
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFileName(event.target.files[0].name);
        } else {
            setFileName(null);
        }
    }

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>5. AI Insights from Your Data</CardTitle>
                <CardDescription>Upload your farm data (CSV, XLS, PDF) to get personalized insights on yields, costs, and risks.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <div className="rounded-lg border-2 border-dashed border-border p-8">
                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-sm text-muted-foreground">
                        Drag and drop your file here or click to upload.
                    </p>
                    <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".csv, .xls, .xlsx, .pdf" />
                    <Button asChild className="mt-4">
                        <label htmlFor="file-upload">
                            Choose File
                        </label>
                    </Button>
                    {fileName && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            <span>{fileName}</span>
                        </div>
                    )}
                </div>
                <Button className="mt-6 w-full md:w-1/2" disabled={!fileName}>
                    Analyze Data
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">(Data analysis feature is coming soon)</p>
            </CardContent>
        </Card>
    );
}
