"use client";

import { Suspense } from "react";
import ReviewFormPage from "./reviewFormPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading product...</div>}>
      <ReviewFormPage />
    </Suspense>
  );
}
