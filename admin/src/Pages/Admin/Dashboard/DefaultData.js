export var salesStatisticsSet3 = {
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
      data: [
        5710, 2820, 3810, 8480, 5300, 1670, 8660, 8830, 5590, 2730, 3790, 5950,
      ],
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
