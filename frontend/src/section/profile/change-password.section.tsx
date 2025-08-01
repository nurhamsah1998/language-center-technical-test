import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import TextErrorForm from "@/components/internal/TextErrorForm";
import useMutationX from "@/hooks/useMutationX";
import { useState } from "react";
import { Navigate } from "react-router-dom";

type changePasswordFormProps = {
  currentPassword: string;
  newPassword: string;
  retypePassword: string;
};
const ChangePasswordSection = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<changePasswordFormProps>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      retypePassword: "",
    },
  });
  const [show, setShow] = useState(false);
  const mutation = useMutationX({
    api: "/profile/change-my-password",
    invalidateKey: "/profile/change-my-password",
    mutation: "put",
    disableParam: true,
    onSuccess() {
      reset();
    },
  });
  const onSubmit = (values: changePasswordFormProps) => {
    mutation.mutate(values);
  };
  if (!localStorage.getItem("accessToken")) return <Navigate to="/" replace />;
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <Controller
            control={control}
            name="currentPassword"
            rules={{
              required: "current password is required",
            }}
            render={({ field: { onChange, value } }) => (
              <div className="grid gap-3">
                <Label htmlFor="currentPassword">Current password</Label>
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
                    id="currentPassword"
                    type={show ? "text" : "password"}
                  />
                  {errors?.currentPassword && (
                    <TextErrorForm>
                      {errors?.currentPassword?.message}
                    </TextErrorForm>
                  )}
                </div>
              </div>
            )}
          />
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
                <Label htmlFor="retypePassword">Retype your password</Label>
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
            <Button
              disabled={mutation.isPending}
              type="submit"
              className="w-full"
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordSection;
