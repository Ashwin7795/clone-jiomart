import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "Smartphones",
    image: "/categories/smartphones.png",
    subcategory: "smartphones",
  },
  {
    name: "Laptops",
    image: "/categories/laptops.png",
    subcategory: "laptops",
  },
  {
    name: "Televisions",
    image: "/categories/tv.png",
    subcategory: "televisions",
  },
  {
    name: "Washing Machines",
    image: "/categories/washingmachine.png",
    subcategory: "washing-machines",
  },
  {
    name: "Air Conditioners",
    image: "/categories/ac.png",
    subcategory: "air-conditioners",
  },
];

function CategoryStrip({ title, categories }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl p-5 mb-8">
      <h2 className="text-xl font-bold mb-5">
  {title}
</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
        {categories.map((item) => (
          <div
            key={item.name}
            onClick={() =>
              navigate(`/?subcategory=${item.subcategory}`)
            }
            className="cursor-pointer text-center"
          >
            <img
              src={item.image}
              className="w-20 h-20 object-contain mx-auto"
              alt={item.name}
            />

            <p className="mt-2 text-sm font-medium">
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryStrip;