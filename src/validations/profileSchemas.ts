// src/validations/profileSchemas.ts
import { z } from "zod";

// اسکیمای تغییر رمز عبور
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "رمز عبور فعلی الزامی است"),
    newPassword: z
      .string()
      .min(8, "رمز عبور جدید باید حداقل ۸ کاراکتر باشد")
      .regex(/[A-Z]/, "باید حداقل یک حرف بزرگ داشته باشد")
      .regex(/[a-z]/, "باید حداقل یک حرف کوچک داشته باشد")
      .regex(/[0-9]/, "باید حداقل یک عدد داشته باشد")
      .regex(/[^A-Za-z0-9]/, "باید حداقل یک کاراکتر خاص داشته باشد"),
    confirmPassword: z
      .string()
      .min(1, "تأیید رمز عبور الزامی است"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "رمز عبور جدید و تأیید آن یکسان نیستند",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "رمز عبور جدید نباید با رمز فعلی یکسان باشد",
    path: ["newPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// اسکیمای ویرایش پروفایل
export const editProfileSchema = z.object({
  displayName: z
    .string()
    .min(2, "نام نمایشی باید حداقل ۲ کاراکتر باشد")
    .max(30, "نام نمایشی حداکثر ۳۰ کاراکتر"),
  username: z
    .string()
    .min(3, "نام کاربری باید حداقل ۳ کاراکتر باشد")
    .max(20, "نام کاربری حداکثر ۲۰ کاراکتر")
    .regex(/^[a-zA-Z0-9_]+$/, "فقط حروف انگلیسی، اعداد و _ مجاز است"),
  email: z
    .string()
    .email("ایمیل نامعتبر است"),
  bio: z
    .string()
    .max(200, "بیوگرافی حداکثر ۲۰۰ کاراکتر")
    .optional()
    .or(z.literal("")),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;

// اسکیمای تنظیمات 2FA
export const twoFactorSchema = z.object({
  code: z
    .string()
    .length(6, "کد تأیید باید ۶ رقم باشد")
    .regex(/^\d+$/, "کد تأیید فقط شامل اعداد است"),
});

export type TwoFactorFormData = z.infer<typeof twoFactorSchema>;

// اسکیمای حذف حساب
export const deleteAccountSchema = z.object({
  confirmation: z
    .string()
    .refine((val) => val === "DELETE", {
      message: 'برای حذف حساب، عبارت "DELETE" را وارد کنید',
    }),
  password: z
    .string()
    .min(1, "رمز عبور الزامی است"),
  reason: z
    .string()
    .optional(),
});

export type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;
