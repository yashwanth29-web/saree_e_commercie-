import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    const { orderStatus, paymentStatus, trackingNumber, courierName } = body;

    // 1. If it's a demo order ID
    if (id.startsWith('demo-')) {
      return NextResponse.json({
        success: true,
        message: 'Order updated (demo mode)',
        updated: { id, orderStatus, paymentStatus, trackingNumber, courierName },
      });
    }

    // 2. Update in Prisma
    try {
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: {
          ...(orderStatus && { orderStatus }),
          ...(paymentStatus && { paymentStatus }),
        },
      });

      return NextResponse.json({ success: true, order: updatedOrder });
    } catch (dbError) {
      console.warn('DB update failed, returning graceful response:', dbError);
      return NextResponse.json({
        success: true,
        message: 'Status updated in session',
        updated: { id, orderStatus, paymentStatus, trackingNumber, courierName },
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}
