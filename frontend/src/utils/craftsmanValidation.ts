import { z } from "zod";

export const craftsmanRegistrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  business_name: z.string().optional(),
  business_reg_number: z.string().optional(),
  phone_number: z.string().optional(),
  experience_level: z.string().optional(),
  pricing_info: z.string().optional(),
  profile_photo_url: z.string().optional(),
  services: z.array(z.string()).optional(),
  service_areas: z.array(z.string()).optional(),
});

export type CraftsmanRegistrationData = z.infer<
  typeof craftsmanRegistrationSchema
>;
