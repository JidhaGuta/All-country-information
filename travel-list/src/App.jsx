import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "./index.css/";
import "leaflet/dist/leaflet.css";
// const initialItems = [
//   { id: 1, description: "Passports", quantity: 2, packed: false },
//   { id: 1, description: "Passports", quantity: 2, packed: false },
//   { id: 2, description: "Socks", quantity: 12, packed: false },
// ];

function App() {
  return (
    <div>
      {/* <Logo />
      <Form />
      <PackingList />
      <Stats /> */}
      <CountryForm />
    </div>
  );
}

const locationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1673/1673221.png", // Location icon URL
  iconSize: [25, 40],
  iconAnchor: [12, 40],
});

function CountryForm() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Fetch and prepare country data
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const formattedCountries = data.map((country) => ({
          name: country.name.common,
          flag: country.flags?.png || country.flags?.svg || "",
          capital: country.capital?.[0] || "N/A",
          region: country.region,
          subregion: country.subregion || "N/A",
          languages: country.languages
            ? Object.values(country.languages).join(", ")
            : "N/A",
          currency: country.currencies
            ? Object.values(country.currencies)
                .map((currency) => currency.name)
                .join(", ")
            : "N/A",
          continent: country.continents?.[0] || "N/A",
          latlng: country.latlng || [0, 0], // Default to [0, 0] if coordinates are unavailable
        }));
        // Sort countries alphabetically by name
        formattedCountries.sort((a, b) => a.name.localeCompare(b.name));
        setCountries(formattedCountries);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  const handleCountryChange = (e) => {
    const selectedCountryName = e.target.value;
    const country = countries.find((c) => c.name === selectedCountryName);
    setSelectedCountry(country);
  };

  return (
    <div className="container">
      {/* Logo Section */}
      <div className="header">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1041/1041885.png"
          alt="World Logo"
          className="logo"
        />
        <h2>Visit Today's World</h2>
      </div>

      <form>
        <label htmlFor="country">Select Country:</label>
        <select id="country" onChange={handleCountryChange}>
          <option value="">search/Select a country</option>
          {countries.map((country, index) => (
            <option key={index} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
      </form>

      {selectedCountry && (
        <div className="country-container">
          {/* Country Information */}
          <div className="country-info">
            <h2>{selectedCountry.name}</h2>
            <img
              src={selectedCountry.flag}
              alt={`${selectedCountry.name} flag`}
              className="country-flag"
            />
            <p>
              <strong>Capital:</strong> {selectedCountry.capital}
            </p>
            <p>
              <strong>Region:</strong> {selectedCountry.region}
            </p>
            <p>
              <strong>Subregion:</strong> {selectedCountry.subregion}
            </p>
            <p>
              <strong>Continent:</strong> {selectedCountry.continent}
            </p>
            <p>
              <strong>Currency:</strong> {selectedCountry.currency}
            </p>
            <p>
              <strong>Languages:</strong> {selectedCountry.languages}
            </p>
          </div>

          {/* Map Rendering */}
          <div className="country-map">
            <MapComponent selectedCountry={selectedCountry} />
          </div>
        </div>
      )}
    </div>
  );
}

// Custom Map Component
function MapComponent({ selectedCountry }) {
  const MapUpdater = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center, zoom, { animate: true });
    }, [center, zoom, map]);
    return null;
  };

  return (
    <MapContainer
      center={selectedCountry.latlng}
      zoom={5}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={selectedCountry.latlng} icon={locationIcon}>
        <Popup>
          {selectedCountry.name}
          <br />
          Capital: {selectedCountry.capital}
        </Popup>
      </Marker>
      <MapUpdater center={selectedCountry.latlng} zoom={5} />
    </MapContainer>
  );
}

// function Logo() {
//   return <h1>Do more. 👍</h1>;
// }

// function Form() {
//   const [description, setDescription] = useState("");
//   const [quantity, setQuantity] = useState();
//   const newItems = { description, quantity };
//   return (
//     <form className="add-form">
//       What did you want? 🥰
//       <select
//         value={quantity}
//         onChange={(e) => setQuantity(Number(e.target.value))}
//         name=""
//         id=""
//       >
//         {Array.from({ length: 20 }, (_, index) => index + 1).map((num) => (
//           <option value={num} key={num}>
//             {num}
//           </option>
//         ))}
//       </select>
//       <input
//         type="text"
//         placeholder="Item.."
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//       />
//       <button>Add</button>
//     </form>
//   );
// }

// function PackingList() {
//   return (
//     <div className="list">
//       <ul>
//         {initialItems.map((item) => (
//           <Item key={item.id} item={item} />
//         ))}
//       </ul>
//     </div>
//   );
// }

// function Item({ item }) {
//   return <li>{item.description}</li>;
// }

// function Stats() {
//   const totalItems = initialItems.length;
//   const packedItems = initialItems.filter((item) => item.packed).length;
//   const packedPercentage =
//     totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

//   return (
//     <footer className="stats">
//       👜 You have {totalItems} items on your list, and you already packed{" "}
//       {packedItems} ({packedPercentage}%)
//     </footer>
//   );
// }

export default App;
