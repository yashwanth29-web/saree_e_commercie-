import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper to generate a clean URL slug
function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return `${base}-${Date.now().toString().slice(-4)}`;
}

// Helper to generate an authentic Handloom SKU
function generateSku(categorySlug: string): string {
  const prefix =
    categorySlug === 'pattu'
      ? 'DL-PAT'
      : categorySlug === 'cotton'
      ? 'DL-COT'
      : categorySlug === 'kalamkari'
      ? 'DL-KAL'
      : 'DL-DRS';
  const rand = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${rand}`;
}

// GET: Fetch all products with category and images for owner inventory
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: any = {};
    if (category && category !== 'ALL') {
      where.category = { slug: category };
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { color: { contains: search } },
        { fabric: { contains: search } },
      ];
    }

    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          category: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.findMany({
        where: { active: true },
        select: { id: true, name: true, slug: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      products,
      categories,
    });
  } catch (error: any) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST: Simple stock upload for store owner
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      price,
      salePrice,
      categoryId,
      categorySlug,
      stock = 1,
      fabric = 'Handloom Silk-Cotton',
      color = 'Traditional Multicolor',
      weave = 'Mangalagiri Zari Border',
      description,
      imageUrl,
      images = [],
      featured = false,
      newArrival = true,
      bestseller = false,
    } = body;

    if (!name || !price) {
      return NextResponse.json(
        { success: false, error: 'Product name and price are required' },
        { status: 400 }
      );
    }

    // Resolve Category ID
    let finalCategoryId = categoryId;
    if (!finalCategoryId && categorySlug) {
      const cat = await prisma.category.findUnique({
        where: { slug: categorySlug },
      });
      if (cat) finalCategoryId = cat.id;
    }

    // Fallback category if none found
    if (!finalCategoryId) {
      const firstCat = await prisma.category.findFirst();
      if (firstCat) {
        finalCategoryId = firstCat.id;
      } else {
        // Create default category
        const newCat = await prisma.category.create({
          data: {
            name: 'Mangalagiri Pattu',
            slug: 'pattu',
            description: 'Pure Mangalagiri Pattu Sarees',
          },
        });
        finalCategoryId = newCat.id;
      }
    }

    const slug = generateSlug(name);
    const sku = generateSku(categorySlug || 'pattu');
    const parsedPrice = parseFloat(price);
    const parsedSalePrice = salePrice ? parseFloat(salePrice) : null;
    const parsedStock = parseInt(stock, 10) || 0;

    // Default description if owner leaves it empty
    const finalDescription =
      description?.trim() ||
      `Authentic ${name} hand-woven by traditional master artisans in Mangalagiri. Crafted with pure breathable yarn, iconic Nizam borders, and lustrous finish for grand festive occasions.`;

    // Gather image URLs
    const imageList: string[] = [];
    if (imageUrl?.trim()) {
      imageList.push(imageUrl.trim());
    }
    if (Array.isArray(images)) {
      images.forEach((img: string) => {
        if (img && !imageList.includes(img)) imageList.push(img);
      });
    }
    if (imageList.length === 0) {
      imageList.push('/sarees/cat-pattu.jpg');
    }

    // Create Product in Prisma
    const newProduct = await prisma.product.create({
      data: {
        name: name.trim(),
        slug,
        sku,
        description: finalDescription,
        price: parsedPrice,
        salePrice: parsedSalePrice,
        fabric,
        weave,
        color,
        stock: parsedStock,
        categoryId: finalCategoryId,
        featured: Boolean(featured),
        newArrival: Boolean(newArrival),
        bestseller: Boolean(bestseller),
        active: true,
        images: {
          create: imageList.map((url, idx) => ({
            url,
            altText: `${name} - Photo ${idx + 1}`,
            sortOrder: idx,
            primary: idx === 0,
          })),
        },
      },
      include: {
        images: true,
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      product: newProduct,
      message: 'Saree published successfully to store!',
    });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload product' },
      { status: 500 }
    );
  }
}

// PATCH: Quick update for stock count, active toggle, or price
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, stock, active, price, salePrice } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (typeof stock === 'number') updateData.stock = Math.max(0, stock);
    if (typeof active === 'boolean') updateData.active = active;
    if (typeof price === 'number') updateData.price = price;
    if (typeof salePrice === 'number' || salePrice === null) updateData.salePrice = salePrice;

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        images: true,
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      product: updated,
      message: 'Stock updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a product
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Delete associated images first, then product
    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: 'Product removed from store',
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}
