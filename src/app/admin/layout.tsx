import { auth } from "@/auth";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Validate ADMIN role
  const isAdmin = session?.user && (session.user as any).role === "ADMIN";

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#111111] text-white flex flex-col items-center justify-center p-6 font-sans selection:bg-[#a15c38]">
        <div className="max-w-md w-full bg-[#1c1c1c] border border-neutral-800 rounded p-8 shadow-2xl relative overflow-hidden text-center backdrop-blur-md">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#a15c38] to-[#c2966e]" />
          
          <div className="mb-6 flex justify-center">
            <div className="h-16 w-16 bg-[#1a1512] rounded-full flex items-center justify-center border border-[#a15c38]/30 text-[#a15c38] animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-2xl font-serif tracking-wider text-white mb-2">ACCESS RESTRICTED</h1>
          <p className="text-[10px] text-[#a15c38] tracking-widest uppercase mb-4">Error Code: 403 Forbidden</p>
          
          <p className="text-neutral-400 text-sm leading-relaxed mb-8 font-light">
            This workspace is reserved exclusively for West Elm India Administrators. 
            Your current account credentials do not have permission to view this panel.
          </p>
          
          <div className="space-y-3">
            <Link 
              href="/login?callbackUrl=/admin" 
              className="block w-full py-3 bg-[#a15c38] hover:bg-[#894b2c] text-white text-xs tracking-widest uppercase font-medium rounded transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Sign In as Administrator
            </Link>
            
            <Link 
              href="/" 
              className="block w-full py-3 bg-transparent border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white text-xs tracking-widest uppercase font-medium rounded transition-all duration-300"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
