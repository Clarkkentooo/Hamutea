import Icon from "@components/common/Icon";

const InfoCard = ({ count, desc, icon, color }) => {
    return (
        <div className="border border-hamutea-border rounded-2xl flex items-center  p-4 gap-3">
            <Icon name={icon} className={`${color} w-[3rem] h-[3rem]`} />
            <div>
                <h1 className="font-bold text-2xl">{count}</h1>
                <p className="text-hamutea-gray text-sm">{desc}</p>
            </div>
        </div>
    );
}

export default InfoCard;