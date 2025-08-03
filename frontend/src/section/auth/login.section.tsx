import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import TextErrorForm from "@/components/internal/TextErrorForm";
import { useState, useTransition } from "react";
import AXIOS from "@/utils/axios";
import { useUserSession } from "@/store/user-session.store";
import { useNavigate } from "react-router-dom";

type loginFormProps = {
  email: string;
  password: string;
};
const LoginSection = ({ className, ...props }: React.ComponentProps<"div">) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<loginFormProps>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isPending, startTransition] = useTransition();
  const { login } = useUserSession();
  const [show, setShow] = useState(false);
  const nav = useNavigate();
  const onSubmit = (values: loginFormProps) => {
    startTransition(async () => {
      try {
        const res = await AXIOS.post("/auth/login", values);
        reset();
        const { accessToken, id, refreshToken, email, role } = res?.data || {};
        const { name, phoneNumber } = res?.data?.profile || {};
        login({
          name,
          phoneNumber,
          email,
          id,
          role,
        });
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        if (role === "Admin") {
          nav("/admin");
        } else {
          nav("/");
        }
      } catch (error) {
        toast.error((error as any)?.response?.data?.message);
      }
    });
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
                          href="/forgot-password"
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </a>
                      </div>
                      <div className=" relative">
                        <div
                          onClick={() => setShow(!show)}
                          className=" bg-slate-300 cursor-pointer top-1.5 px-1 rounded-md absolute right-2"
                        >
                          {show ? "hide" : "show"}
                        </div>
                        <Input
                          onChange={onChange}
                          value={value}
                          id="password"
                          type={show ? "text" : "password"}
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
                  <Button disabled={isPending} type="submit" className="w-full">
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
              <div className="mt-4 text-center text-sm">
                Go explore our{" "}
                <a href="/" className="underline underline-offset-4">
                  product
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
