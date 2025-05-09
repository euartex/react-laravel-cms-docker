import { useEffect } from "react";

export default submit => {
  const handleKeyPress = ({ target, key }) => {
    if (target?.tagName === "SELECT") return;
    if (key === "Enter") submit();
  };

  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [submit]);
};
