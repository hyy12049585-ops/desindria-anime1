/**
 * تبدیل اعداد فارسی (۰-۹) و عربی (٠-٩) به انگلیسی (0-9)
 */
export function toEnglishDigits(str: string): string {
  return str
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

export default toEnglishDigits;
