import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { useI18n } from "@/i18n/index";

export default function Auth() {
  const { t } = useI18n();
  const { login, register, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regDisplayName, setRegDisplayName] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      await login(loginUsername, loginPassword);
      toast({ title: t("auth.loginSuccess") });
      navigate("/");
    } catch (err: any) {
      toast({
        title: t("common.error"),
        description: err.message || "Login failed",
        variant: "destructive",
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    try {
      await register({
        username: regUsername,
        email: regEmail,
        password: regPassword,
        displayName: regDisplayName,
      });
      toast({ title: t("auth.registerSuccess") });
      navigate("/");
    } catch (err: any) {
      toast({
        title: t("common.error"),
        description: err.message || "Registration failed",
        variant: "destructive",
      });
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <Card className="border border-border/80">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-center">Wantd</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" data-testid="tab-login">{t("auth.login")}</TabsTrigger>
              <TabsTrigger value="register" data-testid="tab-register">{t("auth.register")}</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username" className="text-xs font-medium">{t("auth.username")}</Label>
                  <Input
                    id="login-username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    required
                    autoComplete="username"
                    data-testid="input-login-username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-xs font-medium">{t("auth.password")}</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    data-testid="input-login-password"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loginLoading} data-testid="button-login">
                  {loginLoading ? t("common.loading") : t("auth.loginBtn")}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-username" className="text-xs font-medium">{t("auth.username")}</Label>
                  <Input
                    id="reg-username"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    required
                    minLength={3}
                    autoComplete="username"
                    data-testid="input-register-username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-xs font-medium">{t("auth.email")}</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    autoComplete="email"
                    data-testid="input-register-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-displayname" className="text-xs font-medium">{t("auth.displayName")}</Label>
                  <Input
                    id="reg-displayname"
                    value={regDisplayName}
                    onChange={(e) => setRegDisplayName(e.target.value)}
                    required
                    data-testid="input-register-displayname"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password" className="text-xs font-medium">{t("auth.password")}</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    data-testid="input-register-password"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={regLoading} data-testid="button-register">
                  {regLoading ? t("common.loading") : t("auth.registerBtn")}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
