import { icons } from "lucide-react";



const Icon = ({ name, className, size, color, onClick }) => {
    const IconComponent = icons[name];
    if (!IconComponent) {
        return null;
    }

    return <IconComponent size={size} color={color} className={className} onClick={onClick} />;
}

export default Icon;