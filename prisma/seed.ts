import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import argon2 from 'argon2'
import { randomUUID } from 'crypto'

config()

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

// ─── Helpers ─────────────────────────────────────────────────────────────────
const uuid = () => randomUUID()
const img = (seed: string | number, w = 800, h = 800) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`
const pid = (label: string) => `seed/${label}` // fake Cloudinary public_id

// Sample video & audio (publicly accessible)
const SAMPLE_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
const SAMPLE_AUDIO = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

async function main() {
  console.log('🌱 Seeding database…')

  // ── 0. Categories (upsert) ────────────────────────────────────────────────
  const cats = [
    { name: "Women's Fashion", slug: 'womens-fashion' },
    { name: "Men's Fashion", slug: 'mens-fashion' },
    { name: 'Footwear', slug: 'footwear' },
    { name: 'Bags & Luggage', slug: 'bags-luggage' },
    { name: 'Accessories', slug: 'accessories' },
    { name: 'Beauty & Care', slug: 'beauty-care' },
    { name: 'Jewelry & Watches', slug: 'jewelry-watches' },
    { name: 'Kids & Baby', slug: 'kids-baby' },
    { name: 'Sports & Active', slug: 'sports-active' },
    { name: 'Home & Living', slug: 'home-living' },
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Thrift & Pre-loved', slug: 'thrift-pre-loved' },
  ]
  for (const c of cats) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: { name: c.name }, create: c })
  }
  const catMap = Object.fromEntries(
    (await prisma.category.findMany({ select: { id: true, slug: true } })).map(c => [c.slug, c.id])
  )
  console.log('✅ Categories')

  // ── 1. Profiles ───────────────────────────────────────────────────────────
  const pwHash = await argon2.hash('test1234')
  const ADA_ID = uuid()
  const BEN_ID = uuid()

  const ada = await prisma.profile.upsert({
    where: { email: 'ada@reelshop.test' },
    update: {},
    create: {
      id: ADA_ID,
      email: 'ada@reelshop.test',
      username: 'ada_styles',
      password_hash: pwHash,
      avatar: img('ada', 200, 200),
      bio: 'Fashion creator & seller 🛍️ Lagos, Nigeria',
      email_verified: true,
      email_verified_at: new Date(),
    },
  })

  const ben = await prisma.profile.upsert({
    where: { email: 'ben@reelshop.test' },
    update: {},
    create: {
      id: BEN_ID,
      email: 'ben@reelshop.test',
      username: 'ben_shop',
      password_hash: pwHash,
      avatar: img('ben', 200, 200),
      bio: 'Just a shopper who loves style ✨',
      email_verified: true,
      email_verified_at: new Date(),
    },
  })
  console.log('✅ Profiles')

  // ── 2. Seller Profile ─────────────────────────────────────────────────────
  const seller = await prisma.sellerProfile.upsert({
    where: { store_slug: 'ada-styles' },
    update: {},
    create: {
      profileId: ada.id,
      store_slug: 'ada-styles',
      store_name: 'Ada Styles',
      store_description: 'Premium Nigerian fashion — womenswear, menswear, accessories & thrift finds.',
      store_logo: img('logo', 200, 200),
      store_banner: img('banner', 1200, 400),
      is_verified: true,
      is_active: true,
      verification_status: 'VERIFIED',
      default_currency: 'NGN',
    },
  })
  console.log('✅ Seller profile')

  // ── 3. Products ───────────────────────────────────────────────────────────
  // Helper: create product with nested media, variants, categories
  async function makeProduct(data: {
    title: string
    slug: string
    description: string
    price: number
    discount?: number
    status?: string
    isFeatured?: boolean
    isThrift?: boolean
    isAccessory?: boolean
    affiliateCommission?: number
    categoryIds: number[]
    images: string[]   // urls
    video?: string     // url
    bgMusic?: string   // url
    variants: { size: string; stock: number; price?: number }[]
  }) {
    const mediaCreate: any[] = data.images.map((url, i) => ({
      url,
      public_id: pid(`${data.slug}-img${i}`),
      type: 'IMAGE',
      isBgMusic: false,
      authorId: ada.id,
    }))
    if (data.video) {
      mediaCreate.push({
        url: data.video,
        public_id: pid(`${data.slug}-video`),
        type: 'VIDEO',
        isBgMusic: false,
        authorId: ada.id,
      })
    }
    if (data.bgMusic) {
      mediaCreate.push({
        url: data.bgMusic,
        public_id: pid(`${data.slug}-music`),
        type: 'AUDIO',
        isBgMusic: true,
        authorId: ada.id,
      })
    }

    // Check if product already exists
    const existing = await prisma.products.findUnique({ where: { slug: data.slug } })
    if (existing) return existing

    return prisma.products.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        price: data.price,
        discount: data.discount ?? 0,
        status: (data.status ?? 'PUBLISHED') as any,
        isFeatured: data.isFeatured ?? false,
        isThrift: data.isThrift ?? false,
        isAccessory: data.isAccessory ?? false,
        affiliateCommission: data.affiliateCommission,
        bannerImageUrl: data.images[0],
        sellerId: seller.id,
        store_slug: seller.store_slug,
        variants: { create: data.variants },
        media: { create: mediaCreate },
        category: { create: data.categoryIds.map(categoryId => ({ categoryId })) },
      },
    })
  }

  const p1 = await makeProduct({
    title: 'Floral Midi Dress',
    slug: 'floral-midi-dress',
    description: 'A beautiful floral midi dress perfect for any occasion. Lightweight fabric with a flattering fit. Available in S, M, L, and XL. Machine washable.',
    price: 18500,
    discount: 10,
    isFeatured: true,
    affiliateCommission: 1500,
    categoryIds: [catMap['womens-fashion']],
    images: [img('dress1'), img('dress2'), img('dress3')],
    variants: [
      { size: 'S', stock: 8 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 5 },
      { size: 'XL', stock: 3 },
    ],
  })

  const p2 = await makeProduct({
    title: 'Classic White Sneakers',
    slug: 'classic-white-sneakers',
    description: 'Clean, minimalist white sneakers made from premium leather. Goes with everything — jeans, dresses, or suits. Padded insole for all-day comfort.',
    price: 32000,
    discount: 5,
    affiliateCommission: 2500,
    categoryIds: [catMap['footwear']],
    images: [img('sneak1'), img('sneak2'), img('sneak3'), img('sneak4'), img('sneak5')],
    video: SAMPLE_VIDEO,
    variants: [
      { size: '39', stock: 4 },
      { size: '40', stock: 8 },
      { size: '41', stock: 6 },
      { size: '42', stock: 3 },
      { size: '43', stock: 2 },
    ],
  })

  const p3 = await makeProduct({
    title: 'Leather Tote Bag',
    slug: 'leather-tote-bag',
    description: 'Spacious genuine leather tote bag. Perfect for work, travel, or everyday use. Features interior zip pocket and magnetic snap closure.',
    price: 45000,
    isFeatured: true,
    affiliateCommission: 4000,
    categoryIds: [catMap['bags-luggage']],
    images: [img('bag1'), img('bag2')],
    bgMusic: SAMPLE_AUDIO,
    variants: [{ size: 'One Size', stock: 15 }],
  })

  const p4 = await makeProduct({
    title: 'Gold Layered Chain Necklace',
    slug: 'gold-layered-chain-necklace',
    description: '18K gold-plated layered chain necklace. Hypoallergenic and tarnish-resistant. Perfect for gifting or everyday glam.',
    price: 9500,
    discount: 15,
    isAccessory: true,
    affiliateCommission: 800,
    categoryIds: [catMap['jewelry-watches']],
    images: [img('neck1'), img('neck2')],
    variants: [{ size: 'One Size', stock: 30 }],
  })

  const p5 = await makeProduct({
    title: "Men's Ankara Print Shirt",
    slug: 'mens-ankara-print-shirt',
    description: 'Bold Ankara fabric dress shirt with modern cut. Suitable for formal and smart-casual events. Made from 100% Ghanaian cotton fabric.',
    price: 14000,
    affiliateCommission: 1200,
    categoryIds: [catMap['mens-fashion']],
    images: [img('ankara1'), img('ankara2'), img('ankara3')],
    video: SAMPLE_VIDEO,
    bgMusic: SAMPLE_AUDIO,
    variants: [
      { size: 'S', stock: 6 },
      { size: 'M', stock: 10 },
      { size: 'L', stock: 8 },
      { size: 'XL', stock: 4 },
    ],
  })

  const p6 = await makeProduct({
    title: "Thrift Levi's 501 Jeans",
    slug: 'thrift-levis-501-jeans',
    description: "Pre-loved Levi's 501 original fit jeans in excellent condition. Vintage wash, minimal wear. Sustainable fashion at its finest.",
    price: 8000,
    isThrift: true,
    categoryIds: [catMap['thrift-pre-loved']],
    images: [img('jeans1'), img('jeans2')],
    variants: [
      { size: 'W30/L30', stock: 1 },
      { size: 'W32/L32', stock: 2 },
    ],
  })

  console.log('✅ Products (6 created)')

  // ── 4. Posts ──────────────────────────────────────────────────────────────
  async function makePost(data: {
    authorId: string
    content: string
    contentType?: string
    visibility?: string
    images?: string[]
    video?: string
    bgMusic?: string
    taggedProductIds?: number[]
  }) {
    const mediaCreate: any[] = []
    for (let i = 0; i < (data.images?.length ?? 0); i++) {
      mediaCreate.push({
        url: data.images![i],
        public_id: pid(`post-${data.authorId.slice(0, 8)}-img${i}-${Date.now()}-${Math.random().toString(36).slice(2)}`),
        type: 'IMAGE',
        isBgMusic: false,
        authorId: data.authorId,
      })
    }
    if (data.video) {
      mediaCreate.push({
        url: data.video,
        public_id: pid(`post-${data.authorId.slice(0, 8)}-vid-${Date.now()}-${Math.random().toString(36).slice(2)}`),
        type: 'VIDEO',
        isBgMusic: false,
        authorId: data.authorId,
      })
    }
    if (data.bgMusic) {
      mediaCreate.push({
        url: data.bgMusic,
        public_id: pid(`post-${data.authorId.slice(0, 8)}-mus-${Date.now()}-${Math.random().toString(36).slice(2)}`),
        type: 'AUDIO',
        isBgMusic: true,
        authorId: data.authorId,
      })
    }

    return prisma.post.create({
      data: {
        authorId: data.authorId,
        content: data.content,
        contentType: data.contentType ?? 'EXPERIENCE',
        visibility: (data.visibility ?? 'PUBLIC') as any,
        allowComments: true,
        media: mediaCreate.length ? { create: mediaCreate } : undefined,
        taggedProducts: data.taggedProductIds?.length
          ? { create: data.taggedProductIds.map(productId => ({ productId })) }
          : undefined,
      },
    })
  }

  // Ada's posts
  await makePost({
    authorId: ada.id,
    content: 'Style is a way to say who you are without having to speak. 💫 #fashion #ootd #lagos',
  })

  await makePost({
    authorId: ada.id,
    content: 'New arrivals just dropped! This floral midi dress is giving everything 🌸 Comment "LINK" to shop!',
    images: [img('post-dress1'), img('post-dress2')],
    taggedProductIds: [p1.id],
  })

  await makePost({
    authorId: ada.id,
    content: 'Three looks, one bag 👜 Our leather tote goes with EVERYTHING. Tag someone who needs this!',
    images: [img('post-bag1'), img('post-bag2'), img('post-bag3')],
    bgMusic: SAMPLE_AUDIO,
    taggedProductIds: [p3.id],
  })

  await makePost({
    authorId: ada.id,
    content: '👟 Unboxing our Classic White Sneakers — watch the full try-on! Link in bio to cop yours 🔗 #sneakers #streetwear',
    video: SAMPLE_VIDEO,
    taggedProductIds: [p2.id],
  })

  await makePost({
    authorId: ada.id,
    content: 'Ankara never goes out of style 🔥🔥 Perfect for the culture! Shop the shirt, link in bio.',
    images: [img('post-ankara1'), img('post-ankara2'), img('post-ankara3'), img('post-ankara4')],
    bgMusic: SAMPLE_AUDIO,
    taggedProductIds: [p5.id],
  })

  await makePost({
    authorId: ada.id,
    content: 'THRIFT HAUL 🛍️ Found these Levi\'s for under ₦10k — sustainable, stylish, and affordable. #thrift #sustainable #fashion',
    images: [img('post-thrift1'), img('post-thrift2')],
  })

  // Ben's posts
  await makePost({
    authorId: ben.id,
    content: 'Just discovered this amazing store! Ada Styles is sending out serious heat 🔥 Nigeria fashion is on another level.',
  })

  await makePost({
    authorId: ben.id,
    content: 'My delivery just arrived and I am not crying, you are crying 😭❤️ #styleblogger #nigerianfashion',
    images: [img('post-ben1'), img('post-ben2'), img('post-ben3')],
    contentType: 'INSPIRATION',
  })

  console.log('✅ Posts (8 created)')

  // ── 5. Stories ────────────────────────────────────────────────────────────
  async function makeStory(data: { authorId: string; imageUrl: string; productId?: number }) {
    const mediaId = uuid()
    const pubId = pid(`story-${data.authorId.slice(0, 8)}-${Date.now()}-${Math.random().toString(36).slice(2)}`)

    // Create media first (story needs a unique mediaId)
    await prisma.media.create({
      data: {
        id: mediaId,
        url: data.imageUrl,
        public_id: pubId,
        type: 'IMAGE',
        isBgMusic: false,
        authorId: data.authorId,
      },
    })

    return prisma.story.create({
      data: {
        authorId: data.authorId,
        mediaId,
        productId: data.productId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h from now
      },
    })
  }

  await makeStory({ authorId: ada.id, imageUrl: img('story1', 600, 1067), productId: p1.id })
  await makeStory({ authorId: ada.id, imageUrl: img('story2', 600, 1067), productId: p3.id })
  await makeStory({ authorId: ada.id, imageUrl: img('story3', 600, 1067) })
  await makeStory({ authorId: ben.id, imageUrl: img('story4', 600, 1067) })

  console.log('✅ Stories (4 created)')

  // ── 6. Likes & Comments (social proof) ───────────────────────────────────
  // Product likes
  for (const pid_ of [p1.id, p2.id, p3.id, p4.id]) {
    await prisma.like.upsert({
      where: { userId_productId: { userId: ben.id, productId: pid_ } },
      update: {},
      create: { userId: ben.id, productId: pid_ },
    })
  }

  // Comments on products
  await prisma.comment.create({
    data: { authorId: ben.id, productId: p1.id, text: 'OMG this dress is stunning! Does it run true to size? 😍' },
  })
  await prisma.comment.create({
    data: { authorId: ada.id, productId: p1.id, text: 'Yes! It runs true to size, just pick your regular size 😊' },
  })
  await prisma.comment.create({
    data: { authorId: ben.id, productId: p2.id, text: 'These sneakers look amazing, are they genuine leather?' },
  })

  console.log('✅ Likes & Comments')

  console.log('\n🎉 Seed complete!')
  console.log('   Login: ada@reelshop.test / test1234')
  console.log('   Login: ben@reelshop.test / test1234')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
