import Icon from "@components/common/Icon";
const SearchInput = () => {
    return (
        <div className="relative bg-gray-50 px-5 flex items-center rounded-full gap-3">
            <Icon name="Search" className="text-gray-500 w-5 h-5" />
            <input
                type="text"
                placeholder="Search"
                className="appearance-none border-none outline-none bg-transparent py-2 m-0 shadow-none focus:outline-none"
            />
        </div>
    );
}

export default SearchInput;