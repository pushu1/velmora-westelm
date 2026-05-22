import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | West Elm India',
  description: 'Get in touch with the West Elm India team for order inquiries, product information, or general questions.',
};

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
