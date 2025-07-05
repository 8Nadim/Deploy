import landingImage from "../assets/Landing.png";
import appDownloadImage from "../assets/appDownload.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import SearchBar, { SearchForm } from "@/components/SearchBar";

const HomePage = () => {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:7000/api/my/user");
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched User:", data); // Log user data
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, []);

  const navigate = useNavigate();

  const handleSearchSubmit = (searchFormValues: SearchForm) => {
    navigate({
      pathname: `/search/${searchFormValues.searchQuery}`,
    });
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="md:px-32 bg-white rounded-lg shadow-md py-8 flex flex-col gap-5 text-center -mt-16">
        <h1 className="text-5xl font-bold tracking-tight text-violet-600">
          Order to campus today!
        </h1>
        <span className="text-xl">Food is just a click away!</span>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <img src={landingImage} />
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <span className="font-bold text-yju.3x1 tracking-tighter">
            Order takeaway even faster!
          </span>
          <span>Download UrOrder app now</span>
          <img src={appDownloadImage} />
        </div>
      </div>

      {/* Add the button here */}
      <div className="flex justify-center mt-6">
        <Link to="/choose-restaurant">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            View Restaurants
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
