import "./App.css";
import { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import axios from "axios";
import CountryTable from "./components/CountryTable";
import Search from "./components/Search";

function App() {
  const [countries, setCountries] = useState([]);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(`https://restcountries.com/v3.1/all`);
        const totalItems = response.data.length;

        const numberOfPages = calculatePages(totalItems);
        setNumPages(numberOfPages);

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

        const countriesForPage = response.data.slice(startIndex, endIndex);

        setCountries(countriesForPage);
      } catch (error) {
        console.error("Error is ", error);
      }
    };

    fetchdata();
  }, [currentPage, searchInput]);

  useEffect(() => {
    handleSearch(searchInput);
  }, [searchInput]);

  const calculatePages = (totalItems) => {
    return Math.ceil(totalItems / itemsPerPage);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearch = async (search) => {
    setSearchInput(search);

    if (!search.trim()) {
      return;
    }

    try {
      const response = await axios.get(
        `https://restcountries.com/v3.1/name/${search}`
      );

      const searchedCountries = response.data.map((country) => ({
        flags: country.flags || "",
        name: country.name | "",
        capital: country.capital || "N/A",
        population: country.population || "",
        maps: country.maps || "",
        independent: country.independent || "",
      }));

      setCountries(searchedCountries);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  return (
    <div className="app-container">
      <h3>Countries Database</h3>
      <Search search={handleSearch} />
      <CountryTable countries={countries} />
      <div>
        <Pagination
          className="pagination-container"
          onChange={handlePageChange}
          size="large"
          count={numPages}
          page={currentPage}
          color="primary"
        />
      </div>
    </div>
  );
}

export default App;
