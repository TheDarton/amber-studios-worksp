import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Spark</CardTitle>
          <CardDescription>
            Your template is ready to build amazing applications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Current count: <span className="font-semibold">{count}</span>
            </p>
            <div className="flex gap-2 justify-center">
              <Button 
                onClick={() => setCount(count - 1)}
                variant="outline"
                size="sm"
              >
                -
              </Button>
              <Button 
                onClick={() => setCount(count + 1)}
                size="sm"
              >
                +
              </Button>
            </div>
          </div>
          <div className="text-center">
            <Button 
              onClick={() => setCount(0)} 
              variant="secondary"
              size="sm"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}

export default App;