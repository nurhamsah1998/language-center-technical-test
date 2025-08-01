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
import { useNavigate } from "react-router-dom";

type registerFormProps = {
  name: string;
  phoneNumber?: string | undefined;
  email: string;
  password: string;
};
const RegisterSection = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<registerFormProps>({
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
      password: "",
    },
  });
  const [show, setShow] = useState(false);
  const [isPending, startTransition] = useTransition();
  const nav = useNavigate();
  const onSubmit = async (values: registerFormProps) => {
    startTransition(async () => {
      try {
        if (!values.phoneNumber) delete values.phoneNumber;
        const res = await AXIOS.post("/auth/register", values);
        toast.success(res?.data?.message);
        reset();
        nav("/login");
      } catch (error) {
        console.log(error);
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
            <CardTitle>Register</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <Controller
                  control={control}
                  name="name"
                  rules={{
                    required: "name is required",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <div className="grid gap-3">
                      <Label htmlFor="name">Name</Label>
                      <div>
                        <Input
                          onChange={onChange}
                          value={value}
                          id="name"
                          type="text"
                          placeholder="Nurhamsah"
                        />
                        {errors?.name && (
                          <TextErrorForm>{errors?.name?.message}</TextErrorForm>
                        )}
                      </div>
                    </div>
                  )}
                />
                <Controller
                  control={control}
                  name="phoneNumber"
                  render={({ field: { onChange, value } }) => (
                    <div className="grid gap-3">
                      <Label htmlFor="phoneNumber">Phone number</Label>
                      <div>
                        <Input
                          onChange={onChange}
                          value={value}
                          id="phoneNumber"
                          type="number"
                          placeholder="6281213221343"
                        />
                      </div>
                    </div>
                  )}
                />
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
                      <Label htmlFor="password">Password</Label>
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
                    Register
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
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

export default RegisterSection;
