import AppShell from "../components/common/AppShell";
import { AuthProvider } from "../context/AuthContext";
import "./globals.css";

export const metadata = {
  title: "TransitOps",
  description: "Smart Transport Operations Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-slate-50 text-slate-900">
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
