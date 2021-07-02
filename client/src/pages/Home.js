import React from "react";
import { Footer } from "../components/Footer";

export const Home = () => {
  return (
    <div className="jumbotron centered">
      <div className="container">
        <i className="fas fa-business-time fa-6x"></i>
        <h1 className="display-4">Time Management System</h1>
        <p className="lead">Manage your time cleanly and securely!</p>
        <hr className="my-4" />
        <p className="lead">
          <a className="btn btn-dark log" href="/register" role="button">
            Register
          </a>

          <a className="btn btn-dark log" href="/login" role="button">
            Login
          </a>
        </p>
      </div>
      <Footer />
    </div>
  );
};
