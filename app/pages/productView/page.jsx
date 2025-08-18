"use client";

import { Suspense } from "react";
import ProductViewPage from "./ProductViewPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading product...</div>}>
      <ProductViewPage />
    </Suspense>
  );
}
