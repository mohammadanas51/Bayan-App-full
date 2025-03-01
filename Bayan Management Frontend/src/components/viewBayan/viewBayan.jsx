import React, { useState, useMemo, useEffect } from "react";
import "./viewBayan.css";
import { useTable } from "react-table";
import { COLUMNS } from "./columns";
import { Link } from "react-router-dom";
import axios from "axios";

const Viewbayan = () => {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [selectedBayan, setSelectedBayan] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedDayDropdownOption, setSelectedDayDropdownOption] = useState(null);
  const [selectedTimeDropdownOption, setSelectedTimeDropdownOption] = useState(null);
  const [selectedPlaceDropdownOption, setSelectedPlaceDropdownOption] = useState(null);
  const [selectedPersonDropdownOption, setSelectedPersonDropdownOption] = useState(null);
  const [numericTime, setNumericTime] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [formattedMessage, setFormattedMessage] = useState("");

  const DaydropdownOptions = ["திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி", "ஞாயிறு"];
  const TimedropdownOptions = ["காலை", "மாலை"];
  const PlacedropdownOptions = [
    "முஹம்மது புறா",
    "கரிம் காம்பவுண்ட்",
    "ஆதம் பாய் வீடு",
    "அஸ்தம்பட்டி மர்கஸ்",
    "ஜலால் புறா",
    "லைன்மேடு",
    "நியூ பாரதி அருகில்",
    "லுக்மான் மெடிக்கல் ஆபஸிட்",
    "திப்பு நகர்",
    "ஜங்ஷன் மர்கஸ்",
    "மணியனூர்",
  ];
  const PersondropdownOptions = ["ஆயிஷா", "நஜிமா", "ஹாஜிரா", "மதார்"];

  useEffect(() => {
    const fetchBayans = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/api/bayans");
        console.log("API Response:", response.data);
        let serialNumberCounter = 1;
        const flattenedData = response.data.flatMap((doc) =>
          doc.bayans.map((bayan) => ({
            ...bayan,
            docId: doc._id,
            serialNumber: bayan.serialNumber || serialNumberCounter++, // Use counter for fallback
          }))
        );
        const sortedData = [...flattenedData].sort((a, b) => a.serialNumber - b.serialNumber);
        console.log("Flattened and Sorted Data:", sortedData);
        setTableData(sortedData);
        console.log("tableData after set:", tableData);

        // Set formattedMessage from the first document's dates if bayans exist
        if (response.data.length > 0 && response.data[0].fromDate && response.data[0].toDate) {
          const formattedFromDate = new Date(response.data[0].fromDate).toLocaleDateString("ta-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }).replace(/\//g, "-");
          const formattedToDate = new Date(response.data[0].toDate).toLocaleDateString("ta-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }).replace(/\//g, "-");
          setFormattedMessage(`${formattedFromDate} முதல் ${formattedToDate} வரை பயான்கள்`);
        }
      } catch (error) {
        console.error("Error fetching bayans:", error);
        setError("Failed to load bayans. Check server or console for details.");
        setIsErrorModalOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchBayans();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("ta-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).replace(/\//g, "-");
  };

  const handleAddBayan = async () => {
    try {
      if (!fromDate || !toDate) {
        setError("Please select both from and to dates.");
        setShowAlert(true);
        return;
      }
      if (
        !selectedDayDropdownOption ||
        !numericTime ||
        !selectedTimeDropdownOption ||
        !selectedPlaceDropdownOption ||
        !selectedPersonDropdownOption
      ) {
        setError("Please fill all fields.");
        setIsErrorModalOpen(true);
        return;
      }
      setFormattedMessage(`${formatDate(fromDate)} முதல் ${formatDate(toDate)} வரை பயான்கள்`); // Set message on add
      const newBayan = {
        dayOfTheWeek: selectedDayDropdownOption,
        numericTime: numericTime,
        kalaiMalai: selectedTimeDropdownOption,
        place: selectedPlaceDropdownOption,
        speaker: selectedPersonDropdownOption,
      };
      const bayanData = {
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
        bayans: [newBayan],
      };
      const response = await axios.post("http://localhost:8080/api/bayans", bayanData);
      const updatedResponse = await axios.get("http://localhost:8080/api/bayans");
      let serialNumberCounter = 1;
      const flattenedData = updatedResponse.data.flatMap((doc) =>
        doc.bayans.map((bayan) => ({
          ...bayan,
          docId: doc._id,
          serialNumber: bayan.serialNumber || serialNumberCounter++, // Use counter for fallback
        }))
      );
      const sortedData = [...flattenedData].sort((a, b) => a.serialNumber - b.serialNumber);
      setTableData(sortedData);
      console.log("tableData after add:", tableData);
      toggleAddModal();
      setFromDate(""); // Reset date fields after successful add
      setToDate("");
      setSelectedDayDropdownOption(null);
      setSelectedTimeDropdownOption(null);
      setSelectedPlaceDropdownOption(null);
      setSelectedPersonDropdownOption(null);
      setNumericTime("");
    } catch (error) {
      console.error("Error adding bayan:", error);
      setError("Failed to add bayan. Check server or console for details.");
      setIsErrorModalOpen(true);
    }
  };

  const handleTimeChange = (e) => {
    setNumericTime(e.target.value);
  };

  const toggleCancelModal = () => setIsCancelModalOpen(!isCancelModalOpen);
  const toggleAddModal = () => setIsAddModalOpen(!isAddModalOpen);
  const toggleEditModal = () => setIsEditModalOpen(!isEditModalOpen);
  const toggleClearConfirm = () => setIsClearConfirmOpen(!isClearConfirmOpen);
  const toggleErrorModal = () => {
    setIsErrorModalOpen(false);
    setError(null);
  };

  const handleClearBayans = async () => {
    try {
      await axios.delete("http://localhost:8080/api/bayans");
      setTableData([]);
      setFormattedMessage(""); // Clear the message when all bayans are removed
      setError(null);
      toggleClearConfirm();
    } catch (error) {
      console.error("Error clearing bayans:", error);
      setError("Failed to clear bayans. Check server or console for details.");
      setIsErrorModalOpen(true);
    }
  };

  const handleDayDropdownSelect = (day_option) => setSelectedDayDropdownOption(day_option);
  const handleTimeDropdownSelect = (time_option) => setSelectedTimeDropdownOption(time_option);
  const handlePlaceDropdownSelect = (place_option) => setSelectedPlaceDropdownOption(place_option);
  const handlePersonDropdownSelect = (person_option) => setSelectedPersonDropdownOption(person_option);

  const handleEdit = (bayan) => {
    setSelectedBayan(bayan);
    setSelectedDayDropdownOption(bayan.dayOfTheWeek);
    setSelectedTimeDropdownOption(bayan.kalaiMalai);
    setSelectedPlaceDropdownOption(bayan.place);
    setSelectedPersonDropdownOption(bayan.speaker);
    setNumericTime(bayan.numericTime || "");
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (selectedBayan && selectedBayan._id && selectedBayan.docId) {
      try {
        const updatedBayan = {
          dayOfTheWeek: selectedDayDropdownOption,
          numericTime: numericTime,
          kalaiMalai: selectedTimeDropdownOption,
          place: selectedPlaceDropdownOption,
          speaker: selectedPersonDropdownOption,
        };
        await axios.put(
          `http://localhost:8080/api/bayans/${selectedBayan.docId}/bayans/${selectedBayan._id}`,
          updatedBayan
        );
        const response = await axios.get("http://localhost:8080/api/bayans");
        let serialNumberCounter = 1;
        const flattenedData = response.data.flatMap((doc) =>
          doc.bayans.map((bayan) => ({
            ...bayan,
            docId: doc._id,
            serialNumber: bayan.serialNumber || serialNumberCounter++, // Use counter for fallback
          }))
        );
        const sortedData = [...flattenedData].sort((a, b) => a.serialNumber - b.serialNumber);
        setTableData(sortedData);
        console.log("tableData after edit:", tableData);
        toggleEditModal();
      } catch (error) {
        console.error("Error updating bayan:", error);
        setError("Failed to update bayan. Check server or console for details.");
        setIsErrorModalOpen(true);
      }
    }
  };

  const handleCancel = (bayan) => {
    setSelectedBayan(bayan);
    toggleCancelModal();
  };

  const confirmCancel = async () => {
    if (selectedBayan && selectedBayan._id && selectedBayan.docId) {
      try {
        await axios.delete(
          `http://localhost:8080/api/bayans/${selectedBayan.docId}/bayans/${selectedBayan._id}`
        );
        const response = await axios.get("http://localhost:8080/api/bayans");
        let serialNumberCounter = 1;
        const flattenedData = response.data.flatMap((doc) =>
          doc.bayans.map((bayan) => ({
            ...bayan,
            docId: doc._id,
            serialNumber: bayan.serialNumber || serialNumberCounter++, // Use counter for fallback
          }))
        );
        const sortedData = [...flattenedData].sort((a, b) => a.serialNumber - b.serialNumber);
        setTableData(sortedData);
        console.log("tableData after delete:", tableData);
        toggleCancelModal();
      } catch (error) {
        console.error("Error deleting bayan:", error);
        setError("Failed to delete bayan. Check server or console for details.");
        setIsErrorModalOpen(true);
      }
    }
  };

  const addBayan = () => {
    setSelectedDayDropdownOption(null);
    setSelectedTimeDropdownOption(null);
    setSelectedPlaceDropdownOption(null);
    setSelectedPersonDropdownOption(null);
    setNumericTime("");
    // Do not reset fromDate and toDate here to allow reuse
    toggleAddModal();
  };

  const updatedColumns = useMemo(
    () => [
      ...COLUMNS,
      {
        Header: "Actions",
        id: "actions",
        Cell: ({ row }) => (
          <div className="action-buttons">
            <button className="edit-btn" onClick={() => handleEdit(row.original)}>
              <i className="bi bi-pencil"></i>
            </button>
            <button className="cancel-btn" onClick={() => handleCancel(row.original)}>
              <i className="bi bi-trash"></i>
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const data = useMemo(() => tableData, [tableData]);

  const tableInstance = useTable({ columns: updatedColumns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  if (loading) return <div className="loading">Loading <span className="spinner">...</span></div>;

  return (
    <>
      <h1 id="bayan-msg">
        சேலம் மாவட்டம் சார்பாக இந்த வாரம் நடைபெறும் பெண்கள் பயான்
      </h1>

      <div className="aboutme-logout-btns">
        <Link to="/aboutme">
          <button type="button" className="btn btn-info" id="about-me-btn">
            About Me
          </button>
        </Link>
        <Link to="/">
          <button type="button" className="btn btn-danger">
            Log Out
          </button>
        </Link>
      </div>

      <div className="btn-container-outside-modal">
        <button id="add-btn-below-msg" onClick={addBayan}>
          Add Bayan
        </button>
        <button id="clear-btn" onClick={toggleClearConfirm}>
          Clear Bayans
        </button>
      </div>

      {formattedMessage && <h2 id="dates-msg">{formattedMessage}</h2>}

      {isCancelModalOpen && selectedBayan && (
        <div className="cancel-bayan-modal">
          <div className="overlay">
            <div className="modal-content">
              <h2>நிச்சயமாக பயானை ரத்து செய்ய விரும்புகிறீர்களா?</h2>
              <p>
                <strong>நாள்:</strong> {selectedBayan.dayOfTheWeek || "N/A"}
              </p>
              <p>
                <strong>நேரம்:</strong> {selectedBayan.numericTime || "N/A"}
              </p>
              <p>
                <strong>இடம்:</strong> {selectedBayan.place || "N/A"}
              </p>
              <p>
                <strong>பேச்சாளர்:</strong> {selectedBayan.speaker || "N/A"}
              </p>
              <p>இந்த செயலை மாற்ற முடியாது.</p>
              <div className="btn-container">
                <button type="button" className="btn btn-success" onClick={confirmCancel}>
                  Cancel Bayan
                </button>
                <button type="button" className="btn btn-danger" onClick={toggleCancelModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="add-bayan-modal">
          <div className="overlay">
            <div className="modal-content">
              <h2>Add Bayan</h2>
              <div className="add-bayan-container">
                <p>
                  <strong>தேதி வரம்பு (Date Range):</strong>
                </p>
                <div className="date-choose-and-display">
                  {showAlert && (
                    <div className="alert alert-danger" role="alert">
                      Please select both dates.
                    </div>
                  )}
                  <input
                    type="date"
                    id="from-date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                  <label htmlFor="from-date">முதல் </label>
                  <input
                    type="date"
                    id="to-date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                  <label htmlFor="to-date">வரை </label>
                </div>

                <p>
                  <strong>நாள்:</strong>
                </p>
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {selectedDayDropdownOption ? selectedDayDropdownOption : "நாள்"}
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {DaydropdownOptions.map((day_option, index) => (
                      <li key={index}>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => handleDayDropdownSelect(day_option)}
                        >
                          {day_option}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <p id="time-msg">
                  <strong>நேரம்:</strong>
                </p>
                <div className="timeSelect">
                  <label htmlFor="time">Time</label>
                  <input
                    type="text"
                    id="time"
                    name="time"
                    value={numericTime}
                    placeholder="HH:MM"
                    onChange={handleTimeChange}
                  />
                </div>
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButtonTime"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {selectedTimeDropdownOption ? selectedTimeDropdownOption : "நேரம்"}
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButtonTime">
                    {TimedropdownOptions.map((time_option, index) => (
                      <li key={index}>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => handleTimeDropdownSelect(time_option)}
                        >
                          {time_option}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <p id="place-msg">
                  <strong>இடம்:</strong>
                </p>
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButtonPlace"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {selectedPlaceDropdownOption ? selectedPlaceDropdownOption : "இடம்"}
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButtonPlace">
                    {PlacedropdownOptions.map((place_option, index) => (
                      <li key={index}>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => handlePlaceDropdownSelect(place_option)}
                        >
                          {place_option}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <p id="speaker-msg">
                  <strong>பேச்சாளர்:</strong>
                </p>
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButtonPerson"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {selectedPersonDropdownOption ? selectedPersonDropdownOption : "பேச்சாளர்"}
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButtonPerson">
                    {PersondropdownOptions.map((person_option, index) => (
                      <li key={index}>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => handlePersonDropdownSelect(person_option)}
                        >
                          {person_option}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="btn-container-inside-modal">
                <button type="button" className="btn btn-success" onClick={handleAddBayan}>
                  Add Bayan
                </button>
                <button type="button" className="btn btn-danger" onClick={toggleAddModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedBayan && (
        <div className="edit-bayan-modal">
          <div className="overlay">
            <div className="modal-content">
              <h2>Edit Bayan</h2>
              <div className="edit-bayan-container">
                <p>
                  <strong>நாள்:</strong>
                </p>
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {selectedDayDropdownOption ? selectedDayDropdownOption : "நாள்"}
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {DaydropdownOptions.map((day_option, index) => (
                      <li key={index}>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => handleDayDropdownSelect(day_option)}
                        >
                          {day_option}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <p>
                  <strong>நேரம்:</strong>
                </p>
                <div className="timeSelect">
                  <label htmlFor="time">Time</label>
                  <input
                    type="text"
                    id="time"
                    name="time"
                    value={numericTime}
                    placeholder="HH:MM"
                    onChange={handleTimeChange}
                  />
                </div>
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButtonTime"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {selectedTimeDropdownOption ? selectedTimeDropdownOption : "நேரம்"}
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButtonTime">
                    {TimedropdownOptions.map((time_option, index) => (
                      <li key={index}>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => handleTimeDropdownSelect(time_option)}
                        >
                          {time_option}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <p>
                  <strong>இடம்:</strong>
                </p>
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButtonPlace"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {selectedPlaceDropdownOption ? selectedPlaceDropdownOption : "இடம்"}
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButtonPlace">
                    {PlacedropdownOptions.map((place_option, index) => (
                      <li key={index}>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => handlePlaceDropdownSelect(place_option)}
                        >
                          {place_option}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <p>
                  <strong>பேச்சாளர்:</strong>
                </p>
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButtonPerson"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {selectedPersonDropdownOption ? selectedPersonDropdownOption : "பேச்சாளர்"}
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButtonPerson">
                    {PersondropdownOptions.map((person_option, index) => (
                      <li key={index}>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => handlePersonDropdownSelect(person_option)}
                        >
                          {person_option}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="btn-container-inside-modal">
                <button type="button" className="btn btn-success" onClick={handleSaveEdit}>
                  Save Changes
                </button>
                <button type="button" className="btn btn-danger" onClick={toggleEditModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isClearConfirmOpen && (
        <div className="cancel-bayan-modal">
          <div className="overlay">
            <div className="modal-content">
              <h2>நிச்சயமாக அனைத்து பயான்களையும் அழிக்க விரும்புகிறீர்களா?</h2>
              <p>இந்த செயலை மாற்ற முடியாது.</p>
              <div className="btn-container">
                <button type="button" className="btn btn-success" onClick={handleClearBayans}>
                  Yes, Clear All
                </button>
                <button type="button" className="btn btn-danger" onClick={toggleClearConfirm}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isErrorModalOpen && error && (
        <div className="cancel-bayan-modal">
          <div className="overlay">
            <div className="modal-content error-modal">
              <h2>பிழை (Error)</h2>
              <p>{error}</p>
              <div className="btn-container error-modal">
                <button type="button" className="btn btn-primary" onClick={toggleErrorModal}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <table {...getTableProps()} className="bayan-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default Viewbayan;