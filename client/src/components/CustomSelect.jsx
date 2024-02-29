import React, { useState, useEffect, useRef } from "react";
import "../CustomSlect.css"; // Create a CSS file and import it here

const CustomSelect = ({ options, setValue, errors, clearErrors }) => {
  const [selectedOption, setSelectedOption] = useState({
    categoryName: "Category",
  });
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!selectRef.current.contains(e.target)) {
        closeAllSelect();
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleSelectClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    clearErrors("goalCategory");
    setValue("goalCategory", option?.categoryName || "Other");
    closeAllSelect();
  };

  const closeAllSelect = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={`custom-select ${isOpen ? "select-arrow-active" : ""}`}
      ref={selectRef}
    >
      <div
        className={`select-selected ${
          errors?.goalCategory ? "error-border-profile" : ""
        }`}
        onClick={handleSelectClick}
      >
        {selectedOption?.categoryName}
      </div>

      <div className={`select-items ${isOpen ? "" : "select-hide"}`}>
        {options.map((option) => (
          <div
            key={option._id}
            className={`select-item ${
              selectedOption?.categoryName === option?.categoryName
                ? "same-as-selected"
                : ""
            }`}
            onClick={() => handleOptionClick(option)}
          >
            {option?.categoryName}
          </div>
        ))}
      </div>
      <p className="profile-error-message">{errors?.goalCategory?.message}</p>
    </div>
  );
};

export default CustomSelect;
