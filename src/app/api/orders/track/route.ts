import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const DEMO_ORDERS: Record<string, any> = {
  'DL-942811': {
    orderNumber: 'DL-942811',
    customerName: 'Priya Sharma',
    orderStatus: 'PACKED',
    paymentStatus: 'PAID',
    createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    courierName: 'DTDC Express',
    trackingNumber: 'DTDC-88392019',
    items: [
      { name: 'Mangalagiri Pattu Saree - Royal Emerald & Gold Zari', quantity: 1, price: 3999, image: '/products/mangalagiri-pattu-green-01.svg' },
      { name: 'Mangalagiri Cotton Saree - Classic Maroon', quantity: 1, price: 1899, image: '/products/mangalagiri-cotton-maroon-01.svg' }
    ]
  },
  'DL-942812': {
    orderNumber: 'DL-942812',
    customerName: 'Ananya Reddy',
    orderStatus: 'SHIPPED',
    paymentStatus: 'PAID',
    createdAt: new Date(Date.now() - 3600 * 1000 * 28).toISOString(),
    courierName: 'India Post Speed Post',
    trackingNumber: 'IN-POST-4491028',
    items: [
      { name: 'Mangalagiri Pattu Saree - Deep Crimson Wedding Edition', quantity: 1, price: 4499, image: '/products/mangalagiri-pattu-maroon-01.svg' }
    ]
  },
  'DL-942813': {
    orderNumber: 'DL-942813',
    customerName: 'Sunita Rao',
    orderStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    createdAt: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
    items: [
      { name: 'Handloom Cotton Dress Material - Indigo', quantity: 1, price: 2199, image: '/products/mangalagiri-dress-material-gold-01.svg' }
    ]
  },
  'DL-942810': {
    orderNumber: 'DL-942810',
    customerName: 'Kavitha Murthy',
    orderStatus: 'DELIVERED',
    paymentStatus: 'PAID',
    createdAt: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
    courierName: 'Blue Dart Express',
    trackingNumber: 'BD-99182374',
    items: [
      { name: 'Mangalagiri Pattu Saree - Royal Emerald & Gold Zari', quantity: 1, price: 3999, image: '/products/mangalagiri-pattu-green-01.svg' }
    ]
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderNumber = (searchParams.get('orderNumber') || searchParams.get('query') || '').trim();

  if (!orderNumber) {
    return NextResponse.json({ error: 'Please enter a valid Order Number' }, { status: 400 });
  }

  // Normalize (e.g. DL-942811 or 942811)
  const cleanNumber = orderNumber.toUpperCase().startsWith('DL-') ? orderNumber.toUpperCase() : `DL-${orderNumber}`;

  // 1. Try Prisma DB
  try {
    const dbOrder = await prisma.order.findUnique({
      where: { orderNumber: cleanNumber },
      include: {
        items: {
          include: {
            product: {
              include: { images: true }
            }
          }
        }
      }
    });

    if (dbOrder) {
      return NextResponse.json({
        success: true,
        order: {
          orderNumber: dbOrder.orderNumber,
          customerName: dbOrder.customerName,
          orderStatus: dbOrder.orderStatus,
          paymentStatus: dbOrder.paymentStatus,
          createdAt: dbOrder.createdAt,
          total: dbOrder.total,
          items: dbOrder.items.map((it) => ({
            name: it.product?.name || 'Handloom Saree',
            quantity: it.quantity,
            price: it.price,
            image: it.product?.images?.[0]?.url || '/sarees/cat-pattu.jpg'
          }))
        }
      });
    }
  } catch (err) {
    console.warn('Prisma track order lookup error:', err);
  }

  // 2. Check demo orders
  if (DEMO_ORDERS[cleanNumber]) {
    return NextResponse.json({ success: true, order: DEMO_ORDERS[cleanNumber] });
  }

  return NextResponse.json({ error: `No order found with number "${cleanNumber}". Please check the order number.` }, { status: 404 });
}
