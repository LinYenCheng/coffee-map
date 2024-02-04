import { ReactNode } from 'react';

interface ConditionalRendererProps {
  isShowContent: boolean;
  children: ReactNode;
}

function ConditionalRenderer({
  isShowContent,
  children,
}: ConditionalRendererProps): JSX.Element | null {
  return isShowContent ? <>{children}</> : null;
}

export default ConditionalRenderer;
