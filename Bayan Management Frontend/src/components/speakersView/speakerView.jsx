// src/components/SpeakerView/speakerView.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import "./speakerView.css";

const SpeakerView = () => {
    const { user, logout, isLoading } = useContext(AuthContext);
    const [bayans, setBayans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading) return;
        if (!user) {
            navigate("/");
            return;
        }

        const fetchBayans = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:8080/api/bayans");
                console.log("SpeakerView API Response:", response.data);
                const flattenedBayans = response.data.flatMap(doc => doc.bayans);
                setBayans(flattenedBayans);
            } catch (error) {
                console.error("Error fetching bayans:", error.response?.data || error.message);
                setError(error.response?.data?.message || "Failed to load your bayans");
                if (error.response?.status === 401) {
                    logout();
                    navigate("/");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchBayans();
    }, [logout, navigate, user, isLoading]);

    if (isLoading || loading) {
        return <div>Loading your bayans... <span className="spinner">...</span></div>;
    }

    if (!user) {
        return null;
    }

    if (error) {
        return (
            <div>
                <h1>Assalamu Alaikum {user?.userName || "User"}</h1>
                <p style={{ color: "red" }}>{error}</p>
                <div className="btn-container-outside-modal">
                    <button
                        onClick={() => { logout(); navigate("/"); }}
                        className="btn btn-danger"
                        id="log-out-btn"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <h1>Assalamu Alaikum {user?.userName || "User"}, Your Bayans are as follows</h1>
            <div className="btn-container-outside-modal">
                {/* <button
                    onClick={() => { logout(); navigate("/"); }}
                    className="btn btn-danger"
                    id="log-out-btn"
                >
                    Log Out
                </button> */}
                <button type="button" onClick={() => { logout(); navigate("/"); }}
                    className="btn btn-danger"
                    id="log-out-btn">Log Out</button>

            </div>
            {bayans.length === 0 ? (
                <p>No bayans assigned to you yet.</p>
            ) : (
                <table className="bayan-table">
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Time</th>
                            <th>Kalai/Malai</th>
                            <th>Place</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bayans.map((bayan) => (
                            <tr key={bayan._id}>
                                <td>{bayan.dayOfTheWeek}</td>
                                <td>{bayan.numericTime}</td>
                                <td>{bayan.kalaiMalai}</td>
                                <td>{bayan.place}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
};

export default SpeakerView;