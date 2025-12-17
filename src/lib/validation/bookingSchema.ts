import z from "zod";

export const bookingSchema = z.object({
  serviceId: z
    .uuid("Must be a valid service ID format (UUID).")
    .nonempty({ message: "Service ID is required." }),
  startTime: z.iso
    .datetime("Start time must be a valid ISO 8601 date/time string.")
    .nonempty({ message: "Start Time is required." }),
  name: z
    .string()
    .nonempty({ message: "Name is required." })
    .min(2, "Name must be at least 2 characters long.")
    .max(100, "Name cannot exceed 100 characters."),
  email: z
    .email("Must be a valid email address.")
    .nonempty({ message: "Email is required." }),
  phoneNo: z.string().default(""),
  paymentProofUrl: z.url("Invalid image URL"), // New field
});

export type BookingInput = z.infer<typeof bookingSchema>;
