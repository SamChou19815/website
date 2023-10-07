export default function BlogPostItem({
  title,
  formattedDate,
  children,
}: {
  title: JSX.Element | string;
  formattedDate: string;
  children?: React.ReactNode;
}): JSX.Element {
  const TitleHeading = typeof title === "string" ? "h1" : "h2";

  return (
    <article className="mb-4 rounded-md border border-solid border-gray-200 bg-white p-4 font-serif drop-shadow-sm filter">
      <header>
        <TitleHeading className="mb-2 font-sans">{title}</TitleHeading>
        <div className="my-4">{formattedDate}</div>
      </header>
      {children}
    </article>
  );
}
