import { useState } from 'react';

interface CodeBlockProps {
  title: string;
  examples: Record<string, string>;
}

export default function CodeBlock({ title, examples }: CodeBlockProps) {
  const languages = Object.keys(examples);
  const [activeLang, setActiveLang] = useState(languages[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(examples[activeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <h3 className="text-sm font-semibold text-gray-300">{title}</h3>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  activeLang === lang
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-xs rounded-md text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
          >
            {copied ? '✓ Copiado' : '📋 Copiar'}
          </button>
        </div>
      </div>
      <pre className="p-4 text-sm font-mono text-gray-300 overflow-x-auto bg-gray-950 leading-relaxed">
        <code>{examples[activeLang]}</code>
      </pre>
    </div>
  );
}
