import { Suspense } from "react";
import SearchPage from "./SearchPage";

export default function SearchWrapper() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <SearchPage />
    </Suspense>
  );
}
