import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { Footer } from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import { API_URL } from "../App";

export const Userpage = () => {
  const [userData, setUserData] = useState([]);
  const { loading, request, error, clearError } = useHttp();
  const history = useHistory();
  const message = useMessage();
  const auth = useContext(AuthContext);
  const [emailFilter, setEmailFilter] = useState();

  const getData = useCallback(
    async (filter) => {
      let url = API_URL + "/api/user/userpage?";

      if (filter && filter.filterByEmail) {
        url += "email=" + filter.email;
      }
      try {
        const user = await request(url, "GET", null, {
          Authorization: "Bearer " + auth.token,
        });
        setUserData(user);
        console.log("filter", url);
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

  const handleEmailFilter = async () => {
    await getData({
      filterByEmail: true,
      email: emailFilter,
    });
  };

  const logoutHandler = (event) => {
    event.preventDefault();
    auth.logout();
    history.push("home");
  };

  const deleteHandler = async (recordId) => {
    await fetch(API_URL + "/api/user/userpage/" + recordId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + auth.token,
      },
    });
    await getData();
  };

  return (
    <div className="timepage-container auserpage">
      <i className="fas fa-business-time fa-3x timepage-image"></i>
      <h1 className="display-3 tp">Time Management System</h1>

      <hr className="my-4" />
      <p className="lead"></p>
      <div style={{ paddingBottom: "10px" }}>
        {(auth.userRole === "admin" || auth.userRole === "manager") && (
          <>
            <li
              style={{
                listStyleType: "none",
                display: "inline-block",
                marginLeft: "10px",
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
          </>
        )}
      </div>

      <table className="table table-sm">
        <thead className="thead-dark">
          <tr>
            <th scope="col" className="center thead-font">
              Email
            </th>
            <th scope="col" className="center thead-font">
              First Name
            </th>
            <th scope="col" className="center thead-font">
              Last Name
            </th>
            <th scope="col" className="center thead-font">
              Role
            </th>
            <th scope="col" className="center">
              Edit
            </th>
            <th scope="col" className="center">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          {userData.map((row) => (
            <tr key={row._id}>
              <td className="center ">{row.email}</td>
              <td className="center ">{row.firstName}</td>
              <td className="center ">{row.lastName}</td>
              <td className="center ">{row.role}</td>
              <td className="center edit-del">
                <form action="" method="POST">
                  <Link
                    to={"/Edituser/" + row._id}
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

      <button
        className="btn btn-dark btn-sm log"
        onClick={async () => await getData()}
      >
        Show All
      </button>

      <Link className="btn btn-dark btn-sm log" to="/" role="button">
        Back
      </Link>
      <button
        className="btn btn-dark btn-sm log"
        onClick={logoutHandler}
        disabled={loading}
      >
        Log Out
      </button>
      <Footer />
    </div>
  );
};
