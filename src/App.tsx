import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Hello World
        </h1>
        <p className="text-muted-foreground">
          Your clean slate is ready for development.
        </p>
      </div>
      <Toaster />
    </div>
  );
}

export default App;