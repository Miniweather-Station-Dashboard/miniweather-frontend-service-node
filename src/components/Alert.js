const Alert = ({ title, children }) => (
  <div
    className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
    role="alert"
  >
    <p className="font-bold">{title}</p>
    <p>{children}</p>
  </div>
);

export default Alert;