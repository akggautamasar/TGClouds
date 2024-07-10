import DisplayFiles from '@/components/files';
import Files from "@/layouts/files";
import { useUserPotected } from '../page';
export default async function Home() {
  const user = await useUserPotected()

  return (
    <DisplayFiles>
      <Files user={user} mimeType='image/' />
    </DisplayFiles>
  );
}