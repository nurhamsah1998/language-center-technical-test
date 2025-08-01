import TextErrorForm from "@/components/internal/TextErrorForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useMutationX from "@/hooks/useMutationX";
import { useUserSession } from "@/store/user-session.store";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Navigate } from "react-router-dom";

type profileFormProps = {
  name: string;
  phoneNumber: string;
};
function ProfileSection() {
  const { id: userId, isLoading, phoneNumber, name } = useUserSession();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<profileFormProps>({
    defaultValues: {
      name: "",
      phoneNumber: "",
    },
  });
  const mutation = useMutationX({
    api: "/profile",
    invalidateKey: "/profile",
    mutation: "put",
    disableParam: true,
  });
  const onSubmit = (values: profileFormProps) => {
    mutation.mutate(values);
  };
  useEffect(() => {
    if (userId) {
      setValue("name", name || "");
      setValue("phoneNumber", phoneNumber || "");
    }
  }, [isLoading]);
  if (!localStorage.getItem("accessToken")) return <Navigate to="/" replace />;
  return (
    <div>
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
          <div className="mt-4 text-sm">
            <a
              href="/change-my-password"
              className="underline underline-offset-4"
            >
              Change password
            </a>
          </div>

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
}

export default ProfileSection;
