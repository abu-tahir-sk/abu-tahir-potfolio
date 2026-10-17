import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const projectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters").max(250),
  description: z.string().min(20, "Detailed description must be at least 20 characters"),
  coverImageUrl: z.string().min(1, "Cover image is required"),
  coverImagePublicId: z.string().optional().nullable(),
  screenshots: z.array(z.string()).default([]),
  technologies: z.array(z.string()).min(1, "At least one technology is required"),
  features: z.array(z.string()).default([]),
  category: z.string().default("Full-Stack"),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")).nullable(),
  liveDemoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")).nullable(),
  featured: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED"),
  completedAt: z.string().optional().nullable(),
  displayOrder: z.coerce.number().int().default(0),
});

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required").max(50),
  category: z.enum(["Frontend", "Backend", "Database", "Tools"]).default("Frontend"),
  icon: z.string().optional().nullable(),
  displayOrder: z.coerce.number().int().default(0),
  visible: z.boolean().default(true),
});

export const experienceSchema = z.object({
  role: z.string().min(2, "Role is required").max(100),
  organization: z.string().min(2, "Organization is required").max(100),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().nullable(),
  current: z.boolean().default(false),
  technologies: z.array(z.string()).default([]),
  displayOrder: z.coerce.number().int().default(0),
});

export const educationSchema = z.object({
  qualification: z.string().min(2, "Qualification is required").max(120),
  institution: z.string().min(2, "Institution is required").max(150),
  subject: z.string().max(120).optional().nullable(),
  boardOrUniversity: z.string().max(150).optional().nullable(),
  passingYear: z.string().max(20).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  startDate: z.string().max(20).optional().nullable(),
  endDate: z.string().max(20).optional().nullable(),
  displayOrder: z.coerce.number().int().default(0),
  visible: z.boolean().default(true),
});

export const contactMessageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().email("Please provide a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(150),
  message: z.string().min(10, "Message must be at least 10 characters").max(3000),
  website_hp: z.string().max(0, "Spam detected").optional(), // Honeypot field
});

export const siteSettingsSchema = z.object({
  fullName: z.string().min(2).max(100),
  professionalTitle: z.string().min(2).max(120),
  biography: z.string().min(20),
  profileImageUrl: z.string().optional().nullable(),
  profileImagePublicId: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  email: z.string().email(),
  githubUrl: z.string().url(),
  linkedinUrl: z.string().url(),
  availabilityStatus: z.string().min(2).max(150),
  resumeUrl: z.string().optional().nullable(),
  siteUrl: z.string().url(),
  seoTitle: z.string().min(5).max(120),
  seoDescription: z.string().min(20).max(300),
  socialImageUrl: z.string().optional().nullable(),
  footerText: z.string().min(2).max(200),
});
