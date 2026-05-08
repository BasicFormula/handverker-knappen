import { z } from "zod";

export const serviceRequestSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().regex(/^(?:\+47)?[1-9]\d{7}$/, { message: "Please enter a valid Norwegian phone number." }),
  serviceType: z.string({ required_error: "Please select a service type." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  location: z.string().min(3, { message: "Please enter a valid location." }),
  urgency: z.string({ required_error: "Please select an urgency level." }),
  contactMethod: z.string({ required_error: "Please select a contact method." }),
});

export type ServiceRequestData = z.infer<typeof serviceRequestSchema>;
