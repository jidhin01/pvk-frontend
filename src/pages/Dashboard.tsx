import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from './admin/adminDashboard';
import DesignerDashboard from './designer/designerDashboard';

export default function Dashboard() {
    const { user } = useAuth();

    if (user?.role === 'designer') {
        return <DesignerDashboard />;
    }

    // Default to AdminDashboard for non-designers (or handle other roles similarly)
    return <AdminDashboard />;
}
