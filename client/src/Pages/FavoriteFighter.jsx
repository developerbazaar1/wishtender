import React from "react";
import { Link } from "react-router-dom";
import FavoriteFither from "../img/userProfile.png";
import FavoriteFither2 from "../img/about-image02.png";
import FavoriteFither3 from "../img/Fighter3.png";
import FavoriteFither4 from "../img/fighter4.png";

const FavoriteFighter = () => {
  const fighters = [
    {
      img: FavoriteFither,
      name: "Andrew Ainsley",
      id: "evadg",
    },
    {
      img: FavoriteFither2,
      name: "Tracy Cortez",
      id: "fdfdf",
    },
    {
      img: FavoriteFither3,
      name: "Shonie Carter",
      id: "edec",
    },
    {
      img: FavoriteFither4,
      name: "Ronda Rousey",
      id: "jreic",
    },
  ];

  return (
    <>
      <main className="main-content">
        <section className="search-fighter-sec page-head">
          <div className="row">
            <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
              <div className="back-page">
                <Link to="/fighterhome" className="back-to-page-btn link-text">
                  <svg
                    className="mb-1 mx-1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12.7273 3.68676C12.8176 3.59129 12.8881 3.47898 12.9349 3.35626C12.9817 3.23353 13.0039 3.10278 13.0002 2.97148C12.9965 2.84017 12.9669 2.71089 12.9133 2.591C12.8596 2.47112 12.7828 2.36298 12.6873 2.27276C12.5919 2.18254 12.4796 2.11201 12.3568 2.0652C12.2341 2.01838 12.1034 1.9962 11.9721 1.99991C11.8408 2.00363 11.7115 2.03317 11.5916 2.08684C11.4717 2.14052 11.3636 2.21729 11.2733 2.31276L2.77334 11.3128C2.59781 11.4984 2.5 11.7442 2.5 11.9998C2.5 12.2553 2.59781 12.5011 2.77334 12.6868L11.2733 21.6878C11.363 21.7853 11.4711 21.8641 11.5914 21.9195C11.7117 21.975 11.8419 22.0059 11.9743 22.0106C12.1067 22.0153 12.2387 21.9937 12.3626 21.9469C12.4866 21.9002 12.6 21.8293 12.6963 21.7383C12.7927 21.6474 12.8699 21.5382 12.9237 21.4171C12.9775 21.296 13.0067 21.1655 13.0095 21.033C13.0124 20.9006 12.989 20.7689 12.9405 20.6456C12.8921 20.5223 12.8196 20.4098 12.7273 20.3148L4.87534 11.9998L12.7273 3.68676Z"
                      fill="black"
                    />
                  </svg>
                  Back
                </Link>
              </div>
            </div>
          </div>
          {/* page tittle */}
          <div className="row ">
            <div className="col-md-12 col-sm-12 col-xs-12 col-lg-12 text-center">
              <div className="page-head">
                <div className="card-head mb-3 mt-2">
                  <h5>Favorite Fighters</h5>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="favorite-fighters-container">
            {fighters?.map((fighter) => (
              <Link className="favorite-fighter" to="/adrew" key={fighter?.id}>
                <div className="fighter-img-container">
                  <img src={fighter?.img} alt="favorite" />
                </div>
                <div className="fav-fighter-name">{fighter?.name}</div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default FavoriteFighter;
