import { createContext, useContext } from "react";

const CategoryContext = createContext();

const CategoryProvider = ({ categories, children }) => {
  return (
    <CategoryContext.Provider value={categories}>
      {children}
    </CategoryContext.Provider>
  );
};

const useCategory = () => {
  return useContext(CategoryContext);
};

export { CategoryProvider, useCategory };
