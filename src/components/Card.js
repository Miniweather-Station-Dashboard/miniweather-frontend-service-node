
const Card = ({ title, icon, children }) => (
  <div className="bg-white rounded-lg shadow-md p-4">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      {icon}
    </div>
    {children}
  </div>
);

export default Card;