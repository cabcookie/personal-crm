import useCurrentUser from "@/api/useUser";
import MainLayout from "@/components/layouts/MainLayout";

const ProfilePage = () => {
  const { user } = useCurrentUser();

  return (
    <MainLayout title="Profile & Settings" sectionName="Profile/Settings">
      {user?.userName}
      {user?.loginId}
    </MainLayout>
  );
};

export default ProfilePage;
