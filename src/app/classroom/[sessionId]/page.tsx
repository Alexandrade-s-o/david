import Loader from "./loader";

export function generateStaticParams() {
  return [{ sessionId: "_" }];
}

export default function Page({ params }: { params: { sessionId: string } }) {
  return <Loader params={params} />;
}
