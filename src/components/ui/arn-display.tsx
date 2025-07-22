import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from './button';

interface ArnDisplayProps {
  arn: string;
  maxLength?: number;
}

export function ArnDisplay({ arn, maxLength = 20}: ArnDisplayProps) {
  const [copied, setCopied] = useState(false);

  const truncatedArn = arn.length > maxLength 
    ? `${arn.substring(0, maxLength)}...` 
    : arn;

  const handleCopy = () => {
    navigator.clipboard.writeText(arn);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group flex items-center gap-1 bg-muted/30 rounded p-2 text-xs text-muted-foreground font-mono overflow-hidden">
      <div className="truncate flex-1">{truncatedArn}</div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" 
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-3 w-3 text-green-500" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
}
