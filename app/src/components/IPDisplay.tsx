import { useQuery } from "@tanstack/react-query";
import { Loader2, Monitor, Copy, CheckCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Button } from "./ui/button";

const IPDisplay = () => {
  const { toast } = useToast();
  const [copiedIp, setCopiedIp] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["ip"],
    queryFn: async () => {
      const response = await fetch("https://api.ipty.org");
      if (!response.ok) {
        throw new Error("Failed to fetch IP address");
      }
      const ip = await response.text();
      return { ip };
    },
    retry: 1,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to fetch IP address. Please try again later.",
          variant: "destructive",
        });
      },
    },
  });

  const handleCopy = async (text: string, type: 'ip' | 'curl') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'ip') {
        setCopiedIp(true);
        setTimeout(() => setCopiedIp(false), 2000);
      } else {
        setCopiedCurl(true);
        setTimeout(() => setCopiedCurl(false), 2000);
      }
      toast({
        title: "Copied!",
        description: `${type === 'ip' ? 'IP address' : 'curl command'} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="glass-card rounded-xl p-8 w-full max-w-2xl mx-auto fade-in space-y-6">
      <h2 className="text-2xl font-medium mb-4 text-foreground/80">Your Network Information</h2>
      
      <div className="space-y-6">
        {/* IP Address Section */}
        <div className="space-y-2">
          <h3 className="text-lg text-foreground/60 flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Public IP Address
          </h3>
          <div className="flex items-center justify-center h-20 bg-background/50 rounded-lg">
            {isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            ) : error ? (
              <p className="text-destructive">Unable to fetch IP</p>
            ) : (
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-foreground break-all">{data?.ip}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => data?.ip && handleCopy(data.ip, 'ip')}
                  className="hover:bg-white/10"
                  title="Copy IP address"
                >
                  {copiedIp ? (
                    <CheckCheck className="text-green-500" />
                  ) : (
                    <Copy className="text-foreground/60" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Curl Command Section */}
        <div className="p-4 bg-background/50 rounded-lg">
          <h3 className="text-sm font-medium text-foreground/60 mb-2">Shell Command</h3>
          <div className="flex items-center justify-between gap-3">
            <code className="text-sm text-foreground/80 font-mono">curl -L api.ipty.org</code>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy('curl -L api.ipty.org', 'curl')}
              className="hover:bg-white/10 shrink-0"
              title="Copy curl command"
            >
              {copiedCurl ? (
                <CheckCheck className="text-green-500" />
              ) : (
                <Copy className="text-foreground/60" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPDisplay;
