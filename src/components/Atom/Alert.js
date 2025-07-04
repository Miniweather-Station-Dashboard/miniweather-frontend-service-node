const Alert = ({ title, children, type = 'general', lastUpdated }) => {
  const colorClasses = {
    weather: "bg-blue-100 border-blue-500 text-blue-700",
    earthquake: "bg-red-100 border-red-500 text-red-700",
    flood: "bg-indigo-100 border-indigo-500 text-indigo-700",
    volcano: "bg-orange-100 border-orange-500 text-orange-700",
    general: "bg-yellow-100 border-yellow-500 text-yellow-700",
  };

  const classesToApply = colorClasses[type] || colorClasses.general;

  return (
    <div
      className={`border-l-4 p-4 rounded-md ${classesToApply}`}
      role="alert"
    >
      <p className="font-bold">{title}</p>
      <p>{children}</p>
      {lastUpdated && (
        <p className="mt-2 text-sm italic opacity-70">
          Diperbarui terakhir: {new Date(lastUpdated).toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default Alert;
