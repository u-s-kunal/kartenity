"use client";

import { Suspense } from "react";
import ProductList from "./ProductList";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading product...</div>}>
      <ProductList />
    </Suspense>
  );
}
