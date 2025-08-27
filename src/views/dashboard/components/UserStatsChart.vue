<template>
  <b-card title="User Statistics">
    <apexchart
      type="donut"
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
  name: "UserStatsChart",
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
      return this.data.map((item) => item.value);
    },
    chartOptions() {
      return {
        labels: this.data.map((item) => item.label),
        colors: ["#7367f0", "#28c76f"],
        legend: {
          show: true,
          position: "bottom",
        },
        plotOptions: {
          pie: {
            donut: {
              size: "70%",
              labels: {
                show: true,
                name: {
                  show: true,
                },
                value: {
                  show: true,
                  formatter: (val) => val,
                },
                total: {
                  show: true,
                  label: "Total Users",
                  formatter: (w) =>
                    w.globals.seriesTotals.reduce((a, b) => a + b, 0),
                },
              },
            },
          },
        },
      };
    },
  },
};
</script>
