// Shared toggle state for the mobile nav drawer.
// useState makes it globally useable
export const useMobileNav = () => {
  const open = useState("mobile-nav-open", () => false);
  return {
    open,
    toggle: () => (open.value = !open.value),
    close: () => (open.value = false),
  };
};
