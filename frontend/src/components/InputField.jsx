import React from 'react';

const InputField = React.forwardRef(({ label, error, ...rest }, ref) => (
  <div className="mb-4">
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    <input
      ref={ref}
      {...rest}
      className="w-full px-4 py-2 border rounded-md shadow-sm text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm"
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
));

export default InputField;
