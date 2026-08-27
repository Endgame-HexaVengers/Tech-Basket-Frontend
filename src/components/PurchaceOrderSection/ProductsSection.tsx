

import { useState } from 'react';
import {
  TbSearch,
  TbPlus,
  TbTrash,
  TbBox,
} from 'react-icons/tb';
import { CgSpinner } from 'react-icons/cg';
import toast from 'react-hot-toast';

import {
  Product,
  PurchaseItem,
  DUMMY_PRODUCTS,
} from '@/types/purchase';
import { Button } from '@heroui/react';

interface Props {
  items: PurchaseItem[];
  setItems: React.Dispatch<React.SetStateAction<PurchaseItem[]>>;
}

export default function ProductsSection({
  items,
  setItems,
}: Props) {
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const [price, setPrice] = useState<number | ''>('');

  const [quantity, setQuantity] = useState<number | ''>('');

  const [showDropdown, setShowDropdown] = useState(false);

  const [isAdding, setIsAdding] = useState(false);

  // Filter products
  const filteredProducts = DUMMY_PRODUCTS.filter((product) =>
    product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Select product
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setSearchTerm(product.title);
    setPrice(product.defaultPrice);
    setShowDropdown(false);
  };

  // Add product
  const handleAddProduct = () => {
    // Validation
    if (!selectedProduct) {
      toast.error('Please select a product.');
      return;
    }

    if (price === '' || Number(price) <= 0) {
      toast.error('Please enter a valid purchase price.');
      return;
    }

    if (quantity === '' || Number(quantity) <= 0) {
      toast.error('Please enter a valid quantity.');
      return;
    }

    setIsAdding(true);

    setTimeout(() => {
      const newItem: PurchaseItem = {
        id: Date.now().toString(),
        productId: selectedProduct.id,
        title: selectedProduct.title,
        price: Number(price),
        quantity: Number(quantity),
        total: Number(price) * Number(quantity),
      };

      setItems((prev) => [...prev, newItem]);

      // Clear form
      setSelectedProduct(null);
      setSearchTerm('');
      setPrice('');
      setQuantity('');

      setIsAdding(false);

      // ONLY ONE success toast
      toast.success('Product added successfully!');
    }, 500);
  };

  // Remove product
  const handleRemove = (id: string) => {
    setItems((prev) =>
      prev.filter((item) => item.id !== id)
    );

    toast.success('Product removed successfully!');
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 mb-6">

      <h2 className="text-lg font-bold text-slate-800 mb-4">
        Products Information
      </h2>

      {/* Product Form */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

          {/* Product Search */}
          <div className="relative">

            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Product Title{' '}
              <span className="text-red-500">*</span>
            </label>

            <div className="relative flex items-center">

              <TbSearch className="absolute left-3 text-slate-400 text-lg" />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);

                  if (
                    selectedProduct &&
                    e.target.value !== selectedProduct.title
                  ) {
                    setSelectedProduct(null);
                  }
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search product..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            {/* Dropdown */}
            {showDropdown &&
              searchTerm &&
              filteredProducts.length > 0 && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">

                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() =>
                        handleSelectProduct(product)
                      }
                      className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 transition border-b border-slate-50 last:border-none"
                    >
                      <TbBox className="text-slate-400" />

                      {product.title}
                    </div>
                  ))}

                </div>
              )}

          </div>

          {/* Price */}
          <div>

            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Purchase Price / Piece (৳){' '}
              <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              min="0"
              value={price}
              onChange={(e) =>
                setPrice(
                  e.target.value === ''
                    ? ''
                    : Number(e.target.value)
                )
              }
              placeholder="0.00"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />

          </div>

          {/* Quantity */}
          <div>

            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Total Quantity{' '}
              <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  e.target.value === ''
                    ? ''
                    : Number(e.target.value)
                )
              }
              placeholder="0"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />

          </div>

        </div>

        {/* Add Product Button */}
        <div className="flex justify-end">

          <Button
            type="button"
            onClick={handleAddProduct}
            isDisabled={isAdding}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-200
             hover:bg-slate-300 text-slate-700 font-semibold text-sm rounded cursor-pointer  transition disabled:opacity-50"
          >

            {isAdding ? (
              <CgSpinner className="animate-spin text-lg" />
            ) : (
              <TbPlus className="text-lg" />
            )}

            Add Product

          </Button>

        </div>

      </div>

      {/* Product List */}
      <div className="overflow-x-auto">

        <table className="w-full text-left text-sm text-slate-600">

          <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-y border-slate-200">

            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Product Title</th>
              <th className="py-3 px-4 text-center">
                Quantity
              </th>
              <th className="py-3 px-4 text-right">
                Unit Price
              </th>
              <th className="py-3 px-4 text-right">
                Total
              </th>
              <th className="py-3 px-4 text-center">
                Action
              </th>
            </tr>

          </thead>

          <tbody className="divide-y divide-slate-100">

            {items.length === 0 ? (
              <tr>

                <td
                  colSpan={6}
                  className="text-center py-6 text-slate-400">
                  No products added yet.
                </td>

              </tr>
            ) : (
              items.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/50 transition"
                >

                  <td className="py-3 px-4 font-medium">
                    {index + 1}
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {item.title}
                  </td>

                  <td className="py-3 px-4 text-center">
                    {item.quantity}
                  </td>

                  <td className="py-3 px-4 text-right">
                    ৳ {item.price.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 text-right font-semibold text-slate-800">
                    ৳ {item.total.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 text-center">

                    <Button
                      type="button"
                      onClick={() =>
                        handleRemove(item.id)
                      }
                      className="text-red-500 hover:text-red-700  border px-3 bg-white rounded-full transition"
                    >
                      <TbTrash className="text-2xl" />
                    </Button>

                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}