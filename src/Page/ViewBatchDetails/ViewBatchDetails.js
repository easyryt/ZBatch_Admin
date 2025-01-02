import React from "react";
import { useParams } from "react-router-dom";
import BatchDescription from "./BatchDescription";

function ViewBatchDetails() {
  const { id } = useParams();

  return (
    <div>
      <BatchDescription id={id} />
    </div>
  );
}

export default ViewBatchDetails;
