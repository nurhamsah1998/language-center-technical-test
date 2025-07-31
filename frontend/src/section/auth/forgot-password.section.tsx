import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import TextErrorForm from "@/components/internal/TextErrorForm";
import { useTransition } from "react";
import AXIOS from "@/utils/axios";

type loginFormProps = {
  email: string;
};
const ForgotPasswordSection = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormProps>({
    defaultValues: {
      email: "",
    },
  });
  const [isPending, startTransition] = useTransition();
  const onSubmit = (values: loginFormProps) => {
    startTransition(async () => {
      try {
        const res = await AXIOS.post("/auth/forgot-password", values);
        toast.success(res?.data?.message);
        reset();
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
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>
              Enter your email for receiving link for set new password
            </CardDescription>
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
                <div className="flex flex-col gap-3">
                  <Button disabled={isPending} type="submit" className="w-full">
                    Send
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Back to{" "}
                <a href="/login" className="underline underline-offset-4">
                  login
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordSection;
