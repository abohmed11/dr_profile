import { pgTable, text, integer, boolean, jsonb } from 'drizzle-orm/pg-core';

export const doctors = pgTable('doctors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  nameEn: text('name_en').notNull(),
  specialty: text('specialty').notNull(),
  jobTitle: text('job_title'),
  email: text('email'),
  phone: text('phone'),
  whatsapp: text('whatsapp'),
  avatar: text('avatar'),
  bio: text('bio'),
  experience: integer('experience').default(0),
  branches: jsonb('branches'),
  services: jsonb('services'),
  workingHours: jsonb('working_hours'),
  gallery: jsonb('gallery'),
  videos: jsonb('videos'),
  reviews: jsonb('reviews'),
  socials: jsonb('socials'),
  secretaries: jsonb('secretaries'),
  isActiveSubscription: boolean('is_active_subscription').default(true),
  registeredAt: text('registered_at'),
  approvalStatus: text('approval_status').default('approved'),
  subscriptionType: text('subscription_type').default('6months'),
});

export const appointments = pgTable('appointments', {
  id: text('id').primaryKey(),
  doctorId: text('doctor_id').notNull(),
  patientName: text('patient_name').notNull(),
  patientPhone: text('patient_phone').notNull(),
  whatsappNumber: text('whatsapp_number'),
  date: text('date').notNull(),
  time: text('time').notNull(),
  branchId: text('branch_id'),
  status: text('status').default('pending'),
  notes: text('notes'),
  createdAt: text('created_at'),
});

export const landingConfig = pgTable('landing_config', {
  id: text('id').primaryKey(),
  hero: jsonb('hero'),
  features: jsonb('features'),
  pricing: jsonb('pricing'),
  faq: jsonb('faq'),
  contact: jsonb('contact'),
  seo: jsonb('seo'),
});

export const banners = pgTable('banners', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  color: text('color'),
  isActive: boolean('is_active').default(true),
  priority: integer('priority').default(1),
});

export const specialties = pgTable('specialties', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  count: integer('count').default(0),
});
