import HeadTitle from 'esbuild-scripts/components/HeadTitle';
import LanguageDemo from '../components/demo';
import SamlangDocumentWrapper from '../components/SamlangDocumentWrapper';

export default function Demo(): JSX.Element {
  return (
    <SamlangDocumentWrapper>
      <HeadTitle title="Demo | samlang" />
      <LanguageDemo />;
    </SamlangDocumentWrapper>
  );
}
