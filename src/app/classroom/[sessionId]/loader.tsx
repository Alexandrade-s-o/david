"use client";

import dynamic from "next/dynamic";

const ClassroomPage = dynamic(() => import("./client"), { ssr: false });

export default function Loader(props: { params: { sessionId: string } }) {
  return <ClassroomPage {...props} />;
}
