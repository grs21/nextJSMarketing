import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const serviceCount = await prisma.service.count();
if (serviceCount === 0) {
  await prisma.service.createMany({
    data: [
      { name: "Gelinlik Danışmanlığı", description: "Uzman danışmanlarımızla hayalinizdeki gelinliği bulun.", order: 1 },
      { name: "Özel Dikim", description: "Bedeninize özel gelinlik ve kıyafet dikimi.", order: 2 },
      { name: "Düğün Organizasyonu", description: "Düğününüzü bizimle planlayın.", order: 3 },
    ],
  });
}

  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const hash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { username: "admin" },
    create: {
      username: "admin",
      passwordHash: hash,
    },
    update: { passwordHash: hash },
  });

  const slotCount = await prisma.appointmentSlot.count();
if (slotCount === 0) {
  const today = new Date();
  for (let i = 0; i < 7; i++) {
  const d = new Date(today);
  d.setDate(d.getDate() + i);
  const dateStr = d.toISOString().slice(0, 10);
  await prisma.appointmentSlot.create({
    data: {
      date: dateStr,
      startTime: "10:00",
      endTime: "11:00",
      capacity: 1,
      price: 100,
    },
  });
  await prisma.appointmentSlot.create({
    data: {
      date: dateStr,
      startTime: "14:00",
      endTime: "15:00",
      capacity: 1,
      price: 100,
    },
  });
  }
}

const products = await prisma.product.findMany();
const imageMap: Record<string, string> = {
  "Klasik Beyaz Gelinlik": "https://images.unsplash.com/photo-1594552072238-f732aa5c2d1e?w=600",
  "Prenses Kesim Gelinlik": "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
  "Mermaid Gelinlik": "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600",
};
if (products.length === 0) {
  await prisma.product.createMany({
    data: [
      {
        name: "Klasik Beyaz Gelinlik",
        description: "Zarif ve zamansız klasik beyaz gelinlik.",
        price: 15000,
        stock: 3,
        imageUrl: "https://images.unsplash.com/photo-1594552072238-f732aa5c2d1e?w=600",
      },
      {
        name: "Prenses Kesim Gelinlik",
        description: "Geniş etekli prenses kesim gelinlik.",
        price: 22000,
        stock: 2,
        imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
      },
      {
        name: "Mermaid Gelinlik",
        description: "Vücuda yapışan mermaid kesim gelinlik.",
        price: 18500,
        stock: 1,
        imageUrl: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600",
      },
    ],
  });
} else {
  for (const p of products) {
    if (!p.imageUrl && imageMap[p.name]) {
      await prisma.product.update({
        where: { id: p.id },
        data: { imageUrl: imageMap[p.name] },
      });
    }
  }
}

  // Klasik Beyaz Gelinlik'e video ve ek görseller ekle (örnek)
  const klasik = await prisma.product.findFirst({
    where: { name: "Klasik Beyaz Gelinlik" },
    include: { media: true },
  });
  if (klasik && klasik.media.length === 0) {
    const sampleVideo = "https://www.w3schools.com/html/mov_bbb.mp4";
    await prisma.productMedia.createMany({
      data: [
        { productId: klasik.id, url: imageMap["Klasik Beyaz Gelinlik"] || "", type: "image", order: 0 },
        { productId: klasik.id, url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600", type: "image", order: 1 },
        { productId: klasik.id, url: sampleVideo, type: "video", order: 2 },
      ],
    });
  }

  console.log("Seed tamamlandı.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
