"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useTabs } from "@/context/TabContext";

type AddProductClientProps = {
  onClose?: () => void;
  onProductAdded?: () => void;
};

type CatalogResponse = {
  categories?: string[];
};

export default function AddProductClient({
  onClose,
  onProductAdded,
}: AddProductClientProps) {
  const { setActiveTab } = useTabs();

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const [brandName, setBrandName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [productColor, setProductColor] = useState("Black");

  const [warrantyPeriod, setWarrantyPeriod] = useState("1");
  const [warrantyUnit, setWarrantyUnit] = useState("Years");

  const [productImage, setProductImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState("");

  const [catalogCategories, setCatalogCategories] =
    useState<string[]>([]);

  const [isBrandModalOpen, setIsBrandModalOpen] =
    useState(false);

  const [isCategoryModalOpen, setIsCategoryModalOpen] =
    useState(false);

  const [newBrand, setNewBrand] = useState({
    name: "",
    website: "",
    description: "",
  });

  const [newCategory, setNewCategory] = useState({
    name: "",
    parentCategory: "",
    description: "",
  });

  // Stop Lenis while this form is open
  useEffect(() => {
    const lenis = window.__techBasketLenis;

    if (lenis) {
      lenis.stop();
    }

    return () => {
      if (lenis) {
        lenis.start();
      }
    };
  }, []);

  // Load catalog categories
  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const response = await fetch("/api/catalog");

        if (!response.ok) {
          return;
        }

        const data =
          (await response.json()) as CatalogResponse;

        setCatalogCategories(data.categories ?? []);
      } catch {
        setCatalogCategories([]);
      }
    };

    loadCatalog();
  }, []);

  // Close form
  const closeForm = () => {
    if (onClose) {
      onClose();
      return;
    }

    setActiveTab("/admin/products");
  };

  // Save brand
  const saveBrand = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedName = newBrand.name.trim();

    if (!trimmedName) {
      toast.error("Brand name is required.");
      return;
    }

    try {
      const response = await fetch("/api/catalog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "brand",
          name: trimmedName,
          website: newBrand.website.trim(),
          description: newBrand.description.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({}));

        throw new Error(
          errorData?.error ||
            "Could not save brand to the database."
        );
      }

      setBrandName(trimmedName);
      setIsBrandModalOpen(false);

      setNewBrand({
        name: "",
        website: "",
        description: "",
      });

      toast.success("Brand created successfully.");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Could not save brand.";

      setMessage(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Save category
  const saveCategory = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedName = newCategory.name.trim();

    if (!trimmedName) {
      toast.error("Category name is required.");
      return;
    }

    try {
      const response = await fetch("/api/catalog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "category",
          name: trimmedName,
          parentCategory:
            newCategory.parentCategory.trim(),
          description: newCategory.description.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({}));

        throw new Error(
          errorData?.error ||
            "Could not save category to the database."
        );
      }

      setCategoryName(trimmedName);

      setCatalogCategories((current) =>
        current.includes(trimmedName)
          ? current
          : [...current, trimmedName].sort((a, b) =>
              a.localeCompare(b)
            )
      );

      setIsCategoryModalOpen(false);

      setNewCategory({
        name: "",
        parentCategory: "",
        description: "",
      });

      toast.success("Category created successfully.");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Could not save category.";

      setMessage(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Upload image + create product
  async function submit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const form = event.currentTarget;

    /*
     * Product image is mandatory.
     */
    if (!productImage) {
      setMessage("Product image is required.");
      toast.error("Please select a product image.");
      return;
    }

    /*
     * Validate image type.
     */
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(productImage.type)) {
      setMessage(
        "Only PNG, JPG, WEBP or GIF images are allowed."
      );

      toast.error(
        "Only PNG, JPG, WEBP or GIF images are allowed."
      );

      return;
    }

    /*
     * Validate image size.
     * Maximum: 8 MB
     */
    const maxSize = 8 * 1024 * 1024;

    if (productImage.size > maxSize) {
      setMessage("Image size must be less than 8 MB.");
      toast.error("Image size must be less than 8 MB.");
      return;
    }

    setSaving(true);
    setMessage("");

    const formData = new FormData(form);

    try {
      /*
       * STEP 1: Upload image to ImgBB
       */
      const imageData = new FormData();

      imageData.append("image", productImage);

      const uploadResponse = await fetch(
        "/api/image-upload",
        {
          method: "POST",
          body: imageData,
        }
      );

      const uploadResult = await uploadResponse
        .json()
        .catch(() => ({}));

      if (
        !uploadResponse.ok ||
        !uploadResult?.url
      ) {
        throw new Error(
          uploadResult?.error ||
            "Could not upload product image."
        );
      }

      /*
       * ImgBB image URL
       */
      const image = uploadResult.url;

      /*
       * STEP 2: Create product
       */
      const payload = {
        title: String(
          formData.get("title") || ""
        ).trim(),

        sku: String(
          formData.get("sku") || ""
        ).trim(),

        brand: String(
          formData.get("brand") || ""
        ).trim(),

        category: String(
          formData.get("category") || ""
        ).trim(),

        description: String(
          formData.get("description") || ""
        ).trim(),

        color: String(
          formData.get("color") ||
            productColor ||
            ""
        ).trim(),

        warrantyPeriod: Number(
          formData.get("warrantyPeriod") ||
            warrantyPeriod ||
            0
        ),

        warrantyUnit: String(
          formData.get("warrantyUnit") ||
            warrantyUnit ||
            "Years"
        ).trim(),

        /*
         * ImgBB URL
         */
        image,

        status: "active",
      };

      /*
       * STEP 3: Send product to backend
       */
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const errorData = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          errorData?.error ||
            "Could not save product."
        );
      }

      /*
       * SUCCESS
       */

      setMessage(
        "Product added successfully to the database."
      );

      toast.success(
        "Product added successfully!"
      );

      onProductAdded?.();

      /*
       * Reset form
       */
      form.reset();

      setBrandName("");
      setCategoryName("");
      setProductColor("Black");
      setWarrantyPeriod("1");
      setWarrantyUnit("Years");

      setProductImage(null);
      setImagePreview("");

      /*
       * Close form
       */
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 500);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Could not save product.";

      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  }

  /*
   * Product image selection
   */
  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0] || null;

    /*
     * No file
     */
    if (!file) {
      setProductImage(null);
      setImagePreview("");
      return;
    }

    /*
     * Validate file type immediately
     */
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Only PNG, JPG, WEBP or GIF images are allowed."
      );

      event.target.value = "";
      setProductImage(null);
      setImagePreview("");

      return;
    }

    /*
     * Validate file size immediately
     */
    const maxSize = 8 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error(
        "Image size must be less than 8 MB."
      );

      event.target.value = "";
      setProductImage(null);
      setImagePreview("");

      return;
    }

    setProductImage(file);

    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  return (
    <>
      <section
        className="max-h-[90vh] overflow-y-auto overscroll-contain bg-[#f8fafc] px-5 py-7 text-[#172235] sm:px-8 lg:px-12"
        style={{
          overscrollBehavior: "contain",
        }}
      >
        <div className="mx-auto w-full max-w-375">
          {/* Header */}
          <div className="mb-8 border-b border-[#e1e6ee] pb-5">
            <h1 className="text-[30px] font-bold tracking-tight text-[#111827]">
              Add Product
            </h1>

            <p className="mt-1 text-[13px] text-[#536174]">
              Create a new product in the TechBasket
              product catalog.
            </p>
          </div>

          {/* Product Form */}
          <form
            onSubmit={submit}
            autoComplete="off"
            className="grid grid-cols-1 gap-5 lg:grid-cols-2"
          >
            {/* Product Title */}
            <label className="rounded-lg border border-[#d6dce6] bg-white p-5 text-[11px] font-medium lg:col-span-2">
              Product title

              <input
                name="title"
                autoComplete="off"
                required
                className="mt-2 h-11 w-full rounded-md border border-[#d6dce6] px-3 text-[13px]"
                placeholder="e.g. Logitech B175 Mouse"
              />
            </label>

            {/* Product Image */}
            <label className="rounded-lg border border-[#d6dce6] bg-white p-5 text-[11px] font-medium lg:col-span-2">
              <div className="flex items-center gap-2">
                <span>Product image</span>

                <span className="text-red-500">
                  *
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-4">
                {imagePreview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="h-20 w-20 rounded-lg border border-[#d6dce6] object-cover"
                    />
                  </>
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                    No image
                  </div>
                )}

                <input
                  name="image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  required
                  onChange={handleImageChange}
                  className="block w-full max-w-md text-xs text-[#536174] file:mr-3 file:rounded-md file:border-0 file:bg-[#e7ecff] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#2949a8]"
                />
              </div>

              <p className="mt-2 text-[11px] font-normal text-slate-400">
                PNG, JPG, WEBP or GIF up to 8 MB.
              </p>

              <p className="mt-1 text-[11px] font-normal text-red-500">
                Product image is required.
              </p>
            </label>

            {/* SKU */}
            <label className="rounded-lg border border-[#d6dce6] bg-white p-5 text-[11px] font-medium">
              SKU

              <input
                name="sku"
                required
                className="mt-2 h-11 w-full rounded-md border border-[#d6dce6] px-3 text-[13px]"
                placeholder="LOG-B175-WH"
              />
            </label>

            {/* Brand */}
            <div className="rounded-lg border border-[#d6dce6] bg-white p-5 text-[11px] font-medium">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span>Brand</span>

                <button
                  type="button"
                  onClick={() =>
                    setIsBrandModalOpen(true)
                  }
                  className="rounded-md border border-[#d6dce6] px-2 py-1 text-[10px] font-semibold text-[#2949a8]"
                >
                  + New Brand
                </button>
              </div>

              <input
                name="brand"
                value={brandName}
                onChange={(event) =>
                  setBrandName(
                    event.target.value
                  )
                }
                required
                className="h-11 w-full rounded-md border border-[#d6dce6] px-3 text-[13px]"
              />
            </div>

            {/* Category */}
            <div className="rounded-lg border border-[#d6dce6] bg-white p-5 text-[11px] font-medium">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span>Category</span>

                <button
                  type="button"
                  onClick={() =>
                    setIsCategoryModalOpen(true)
                  }
                  className="rounded-md border border-[#d6dce6] px-2 py-1 text-[10px] font-semibold text-[#2949a8]"
                >
                  + New Category
                </button>
              </div>

              <input
                name="category"
                value={categoryName}
                onChange={(event) =>
                  setCategoryName(
                    event.target.value
                  )
                }
                required
                className="h-11 w-full rounded-md border border-[#d6dce6] px-3 text-[13px]"
              />
            </div>

            {/* Color */}
            <label className="rounded-lg border border-[#d6dce6] bg-white p-5 text-[11px] font-medium">
              Color

              <input
                name="color"
                value={productColor}
                onChange={(event) =>
                  setProductColor(
                    event.target.value
                  )
                }
                className="mt-2 h-11 w-full rounded-md border border-[#d6dce6] px-3 text-[13px]"
                placeholder="Black"
              />
            </label>

            {/* Warranty */}
            <div className="rounded-lg border border-[#d6dce6] bg-white p-5 text-[11px] font-medium">
              <div className="mb-2 flex items-center gap-2">
                <span>Warranty</span>
              </div>

              <div className="flex gap-2">
                <input
                  name="warrantyPeriod"
                  type="number"
                  min="0"
                  value={warrantyPeriod}
                  onChange={(event) =>
                    setWarrantyPeriod(
                      event.target.value
                    )
                  }
                  className="h-11 w-24 rounded-md border border-[#d6dce6] px-3 text-[13px]"
                />

                <select
                  name="warrantyUnit"
                  value={warrantyUnit}
                  onChange={(event) =>
                    setWarrantyUnit(
                      event.target.value
                    )
                  }
                  className="h-11 flex-1 rounded-md border border-[#d6dce6] px-3 text-[13px]"
                >
                  <option value="Years">
                    Years
                  </option>

                  <option value="Months">
                    Months
                  </option>

                  <option value="Days">
                    Days
                  </option>
                </select>
              </div>
            </div>

            {/* Description */}
            <label className="rounded-lg border border-[#d6dce6] bg-white p-5 text-[11px] font-medium lg:col-span-2">
              Description

              <textarea
                name="description"
                className="mt-2 h-28 w-full rounded-md border border-[#d6dce6] p-3 text-[13px]"
                placeholder="Brief description about the product..."
              />
            </label>

            {/* Buttons */}
            <div className="flex flex-wrap justify-end gap-3 border-t border-[#dfe4ec] pt-6 lg:col-span-2">
              <button
                type="button"
                onClick={closeForm}
                className="h-10 px-4 text-[12px] text-[#536174]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="h-10 rounded-md bg-[#2949a8] px-5 text-[12px] font-semibold text-white disabled:opacity-60"
              >
                {saving
                  ? "Uploading & Saving..."
                  : "Create Product"}
              </button>
            </div>
          </form>

          {/* Message */}
          {message && (
            <p
              role="status"
              className="mt-4 text-[13px] text-[#2949a8]"
            >
              {message}
            </p>
          )}
        </div>
      </section>

      {/* ========================================
          CATEGORY MODAL
      ======================================== */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-140 rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-5">
              <h2 className="text-[17px] font-semibold text-[#111827]">
                Add New Category
              </h2>

              <button
                type="button"
                onClick={() =>
                  setIsCategoryModalOpen(false)
                }
                aria-label="Close category modal"
                className="text-[30px] leading-none text-[#6b7280]"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={saveCategory}
              className="space-y-5 p-6"
            >
              <p className="text-[13px] text-[#536174]">
                Define a new product category for
                catalog organization.
              </p>

              {/* Category Name */}
              <div>
                <label className="mb-2 block text-[13px] font-medium text-[#111827]">
                  Category Name{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  value={newCategory.name}
                  onChange={(event) =>
                    setNewCategory(
                      (current) => ({
                        ...current,
                        name: event.target.value,
                      })
                    )
                  }
                  required
                  className="h-11 w-full rounded-md border border-[#d6dce6] bg-white px-3 text-[13px] text-[#111827] outline-none placeholder:text-[#8b95a7]"
                  placeholder="e.g., Wireless Mouse"
                />
              </div>

              {/* Parent Category */}
              <div>
                <label className="mb-2 block text-[13px] font-medium text-[#111827]">
                  Parent Category
                </label>

                <select
                  value={
                    newCategory.parentCategory
                  }
                  onChange={(event) =>
                    setNewCategory(
                      (current) => ({
                        ...current,
                        parentCategory:
                          event.target.value,
                      })
                    )
                  }
                  className="h-11 w-full rounded-md border border-[#d6dce6] bg-white px-3 text-[13px] text-[#111827] outline-none"
                >
                  <option value="">
                    None (Top Level)
                  </option>

                  {catalogCategories
                    .filter(
                      (category) =>
                        category !==
                        newCategory.name.trim()
                    )
                    .map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-[13px] font-medium text-[#111827]">
                  Description{" "}
                  <span className="text-[#536174]">
                    (Optional)
                  </span>
                </label>

                <textarea
                  value={
                    newCategory.description
                  }
                  onChange={(event) =>
                    setNewCategory(
                      (current) => ({
                        ...current,
                        description:
                          event.target.value,
                      })
                    )
                  }
                  className="h-28 w-full rounded-md border border-[#d6dce6] bg-white p-3 text-[13px] text-[#111827] outline-none placeholder:text-[#8b95a7]"
                  placeholder="Briefly describe the category..."
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setIsCategoryModalOpen(false)
                  }
                  className="h-10 rounded-md border border-[#d6dce6] bg-white px-4 text-[12px] font-medium text-[#374151]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="h-10 rounded-md bg-[#2949a8] px-5 text-[12px] font-semibold text-white shadow-sm"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================
          BRAND MODAL
      ======================================== */}
      {isBrandModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-140 rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-5">
              <h2 className="text-[17px] font-semibold text-[#111827]">
                Add New Brand
              </h2>

              <button
                type="button"
                onClick={() =>
                  setIsBrandModalOpen(false)
                }
                aria-label="Close brand modal"
                className="text-[30px] leading-none text-[#6b7280]"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={saveBrand}
              className="space-y-5 p-6"
            >
              <p className="text-[13px] text-[#536174]">
                Create a new brand entry in the
                master catalog.
              </p>

              {/* Brand Name */}
              <div>
                <label className="mb-2 block text-[13px] font-medium text-[#111827]">
                  Brand Name{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  value={newBrand.name}
                  onChange={(event) =>
                    setNewBrand(
                      (current) => ({
                        ...current,
                        name: event.target.value,
                      })
                    )
                  }
                  required
                  className="h-11 w-full rounded-md border border-[#d6dce6] bg-white px-3 text-[13px] text-[#111827] outline-none placeholder:text-[#8b95a7]"
                  placeholder="e.g., Logitech"
                />
              </div>

              {/* Brand Website */}
              <div>
                <label className="mb-2 block text-[13px] font-medium text-[#111827]">
                  Brand Website{" "}
                  <span className="text-[#536174]">
                    (Optional)
                  </span>
                </label>

                <input
                  type="url"
                  value={newBrand.website}
                  onChange={(event) =>
                    setNewBrand(
                      (current) => ({
                        ...current,
                        website:
                          event.target.value,
                      })
                    )
                  }
                  className="h-11 w-full rounded-md border border-[#d6dce6] bg-white px-3 text-[13px] text-[#111827] outline-none placeholder:text-[#8b95a7]"
                  placeholder="https://www.example.com"
                />
              </div>

              {/* Brand Description */}
              <div>
                <label className="mb-2 block text-[13px] font-medium text-[#111827]">
                  Description{" "}
                  <span className="text-[#536174]">
                    (Optional)
                  </span>
                </label>

                <textarea
                  value={
                    newBrand.description
                  }
                  onChange={(event) =>
                    setNewBrand(
                      (current) => ({
                        ...current,
                        description:
                          event.target.value,
                      })
                    )
                  }
                  className="h-28 w-full rounded-md border border-[#d6dce6] bg-white p-3 text-[13px] text-[#111827] outline-none placeholder:text-[#8b95a7]"
                  placeholder="Brief details about the brand..."
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setIsBrandModalOpen(false)
                  }
                  className="h-10 rounded-md border border-[#d6dce6] bg-white px-4 text-[12px] font-medium text-[#374151]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="h-10 rounded-md bg-[#2949a8] px-5 text-[12px] font-semibold text-white shadow-sm"
                >
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}