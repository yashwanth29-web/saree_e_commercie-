import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      paymentMethod,
      subtotal,
      shipping = 0,
      discount = 0,
      total,
    } = body;

    // 1. Validation
    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !items || !items.length) {
      return NextResponse.json(
        { error: 'Missing required order details' },
        { status: 400 }
      );
    }

    // 2. Generate clean order number
    const orderNumber = `DL-${Date.now().toString().slice(-6)}`;

    // 3. Determine initial payment and order status
    const paymentStatus = paymentMethod === 'TEST_PAYMENT' ? 'PAID' : 'PENDING';
    const orderStatus = 'CONFIRMED';

    // 4. Create Order & OrderItems in database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress: typeof shippingAddress === 'string' 
          ? shippingAddress 
          : JSON.stringify(shippingAddress),
        subtotal: Number(subtotal),
        shipping: Number(shipping),
        discount: Number(discount),
        total: Number(total),
        paymentStatus,
        orderStatus,
        items: {
          create: items.map((item: { productId: string; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: Number(item.price),
          })),
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Failed to create order:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to place order' },
      { status: 500 }
    );
  }
}
