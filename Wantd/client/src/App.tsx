import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { I18nProvider } from "@/components/I18nProvider";
import { AuthProvider } from "@/components/AuthProvider";
import Header from "@/components/Header";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import PostWant from "@/pages/PostWant";
import Browse from "@/pages/Browse";
import WantDetail from "@/pages/WantDetail";
import Auth from "@/pages/Auth";
import Notifications from "@/pages/Notifications";
import Export from "@/pages/Export";

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/post" component={PostWant} />
      <Route path="/browse" component={Browse} />
      <Route path="/wants/:id" component={WantDetail} />
      <Route path="/auth" component={Auth} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/export" component={Export} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <I18nProvider>
            <AuthProvider>
              <Toaster />
              <div className="flex min-h-screen flex-col">
                <Router hook={useHashLocation}>
                  <Header />
                  <main className="flex-1">
                    <AppRouter />
                  </main>
                  <footer className="border-t border-border/40 py-4 text-center">
                    <PerplexityAttribution />
                  </footer>
                </Router>
              </div>
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
