'use client';

interface StreamingMessageProps {
  content: string;
  isComplete: boolean;
}

export default function StreamingMessage({ content, isComplete }: StreamingMessageProps) {
  if (!content) return null;
  
  return (
    <div className="flex items-start space-x-3 mb-4">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
          <span className="text-white text-sm font-semibold">E</span>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg px-4 py-3 max-w-[80%]">
        <p className="text-gray-100 whitespace-pre-wrap">
          {content}
          {!isComplete && (
            <span className="inline-block w-1 h-4 bg-purple-500 ml-1 animate-pulse"></span>
          )}
        </p>
      </div>
    </div>
  );
}
