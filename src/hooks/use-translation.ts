"use client";

import { useLanguage } from '@/context/language-context';

export function useTranslation() {
    return useLanguage();
}
