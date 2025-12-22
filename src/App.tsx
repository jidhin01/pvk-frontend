import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/ui/Sidebar';

// Admin
import AdminPage from './pages/admin/page';
import AdminDashboard from './pages/admin/adminDashboard';
import AdminUserManagement from './pages/admin/adminUserManagement';
import AdminRoleManagement from './pages/admin/adminRoleManagement';
import AdminActivityLogs from './pages/admin/adminActivityLogs';
import AdminSettings from './pages/admin/adminSettings';

// Dealer
import DealerPage from './pages/dealer/page';
import DealerDashboard from './pages/dealer/dealerDashboard';
import DealerPAN from './pages/dealer/dealerPAN';
import DealerSeal from './pages/dealer/dealerSeal';
import DealerPrintingOrders from './pages/dealer/dealerPrintingOrders';
import DealerLiveStatus from './pages/dealer/dealerLiveStatus';

// Designer
import DesignerPage from './pages/designer/page';
import DesignerDashboard from './pages/designer/designerDashboard';
import DesignerWorkPool from './pages/designer/designerWorkPool';
import DesignerMyWork from './pages/designer/designerMyWork';
import DesignerEarnings from './pages/designer/designerEarnings';

// Printer
import PrinterPage from './pages/printer/page';
import PrinterDashboard from './pages/printer/printerDashboard';
import PrinterPending from './pages/printer/printerPending';
import PrinterCompleted from './pages/printer/printerCompleted';
import PrinterRejected from './pages/printer/printerRejected';

// Sales
import SalesPage from './pages/sales/page';
import SalesDashboard from './pages/sales/salesDashboard';
import SalesDeliveryList from './pages/sales/salesDeliveryList';
import SalesPaymentCollection from './pages/sales/salesPaymentCollection';
import SalesExpenses from './pages/sales/salesExpenses';

// Finance
import FinancePage from './pages/finance/page';
import FinanceDashboard from './pages/finance/financeDashboard';
import FinanceRevenue from './pages/finance/financeRevenue';
import FinanceCredit from './pages/finance/financeCredit';
import FinanceRefunds from './pages/finance/financeRefunds';
import FinanceDesignerEarnings from './pages/finance/financeDesignerEarnings';

// Stock
import StockPage from './pages/stock/page';
import StockDashboard from './pages/stock/stockDashboard';
import StockInventory from './pages/stock/stockInventory';
import StockDeadStock from './pages/stock/stockDeadStock';
import StockTransfer from './pages/stock/stockTransfer';

function App() {
  return (
    <BrowserRouter>
      <div className="flex bg-pvk-bg text-pvk-text min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto bg-pvk-bg">
          <Routes>
            <Route path="/" element={<Navigate to="/admin" replace />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUserManagement />} />
            <Route path="/admin/roles" element={<AdminRoleManagement />} />
            <Route path="/admin/logs" element={<AdminActivityLogs />} />
            <Route path="/admin/settings" element={<AdminSettings />} />

            {/* Dealer Routes */}
            <Route path="/dealer" element={<DealerPage />} />
            <Route path="/dealer/dashboard" element={<DealerDashboard />} />
            <Route path="/dealer/pan" element={<DealerPAN />} />
            <Route path="/dealer/seal" element={<DealerSeal />} />
            <Route path="/dealer/orders" element={<DealerPrintingOrders />} />
            <Route path="/dealer/status" element={<DealerLiveStatus />} />

            {/* Designer Routes */}
            <Route path="/designer" element={<DesignerPage />} />
            <Route path="/designer/dashboard" element={<DesignerDashboard />} />
            <Route path="/designer/work-pool" element={<DesignerWorkPool />} />
            <Route path="/designer/my-work" element={<DesignerMyWork />} />
            <Route path="/designer/earnings" element={<DesignerEarnings />} />

            {/* Printer Routes */}
            <Route path="/printer" element={<PrinterPage />} />
            <Route path="/printer/dashboard" element={<PrinterDashboard />} />
            <Route path="/printer/pending" element={<PrinterPending />} />
            <Route path="/printer/completed" element={<PrinterCompleted />} />
            <Route path="/printer/rejected" element={<PrinterRejected />} />

            {/* Sales Routes */}
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/sales/dashboard" element={<SalesDashboard />} />
            <Route path="/sales/delivery" element={<SalesDeliveryList />} />
            <Route path="/sales/payments" element={<SalesPaymentCollection />} />
            <Route path="/sales/expenses" element={<SalesExpenses />} />

            {/* Finance Routes */}
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/finance/dashboard" element={<FinanceDashboard />} />
            <Route path="/finance/revenue" element={<FinanceRevenue />} />
            <Route path="/finance/credit" element={<FinanceCredit />} />
            <Route path="/finance/refunds" element={<FinanceRefunds />} />
            <Route path="/finance/designer-earnings" element={<FinanceDesignerEarnings />} />

            {/* Stock Routes */}
            <Route path="/stock" element={<StockPage />} />
            <Route path="/stock/dashboard" element={<StockDashboard />} />
            <Route path="/stock/inventory" element={<StockInventory />} />
            <Route path="/stock/dead-stock" element={<StockDeadStock />} />
            <Route path="/stock/transfer" element={<StockTransfer />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
