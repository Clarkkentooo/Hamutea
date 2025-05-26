const PageTitle = ({ title, desc }) => {
    return (
        <div>
            <h1 className="font-bold text-3xl">{title}</h1>
            <p className="text-hamutea-gray">{desc}</p>
        </div>
    );
}

export default PageTitle;