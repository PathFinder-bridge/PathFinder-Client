'use client';

import React from 'react';
import { Layout } from '@/layout/Layout';
import { HeroSection } from '@/components/HomePage/HeroSection';
import { FeatureSection } from '@/components/HomePage/FeatureSection';

export default function HomePage() {
    return (
        <Layout variant="landing">
            <HeroSection />
            <FeatureSection />
        </Layout>
    );
}