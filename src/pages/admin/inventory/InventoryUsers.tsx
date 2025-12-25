import React from 'react';
import RoleManagement from '@/pages/admin/RoleManagement';
import { Package } from 'lucide-react';

export default function InventoryUsers() {
    // We reuse the existing RoleManagement component, forcing it to focus on 'stock' role.
    // This ensures consistency with other tabs in the application.
    return (
        <RoleManagement
            roleId="stock"
            roleName="Stock Keeper"
            roleIcon={<Package className="h-6 w-6 text-primary" />}
        />
    );
}
