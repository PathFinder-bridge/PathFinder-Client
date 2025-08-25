'use client';

import React from 'react';
import { Layout } from '@/layout/Layout';
import { HeroSection } from '@/components/HomePage/HeroSection';
import { FeatureSection } from '@/components/HomePage/FeatureSection';
import { ChatSection } from '@/components/HomePage/ChatSection';
import { RecommendationSection } from '@/components/HomePage/RecommendationSection';

export default function HomePage() {
    return (
        <Layout variant="landing">
            {/* Hero Section */}
            <HeroSection />

            {/* Feature Section */}
            <FeatureSection />

            {/* Chat Section */}
            <ChatSection />

            {/* Recommendation Section */}
            <RecommendationSection />
        </Layout>
    );
}