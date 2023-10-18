import { Loading } from "@/components/loading";
import React, { useState } from "react";

const LoadingBoundary = ({ children }: { children: React.ReactNode }) => {
  const [loading] = useState(false);

  if (loading) {
    return <Loading />;
  }

  return children;
};

export default LoadingBoundary;
