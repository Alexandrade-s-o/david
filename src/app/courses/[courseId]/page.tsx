import CourseDetailPage from "./client";

export function generateStaticParams() {
  return [{ courseId: "_" }];
}

export default function Page({ params }: { params: { courseId: string } }) {
  return <CourseDetailPage params={params} />;
}
