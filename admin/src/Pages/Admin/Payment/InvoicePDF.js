import React from "react";

const InvoicePDF = ({ studentInfo, ref }) => {
  return (
    <div className="invoice-container" ref={ref}>
      {/* Your custom invoice design */}
      <h1>Invoice Payment</h1>
      <p>
        Student Name: {studentInfo.firstName} {studentInfo.lastName}
      </p>
      <p>
        Number of Months:{" "}
        {studentInfo.invoicePayment.map((el) => el.numberOfMonth)}
      </p>
      <p>Price: {studentInfo.invoicePayment.map((el) => el.price)} TND</p>
      {/* Add other invoice information as needed */}
    </div>
  );
};

export default InvoicePDF;
