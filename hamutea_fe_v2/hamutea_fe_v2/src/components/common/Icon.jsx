import { icons } from "lucide-react";

const Icon = ({ name, className, size, color, onClick, ...props }) => {
    const IconComponent = icons[name];
    
    if (!IconComponent) {
        console.warn(`Icon "${name}" not found in lucide-react`);
        return null;
    }

    return (
        <IconComponent 
            size={size} 
            color={color} 
            className={className} 
            onClick={onClick}
            {...props}
        />
    );
};

export default Icon;