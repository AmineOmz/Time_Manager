<template>
  <div>
      <b-card bg-variant="light" text-variant="dark" border-variant="dark" title="Time Range">
        <center>
        <b-card-text>
          Start: <date-picker format="YYYY-MM-DD HH:mm:ss" valueType="format" v-model="start" type="datetime" :time-picker-options="timeOptions" :lang="lang" :shortcuts="shortcuts"></date-picker>
        </b-card-text>
        <b-card-text>
          End: <date-picker format="YYYY-MM-DD HH:mm:ss" valueType="format" v-model="end" type="datetime" :time-picker-options="timeOptions" :lang=lang :shortcuts="shortcuts"></date-picker>
        </b-card-text>
        </center>
      </b-card>
      <br/>
      <center><b-button v-on:click="update_data">Update le graph</b-button></center>
    <div class="graph" ref="chartdiv"></div>
  </div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import DashboardLayout from '@/pages';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import moment from 'moment';
import DatePicker from 'vue2-datepicker';
import datetime from 'vuejs-datetimepicker';


am4core.useTheme(am4themes_animated);
export default {
  name: 'Dashboard',
  components: {
    DatePicker,
    datetime
  },
  data() {
    return {
      start: null,
      end: null,
      shortcuts: [
      {
        text: 'OK',
        onClick: () => {
          this.start = [new Date()],
          this.end = [new Date()]
          }
      }],
      timeOptions: {
          start: '',
          step: '',
          end: ''
      },
      lang: {
          days: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
          months: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jui', 'Jui', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'],
      }
    }
  },
  mounted() {
    let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);
    chart.data = [];
    // XY
    chart.dateFormatter.dateFormat = "yyyy-MM-dd";
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "hours";
    series.dataFields.dateX = "date";
    series.tooltipText = "{value}";
    series.dataFields.value = "hours";
    series.columns.template.width = am4core.percent(50);
    series.tooltip.pointerOrientation = "vertical";

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.snapToSeries = series;
    chart.cursor.xAxis = dateAxis;
    //chart.scrollbarY = new am4core.Scrollbar();
    chart.scrollbarX = new am4core.Scrollbar();
    this.chart = chart;
    this.update_data();
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  },
  methods: {
      update_data() {
      var token = localStorage.getItem('token')
      var self = this;
      var query = "https://timepool.me:3001/api/workingtimes/user/" +  jwt_decode(token).id
      if (this.start != null && this.end != null) {
          query += `?start=${this.start}&end=${this.end}`;
      }
      axios.get(query, {
      headers: {Authorization: 'Bearer ' + token}
      })
      .then(function(result) {
      var data = result.data;
      var graphData = [];
      var dailyHours = 0;
      var index, obj;

      for (var [index, obj] of data.entries()) {
          var start = moment(obj.start);
          var end = moment(obj.end);
          dailyHours += end.diff(start, 'hours');
          if (data[index+1] == undefined || !(moment(data[index+1].start).isSame(start, 'day'))) {
          graphData.push({
              date: `${start.year().toString()}-${(start.month() + 1).toString()}-${start.date().toString()}`,
              hours: dailyHours
          });
          dailyHours = 0;
          }
      }
      self.chart.data = graphData;
      })
  }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.graph {
  margin: auto;
  width: 90%;
  height: 500px;
}
</style>