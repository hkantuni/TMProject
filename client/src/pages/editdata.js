import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../App";

export const EditData = () => {
  const auth = useContext(AuthContext);
  const { id } = useParams();
  const history = useHistory();

  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      if (ignore) {
        return;
      }

      try {
        setLoading(true);
        setError(undefined);
        const response = await fetch(API_URL + "/api/data/" + id, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
        });
        const responseData = await response.json();
        setData(responseData[0]);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };

    fetchData();
    return () => {
      ignore = true;
    };
  }, [id, auth.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(API_URL + "/api/data/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
        body: JSON.stringify(data),
      });
      history.push("/");
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="jumbotron centered jumboform" style={{ width: "40%" }}>
      {error && <p>{error.message}</p>}
      <h1 className="form-header">Please update info you want to edit</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="dateWorked">Date</label>
          <input
            type="date"
            value={data ? data.dateWorked.split("T")[0] : ""}
            onChange={(e) => {
              setData({ ...data, dateWorked: e.target.value });
            }}
            className="form-control"
            name="dateWorked"
            placeholder="Dateworked"
          />
        </div>
        <div className="form-group">
          <label htmlFor="workedHours">Worked Hours</label>
          <input
            type="number"
            value={data ? data.workedHours : ""}
            onChange={(e) => {
              setData({ ...data, workedHours: e.target.value });
            }}
            className="form-control"
            name="workedHours"
            placeholder="Worked Hours"
          />
        </div>
        <div className="form-group">
          <label htmlFor="prefferedWorkingHoursPerDay">
            Preffered Working Hours
          </label>
          <input
            type="number"
            value={data ? data.prefferedWorkingHoursPerDay : ""}
            onChange={(e) => {
              setData({
                ...data,
                prefferedWorkingHoursPerDay: e.target.value,
              });
            }}
            className=" form-control"
            name="prefferedWorkingHoursPerDay"
            placeholder="Preffered Working Hours"
          />
        </div>
        <div className="form-group">
          <label htmlFor="workTopic">Job Name</label>
          <input
            type="text"
            value={data ? data.workTopic : ""}
            onChange={(e) => {
              setData({ ...data, workTopic: e.target.value });
            }}
            className=" form-control"
            name="workTopic"
            placeholder="Work Topic Name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="comments">Comments</label>
          <textarea
            className="form-control"
            name="comments"
            rows="3"
            value={data ? data.comments : ""}
            onChange={(e) => {
              setData({ ...data, comments: e.target.value });
            }}
          ></textarea>
        </div>
        <Link to="/" className="btn btn-dark" role="button">
          Back
        </Link>
        <button
          type="submit"
          className=" btn btn-dark"
          style={{ marginLeft: "25px" }}
          disabled={loading}
        >
          Submit
        </button>
      </form>
    </div>
  );
};
