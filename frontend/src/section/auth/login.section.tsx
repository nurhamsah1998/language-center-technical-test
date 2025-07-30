import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import TextErrorForm from "@/components/internal/TextErrorForm";

type loginFormProps = {
  email: string;
  password: string;
};
const LoginSection = ({ className, ...props }: React.ComponentProps<"div">) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormProps>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: loginFormProps) => {
    console.log(values);
  };
  return (
    <div className="  min-h-dvh flex justify-center items-center">
      <div
        className={cn("flex flex-col gap-6 md:min-w-sm", className)}
        {...props}
      >
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: "email is required",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <div className="grid gap-3">
                      <Label htmlFor="email">Email</Label>
                      <div>
                        <Input
                          onChange={onChange}
                          value={value}
                          id="email"
                          type="email"
                          placeholder="m@example.com"
                        />
                        {errors?.email && (
                          <TextErrorForm>
                            {errors?.email?.message}
                          </TextErrorForm>
                        )}
                      </div>
                    </div>
                  )}
                />
                <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: "password is required",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <div className="grid gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <a
                          href="#"
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </a>
                      </div>
                      <div>
                        <Input
                          onChange={onChange}
                          value={value}
                          id="password"
                          type="password"
                        />
                        {errors?.password && (
                          <TextErrorForm>
                            {errors?.password?.message}
                          </TextErrorForm>
                        )}
                      </div>
                    </div>
                  )}
                />

                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/register" className="underline underline-offset-4">
                  register
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginSection;
