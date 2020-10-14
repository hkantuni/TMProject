import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { Footer } from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";

export const Timepage = () => {
  const [userData, setUserData] = useState([]);
  const history = useHistory();
  const { loading, request, error, clearError } = useHttp();
  const message = useMessage();
  const auth = useContext(AuthContext);
  const [dateFromFilter, setDateFromFilter] = useState();
  const [dateToFilter, setDateToFilter] = useState();
  const [emailFilter, setEmailFilter] = useState();

  const getData = useCallback(
    async (filter) => {
      let url = "/api/data?";
      if (filter && filter.filterByDate) {
        url += "dateFrom=" + filter.dateFrom + "&dateTo=" + filter.dateTo;
      }
      if (filter && filter.filterByEmail) {
        url += "email=" + filter.email;
      }
      try {
        const data = await request(url, "GET", null, {
          Authorization: "Bearer " + auth.token,
        });
        setUserData(data);
      } catch (e) {}
    },
    [request, auth.token]
  );

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  useEffect(() => {
    getData();
  }, [getData, request, auth.token]);

  const logoutHandler = (event) => {
    event.preventDefault();
    auth.logout();
    history.push("home");
  };

  const handleDateFilter = async () => {
    await getData({
      filterByDate: true,
      dateFrom: dateFromFilter,
      dateTo: dateToFilter,
    });
  };

  const handleEmailFilter = async () => {
    await getData({
      filterByEmail: true,
      email: emailFilter,
    });
  };

  const deleteHandler = async (recordId) => {
    // Send an delete request
    await fetch("/api/data/" + recordId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + auth.token,
      },
    });
    await getData();
  };

  return (
    <div className="timepage-container">
      <i className="fas fa-business-time fa-4x timepage-image"></i>
      <h1 className="display-3 tp">Time Management System</h1>

      <hr className="my-4" />
      <p className="lead"></p>
      <div>
        <ul>
          <li
            style={{
              listStyleType: "none",
              display: "inline-block",
              width: "80px",
            }}
          >
            Date From:
          </li>
          <li style={{ listStyleType: "none", display: "inline-block" }}>
            <input
              type="date"
              name="dayfrom"
              max="3000-12-31"
              min="1000-01-01"
              className="datefiltertop form-control"
              onChange={(e) => {
                setDateFromFilter(e.target.value);
              }}
            />
          </li>
        </ul>
        <ul>
          <li
            style={{
              listStyleType: "none",
              display: "inline-block",
              width: "80px",
            }}
          >
            Date To:
          </li>
          <li style={{ listStyleType: "none", display: "inline-block" }}>
            <input
              type="date"
              name="dayto"
              max="3000-12-31"
              min="1000-01-01"
              className="datefilter form-control"
              onChange={(e) => {
                setDateToFilter(e.target.value);
              }}
            />
          </li>
          <li style={{ listStyleType: "none", display: "inline-block" }}>
            <button
              type="submit"
              className=" datefilterbtn btn btn-dark"
              onClick={handleDateFilter}
            >
              Filter
            </button>
          </li>

          {auth.userRole === "admin" && (
            <li style={{ float: "right", listStyleType: "none" }}>
              <li
                style={{
                  listStyleType: "none",
                  display: "inline-block",
                  marginLeft: "30px",
                }}
              >
                User email:
              </li>
              <li style={{ listStyleType: "none", display: "inline-block" }}>
                <input
                  type="email"
                  name="filterusername"
                  className="datefilter userfilter form-control"
                  onChange={(e) => {
                    setEmailFilter(e.target.value);
                  }}
                />
              </li>

              <li style={{ listStyleType: "none", display: "inline-block" }}>
                <button
                  type="submit"
                  className=" datefilterbtn btn btn btn-dark"
                  onClick={handleEmailFilter}
                >
                  Filter
                </button>
              </li>
            </li>
          )}
        </ul>
      </div>

      <table className="table table-sm">
        <thead className="thead-dark thead-font">
          <tr>
            <th
              scope="col"
              className="center thead-font"
              style={{ width: "180px" }}
            >
              Date
            </th>
            <th scope="col" className="center thead-font">
              User
            </th>
            <th scope="col" className="center thead-font">
              Task Title
            </th>
            <th scope="col" className="center wrap thead-font">
              Preffered Time
            </th>
            <th scope="col" className="center wrap thead-font">
              Time Competed
            </th>
            <th scope="col" className="center wrap thead-font">
              Difference
            </th>
            <th scope="col" className="center thead-font">
              Comments
            </th>
            <th scope="col" className="center thead-font">
              Edit
            </th>
            <th scope="col" className="center thead-font">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          {userData.map((row) => (
            <tr key={row._id}>
              <td className="center dateworked">
                {new Date(row.dateWorked).toLocaleDateString().split("T")[0]}
              </td>
              <td className="center worktopic">{row.ownerInfo[0].email}</td>
              <td className="center worktopic">{row.workTopic}</td>
              <td className="center">{row.prefferedWorkingHoursPerDay}</td>

              <td className="center">{row.workedHours}</td>
              {row.prefferedWorkingHoursPerDay - row.workedHours < 0 ? (
                <td className="center" style={{ color: "red" }}>
                  {(row.prefferedWorkingHoursPerDay - row.workedHours) * -1}
                </td>
              ) : (
                <td className="center">
                  {row.prefferedWorkingHoursPerDay - row.workedHours}
                </td>
              )}
              <td className="center comment">{row.comments}</td>

              <td className="center edit-del">
                <form action="" method="POST">
                  <Link
                    to={"/EditData/" + row._id}
                    role="button"
                    className="edit btn btn-outline-dark btn-sm"
                  >
                    Edit
                  </Link>
                </form>
              </td>
              <td className="center edit-del">
                <button
                  className="btn btn-dark btn-sm"
                  onClick={() => deleteHandler(row._id)}
                  disabled={loading}
                >
                  Del.
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/Newdata" className="btn btn-dark btn-sm log" role="button">
        Add New Data
      </Link>

      <button
        className="btn btn-dark btn-sm log"
        onClick={async () => await getData()}
      >
        Show All
      </button>
      {(auth.userRole === "admin" || auth.userRole === "manager") && (
        <Link className="btn btn-dark btn-sm log" to="/userpage" role="button">
          Manage Users
        </Link>
      )}
      <button
        className="btn btn-dark btn-sm log"
        onClick={logoutHandler}
        disabled={loading}
      >
        Log Out
      </button>
      <Footer className="footer" />
    </div>
  );
};
