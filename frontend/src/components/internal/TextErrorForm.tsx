function TextErrorForm({ children }: { children: string | undefined }) {
  return <span className="text-xs text-red-600 ml-3 mt-1">{children}</span>;
}

export default TextErrorForm;
