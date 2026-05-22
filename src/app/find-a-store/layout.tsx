import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find A Store | West Elm India',
  description: 'Locate West Elm flagship stores in Mumbai and Gurugram. Get directions, store hours, and browse expert in-store design crew amenities.'
};

export default function FindAStoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
