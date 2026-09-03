import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)

  // Clear existing
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // 1. Create Categories
  const pattuCat = await prisma.category.create({
    data: {
      name: 'Mangalagiri Pattu',
      slug: 'pattu',
      description: 'Pure silk sarees with authentic Mangalagiri weave and zari border.',
      image: '/products/mangalagiri-pattu-green-01.svg'
    }
  })

  const cottonCat = await prisma.category.create({
    data: {
      name: 'Cotton Sarees',
      slug: 'cotton',
      description: 'Light, breathable pure cotton handwoven sarees.',
      image: '/products/mangalagiri-cotton-maroon-01.svg'
    }
  })

  const dressCat = await prisma.category.create({
    data: {
      name: 'Dress Materials',
      slug: 'dress-materials',
      description: 'Unstitched authentic handloom dress materials.',
      image: '/products/mangalagiri-dress-material-gold-01.svg'
    }
  })

  // 2. Create Products
  const p1 = await prisma.product.create({
    data: {
      name: 'Mangalagiri Cotton Saree - Classic Maroon',
      slug: 'mangalagiri-cotton-saree-maroon',
      sku: 'DL-COT-001',
      description: 'A pure handloom cotton saree woven in Mangalagiri. Features a classic plain body with a traditional Nizam zari border. Perfect for daily wear and formal occasions. Breathable fabric that gets softer with every wash.',
      shortDescription: 'Pure handloom cotton saree with Nizam border.',
      price: 1899,
      fabric: 'Pure Cotton',
      weave: 'Mangalagiri Handloom',
      color: 'Maroon',
      occasion: 'Casual, Workwear',
      stock: 15,
      featured: true,
      newArrival: true,
      bestseller: true,
      active: true,
      isDemo: true,
      categoryId: cottonCat.id,
      images: {
        create: [
          { url: '/sarees/feat-4.jpg', altText: 'Maroon cotton saree', sortOrder: 0, primary: true }
        ]
      }
    }
  })

  const p2 = await prisma.product.create({
    data: {
      name: 'Pure Zari Mangalagiri Pattu - Emerald Green',
      slug: 'pure-zari-mangalagiri-pattu-emerald-green',
      sku: 'DL-PAT-001',
      description: 'Authentic Mangalagiri Pattu (Silk) saree featuring an intricate pure gold zari border. Woven by master craftsmen with generations of experience. Ideal for weddings and grand festive occasions.',
      shortDescription: 'Pure silk Mangalagiri saree with gold zari border.',
      price: 8500,
      salePrice: 7999,
      fabric: 'Pure Silk (Pattu)',
      weave: 'Mangalagiri Handloom',
      color: 'Emerald Green',
      occasion: 'Wedding, Festive',
      stock: 5,
      featured: true,
      newArrival: false,
      bestseller: true,
      active: true,
      isDemo: true,
      categoryId: pattuCat.id,
      images: {
        create: [
          { url: '/sarees/feat-1.jpg', altText: 'Emerald green pattu', sortOrder: 0, primary: true }
        ]
      }
    }
  })

  const p3 = await prisma.product.create({
    data: {
      name: 'Mangalagiri Handloom Dress Material - Antique Gold',
      slug: 'mangalagiri-dress-material-antique-gold',
      sku: 'DL-DRS-001',
      description: 'Unstitched 3-piece dress material set (Top, Bottom, Dupatta). Woven in Mangalagiri using pure cotton and silk threads. Create your own custom ethnic wear.',
      shortDescription: 'Unstitched 3-piece Mangalagiri dress material set.',
      price: 2400,
      fabric: 'Cotton Silk Blend',
      weave: 'Mangalagiri Handloom',
      color: 'Antique Gold',
      occasion: 'Festive, Party',
      stock: 20,
      featured: false,
      newArrival: true,
      bestseller: false,
      active: true,
      isDemo: true,
      categoryId: dressCat.id,
      images: {
        create: [
          { url: '/sarees/cat-dress.jpg', altText: 'Antique gold dress material', sortOrder: 0, primary: true }
        ]
      }
    }
  })

  const p4 = await prisma.product.create({
    data: {
      name: 'Royal Blue Mangalagiri Pattu Saree with Silver Zari',
      slug: 'royal-blue-mangalagiri-pattu-silver-zari',
      sku: 'DL-PAT-002',
      description: 'Stunning royal blue pure silk saree with silver zari border. Exquisite handloom craftsmanship for special occasions.',
      shortDescription: 'Royal blue pure silk saree with silver zari.',
      price: 8900,
      fabric: 'Pure Silk (Pattu)',
      weave: 'Mangalagiri Handloom',
      color: 'Royal Blue',
      occasion: 'Wedding, Festive',
      stock: 8,
      featured: true,
      newArrival: true,
      bestseller: false,
      active: true,
      isDemo: true,
      categoryId: pattuCat.id,
      images: {
        create: [
          { url: '/sarees/cat-cotton.jpg', altText: 'Royal blue pattu saree', sortOrder: 0, primary: true }
        ]
      }
    }
  })

  const p5 = await prisma.product.create({
    data: {
      name: 'Bridal Kanchi-Border Mangalagiri Pattu - Red',
      slug: 'bridal-kanchi-border-mangalagiri-pattu-red',
      sku: 'DL-PAT-003',
      description: 'A masterpiece bridal saree blending Mangalagiri weave body with a grand Kanchi style big border. Traditional vermillion red color.',
      shortDescription: 'Bridal red pure silk saree with Kanchi border.',
      price: 12500,
      fabric: 'Pure Silk (Pattu)',
      weave: 'Mangalagiri Handloom',
      color: 'Red',
      occasion: 'Bridal, Wedding',
      stock: 3,
      featured: true,
      newArrival: false,
      bestseller: true,
      active: true,
      isDemo: true,
      categoryId: pattuCat.id,
      images: {
        create: [
          { url: '/sarees/cat-arrivals.jpg', altText: 'Bridal red pattu saree', sortOrder: 0, primary: true }
        ]
      }
    }
  })

  const p6 = await prisma.product.create({
    data: {
      name: 'Pastel Pink Mangalagiri Dress Material',
      slug: 'pastel-pink-mangalagiri-dress-material',
      sku: 'DL-DRS-002',
      description: 'Elegant pastel pink 3-piece unstitched suit material. Soft pure cotton body with missing checks pattern. Perfect for casual gatherings.',
      shortDescription: 'Soft pure cotton 3-piece suit material in pastel pink.',
      price: 1800,
      fabric: 'Pure Cotton',
      weave: 'Mangalagiri Handloom',
      color: 'Pastel Pink',
      occasion: 'Casual, Everyday',
      stock: 25,
      featured: false,
      newArrival: true,
      bestseller: true,
      active: true,
      isDemo: true,
      categoryId: dressCat.id,
      images: {
        create: [
          { url: '/sarees/feat-3.jpg', altText: 'Pastel pink dress material', sortOrder: 0, primary: true }
        ]
      }
    }
  })

  console.log(`Seeding finished. Added ${[p1, p2, p3, p4, p5, p6].length} products.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

