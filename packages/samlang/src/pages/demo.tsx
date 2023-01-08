import HeadTitle from 'esbuild-scripts/components/HeadTitle';
import LanguageDemo from '../components/demo';

export default function Demo(): JSX.Element {
  return (
    <>
      <HeadTitle title="Demo | samlang" />
      <LanguageDemo />;
    </>
  );
}
