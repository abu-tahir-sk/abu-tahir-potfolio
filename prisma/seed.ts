import { PrismaClient, ProjectStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  const adminEmail = process.env.ADMIN_EMAIL || "abutahir2626@gmail.com";
  const rawPassword = process.env.ADMIN_INITIAL_PASSWORD || "AdminPassword123!";
  const passwordHash = await bcrypt.hash(rawPassword, 12);

  // 1. Seed Admin User
  const adminUser = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: "Abu Tahir Sk",
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Abu Tahir Sk",
    },
  });
  console.log(`✅ Admin user seeded: ${adminUser.email}`);

  // 2. Seed Site Settings
  await prisma.siteSettings.upsert({
    where: { id: "default-settings" },
    update: {
      fullName: "Abu Tahir Sk",
      professionalTitle: "Full-Stack Web Developer",
      biography:
        "I build modern web applications, responsive interfaces, and practical digital products using React, Next.js, TypeScript, and Node.js. Passionate about clean code architecture, intuitive user interfaces, and robust backend database design.",
      profileImageUrl: "/images/profile/avatar-default.svg",
      email: "abutahir2626@gmail.com",
      githubUrl: "https://github.com/abu-tahir-sk",
      linkedinUrl: "https://linkedin.com/in/abu-tahir-sk",
      availabilityStatus: "Available for full-time roles & projects",
      resumeUrl: "/resume/Abu-Tahir-Sk-Resume.pdf",
      siteUrl: "https://abutahir.dev",
      seoTitle: "Abu Tahir Sk — Full-Stack Web Developer",
      seoDescription:
        "Full-Stack Web Developer specializing in React, Next.js, TypeScript, Node.js, and PostgreSQL. View projects, skills, and get in touch.",
      footerText: "Designed and built by Abu Tahir Sk.",
    },
    create: {
      id: "default-settings",
      fullName: "Abu Tahir Sk",
      professionalTitle: "Full-Stack Web Developer",
      biography:
        "I build modern web applications, responsive interfaces, and practical digital products using React, Next.js, TypeScript, and Node.js. Passionate about clean code architecture, intuitive user interfaces, and robust backend database design.",
      profileImageUrl: "/images/profile/avatar-default.svg",
      email: "abutahir2626@gmail.com",
      githubUrl: "https://github.com/abu-tahir-sk",
      linkedinUrl: "https://linkedin.com/in/abu-tahir-sk",
      availabilityStatus: "Available for full-time roles & projects",
      resumeUrl: "/resume/Abu-Tahir-Sk-Resume.pdf",
      siteUrl: "https://abutahir.dev",
      seoTitle: "Abu Tahir Sk — Full-Stack Web Developer",
      seoDescription:
        "Full-Stack Web Developer specializing in React, Next.js, TypeScript, Node.js, and PostgreSQL. View projects, skills, and get in touch.",
      footerText: "Designed and built by Abu Tahir Sk.",
    },
  });
  console.log("✅ Site settings seeded.");

  // 3. Seed Skills
  const skillsData = [
    // Frontend
    { name: "HTML5", category: "Frontend", displayOrder: 1, icon: "Code2" },
    { name: "CSS3", category: "Frontend", displayOrder: 2, icon: "Palette" },
    { name: "JavaScript", category: "Frontend", displayOrder: 3, icon: "FileCode" },
    { name: "TypeScript", category: "Frontend", displayOrder: 4, icon: "FileCode2" },
    { name: "React.js", category: "Frontend", displayOrder: 5, icon: "Atom" },
    { name: "Next.js", category: "Frontend", displayOrder: 6, icon: "Layers" },
    { name: "Tailwind CSS", category: "Frontend", displayOrder: 7, icon: "Wind" },

    // Backend
    { name: "Node.js", category: "Backend", displayOrder: 8, icon: "Server" },
    { name: "Express.js", category: "Backend", displayOrder: 9, icon: "Cpu" },
    { name: "REST APIs", category: "Backend", displayOrder: 10, icon: "Network" },
    { name: "JWT Authentication", category: "Backend", displayOrder: 11, icon: "ShieldCheck" },

    // Database
    { name: "PostgreSQL", category: "Database", displayOrder: 12, icon: "Database" },
    { name: "Prisma", category: "Database", displayOrder: 13, icon: "Boxes" },
    { name: "MongoDB", category: "Database", displayOrder: 14, icon: "HardDrive" },

    // Tools
    { name: "Git", category: "Tools", displayOrder: 15, icon: "GitBranch" },
    { name: "GitHub", category: "Tools", displayOrder: 16, icon: "Github" },
    { name: "Postman", category: "Tools", displayOrder: 17, icon: "Send" },
    { name: "VS Code", category: "Tools", displayOrder: 18, icon: "Terminal" },
    { name: "Vercel", category: "Tools", displayOrder: 19, icon: "Cloud" },
  ];

  await prisma.skill.deleteMany({});
  for (const skill of skillsData) {
    await prisma.skill.create({
      data: {
        name: skill.name,
        category: skill.category,
        displayOrder: skill.displayOrder,
        icon: skill.icon,
        visible: true,
      },
    });
  }
  console.log(`✅ Seeded ${skillsData.length} skills.`);

  // 4. Seed Projects
  const projectsData = [
    {
      title: "DocuFlow",
      slug: "docuflow",
      shortDescription:
        "A document management application designed to help businesses create, organize, preview, and manage professional invoices.",
      description:
        "DocuFlow is a complete invoice and document management system built to simplify commercial invoicing for small business owners and freelancers.\n\nIt features live real-time A4 document previewing, client directory management, multiple customizable templates, dynamic calculations (taxes, discounts, subtotals), and PDF export powered by React-PDF. Fully persisted on PostgreSQL with Neon for fast, scalable access.",
      coverImageUrl: "/images/projects/docuflow/template-1.jpg",
      screenshots: [
        "/images/projects/docuflow/template-1.jpg",
        "/images/projects/docuflow/template-2.jpg",
        "/images/projects/docuflow/template-3.jpg",
        "/images/projects/docuflow/template-4.jpg",
      ],
      technologies: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "PostgreSQL",
        "Prisma",
        "Neon",
        "@react-pdf/renderer",
      ],
      features: [
        "Invoice creation and editing",
        "Live A4 invoice preview",
        "Client management",
        "Company profile settings",
        "PDF generation and download",
        "Multiple invoice templates",
        "Document persistence",
        "Dashboard overview",
        "Invoice status tracking",
      ],
      category: "Full-Stack",
      githubUrl: "https://github.com/abu-tahir-sk/docuflow",
      liveDemoUrl: "https://docuflow-mu-inky.vercel.app/",
      featured: true,
      status: ProjectStatus.PUBLISHED,
      displayOrder: 1,
    },
    {
      title: "FitLog",
      slug: "fit-log",
      shortDescription:
        "A dark, no-nonsense gym companion app to browse workout libraries, follow detailed routines, and log personal training sessions.",
      description:
        "FitLog was created for athletes seeking a focused, distraction-free companion to track their training splits. It provides an extensive library of workouts, target muscle breakdown, rep/set tracking, and a clean mobile-first design.",
      coverImageUrl: "/images/projects/fitlog/banner.png",
      screenshots: ["/images/projects/fitlog/banner.png"],
      technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
      features: [
        "Exercise library by muscle group",
        "Workout routine planner",
        "Daily log tracking",
        "Mobile-first responsive layout",
        "Dark mode interface",
      ],
      category: "Web App",
      githubUrl: "https://github.com/abu-tahir-sk",
      liveDemoUrl: "https://fit-log-two-alpha.vercel.app/",
      featured: false,
      status: ProjectStatus.PUBLISHED,
      displayOrder: 2,
    },
    {
      title: "DevStack",
      slug: "devstack",
      shortDescription:
        "An interactive platform where developers can explore modern frameworks, libraries, and design their ideal development stack.",
      description:
        "DevStack is a responsive tech stack discovery app that helps developers curate tools across frontend, backend, databases, and DevOps for their next project.",
      coverImageUrl: "/images/projects/devstack/banner-stack.png",
      screenshots: ["/images/projects/devstack/banner-stack.png"],
      technologies: ["JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Netlify"],
      features: [
        "Interactive technology explorer",
        "Stack architecture curation",
        "Category filtering and search",
        "Clean responsive user experience",
      ],
      category: "Frontend",
      githubUrl: "https://github.com/abu-tahir-sk",
      liveDemoUrl: "https://devstackss.netlify.app/",
      featured: false,
      status: ProjectStatus.PUBLISHED,
      displayOrder: 3,
    },
  ];

  for (const proj of projectsData) {
    await prisma.project.upsert({
      where: { slug: proj.slug },
      update: proj,
      create: proj,
    });
  }
  console.log(`✅ Seeded ${projectsData.length} projects.`);

  // 5. Seed Experience
  await prisma.experience.deleteMany({});
  await prisma.experience.create({
    data: {
      role: "Full-Stack Web Developer",
      organization: "Independent Development & Client Projects",
      description:
        "Built and deployed end-to-end web applications with modern frontend architectures and robust backend services. Implemented document management solutions (DocuFlow), responsive workout logs, and custom web applications with PostgreSQL and TypeScript.",
      startDate: "2024",
      current: true,
      technologies: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "Tailwind CSS"],
      displayOrder: 1,
    },
  });
  console.log("✅ Seeded experience.");

  // 6. Seed Education
  await prisma.education.deleteMany({});
  await prisma.education.create({
    data: {
      qualification: "Computer Science & Engineering",
      institution: "Technical Institute",
      description:
        "Core studies in software engineering, database management, algorithms, and modern web application development.",
      startDate: "2022",
      endDate: "2026",
      displayOrder: 1,
    },
  });
  console.log("✅ Seeded education.");

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
