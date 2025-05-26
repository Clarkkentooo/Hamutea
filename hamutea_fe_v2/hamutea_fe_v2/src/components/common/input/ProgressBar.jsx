const ProgressBar = ({ color, progress }) => {
    return (
        <div className="w-full h-3 rounded-full relative"
            style={{
                backgroundColor: `${color}80`
            }}
        >
            <div className=" h-full absolute rounded-full"
                style={{
                    backgroundColor: color,
                    width: `${progress}%`
                }}
            ></div>
        </div>
    );
}

export default ProgressBar;