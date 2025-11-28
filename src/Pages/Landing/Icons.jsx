// src/components/Icons.jsx
const Icons = ({ IconComponent, iconClass }) => {
  return (
    <div className="timeline-logo">
      <IconComponent className={iconClass} />
    </div>
  );
};

export default Icons;
