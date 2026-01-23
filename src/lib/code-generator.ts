import { db } from "@/lib/db";

/**
 * Generates the next code string based on the given prefix and model.
 * Assumes the code format is "{PREFIX}-{NUMBER}" (e.g., BRG-0001).
 *
 * @param prefix The prefix for the code (e.g., "BRG", "SUP", "KRY")
 * @param modelName The name of the Prisma model to query (e.g., "barang", "supplier", "karyawan")
 * @param codeField The name of the field storing the code (default: "kode", "nik" for karyawan)
 * @param digits The number of digits for the numeric part (default: 4)
 * @returns The generated code string
 */
export async function generateNextCode(
  prefix: string,
  modelName: "barang" | "supplier" | "karyawan",
  codeField: string = "kode",
  digits: number = 4,
): Promise<string> {
  // We can't use dynamic model access with full type safety easily in Prisma without 'any' or mapping
  // safe way: switch based on modelName

  let lastItem: any = null;

  // This relies on the convention that we can sort by createdAt or the code itself.
  // Sorting by the code field desc is usually safest if the format is consistent.
  // However, string sorting "BRG-10" comes before "BRG-2" if not careful, but "BRG-0002" beats "BRG-0001".

  // @ts-ignore - Dynamic access to db model
  const modelDelegate = db[modelName] as any;

  if (!modelDelegate) {
    throw new Error(`Model ${modelName} not found in db`);
  }

  // Find the last item ordered by the code field in descending order
  // We filter with 'startsWith' to ensure we only look at relevant codes (ignoring legacy weird formats if any)
  lastItem = await modelDelegate.findFirst({
    where: {
      [codeField]: {
        startsWith: prefix,
      },
    },
    orderBy: {
      [codeField]: "desc",
    },
  });

  if (!lastItem) {
    return `${prefix}-${"1".padStart(digits, "0")}`;
  }

  const lastCode = lastItem[codeField] as string;
  // Extract the numeric part. Assuming default format PREFIX-XXXX
  // If format is purely numbers (like NIK might be), we need to handle that.
  // But request implies "kode ... otomatis", and typically these have prefixes.

  // Split by last hyphen or just take regex match
  const match = lastCode.match(/(\d+)$/);

  if (match) {
    const lastNumber = parseInt(match[1], 10);
    const nextNumber = lastNumber + 1;
    return `${prefix}-${nextNumber.toString().padStart(digits, "0")}`;
  }

  // Fallback if regex fails
  return `${prefix}-${"1".padStart(digits, "0")}`;
}
