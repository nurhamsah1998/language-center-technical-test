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
import { useState, useTransition } from "react";
import AXIOS from "@/utils/axios";
import { useNavigate, useParams } from "react-router-dom";

type resetPasswordFormProps = {
  newPassword: string;
  retypePassword: string;
};
const ResetPasswordSection = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<resetPasswordFormProps>({
    defaultValues: {
      newPassword: "",
      retypePassword: "",
    },
  });
  const [show, setShow] = useState(false);
  const { forgotPasswordToken } = useParams();
  const nav = useNavigate();
  const [isPending, startTransition] = useTransition();
  const onSubmit = (values: resetPasswordFormProps) => {
    startTransition(async () => {
      try {
        const res = await AXIOS.put(
          `/auth/reset-password/${forgotPasswordToken}`,
          values
        );
        toast.success(res?.data?.message);
        nav("/login");
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
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>Enter your new password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <Controller
                  control={control}
                  name="newPassword"
                  rules={{
                    required: "new password is required",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <div className="grid gap-3">
                      <Label htmlFor="newPassword">New password</Label>
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
                          id="newPassword"
                          type={show ? "text" : "password"}
                        />
                        {errors?.newPassword && (
                          <TextErrorForm>
                            {errors?.newPassword?.message}
                          </TextErrorForm>
                        )}
                      </div>
                    </div>
                  )}
                />
                <Controller
                  control={control}
                  name="retypePassword"
                  rules={{
                    required: "retype password is required",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <div className="grid gap-3">
                      <Label htmlFor="retypePassword">
                        Retype your password
                      </Label>
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
                          id="retypePassword"
                          type={show ? "text" : "password"}
                        />
                        {errors?.retypePassword && (
                          <TextErrorForm>
                            {errors?.retypePassword?.message}
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
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordSection;
