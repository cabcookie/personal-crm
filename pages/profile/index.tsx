import useCurrentUser, { TUpdateProfileInfo } from "@/api/useUser";
import SettingsLayout from "@/components/layouts/SettingsLayout";
import S3Image from "@/components/ui-elements/image/S3Image";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import "@aws-amplify/ui-react/styles.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const profileNavItems = [
  { title: "Profile", href: "/profile" },
  { title: "Labels", href: "/profile/labels" },
];

const profileFormSchema = z.object({
  displayName: z.string().min(2, {
    message: "Your name must be at least 2 characters.",
  }),
});
type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfilePage = () => {
  const { user, updateProfileInfo, updateProfilePicture } = useCurrentUser();
  const [tempImgUrl, setTempImgUrl] = useState<string | undefined>(undefined);
  const defaultValues: Partial<ProfileFormValues> = {
    displayName: user?.userName || "",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (!user || !user.userName) return;
    const { displayName } = form.getValues();
    if (displayName !== "") return;
    form.setValue("displayName", user.userName);
  }, [form, user]);

  const onSubmit = (data: TUpdateProfileInfo) => {
    updateProfileInfo(data);
  };

  const uploadNewProfileImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    const tempUrl = URL.createObjectURL(file);
    setTempImgUrl(tempUrl);
    updateProfilePicture(file, () => setTempImgUrl(undefined));
  };

  return (
    <SettingsLayout
      title="Profile & Settings"
      sidebarNavItems={profileNavItems}
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Profile</h3>
          <p className="text-sm text-muted-foreground">
            This is how others will see you on the site.
          </p>
        </div>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display name</FormLabel>
                  <FormControl>
                    <Input placeholder="Type your name…" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name. It can be your real name
                    or a pseudonym.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Update profile</Button>
          </form>
        </Form>
        <div className="flex flex-col space-y-2">
          <Label className="font-semibold">Profile image</Label>
          <S3Image
            imgKey={user?.profilePicture}
            tempUrl={tempImgUrl}
            alt="Your profile image"
            hasNoImage={user && !user.profilePicture}
            noImagePlaceholder="No profile image."
          />
          <Label>Select new profile image</Label>
          <Input type="file" onChange={uploadNewProfileImage} />
        </div>
      </div>
    </SettingsLayout>
  );
};

export default ProfilePage;
