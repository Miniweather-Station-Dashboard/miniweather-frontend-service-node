"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";          // allow inline HTML *before* sanitizing
import rehypeSanitize from "rehype-sanitize"; // sanitize to prevent XSS
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";


export default function Markdown({ content, className = "" }) {
  return (
    <div className={`prose prose-neutral max-w-none whitespace-pre-line ${className}`}>
      <ReactMarkdown
        // GitHub-style markdown: tables, strikethrough, task lists, autolinks
        remarkPlugins={[remarkGfm]}
        // Allow limited HTML but sanitize it
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          h1: ({node, ...props}) => (
            <h1 className="text-3xl md:text-4xl font-extrabold" {...props} />
          ),
          h2: ({node, ...props}) => (
            <h2 className="text-2xl md:text-3xl font-bold mt-8" {...props} />
          ),
          h3: ({node, ...props}) => (
            <h3 className="text-xl md:text-2xl font-semibold mt-6" {...props} />
          ),
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || "");
            if (!inline && match) {
              return (
                <SyntaxHighlighter language={match[1]} PreTag="div" {...props}>
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              );
            }
            return (
              <code className="px-1 py-0.5 rounded bg-gray-100" {...props}>
                {children}
              </code>
            );
          },
          img: ({node, ...props}) => (
            // keep simple <img>; swap for next/image if you want optimization
            <img loading="lazy" className="rounded-lg shadow" {...props} />
          ),
          a: ({node, ...props}) => (
            <a className="text-blue-600 underline hover:no-underline" {...props} />
          ),
          ul: ({node, ...props}) => <ul className="list-disc pl-6" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-6" {...props} />,
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 pl-4 italic text-gray-600" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
