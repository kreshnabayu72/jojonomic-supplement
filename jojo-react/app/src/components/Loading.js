import React from "react";

const Loading = ({ isLoading }) => {
  if (isLoading) {
    return <h1>LOADING...</h1>;
  }
};

export default Loading;
