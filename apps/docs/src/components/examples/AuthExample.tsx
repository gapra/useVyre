import { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Field,
  Input,
  Separator,
} from "@usevyre/react";

export function AuthExample() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showHint, setShowHint] = useState(false);

  const emailError =
    email.length > 0 && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
      ? "Enter a valid email address"
      : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowHint(true);
  };

  return (
    <div className="vyre-example-auth">
      <Card variant="elevated" style={{ width: "100%", maxWidth: 420 }}>
        <CardHeader>
          <div className="vyre-example-auth__head">
            <span className="vyre-example-auth__logo" aria-hidden="true" />
            <Badge variant="teal" dot>Beta</Badge>
          </div>
          <h1 className="vyre-example-auth__title">Welcome back</h1>
          <p className="vyre-example-auth__sub">
            Sign in to your useVyre account.
          </p>
        </CardHeader>

        <CardBody>
          {showHint && (
            <div style={{ marginBottom: 16 }}>
              <Alert variant="info">
                This is a demo — submission is stubbed.
              </Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} className="vyre-example-auth__form">
            <Field
              label="Email"
              state={emailError ? "error" : "idle"}
              hint={emailError}
            >
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </Field>

            <Field label="Password">
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </Field>

            <div className="vyre-example-auth__row">
              <label className="vyre-example-auth__remember">
                <Checkbox
                  checked={remember}
                  onCheckedChange={(v) => setRemember(Boolean(v))}
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="vyre-example-auth__link">Forgot password?</a>
            </div>

            <Button variant="accent" type="submit" style={{ width: "100%" }}>
              Sign in
            </Button>
          </form>

          <div className="vyre-example-auth__divider">
            <Separator />
            <span>or continue with</span>
            <Separator />
          </div>

          <div className="vyre-example-auth__providers">
            <Button variant="secondary" type="button" style={{ flex: 1 }}>
              GitHub
            </Button>
            <Button variant="secondary" type="button" style={{ flex: 1 }}>
              Google
            </Button>
          </div>
        </CardBody>

        <CardFooter>
          <p className="vyre-example-auth__foot">
            Don't have an account?{" "}
            <a href="#" className="vyre-example-auth__link">Create one</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
