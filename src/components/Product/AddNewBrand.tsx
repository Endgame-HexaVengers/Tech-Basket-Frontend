type AddNewBrandProps = {
  brands: string[];
};

export default function AddNewBrand({ brands }: AddNewBrandProps) {
  return (
    <div>
      <label htmlFor="brand-name">Brand name</label>
      <input id="brand-name" name="brand" required />
      <small>{brands.length} brands currently available</small>
    </div>
  );
}
