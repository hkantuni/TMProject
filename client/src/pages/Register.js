import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { Footer } from "../components/Footer";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";

export const Register = () => {
  const history = useHistory();
  const message = useMessage();
  const { loading, request, error, clearError } = useHttp();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userRole: "user",
  });

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  const registerHandler = async () => {
    try {
      const data = await request("/api/auth/register", "POST", { ...form });
      history.push("/login");
      message(data.message);
    } catch (e) {}
  };

  return (
    <div className="jumbotron centered jumboregister">
      <form action="/register" method="POST" className="register-form">
        <i className="fas fa-business-time fa-4x" />
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            className="form-control"
            name="firstName"
            onChange={changeHandler}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            className="form-control"
            name="lastName"
            onChange={changeHandler}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            onChange={changeHandler}
          />
        </div>
        <div className="form-group middle">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            onChange={changeHandler}
          />
        </div>
        <div className="form-group lower">
          <a className="btn btn-light vert-align" href="/" role="button">
            Back Home
          </a>
          <button
            type="submit"
            className="btn btn-dark log"
            onClick={registerHandler}
            disabled={loading}
          >
            Submit
          </button>
        </div>
      </form>
      <Footer />
    </div>
  );
};
