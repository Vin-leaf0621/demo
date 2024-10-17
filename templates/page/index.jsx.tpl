import { PageContainer } from '@ant-design/pro-components';
import ss from './{{{name}}}{{{ cssExt }}}';

const Page = () => {
  return (
    <PageContainer className={ss.page}>
      <p className={ss.title}>Page {{{ name }}}</p>
    </PageContainer>
  );
}

export default Page;