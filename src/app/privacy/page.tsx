import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <div className="flex-grow flex items-center justify-center pt-24 pb-12">
        <div className="text-center">
            <h1 className="text-4xl font-serif font-bold text-charcoal uppercase tracking-widest mb-4">privacy</h1>
            <p className="text-charcoal/60">This page is currently under construction. Please check back later.</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
