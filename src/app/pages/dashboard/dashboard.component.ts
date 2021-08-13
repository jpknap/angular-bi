import { Component, OnInit, ViewChild } from '@angular/core';
import { LinealchartComponent } from 'src/app/component/linealchart/linealchart.component';
import * as XLSX from 'xlsx';
import SampleJson from '../../../assets/xlsxtojson.json'

@Component({

  selector: 'app-root',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],

})

export class DashboardComponent implements OnInit {
  title: string = 'dashboard';
  public chart: any = null;
  public data_source = [];
  public enterprises_source = [];
  willDownload: boolean = false;
  storage_json: object = {};
  public tableValues = []
  public enterprises = []

  @ViewChild(LinealchartComponent ) child: LinealchartComponent ; 

  elements: any = [];

  ngOnInit() {
    this.storage_json =  SampleJson
    this.loadChart()

  }


  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name, index) => {
        const sheet = workBook.Sheets[name];
        const name_translate: string = index == 0 ? 'sales' : 'name'
        sheet.A1 = { t: 's', v: "total_sale" }
        sheet.B1 = { t: 's', v: "unix_time" }
        sheet.C1 = { t: 's', v: "enterprise" }
        initial[name_translate] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      this.storage_json = jsonData;
      const dataString = JSON.stringify(jsonData);
      this.loadChart()
    }
    reader.readAsBinaryString(file);

  }

  setDownload(data) {
    this.willDownload = true;
    setTimeout(() => {
      const el = document.querySelector("#download");
      el.setAttribute("href", `data:text/json;charset=utf-8,${encodeURIComponent(data)}`);
      el.setAttribute("download", 'xlsxtojson.json');
    }, 1000)

  }

  transformSalesGroupBy(sales) {
    const result = Object.entries(sales.reduce((acc, { total_sale, unix_time, enterprise }) => {
      acc[enterprise] = (acc[enterprise] || []);
      acc[enterprise].push({ total_sale, unix_time });
      return acc;
    }, {})).map(([key, value]) => ({ enterprise: key, value }));
    return result
  }

  getMinMaxUnixTime(sales) {
    const sales_aux = sales;
    sales_aux.sort((i, j) => (i.unix_time > j.unix_time) ? 1 : ((i.unix_time > j.unix_time) ? -1 : 0));
    return {
      min_date: sales_aux[0].unix_time,
      max_date: sales_aux[sales_aux.length - 1].unix_time
    }
  }

  translateUnixTime(unixTime) {
    return new Date(unixTime * 1000)
  }

  getFirstWeek(date: Date): Date {
    const diff: number = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
    const date_monday: Date = new Date(date.setDate(diff))
    date_monday.setHours(0, 0, 0, 0)
    return date_monday;
  }

  getWeeks(date_first_week, date_last_week): Array<object> {
    let date_week = date_first_week;
    let list_weeks = []
    while (date_week <= date_last_week) {
      const week_obj = { date_start: null, date_end: null, date_start_unix: null, date_end_unix: null, sales: [] }
      week_obj.date_start = new Date(date_week);
      week_obj.date_end = this.getEndDayWeek(date_week)
      week_obj.date_start_unix = week_obj.date_start.getTime() / 1000
      week_obj.date_end_unix = week_obj.date_end.getTime() / 1000
      list_weeks.push(week_obj)
      date_week = new Date(date_week.setDate(date_week.getDate() + 1))

    }
    return list_weeks
  }

  getEndDayWeek(dateMonday) {
    return new Date(new Date(dateMonday.setDate(dateMonday.getDate() + 6)).setHours(23, 59, 59, 999))

  }

  isEnterpriseInclude(sales, enterprise_id) {
    let inArray = false
    sales.forEach(element => {
      if (element['enterprise'] == enterprise_id) {
        inArray = true
        return
      }
    });
    return inArray
  }

  sumSalesforEnterprise(sales) {
    const sales_reduce = []
    sales.forEach(item => {
      if (!this.isEnterpriseInclude(sales_reduce, item['enterprise'])) {
        const entreprise = sales.filter(element => element['enterprise'] === item['enterprise'])
        const sales_tranform = {}
        const total_sale = entreprise.reduce((acc, element) => {
          const sale_element = Number.parseInt(element['total_sale'])
          return sale_element + acc
        }, 0)
        sales_reduce.push({
          'enterprise': item['enterprise'],
          'total_sale': total_sale
        })
      }
    });
    return sales_reduce
  }
  getGenerateTable(weeks) {
    const aux_weeks = JSON.parse(JSON.stringify(weeks))
    aux_weeks.map((item) => {
      item.sales = this.sumSalesforEnterprise(item['sales'])
      return item
    })
    return aux_weeks
  }

  createChart() { }

  loadChart(){
    const enterprises = this.transformSalesGroupBy(this.storage_json['sales']);
    const dates_range = this.getMinMaxUnixTime(this.storage_json['sales'])
    const date_min = this.translateUnixTime(dates_range.min_date)
    const date_max = this.translateUnixTime(dates_range.max_date)
    const date_first_week = this.getFirstWeek(date_min)
    const date_last_week = this.getFirstWeek(date_max)
    const arrayWeeks = this.getWeeks(date_first_week, date_last_week);
   
   
    let aux_sales = this.storage_json['sales']

    arrayWeeks.map(element => {
      aux_sales.forEach(item => {
        if (element['date_start_unix'] <= item.unix_time && item.unix_time <= element['date_end_unix']) {
          element['sales'].push(item)
          aux_sales = aux_sales.filter(function (value) {
            return value != item;
          });
        }
      });
      return element
    });

    const array_enterprises = []
    enterprises.forEach(element => {
      array_enterprises.push(element['enterprise'])
    })

    this.tableValues = this.getGenerateTable(arrayWeeks)
    this.enterprises_source = [...array_enterprises]
    this.data_source = [...this.tableValues]
    this.enterprises = enterprises


  }
  

  onClick() {
    const enterprises = this.transformSalesGroupBy(this.storage_json['sales']);
    const dates_range = this.getMinMaxUnixTime(this.storage_json['sales'])
    const date_min = this.translateUnixTime(dates_range.min_date)
    const date_max = this.translateUnixTime(dates_range.max_date)
    const date_first_week = this.getFirstWeek(date_min)
    const date_last_week = this.getFirstWeek(date_max)
    const arrayWeeks = this.getWeeks(date_first_week, date_last_week);
   
   
    let aux_sales = this.storage_json['sales']

    arrayWeeks.map(element => {
      aux_sales.forEach(item => {
        if (element['date_start_unix'] <= item.unix_time && item.unix_time <= element['date_end_unix']) {
          element['sales'].push(item)
          aux_sales = aux_sales.filter(function (value) {
            return value != item;
          });
        }
      });
      return element
    });
    const array_enterprises = []
    enterprises.forEach(element => {
      array_enterprises.push(element['enterprise'])
    })
    this.tableValues = this.getGenerateTable(arrayWeeks)
    this.enterprises = array_enterprises
    this.child.reloadChart(enterprises,this.tableValues);
  }

}