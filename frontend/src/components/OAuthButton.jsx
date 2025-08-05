import React from "react";

const OAuthButton = ({
  provider = "Google",
  iconUrl,
  onClick,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-200   ${className}`}
    >
      {iconUrl && <img src={iconUrl} alt={provider} className="h-5 w-5" />}
      Continue with {provider}
    </button>
  );
};

export default OAuthButton;
