# PVK Enterprises - Frontend

A modern, role-based enterprise management dashboard built with React, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: [React](https://react.dev/) 18 + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Routing**: [React Router](https://reactrouter.com/) v6
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── layout/       # Layout components (Sidebar, TopBar)
│   └── ui/           # shadcn/ui components
├── config/           # App configuration
├── contexts/         # React contexts (Auth, Theme)
├── data/             # Mock data and constants
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
└── pages/            # Route pages
    ├── admin/        # Admin dashboard pages
    ├── dealer/       # Dealer workflow pages
    ├── designer/     # Designer workflow pages
    ├── finance/      # Finance management pages
    ├── inventory/    # Inventory management pages
    ├── pan-team/     # PAN verification pages
    ├── printer/      # Printer workflow pages
    ├── sales/        # Sales management pages
    ├── seal-team/    # Seal team pages
    └── stock/        # Stock keeper pages
```

## 🎭 Role-Based Access

The application supports multiple user roles, each with a customized dashboard:

| Role | Description |
|------|-------------|
| Admin | Full system administration |
| Dealer | Dealer operations management |
| Designer | Design workflow management |
| Finance | Financial reports and management |
| Printer | Print job management |
| Sales | Sales operations |
| Stock Keeper | Inventory control |
| PAN Team | PAN card verification |
| Seal Team | Seal management |

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project
cd pvk-frontend

# Install dependencies
npm install
# or
bun install
```

### Development

```bash
# Start development server
npm run dev
# or
bun dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
# Production build
npm run build

# Development build
npm run build:dev

# Preview production build
npm run preview
```

### Linting

```bash
npm run lint
```

## 🎨 Features

- **Dark/Light Mode**: Theme switching with system preference detection
- **Responsive Design**: Mobile-friendly sidebar and layouts
- **Role-Based Navigation**: Dynamic sidebar based on user role
- **Modern UI**: Clean, minimal design with smooth animations
- **Form Validation**: Comprehensive form handling with Zod schemas
- **Data Visualization**: Interactive charts and graphs

## 📦 Deployment

The project is configured for deployment on [Vercel](https://vercel.com/). The `vercel.json` file handles client-side routing rewrites.

```bash
# Deploy to Vercel
vercel deploy
```

## 📄 License

Private - All rights reserved

---

Built with ❤️ for PVK Enterprises
