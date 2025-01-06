import { authSignUp } from "@/app/(server)/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { cn } from "@/lib/utils/cn";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>
            Enter your information below to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  name="first-name"
                  id="first-name"
                  type="text"
                  placeholder="John"
                  required
                />
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  name="last-name"
                  id="last-name"
                  type="text"
                  placeholder="Doe"
                  required
                />
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  required
                />
                <Label htmlFor="password">Password</Label>
                <Input
                  name="password"
                  id="password"
                  type="password"
                  placeholder="********"
                  required
                  minLength={6}
                />
              </div>
              <SubmitButton
                className="w-full"
                pendingText="Signing Up..."
                formAction={authSignUp}
              >
                Sign up
              </SubmitButton>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/sign-in" className="underline underline-offset-4">
                Sign in
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
