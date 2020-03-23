const DisableComponent = ({ isDisabled, children }) => {
  if (isDisabled) return null;
  return children;
};

export default DisableComponent;
