export type ProductInput = {
  title?: string;
  sku?: string;
  brand?: string;
  category?: string;
  color?: string;
  warrantyPeriod?: number;
  warrantyUnit?: string;
  description?: string;
  status?: "active" | "inactive" | "ACTIVE" | "INACTIVE" | string;
};

export function buildProductDocument(input: ProductInput) {
  const title = input.title?.trim() || "";
  const sku = input.sku?.trim().toUpperCase() || "";
  const brand = input.brand?.trim() || "";
  const category = input.category?.trim() || "";
  const description = input.description?.trim() || "";
  const warrantyUnit = input.warrantyUnit?.trim() || "Years";
  const status = String(input.status || "active").toUpperCase() === "INACTIVE"
    ? "INACTIVE"
    : "ACTIVE";

  const formattedBrandId = brand.toUpperCase().startsWith("BRAND_")
    ? brand.toUpperCase()
    : `BRAND_${brand.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`;

  const formattedCategoryId = category.toUpperCase().startsWith("CAT_")
    ? category.toUpperCase()
    : `CAT_${category.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`;

  const nowIso = new Date().toISOString();

  return {
    productTitle: title,
    title,
    sku,
    brand,
    brandId: formattedBrandId,
    category,
    categoryId: formattedCategoryId,
    color: input.color?.trim() || "",
    warrantyPeriod: Number(input.warrantyPeriod) || 0,
    warrantyUnit,
    description,
    status,
    approvalStatus: "PENDING",
    createdBy: "USER-001",
    approvedBy: null,
    approvedAt: null,
    rejectionReason: null,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}
