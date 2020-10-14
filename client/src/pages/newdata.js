import React, { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../hooks/auth.hook";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";

export const Newdata = () => {
  const { token } = useAuth();
  const message = useMessage();
  const { loading, request, error, clearError } = useHttp();
  const history = useHistory();
  const [form, setForm] = useState({
    workTopic: "",
    workedHours: "0",
    hoursTotal: "0",
    prefferedWorkingHoursPerDay: "0",
    dateWorked: "",
    comments: "",
  });

  const dataChangeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  const newDataHandler = async () => {
    try {
      const data = await request(
        "/api/data/timepage",
        "POST",
        { ...form },
        { Authorization: "Bearer " + token }
      );

      message(data.message);
      history.push("/");
    } catch (e) {}
  };

  return (
    <div className="jumbotron centered jumboform">
      <h1 className="form-header">Please provide following info</h1>
      <form action="/form" method="POST">
        <div className="form-group">
          <label htmlFor="dateWorked">Date Worked</label>
          <input
            type="date"
            className="form-control"
            name="dateWorked"
            placeholder="Dateworked"
            required={true}
            onChange={dataChangeHandler}
          ></input>
        </div>
        <div className="form-group">
          <label htmlFor="workedHours">Worked Hours</label>
          <input
            type="number"
            className="form-control"
            name="workedHours"
            placeholder="Worked Hours"
            onChange={dataChangeHandler}
          ></input>
        </div>
        <div className="form-group">
          <label htmlFor="prefferedWorkingHoursPerDay">
            Preffered Working Hours
          </label>
          <input
            type="number"
            className="form-control"
            name="prefferedWorkingHoursPerDay"
            placeholder="Preffered Working Hours"
            onChange={dataChangeHandler}
          ></input>
        </div>
        <div className="form-group">
          <label htmlFor="workTopic">Job Name</label>
          <input
            type="text"
            className="form-control"
            name="workTopic"
            placeholder="Work Topic Name"
            onChange={dataChangeHandler}
          ></input>
        </div>
        <div className="form-group">
          <label htmlFor="comments">Comments</label>
          <textarea
            className="form-control"
            name="comments"
            rows="3"
            onChange={dataChangeHandler}
          ></textarea>
        </div>

        <Link to="/" className="btn btn-dark btn-form log" role="button">
          Back
        </Link>
        <button
          type="submit"
          action="/edit"
          className=" btn btn-dark btn-form log"
          onClick={newDataHandler}
          disabled={loading}
        >
          Submit
        </button>
      </form>
      <Footer />
    </div>
  );
};
