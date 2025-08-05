import React from 'react';

const SelectField = React.forwardRef(({ label, error, children, ...rest }, ref) => (
  <div>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    <select
      ref={ref}
      {...rest}
      className="input"
    >
      {children}
    </select>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
));

export default SelectField;
