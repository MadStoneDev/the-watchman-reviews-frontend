"use client";

import * as React from "react";
import {useEffect} from "react";
import {initMixpanel} from "@/src/lib/mixpanel-client";

export function AnalyticsProvider({ children }: Readonly<{
    children: React.ReactNode;
}> ) {
    useEffect(() => {
        initMixpanel(); // Initialize Mixpanel
    }, []);
    
    return <>{children}</>;
}
