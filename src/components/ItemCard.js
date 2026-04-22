const CategoryCard = ({ title, img }) => {
  return (
    <div className="category-card">
      <img src={img} alt={title} className="category-img" />
      <div className="category-overlay">
        <h3 className="category-title">{title}</h3>
      </div>
    </div>
  );
};
export default CategoryCard;
