"use client";

import { NextStudio } from "next-sanity/studio";
import { Config, StudioProvider, StudioLayout } from "sanity";
import config from "../../../sanity-config/sanity.config";

export default function StudioPage() {
  return (
    <div style={{ height: "100vh", width: "100vw", position: "fixed", top: 0, left: 0, zIndex: 9999 }}>
      <NextStudio config={config as Config}>
        <StudioProvider config={config as Config}>
           <StudioLayout />
        </StudioProvider>
      </NextStudio>
    </div>
  );
}