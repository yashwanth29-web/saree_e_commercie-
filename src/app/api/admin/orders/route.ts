import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Fallback demo orders for instant showcase preview
const DEMO_ORDERS = [
  {
    id: 'demo-ord-1',
    orderNumber: 'DL-942811',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.sharma@gmail.com',
    customerPhone: '+919876543210',
    shippingAddress: 'Flat 402, Sai Residency, Jubilee Hills, Hyderabad, Telangana - 500033',
    subtotal: 5898,
    shipping: 0,
    discount: 300,
    total: 5598,
    paymentStatus: 'PAID',
    orderStatus: 'PACKED',
    createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    items: [
      {
        id: 'item-1',
        quantity: 1,
        price: 3999,
        product: {
          name: 'Mangalagiri Pattu Saree - Royal Emerald & Gold Zari',
          sku: 'DL-PAT-001',
          fabric: 'Pure Silk (Pattu)',
          images: [{ url: '/products/mangalagiri-pattu-green-01.svg' }]
        }
      },
      {
        id: 'item-2',
        quantity: 1,
        price: 1899,
        product: {
          name: 'Mangalagiri Cotton Saree - Classic Maroon',
          sku: 'DL-COT-001',
          fabric: 'Pure Cotton',
          images: [{ url: '/products/mangalagiri-cotton-maroon-01.svg' }]
        }
      }
    ]
  },
  {
    id: 'demo-ord-2',
    orderNumber: 'DL-942812',
    customerName: 'Ananya Reddy',
    customerEmail: 'ananya.reddy@outlook.com',
    customerPhone: '+919123456789',
    shippingAddress: 'Plot 18, Road No. 12, Banjara Hills, Hyderabad, Telangana - 500034',
    subtotal: 4499,
    shipping: 0,
    discount: 0,
    total: 4499,
    paymentStatus: 'PAID',
    orderStatus: 'SHIPPED',
    createdAt: new Date(Date.now() - 3600 * 1000 * 28).toISOString(),
    items: [
      {
        id: 'item-3',
        quantity: 1,
        price: 4499,
        product: {
          name: 'Mangalagiri Pattu Saree - Deep Crimson Wedding Edition',
          sku: 'DL-PAT-002',
          fabric: 'Pure Silk (Pattu)',
          images: [{ url: '/products/mangalagiri-pattu-maroon-01.svg' }]
        }
      }
    ]
  },
  {
    id: 'demo-ord-3',
    orderNumber: 'DL-942813',
    customerName: 'Sunita Rao',
    customerEmail: 'sunita.rao@yahoo.com',
    customerPhone: '+919440123456',
    shippingAddress: '4-12-89, Main Road, Guntur, Andhra Pradesh - 522002',
    subtotal: 2199,
    shipping: 0,
    discount: 100,
    total: 2099,
    paymentStatus: 'PAID',
    orderStatus: 'CONFIRMED',
    createdAt: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
    items: [
      {
        id: 'item-4',
        quantity: 1,
        price: 2199,
        product: {
          name: 'Handloom Cotton Dress Material - Indigo',
          sku: 'DL-DRS-001',
          fabric: 'Pure Cotton',
          images: [{ url: '/products/mangalagiri-dress-material-gold-01.svg' }]
        }
      }
    ]
  },
  {
    id: 'demo-ord-4',
    orderNumber: 'DL-942810',
    customerName: 'Kavitha Murthy',
    customerEmail: 'kavitha.m@gmail.com',
    customerPhone: '+919845098765',
    shippingAddress: '12th Cross, Indiranagar, Bengaluru, Karnataka - 560038',
    subtotal: 3999,
    shipping: 0,
    discount: 0,
    total: 3999,
    paymentStatus: 'PAID',
    orderStatus: 'DELIVERED',
    createdAt: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
    items: [
      {
        id: 'item-5',
        quantity: 1,
        price: 3999,
        product: {
          name: 'Mangalagiri Pattu Saree - Royal Emerald & Gold Zari',
          sku: 'DL-PAT-001',
          fabric: 'Pure Silk (Pattu)',
          images: [{ url: '/products/mangalagiri-pattu-green-01.svg' }]
        }
      }
    ]
  }
];

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!orders || orders.length === 0) {
      return NextResponse.json({ success: true, orders: DEMO_ORDERS, isDemo: true });
    }

    return NextResponse.json({ success: true, orders, isDemo: false });
  } catch (error: any) {
    console.warn('Prisma admin orders query failed, returning demo list:', error);
    return NextResponse.json({ success: true, orders: DEMO_ORDERS, isDemo: true });
  }
}
