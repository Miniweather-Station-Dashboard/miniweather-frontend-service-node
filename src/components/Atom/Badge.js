const Badge = ({ children, variant = "default" }) => (
  <span
    className={`px-2 py-1 text-xs font-semibold rounded-full ${
      variant === "default"
        ? "bg-blue-500 text-white"
        : "bg-white text-blue-500 border border-blue-500"
    }`}
  >
    {children}
  </span>
);

export default Badge;
