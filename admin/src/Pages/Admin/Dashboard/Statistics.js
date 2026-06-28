import React, { useState } from "react";
import { DefaultSalesStatistics } from "./DefaultCharts";

const Statistics = () => {
  const [data, setData] = useState("Weekly");
  const today = new Date();
  const currentYear = today.getFullYear();
  return (
    <div className="card">
      <div className="nk-ecwg nk-ecwg8 h-100">
        <div className="card-inner">
          <div className="card-title-group mb-3">
            <div className="card-title">
              <h6 className="title">Sales Statistics</h6>
            </div>
          </div>
          <ul className="nk-ecwg8-legends">
            <li>
              <div className="title">
                <span
                  className="dot dot-lg sq"
                  style={{ background: "#6576ff" }}
                ></span>
                <span>Total Order</span>
              </div>
            </li>
            {/* <li>
              <div className="title">
                <span
                  className="dot dot-lg sq"
                  style={{ background: "#eb6459" }}
                ></span>
                <span>Cancelled Order</span>
              </div>
            </li> */}
          </ul>
          <div className="nk-ecwg8-ck">
            <DefaultSalesStatistics />
          </div>
          <div className="chart-label-group pl-5">
            <div className="chart-label">01 Jan, {currentYear}</div>
            <div className="chart-label">
              31 Dec,
              {currentYear}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Statistics;
