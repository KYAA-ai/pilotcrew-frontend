import React from "react";

interface AgenticAuthGuardProps {
  children: React.ReactElement;
}

export function AgenticAuthGuard({ children }: AgenticAuthGuardProps) {
  // For testing purposes, just return the children without validation
  return children;
} 