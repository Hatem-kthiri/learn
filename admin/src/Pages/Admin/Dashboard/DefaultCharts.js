import { useEffect, useState } from "react";
// import { salesStatisticsSet3 } from "./DefaultData";
import { Line } from "react-chartjs-2";
import api from "../../../utils/api";

export const DefaultSalesStatistics = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const getStudent = () => {
    api
      .get(`/api/admin/getStudents`)
      .then((res) => {
        setStudents(res.data.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getStudent();
  }, []);

  function extractInvoicePayments(data) {
    const monthlyPayments = {};

    data.forEach((user) => {
      user.invoicePayment?.forEach((payment) => {
        const month = new Date(payment.paymentDate).getMonth();
        const amount = parseInt(payment.price) || 0;

        if (!monthlyPayments[month]) {
          monthlyPayments[month] = amount;
        } else {
          monthlyPayments[month] += amount;
        }
      });
    });

    const monthlySums = new Array(12).fill(0);
    Object.entries(monthlyPayments).forEach(([month, amount]) => {
      monthlySums[month] = amount;
    });
    return monthlySums;
  }
  var salesStatisticsSet3 = {
    labels: generateLabels(),
    dataUnit: "TND",
    datasets: [
      {
        label: "Total payment",
        color: "#9d72ff",
        borderWidth: 2,
        borderColor: "#9d72ff",
        fill: true,
        dash: 0,
        pointRadius: 0,
        lineTension: 0.4,
        backgroundColor: "rgba(157, 114, 255, 0.15)",
        pointBorderColor: "transparent",
        pointBackgroundColor: "transparent",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#9d72ff",
        pointBorderWidth: 2,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 2,
        pointHitRadius: 4,
        data: extractInvoicePayments(students),
      },
      // {
      //   label: "Canceled orders",
      //   color: "#eb6459",
      //   borderWidth: 2,
      //   borderColor: "#eb6459",
      //   borderDash: [5],
      //   pointRadius: 0,
      //   backgroundColor: "transparent",
      //   pointBorderColor: "transparent",
      //   pointBackgroundColor: "transparent",
      //   pointHoverBackgroundColor: "#fff",
      //   pointHoverBorderColor: "#eb6459",
      //   pointBorderWidth: 2,
      //   pointHoverRadius: 4,
      //   pointHoverBorderWidth: 2,
      //   pointHitRadius: 4,
      //   data: [
      //     120, 50, 510, 280, 600, 670, 260, 230, 890, 1730, 2090, 1550, 1000,
      //     1800, 950, 850, 950, 450, 900, 0, 200, 500, 950, 1950, 1300, 1200, 1250,
      //     250, 2950, 750,
      //   ],
      // },
    ],
  };
  function generateLabels() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const labels = [];

    for (let i = 0; i < today.getMonth() + 1; i++) {
      labels.push(`${months[i]} ${currentYear}`);
    }

    return labels;
  }

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <Line
          className="ecommerce-line-s4"
          data={salesStatisticsSet3}
          options={{
            legend: {
              display: false,
            },
            maintainAspectRatio: false,
            tooltips: {
              enabled: true,
              callbacks: {
                title: function (tooltipItem, data) {
                  return data["labels"][tooltipItem[0]["index"]];
                },
                label: function (tooltipItem, data) {
                  return data.datasets[tooltipItem.datasetIndex]["data"][
                    tooltipItem["index"]
                  ];
                },
              },
              backgroundColor: "#1c2b46",
              titleFontSize: 13,
              titleFontColor: "#fff",
              titleMarginBottom: 6,
              bodyFontColor: "#fff",
              bodyFontSize: 12,
              bodySpacing: 4,
              yPadding: 10,
              xPadding: 10,
              footerMarginTop: 0,
              displayColors: false,
            },
            scales: {
              yAxes: [
                {
                  display: true,
                  //stacked: _get_data.stacked ? _get_data.stacked : false,
                  //position: NioApp.State.isRTL ? "right" : "left",
                  ticks: {
                    beginAtZero: true,
                    fontSize: 11,
                    fontColor: "#9eaecf",
                    padding: 10,
                    callback: function (value, index, values) {
                      return value + " TND";
                    },
                    min: 0,
                    stepSize: 3000,
                  },
                  gridLines: {
                    color: "rgba(82, 100, 132, 0.2)",
                    tickMarkLength: 0,
                    zeroLineColor: "rgba(82, 100, 132, 0.2)",
                  },
                },
              ],
              xAxes: [
                {
                  display: false,
                  //stacked: _get_data.stacked ? _get_data.stacked : false,
                  ticks: {
                    fontSize: 9,
                    fontColor: "#9eaecf",
                    source: "auto",
                    padding: 10,
                    //reverse: NioApp.State.isRTL,
                  },
                  gridLines: {
                    color: "transparent",
                    tickMarkLength: 0,
                    zeroLineColor: "transparent",
                  },
                },
              ],
            },
          }}
        />
      )}
    </>
  );
};
