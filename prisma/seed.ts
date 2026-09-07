import "dotenv/config";
import { prisma } from "../lib/prisma";
import {
  PERMISSIONS,
  DEFAULT_MANAGER_PERMISSION_KEYS,
  DEFAULT_SELLER_PERMISSION_KEYS,
} from "../lib/permission-defs";

const ADMIN_EMAIL = "ngetichjustine1@gmail.com";

async function main() {
  for (const perm of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key: perm.key },
      create: { key: perm.key, group: perm.group, description: perm.description },
      update: { group: perm.group, description: perm.description },
    });
  }

  const allPermissions = await prisma.permission.findMany();

  const adminRole = await prisma.role.upsert({
    where: { name: "Admin" },
    create: { name: "Admin", description: "Full access to everything", isSystem: true },
    update: {},
  });
  await prisma.rolePermission.deleteMany({ where: { roleId: adminRole.id } });
  await prisma.rolePermission.createMany({
    data: allPermissions.map((p) => ({ roleId: adminRole.id, permissionId: p.id })),
  });

  const managerRole = await prisma.role.upsert({
    where: { name: "Manager" },
    create: { name: "Manager", description: "Runs day-to-day operations", isSystem: true },
    update: {},
  });
  const managerPermissions = allPermissions.filter((p) => DEFAULT_MANAGER_PERMISSION_KEYS.includes(p.key));
  await prisma.rolePermission.deleteMany({ where: { roleId: managerRole.id } });
  await prisma.rolePermission.createMany({
    data: managerPermissions.map((p) => ({ roleId: managerRole.id, permissionId: p.id })),
  });

  const sellerRole = await prisma.role.upsert({
    where: { name: "Seller" },
    create: { name: "Seller", description: "Front-desk staff capturing client data", isSystem: true },
    update: {},
  });
  const sellerPermissions = allPermissions.filter((p) => DEFAULT_SELLER_PERMISSION_KEYS.includes(p.key));
  await prisma.rolePermission.deleteMany({ where: { roleId: sellerRole.id } });
  await prisma.rolePermission.createMany({
    data: sellerPermissions.map((p) => ({ roleId: sellerRole.id, permissionId: p.id })),
  });

  await prisma.allowedEmail.upsert({
    where: { email: ADMIN_EMAIL },
    create: { email: ADMIN_EMAIL, roleId: adminRole.id, note: "Seeded admin" },
    update: { roleId: adminRole.id },
  });

  if ((await prisma.heroSlide.count()) === 0) {
    await prisma.heroSlide.createMany({
      data: [
        {
          label: "Ironing Perfection, Delivered Fast",
          body: "Achieve that crisp, flawless look without lifting a finger. Pure convenience starts here.",
          ctaText: "Schedule Ironing Pickup",
          imageUrl: "/iron.jpeg",
          sortOrder: 0,
        },
        {
          label: "Washing Made Wonderful & Easy",
          body: "Experience deep, eco-friendly cleaning with effortless same-day pickup and delivery.",
          ctaText: "Start Washing Order",
          imageUrl: "/wash.jpeg",
          sortOrder: 1,
        },
        {
          label: "Experience Unparalleled Convenience",
          body: "Our premium laundry services ensure a spotless finish and absolute peace of mind, every time.",
          ctaText: "Book Your Service Now",
          imageUrl: "/iron1.jpeg",
          sortOrder: 2,
        },
        {
          label: "Care Beyond Compare for Fabrics",
          body: "From delicates to heavy linens, trust our experts for gentle treatment and sparkling results.",
          ctaText: "See All Pricing",
          imageUrl: "/iron.jpeg",
          sortOrder: 3,
        },
      ],
    });
  }

  if ((await prisma.serviceCategory.count()) === 0) {
    await prisma.serviceCategory.create({
      data: {
        name: "Duvet Cleaning",
        icon: "Package",
        displayStyle: "LIST",
        sortOrder: 0,
        items: {
          create: [
            { label: "4x6", price: 400, sortOrder: 0 },
            { label: "5x6", price: 500, sortOrder: 1 },
            { label: "6x6", price: 600, sortOrder: 2 },
          ],
        },
      },
    });
    await prisma.serviceCategory.create({
      data: {
        name: "Bulk Laundry",
        icon: "WashingMachine",
        displayStyle: "SINGLE",
        sortOrder: 1,
        items: {
          create: [{ label: "Bulk Laundry", price: 100, unit: "per kg", sortOrder: 0 }],
        },
      },
    });
  }

  console.log("Seed complete.");
  console.log(`Roles: Admin (${allPermissions.length} perms), Manager (${managerPermissions.length} perms), Seller (${sellerPermissions.length} perms)`);
  console.log(`Allowlisted admin: ${ADMIN_EMAIL}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
