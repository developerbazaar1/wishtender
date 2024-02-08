const NotFound = () => {
  return (
    <div className="notFound-container">
      <div className="second-container">
        <h1 className="title-h1">
          <span className="fade-in" id="digit1">
            4
          </span>
          <span className="fade-in" id="digit2">
            0
          </span>
          <span className="fade-in" id="digit3">
            4
          </span>
        </h1>
        <h3 className="fadeIn">PAGE NOT FOUND</h3>
        <button
          className="return-toHome"
          name="button"
          onClick={() => window.history.back()}
        >
          Return To Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
