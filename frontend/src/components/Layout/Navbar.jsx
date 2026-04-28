import React, { useState } from "react";
import { navItems } from "../../static/data";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";

const Navbar = () => {
const [active, setActive] = useState(null); // added

return (
<>
<div className={`${styles.normalFlex}`}>
{navItems &&
navItems.map((i, index) => (
<div className="flex" key={index}>
<Link
to={i.url}
onClick={() => setActive(index + 1)} // optional but needed for active state
className={`${
active === index + 1
? "text-[#17dd1f]"
: "text-[#fff]"
} font-[500] px-6 cursor-pointer`}
>
{i.name}
</Link>
</div>
))}
</div>
</>
  );
};

export default Navbar;