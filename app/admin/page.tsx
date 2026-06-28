import { isAdmin } from '@/lib/session';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { getAllItems } from '@/lib/items';

export default async function AdminPage() {
  const isAuthorized = await isAdmin();
  
  if (!isAuthorized) {
    return <AdminLogin />;
  }

  const items = await getAllItems();

  return <AdminDashboard initialItems={items} />;
}
