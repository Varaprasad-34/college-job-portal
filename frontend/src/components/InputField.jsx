import React from 'react';

const InputField = React.forwardRef(({ label, error, ...rest }, ref) => (
  <div>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    <input
      ref={ref}
      {...rest}
      className="input"
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
));

export default InputField;
