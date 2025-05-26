import Icon from "@components/common/Icon";
const Select = ({ color, placeholder, options = [] }) => {
    if (!options.length) return "No options";
    return (
        <div className="flex items-center gap-2">
            <select className="appearance-none bg-transparent border-none p-0 m-0 focus:outline-none"
                style={{
                    color: color
                }}
            >
                <option value="0" className="text-hamutea-brown" disabled>{placeholder}</option>
                {options.map((option, index) => (
                    <option key={index} value={option.value} className="text-hamutea-brown">{option.label}</option>
                ))}
            </select>
            <Icon name="ChevronDown" color={color} className="h-5 w-5 shrink-0" />
        </div>

    );
}

export default Select;