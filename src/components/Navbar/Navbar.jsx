import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";

import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const PLACEHOLDER_IMAGE = "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function MyNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const LoggedMenuItems = ["Home", "Log Out"];
  const unLoggedMenuItems = ["Log In", "Register"];

  const navigate = useNavigate();
  const { userLogin, setuserLogin, userData } = useContext(AuthContext);

  function logOut() {
    localStorage.removeItem("userToken");
    setuserLogin(null);
    navigate("/login");
  }
  

  return (
    <Navbar className="border-b border-white/10 bg-slate-950/95 text-white shadow-lg backdrop-blur-md">
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden text-white"
      />

      <NavbarBrand>
        <div className="text-sky-400">
          <AcmeLogo />
        </div>

        <p className="ml-2 text-xl font-extrabold tracking-[0.18em] text-inherit">
          <Link
            to="/"
            className="transition duration-200 hover:text-slate-300"
          >
            ECHO
          </Link>
        </p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-7" justify="center">
        {userLogin !== null && (
          <NavbarItem>
            <Link
              className="font-semibold text-slate-100 transition duration-200 hover:text-sky-300"
              to="/"
            >
              Home
            </Link>
          </NavbarItem>
        )}

        {userLogin === null && (
          <>
            <NavbarItem>
              <Link
                className="font-semibold text-slate-100 transition duration-200 hover:text-sky-300"
                to="/login"
              >
                Login
              </Link>
            </NavbarItem>

            <NavbarItem>
              <Link
                className="font-semibold text-slate-100 transition duration-200 hover:text-sky-300"
                to="/register"
              >
                Register
              </Link>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform duration-200 hover:scale-105"
              color="primary"
              name={userData?.name || "User"}
              size="sm"
              src={userData?.photo || PLACEHOLDER_IMAGE}
            />
          </DropdownTrigger>

          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="settings">
              <Link className="block" to="/profile">
                Profile
              </Link>
            </DropdownItem>

            <DropdownItem
              key="logout"
              color="danger"
              onClick={() => logOut()}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      <NavbarMenu className="bg-slate-950 text-white">
        {userLogin
          ? LoggedMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  onClick={item === "Log Out" && function () { logOut(); }}
                  className="block w-full rounded-xl px-3 py-2 font-medium transition duration-200 hover:bg-slate-900 hover:text-sky-300"
                  to={`/${item === "Log Out" ? "login" : item}`}
                >
                  {item}
                </Link>
              </NavbarMenuItem>
            ))
          : unLoggedMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  className="block w-full rounded-xl px-3 py-2 font-medium transition duration-200 hover:bg-slate-900 hover:text-sky-300"
                  to={`/${item}`}
                >
                  {item}
                </Link>
              </NavbarMenuItem>
            ))}
      </NavbarMenu>
    </Navbar>
  );
}