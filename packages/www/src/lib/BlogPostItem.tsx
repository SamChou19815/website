import Link from "next/link";

type Props = {
  readonly metadata: BlogPostMetadata;
  readonly truncated?: boolean;
  readonly children?: React.ReactNode;
};

export default function BlogPostItem(props: Props): JSX.Element {
  const { children, metadata, truncated } = props;
  const { title, formattedDate, permalink } = metadata;

  const TitleHeading = truncated ? "h2" : "h1";

  return (
    <article className="mb-4 rounded-md border border-solid border-gray-200 bg-white p-4 font-serif drop-shadow-sm filter">
      <header>
        <TitleHeading className="mb-2 font-sans">
          {truncated ? <Link href={permalink}>{title}</Link> : title}
        </TitleHeading>
        <div className="my-4">{formattedDate}</div>
      </header>
      {children && <div className="markdown">{children}</div>}
    </article>
  );
}
