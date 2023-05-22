import React, { useEffect, useState } from "react";

const App = () => {
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [editCity, setEditCity] = useState(null); // State to track the city being edited
  const [editedName, setEditedName] = useState("");
  const [editedPhoto, setEditedPhoto] = useState("");

  useEffect(() => {
    fetchCities();
  }, [currentPage]);

  const fetchCities = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/cities?page=${currentPage}&size=10`
      );
      const data = await response.json();
      setCities(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/cities/${searchTerm}`
      );
      const data = await response.json();
      setCities([data]);
      setTotalPages(1);
    } catch (error) {
      console.error("Error searching city:", error);
    }
  };

  const handleEdit = async (id, name, photo) => {
    setEditCity(id); // Set the city being edited
    setEditedName(name);
    setEditedPhoto(photo);
  };

  const handleSaveEdit = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/cities/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editedName, photo: editedPhoto }),
      });

      if (response.ok) {
        const updatedCity = { ...cities.find((city) => city.id === id) };
        updatedCity.name = editedName;
        updatedCity.photo = editedPhoto;
        const updatedCities = cities.map((city) =>
          city.id === id ? updatedCity : city
        );
        setCities(updatedCities);
        setEditCity(null); // Clear the edit state
      } else {
        console.error("Error updating city:", response.status);
      }
    } catch (error) {
      console.error("Error updating city:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h1>City List</h1>
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <table style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>ID</th>
            <th style={tableHeaderStyle}>Name</th>
            <th style={tableHeaderStyle}>Photo</th>
            <th style={tableHeaderStyle}>Edit</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => (
            <tr key={city.id}>
              <td style={tableCellStyle}>{city.id}</td>
              <td style={tableCellStyle}>
                {editCity === city.id ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                ) : (
                  city.name
                )}
              </td>
              <td style={tableCellStyle}>
                {editCity === city.id ? (
                  <input
                    type="text"
                    value={editedPhoto}
                    onChange={(e) => setEditedPhoto(e.target.value)}
                  />
                ) : (
                  <img src={city.photo} alt={city.name} width="200" />
                )}
              </td>
              <td style={tableCellStyle}>
                {editCity === city.id ? (
                  <button onClick={() => handleSaveEdit(city.id)}>Save</button>
                ) : (
                  <button
                    onClick={() =>
                      handleEdit(city.id, `${city.name}`, city.photo)
                    }
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {Array.from(Array(totalPages).keys()).map((page) => (
          <button key={page} onClick={() => handlePageChange(page)}>
            {page + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

const tableHeaderStyle = {
  border: "1px solid black",
  padding: "8px",
};

const tableCellStyle = {
  border: "1px solid black",
  padding: "8px",
};

export default App;
