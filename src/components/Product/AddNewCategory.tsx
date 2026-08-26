type AddNewCategoryProps = {
  categories: string[];
};

export default function AddNewCategory({ categories }: AddNewCategoryProps) {
  return (
    <div>
      <label htmlFor="category-name">Category name</label>
      <input id="category-name" name="category" required />
      <small>{categories.length} categories currently available</small>
    </div>
  );
}
