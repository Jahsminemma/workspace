import { getProfile } from '@/lib/profile-store';
import { ProfileForm } from './profile-form';
import { AssetsForm } from './assets-form';
import { ResumeImportForm } from './resume-import-form';
import { ResumeUploadForm } from './resume-upload-form';
import { SectionHeader } from '@/components/ui/section-header';

export default async function ProfilePage() {
  const profile = await getProfile();

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <SectionHeader title="Profile" subtitle="Set the baseline info and source assets the tailoring engine will use." />
      <ProfileForm initialProfile={profile} />
      <ResumeUploadForm />
      <ResumeImportForm />
      <AssetsForm initialProfile={profile} />
    </main>
  );
}
