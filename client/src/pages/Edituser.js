import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../App";

export const Edituser = () => {
  const auth = useContext(AuthContext);
  const { id } = useParams();
  const history = useHistory();

  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      if (ignore) {
        return;
      }

      try {
        setLoading(true);
        setError(undefined);
        const response = await fetch(API_URL + "/api/user/editusers/" + id, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
        });
        const responseData = await response.json();
        console.log("bbb", responseData);
        setUser(responseData[0]);
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
    // To prevent form from reloading
    e.preventDefault();

    // Send an update request
    await fetch(API_URL + "/api/user/edituser/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + auth.token,
      },
      body: JSON.stringify(user),
    });
    history.push("/userpage");
  };

  return (
    <div className="jumbotron centered jumboform">
      {error && <p>{error.message}</p>}
      <h1 className="form-header">Please update info you want to edit</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="First Name">First Name</label>
          <input
            type="text"
            value={user ? user.firstName : ""}
            onChange={(e) => {
              setUser({ ...user, firstName: e.target.value });
            }}
            className=" form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="Last Name">Last Name</label>
          <input
            type="text"
            value={user ? user.lastName : ""}
            onChange={(e) => {
              setUser({ ...user, lastName: e.target.value });
            }}
            className=" form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="email "
            value={user ? user.email : ""}
            onChange={(e) => {
              setUser({ ...user, email: e.target.value });
            }}
            className=" form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role</label>

          <select
            id="role"
            className="form-control"
            value={user ? user.role : ""}
            onChange={(e) => {
              setUser({ ...user, role: e.target.value });
            }}
          >
            {auth.userRole === "admin" && <option>manager</option>}
            <option>user</option>
          </select>
        </div>
        <Link to="/userpage" className="btn btn-dark" role="button">
          Back
        </Link>
        {/* <input type="hidden" value="<%=users[0]._id%>" name="userID" /> */}
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
