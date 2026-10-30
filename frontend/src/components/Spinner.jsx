import { Loader2 } from 'lucide-react';

export default function Spinner({ fullScreen = false, label = 'Loading' }) {
  const spinner = <Loader2 className="h-6 w-6 animate-spin text-teal-700" aria-label={label} />;
  if (!fullScreen) return <div className="flex justify-center py-16">{spinner}</div>;
  return <div className="flex min-h-screen items-center justify-center">{spinner}</div>;
}
