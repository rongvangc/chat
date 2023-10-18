import { Loading } from "@/components/loading";
import useChatStore from "@/stores/chat";
import React, { useEffect, useState } from "react";

const LoadingBoundary = ({ children }: { children: React.ReactNode }) => {
  const { rooms, selectedRoom } = useChatStore();
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <Loading />;
  }

  return children;
};

export default LoadingBoundary;
