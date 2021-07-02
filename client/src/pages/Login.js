import React, { useContext, useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import { AuthContext } from "../context/AuthContext";
import { useHistory } from "react-router-dom";
import { API_URL } from "../App";

export const Login = () => {
  const auth = useContext(AuthContext);
  const message = useMessage();
  const history = useHistory();
  const { loading, request, error, clearError } = useHttp();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  const loginHandler = async () => {
    try {
      const data = await request(API_URL + "/api/auth/login", "POST", {
        ...form,
      });
      auth.login(data.token, data.userId, data.userRole);
      history.push("/");
    } catch (e) {}
  };

  return (
    <div className="jumbotron centered">
      <form action="/login" method="POST" className="login-form">
        <i className="fas fa-business-time fa-4x" />

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
            onClick={loginHandler}
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
