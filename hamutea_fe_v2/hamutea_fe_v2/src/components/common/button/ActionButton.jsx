import Icon from "@components/common/Icon";

const ActionButton = ({ variant, label, icon, iconAlign = "left" }) => {

    const VARIANTS = {
        danger: {
            border: "border-hamutea-red",
            bg: "bg-white",
            text: "text-hamutea-red",
            hover: "hover:text-white hover:bg-hamutea-red",
        },
        gray: {
            border: "border-[#3d3d3d]",
            text: "text-[#3d3d3d]",
            bg: "bg-[#e0e0e0]",
            hover: "hover:text-white hover:bg-hamutea-gray",
        },
        success: {
            border: "border-green-500",
            bg: "bg-green-100",
            text: "text-green-600",
            hover: "hover:text-white hover:bg-green-500",
        }
    }


    return (
        <button className={`rounded-full transition-all duration-300 ease-in-out border px-4 py-1 inline-flex  gap-1 items-center justify-center ${VARIANTS[variant].border} ${VARIANTS[variant].text} ${VARIANTS[variant].hover} ${VARIANTS[variant].bg} ${iconAlign === "right" && "flex-row-reverse"}`}>
            {label}
            <span>
                <Icon name={icon} className="shrink-0 h-5 w-5" />
            </span>
        </button>
    );
}

export default ActionButton;