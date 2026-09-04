import prisma from '@/lib/prisma';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { CheckCircle2, PackageCheck, Truck, ArrowRight, MessageCircle } from 'lucide-react';

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ orderNumber?: string }>;
}) {
  const resolvedParams = await searchParams;
  const orderNumber = resolvedParams?.orderNumber;

  let order: any = null;
  if (orderNumber) {
    try {
      order = await prisma.order.findUnique({
        where: { orderNumber },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: true,
                },
              },
            },
          },
        },
      });
    } catch (err) {
      console.error("Order confirmation query error:", err);
    }
  }

  // Parse shipping address if stored as JSON
  let shippingAddressObj: any = {};
  if (order?.shippingAddress) {
    try {
      shippingAddressObj = JSON.parse(order.shippingAddress);
    } catch {
      shippingAddressObj = { address: order.shippingAddress };
    }
  }

  const whatsappInquiry = order ? encodeURIComponent(
    `Namaste DL Handlooms! I have placed order #${order.orderNumber}. Could you please confirm dispatch updates? Thank you!`
  ) : "";

  return (
    <main className="min-h-screen flex flex-col bg-[#F7F3ED]">
      <Navbar />

      <div className="flex-grow pt-10 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          
          {/* Order Success Card */}
          <div className="bg-white border border-[#222222]/10 rounded-sm p-6 sm:p-10 shadow-xs mb-8 text-center">
            <div className="w-16 h-16 bg-[#1F7A4C]/10 text-[#1F7A4C] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#1F7A4C] font-semibold block mb-1">
              Order Confirmed &bull; DL Handlooms
            </span>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#222222] mb-2">
              Thank You for Supporting Handloom Weavers!
            </h1>
            <p className="text-sm font-sans text-[#222222]/70 max-w-md mx-auto mb-6">
              Your authentic Mangalagiri saree order has been received and registered directly with our looms in Andhra Pradesh.
            </p>

            {order && (
              <div className="inline-flex items-center gap-3 bg-[#F7F3ED] px-4 py-2.5 rounded-sm border border-[#222222]/10 text-xs font-sans">
                <span className="text-[#222222]/60">Order Number:</span>
                <span className="font-bold text-[#7A211B] text-sm tracking-wider font-mono">
                  {order.orderNumber}
                </span>
                <span className="px-2 py-0.5 rounded-xs font-bold text-[10px] uppercase tracking-wider bg-[#1F7A4C] text-white">
                  {order.paymentStatus}
                </span>
              </div>
            )}
          </div>

          {order ? (
            /* Order Breakdown Card */
            <div className="bg-white border border-[#222222]/10 rounded-sm p-6 sm:p-8 shadow-xs space-y-6">
              
              <h2 className="font-serif text-lg font-bold text-[#222222] pb-3 border-b border-[#222222]/10 flex items-center justify-between">
                <span>Items Ordered</span>
                <span className="text-xs font-sans text-[#222222]/60 font-normal">
                  {order.items.length} {order.items.length === 1 ? "saree" : "sarees"}
                </span>
              </h2>

              <div className="divide-y divide-[#222222]/10">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 flex items-center gap-4">
                    <div className="relative w-16 h-20 bg-[#EFE9DF] rounded-xs overflow-hidden flex-shrink-0 border border-[#222222]/10">
                      <ImageWithFallback
                        src={item.product?.images?.[0]?.url || '/sarees/cat-pattu.jpg'}
                        alt={item.product?.name || "Handloom Saree"}
                        fill
                        sizes="64px"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-grow min-w-0">
                      <Link 
                        href={`/product/${item.productId}`}
                        className="font-serif text-sm sm:text-base font-bold text-[#222222] hover:text-[#7A211B] line-clamp-1"
                      >
                        {item.product?.name || "Mangalagiri Handloom Saree"}
                      </Link>
                      <p className="text-xs font-sans text-[#7A211B] font-semibold mt-0.5">
                        Pure Handloom &bull; SKU: {item.product?.sku || 'DL-PAT'}
                      </p>
                      <p className="text-xs font-sans text-[#222222]/60 mt-1">
                        Qty: {item.quantity} &times; ₹{item.price.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="text-right font-sans text-sm font-bold text-[#222222]">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="pt-4 border-t border-[#222222]/10 space-y-2 font-sans text-xs text-[#222222]/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#222222]">₹{order.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Loom Shipping</span>
                  <span className="font-semibold text-[#1F7A4C] uppercase">FREE</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#222222]/10 text-sm font-bold text-[#222222]">
                  <span>Total Paid</span>
                  <span className="text-lg text-[#7A211B]">₹{order.total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Delivery Address & Customer details */}
              <div className="pt-4 border-t border-[#222222]/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="bg-[#F7F3ED]/60 p-4 rounded-sm border border-[#222222]/10">
                  <span className="font-semibold block text-[#222222] uppercase tracking-wider mb-1">
                    Shipping To
                  </span>
                  <p className="font-medium text-[#222222]">{order.customerName}</p>
                  <p className="text-[#222222]/70 mt-0.5">{shippingAddressObj.address || "Direct Address"}</p>
                  <p className="text-[#222222]/70">
                    {shippingAddressObj.city ? `${shippingAddressObj.city}, ` : ""}
                    {shippingAddressObj.state ? `${shippingAddressObj.state} ` : ""}
                    {shippingAddressObj.pinCode ? `- ${shippingAddressObj.pinCode}` : ""}
                  </p>
                  <p className="text-[#222222]/70 mt-1">Phone: +91 {order.customerPhone}</p>
                </div>

                <div className="bg-[#F7F3ED]/60 p-4 rounded-sm border border-[#222222]/10 flex flex-col justify-between">
                  <div>
                    <span className="font-semibold block text-[#222222] uppercase tracking-wider mb-1">
                      Order Updates
                    </span>
                    <p className="text-[#222222]/70 leading-relaxed">
                      Confirmation email sent to <strong>{order.customerEmail}</strong>. You will receive dispatch tracking updates via SMS and WhatsApp.
                    </p>
                  </div>
                  
                  <a
                    href={`https://wa.me/919666228380?text=${whatsappInquiry}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#1F7A4C] font-semibold hover:underline mt-3"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-[#222222]/10 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/shop"
                  className="flex-grow bg-[#7A211B] hover:bg-[#5E1914] text-[#F7F3ED] font-sans text-xs font-semibold tracking-widest uppercase py-3.5 px-6 rounded-sm text-center transition-colors flex items-center justify-center gap-2"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/"
                  className="border border-[#222222]/20 hover:border-[#7A211B] text-[#222222] hover:text-[#7A211B] font-sans text-xs font-semibold tracking-widest uppercase py-3.5 px-6 rounded-sm text-center transition-colors"
                >
                  Back to Home
                </Link>
              </div>

            </div>
          ) : (
            <div className="text-center py-6">
              <Link
                href="/shop"
                className="bg-[#7A211B] text-[#F7F3ED] font-sans text-xs font-semibold tracking-widest uppercase py-3.5 px-6 rounded-sm"
              >
                Go to Shop
              </Link>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </main>
  );
}
