import Navbar from '@/components/Navbar';

interface RootLayoutProps {
    children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
    return (
        <div className="bg-white flex flex-col min-h-screen">
            <Navbar />
            {children}
        </div>
    );
}
