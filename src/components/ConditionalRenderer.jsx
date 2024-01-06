function ConditionalRenderer({ isShowContent, children }) {
  return isShowContent ? <>{children}</> : null;
}

export default ConditionalRenderer;
