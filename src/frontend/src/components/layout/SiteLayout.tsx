import { ReactNode } from 'react';
import SiteHeader from '../navigation/SiteHeader';
import SiteFooter from '../navigation/SiteFooter';
import ProfileSetupDialog from '../auth/ProfileSetupDialog';

interface SiteLayoutProps {
  children: ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <ProfileSetupDialog />
    </div>
  );
}
