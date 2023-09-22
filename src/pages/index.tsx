import ChatMessages from "@/components/chat/ChatMessages";
import ChatSidebar from "@/components/chat/sidebar/ChatSidebar";
import Head from "next/head";
import React, { useEffect } from "react";
import { useOpenAI } from "@/context/OpenAIProvider";
import ChatHeader from "@/components/chat/ChatHeader";
import { GetServerSideProps } from "next";

type Props = {
  branding: string;
};

export default function Chat(props: Props) {
  const { clearConversation } = useOpenAI();

  useEffect(() => {
    clearConversation();
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>OpenAI</title>
        <meta name="description" content="A clone of OpenAI playground." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-screen relative h-screen max-h-screen w-screen overflow-hidden">
        <ChatHeader />
        <ChatMessages branding={props.branding} />
        <ChatSidebar />
      </div>
    </React.Fragment>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: Props = {
    branding: process.env.AZURE_OPENAI_SITE_BRANDING || "Azure OpenAI Playground",
  };

  console.log("server side / branding: " + props.branding);

  return {
    props: props,
  };
};