import SlideDown from "react-slidedown";

import "react-slidedown/lib/slidedown.css";
function Dropdown({ open, children }) {
  return (
    <SlideDown className={"my-dropdown-slidedown"}>
      {open ? children : null}
    </SlideDown>
  );
}

export default Dropdown;
