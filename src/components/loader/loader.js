import "./loader.css";
const Loader = ({ children, style }) => {
  return (
    <div style={style} className="loader-wrapper">
      <div className="flexbox loader">
        <div className="spinner"></div>
        <span style={{ fontSize: "20px" }}>{children}</span>
      </div>
    </div>
  );
};

export default Loader;
