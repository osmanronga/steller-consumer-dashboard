<template>
  <b-card title="Sales Statistics">
    <apexchart
      type="area"
      height="350"
      :options="chartOptions"
      :series="series"
    />
  </b-card>
</template>

<script>
import { BCard } from "bootstrap-vue";
import VueApexCharts from "vue-apexcharts";

export default {
  name: "SalesChart",
  components: {
    BCard,
    apexchart: VueApexCharts,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  computed: {
    series() {
      return [
        {
          name: "Sales",
          data: this.data.map((item) => ({
            x: new Date(item.date).getTime(),
            y: item.amount,
          })),
        },
      ];
    },
    chartOptions() {
      return {
        chart: {
          type: "area",
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
          width: 2,
        },
        xaxis: {
          type: "datetime",
        },
        yaxis: {
          labels: {
            formatter: (value) => `$${value.toFixed(2)}`,
          },
        },
        tooltip: {
          x: {
            format: "dd MMM yyyy",
          },
          y: {
            formatter: (value) => `$${value.toFixed(2)}`,
          },
        },
        colors: ["#7367f0"],
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.2,
            stops: [0, 90, 100],
          },
        },
      };
    },
  },
};
</script>
