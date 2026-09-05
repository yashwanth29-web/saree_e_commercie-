const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding 15 authentic DL Handlooms products into database...');

  // Ensure categories exist
  const categories = [
    {
      name: 'Kalamkari Handlooms',
      slug: 'kalamkari',
      description: 'Hand-painted mythological Kalamkari artwork on pure handloom fabric.',
      image: '/products/kalamkari-peacock-lotus.jpg',
    },
    {
      name: 'Mangalagiri Pattu',
      slug: 'pattu',
      description: 'Pure Mangalagiri Pattu silk-cotton sarees with silver and gold zari temple borders.',
      image: '/products/mangalagiri-pattu-sky-blue.jpg',
    },
    {
      name: 'Cotton Sarees',
      slug: 'cotton',
      description: '100s count pure handloom Mangalagiri cotton sarees with contrast designer blouse pieces.',
      image: '/products/mangalagiri-cotton-yellow-bandhani.jpg',
    },
    {
      name: 'Dress Materials',
      slug: 'dress-materials',
      description: 'Authentic 3-piece handloom dress materials with traditional Nizam borders.',
      image: '/products/mangalagiri-cotton-maroon-ikkat.jpg',
    },
  ];

  const catMap = {};
  for (const cat of categories) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (existing) {
      catMap[cat.slug] = existing;
    } else {
      catMap[cat.slug] = await prisma.category.create({ data: cat });
    }
  }

  const products = [
    // --- 5 KALAMKARI ---
    {
      name: 'Mangalagiri Royal Peacock & Lotus Pond Kalamkari Saree',
      slug: 'mangalagiri-peacock-lotus-kalamkari',
      sku: 'DL-KAL-001',
      description: 'Authentic hand-painted Kalamkari saree crafted by traditional artisans. Features a rich emerald green body with a blooming lotus pond motif, a magnificent Mayil (peacock) pallu in wine maroon, and a pure golden zari temple border. Woven in Mangalagiri with breathable silk-cotton yarn.',
      price: 2850,
      fabric: 'Handloom Silk-Cotton',
      weave: 'Kalamkari Hand-Painted with Zari Border',
      color: 'Emerald Green & Wine Maroon',
      stock: 12,
      bestseller: true,
      featured: true,
      newArrival: false,
      catSlug: 'kalamkari',
      image: '/products/kalamkari-peacock-lotus.jpg',
    },
    {
      name: 'Vrindavan Kamadhenu Cow & Lotus Handloom Saree',
      slug: 'vrindavan-kamadhenu-lotus-kalamkari',
      sku: 'DL-KAL-002',
      description: 'Exquisite Pichwai-inspired Kamadhenu cow and lotus garden motifs hand-painted across a vibrant parrot green body. Finished with a dramatic crimson red pallu and an antique silver zari border. Direct from master weavers in Mangalagiri.',
      price: 2950,
      fabric: 'Handloom Silk-Cotton',
      weave: 'Kalamkari Hand-Painted with Zari Border',
      color: 'Parrot Green & Carmine Red',
      stock: 10,
      bestseller: false,
      featured: true,
      newArrival: true,
      catSlug: 'kalamkari',
      image: '/products/kalamkari-pichwai-cow.jpg',
    },
    {
      name: 'Radha-Krishna Vrindavan Kalamkari Handloom Saree',
      slug: 'radha-krishna-vrindavan-kalamkari',
      sku: 'DL-KAL-003',
      description: 'Celestial depiction of Radha and Krishna under the Kadamba tree, surrounded by sacred deer, gopis, and dancing peacocks. Vibrant mustard turmeric yellow paired with a striking midnight black pallu and shimmering copper zari border.',
      price: 3250,
      fabric: 'Handloom Silk-Cotton',
      weave: 'Kalamkari Hand-Painted with Zari Border',
      color: 'Mustard Yellow & Midnight Black',
      stock: 8,
      bestseller: true,
      featured: true,
      newArrival: false,
      catSlug: 'kalamkari',
      image: '/products/kalamkari-radha-krishna.jpg',
    },
    {
      name: 'Lotus Lake Maiden & Sacred Fish Kalamkari Saree',
      slug: 'lotus-lake-maiden-kalamkari',
      sku: 'DL-KAL-004',
      description: 'Enchanting village maiden navigating a lotus river with sacred fish and water lily motifs. Jade green body with rich plum violet and mustard yellow accents, bordered by a traditional Mangalagiri copper zari edge.',
      price: 2850,
      fabric: 'Handloom Silk-Cotton',
      weave: 'Kalamkari Hand-Painted with Zari Border',
      color: 'Jade Green & Plum Violet',
      stock: 15,
      bestseller: false,
      featured: false,
      newArrival: true,
      catSlug: 'kalamkari',
      image: '/products/kalamkari-river-maiden.jpg',
    },
    {
      name: 'Vanya Forest Deer & Tree of Life Kalamkari Saree',
      slug: 'vanya-forest-deer-tree-of-life-kalamkari',
      sku: 'DL-KAL-005',
      description: 'Mythological Tree of Life depiction with forest deer, chirping songbirds, and celestial dancers. Cerulean blue body complemented by an ivory white pallu and rich golden zari border.',
      price: 3150,
      fabric: 'Handloom Silk-Cotton',
      weave: 'Kalamkari Hand-Painted with Zari Border',
      color: 'Cerulean Blue & Ivory White',
      stock: 10,
      bestseller: true,
      featured: true,
      newArrival: true,
      catSlug: 'kalamkari',
      image: '/products/kalamkari-forest-deer.jpg',
    },

    // --- 5 MANGALAGIRI PATTU ---
    {
      name: 'Mangalagiri Pattu Silver Zari Temple Saree - Sky Blue',
      slug: 'mangalagiri-pattu-silver-zari-sky-blue',
      sku: 'DL-PAT-SILVER-01',
      description: 'Pure Mangalagiri Pattu handloom saree in an electric royal sky blue shade. Features delicate vertical silver zari lines across the body and a traditional Nizam temple (kaddi) border with rich silver zari pallu.',
      price: 1950,
      fabric: 'Pure Mangalagiri Pattu',
      weave: 'Handloom Pattu with Silver Zari Nizam Border',
      color: 'Royal Sky Blue',
      stock: 20,
      bestseller: true,
      featured: true,
      newArrival: false,
      catSlug: 'pattu',
      image: '/products/mangalagiri-pattu-sky-blue.jpg',
    },
    {
      name: 'Mangalagiri Pattu Silver Zari Temple Saree - Rani Pink',
      slug: 'mangalagiri-pattu-silver-zari-rani-pink',
      sku: 'DL-PAT-SILVER-02',
      description: 'Radiant Rani magenta pink Mangalagiri Pattu saree. Decorated with fine silver zari pinstripes throughout the body and a regal Nizam temple silver zari border.',
      price: 1950,
      fabric: 'Pure Mangalagiri Pattu',
      weave: 'Handloom Pattu with Silver Zari Nizam Border',
      color: 'Rani Magenta Pink',
      stock: 18,
      bestseller: true,
      featured: true,
      newArrival: true,
      catSlug: 'pattu',
      image: '/products/mangalagiri-pattu-rani-pink.jpg',
    },
    {
      name: 'Mangalagiri Pattu Silver Zari Temple Saree - Wine Maroon',
      slug: 'mangalagiri-pattu-silver-zari-wine-maroon',
      sku: 'DL-PAT-SILVER-03',
      description: 'Classic bridal deep wine maroon Mangalagiri Pattu saree. Features antique silver zari stripes and the iconic Nizam temple border. Comes with matching running blouse piece.',
      price: 2100,
      fabric: 'Pure Mangalagiri Pattu',
      weave: 'Handloom Pattu with Silver Zari Nizam Border',
      color: 'Wine Maroon',
      stock: 15,
      bestseller: true,
      featured: true,
      newArrival: false,
      catSlug: 'pattu',
      image: '/products/mangalagiri-pattu-wine-maroon.jpg',
    },
    {
      name: 'Mangalagiri Pattu Silver Zari Temple Saree - Royal Violet',
      slug: 'mangalagiri-pattu-silver-zari-royal-violet',
      sku: 'DL-PAT-SILVER-04',
      description: 'Regal royal violet jamun shade in pure handloom Mangalagiri Pattu. Handwoven with shimmering silver zari lines and a heavy temple border.',
      price: 1950,
      fabric: 'Pure Mangalagiri Pattu',
      weave: 'Handloom Pattu with Silver Zari Nizam Border',
      color: 'Royal Jamun Violet',
      stock: 14,
      bestseller: false,
      featured: false,
      newArrival: true,
      catSlug: 'pattu',
      image: '/products/mangalagiri-pattu-royal-purple.jpg',
    },
    {
      name: 'Mangalagiri Pattu Silver Zari Temple Saree - Peacock Teal',
      slug: 'mangalagiri-pattu-silver-zari-peacock-teal',
      sku: 'DL-PAT-SILVER-05',
      description: 'Breathtaking deep peacock teal green shade woven in pure Mangalagiri Pattu. Accented by lustrous silver zari checks and temple pallu.',
      price: 2100,
      fabric: 'Pure Mangalagiri Pattu',
      weave: 'Handloom Pattu with Silver Zari Nizam Border',
      color: 'Peacock Teal Green',
      stock: 16,
      bestseller: true,
      featured: true,
      newArrival: true,
      catSlug: 'pattu',
      image: '/products/mangalagiri-pattu-peacock-teal.jpg',
    },

    // --- 5 MANGALAGIRI COTTON WITH CONTRAST BLOUSE ---
    {
      name: 'Mangalagiri Cotton Saree with Bandhani Blouse - Lemon Yellow',
      slug: 'mangalagiri-cotton-lemon-yellow-bandhani',
      sku: 'DL-COT-BLOUSE-01',
      description: 'Sunny lemon yellow 100s count pure Mangalagiri cotton saree with fine self-woven stripes and handcrafted yellow tassels (kuchu). Accompanied by a designer chocolate brown Bandhani print blouse piece.',
      price: 1250,
      fabric: '100s Count Pure Cotton',
      weave: 'Mangalagiri Handloom Cotton with Tassels',
      color: 'Lemon Yellow',
      stock: 25,
      bestseller: true,
      featured: true,
      newArrival: false,
      catSlug: 'cotton',
      image: '/products/mangalagiri-cotton-yellow-bandhani.jpg',
    },
    {
      name: 'Mangalagiri Cotton Saree with Floral Blouse - Tangerine Orange',
      slug: 'mangalagiri-cotton-tangerine-orange-floral',
      sku: 'DL-COT-BLOUSE-02',
      description: 'Vibrant tangerine orange handloom cotton saree with handcrafted tassels. Paired with a contrast pastel sky blue floral printed designer blouse piece.',
      price: 1250,
      fabric: '100s Count Pure Cotton',
      weave: 'Mangalagiri Handloom Cotton with Tassels',
      color: 'Tangerine Orange',
      stock: 20,
      bestseller: false,
      featured: true,
      newArrival: true,
      catSlug: 'cotton',
      image: '/products/mangalagiri-cotton-orange-floral.jpg',
    },
    {
      name: 'Mangalagiri Cotton Saree with Floral Checks Blouse - Sage Green',
      slug: 'mangalagiri-cotton-sage-green-checks',
      sku: 'DL-COT-BLOUSE-03',
      description: 'Earthy sage sea green pure cotton saree with matching tassels. Comes with an artistic cream and burgundy floral checked designer blouse piece.',
      price: 1350,
      fabric: '100s Count Pure Cotton',
      weave: 'Mangalagiri Handloom Cotton with Tassels',
      color: 'Sage Green',
      stock: 22,
      bestseller: true,
      featured: true,
      newArrival: false,
      catSlug: 'cotton',
      image: '/products/mangalagiri-cotton-sage-check.jpg',
    },
    {
      name: 'Mangalagiri Cotton Saree with Dark Floral Blouse - Mint Green',
      slug: 'mangalagiri-cotton-mint-green-dark-floral',
      sku: 'DL-COT-BLOUSE-04',
      description: 'Refreshing pistachio mint green handloom cotton saree with rich green tassels. Paired with a contrasting midnight black floral blossom designer blouse piece.',
      price: 1250,
      fabric: '100s Count Pure Cotton',
      weave: 'Mangalagiri Handloom Cotton with Tassels',
      color: 'Pistachio Mint Green',
      stock: 19,
      bestseller: true,
      featured: false,
      newArrival: true,
      catSlug: 'cotton',
      image: '/products/mangalagiri-cotton-mint-floral.jpg',
    },
    {
      name: 'Mangalagiri Cotton Saree with Ikkat Blouse - Deep Maroon',
      slug: 'mangalagiri-cotton-deep-maroon-ikkat',
      sku: 'DL-COT-BLOUSE-05',
      description: 'Deep royal maroon wine handloom cotton saree with dual-tone black and maroon tassels. Styled with an authentic parrot green Pochampally Ikkat designer blouse piece.',
      price: 1350,
      fabric: '100s Count Pure Cotton',
      weave: 'Mangalagiri Handloom Cotton with Tassels',
      color: 'Deep Maroon Wine',
      stock: 15,
      bestseller: true,
      featured: true,
      newArrival: true,
      catSlug: 'cotton',
      image: '/products/mangalagiri-cotton-maroon-ikkat.jpg',
    },
  ];

  for (const item of products) {
    const category = catMap[item.catSlug];
    if (!category) continue;

    const existingProduct = await prisma.product.findUnique({
      where: { slug: item.slug },
    });

    if (existingProduct) {
      await prisma.product.update({
        where: { id: existingProduct.id },
        data: {
          name: item.name,
          price: item.price,
          description: item.description,
          fabric: item.fabric,
          weave: item.weave,
          color: item.color,
          bestseller: item.bestseller,
          featured: item.featured,
          newArrival: item.newArrival,
          stock: item.stock,
          active: true,
        },
      });

      // Update image
      const primaryImg = await prisma.productImage.findFirst({
        where: { productId: existingProduct.id },
      });
      if (primaryImg) {
        await prisma.productImage.update({
          where: { id: primaryImg.id },
          data: { url: item.image },
        });
      } else {
        await prisma.productImage.create({
          data: {
            productId: existingProduct.id,
            url: item.image,
            primary: true,
          },
        });
      }
      console.log(`Updated: ${item.name}`);
    } else {
      const created = await prisma.product.create({
        data: {
          name: item.name,
          slug: item.slug,
          sku: item.sku,
          description: item.description,
          price: item.price,
          fabric: item.fabric,
          weave: item.weave,
          color: item.color,
          bestseller: item.bestseller,
          featured: item.featured,
          newArrival: item.newArrival,
          stock: item.stock,
          active: true,
          categoryId: category.id,
        },
      });

      await prisma.productImage.create({
        data: {
          productId: created.id,
          url: item.image,
          primary: true,
        },
      });
      console.log(`Created: ${item.name}`);
    }
  }

  console.log('Seeding complete! All 15 authentic DL Handlooms sarees are now live.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
