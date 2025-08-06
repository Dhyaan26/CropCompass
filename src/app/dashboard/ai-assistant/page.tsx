
'use client';

import ChatAssistant from "@/components/chat-assistant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";

export default function AiAssistantPage() {
    const { t } = useTranslation();
    return (
        <Card className="shadow-lg w-full max-w-4xl mx-auto h-[80vh] flex flex-col">
            <CardHeader>
                <CardTitle>{t('chatAssistant.title')}</CardTitle>
                <CardDescription>{t('chatAssistant.description')}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <ChatAssistant />
            </CardContent>
        </Card>
    );
}
