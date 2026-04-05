import LessonPage from "./client";

export function generateStaticParams() {
  return [{ courseId: "_", lessonId: "_" }];
}

export default function Page({ params }: { params: { courseId: string; lessonId: string } }) {
  return <LessonPage params={params} />;
}
