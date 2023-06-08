import React from "react";
import { Suspense } from "react";
import { GetServerSideProps } from "next";

type Props = {
  branding: string;
};

export default function ChatPlaceholder({branding}:Props) {
  if (branding === undefined) {
    branding = "Azure OpenAI Playground";
  }

console.log("branding: " + branding);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="max-w-3xl p-4 text-center text-primary">
      <h1 className="text-4xl font-medium">{branding}</h1>
      </div>
    </div>
  );
}