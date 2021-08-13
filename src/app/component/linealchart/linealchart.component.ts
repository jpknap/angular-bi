import { Component, Input, OnInit } from '@angular/core';

import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-linealchart',
  templateUrl: './linealchart.component.html',
  styles: [
  ]
})
export class LinealchartComponent implements OnInit {

  @Input("enterprises") enterprises;
  @Input("tableValues") tableValues;
  public primaryXAxis: Object;
  public chartData: Object[];
  public title: string;
  public primaryYAxis: Object;
  constructor() { }


  ngOnInit(): void {
    this.primaryXAxis = {
      title: 'Countries',
      valueType: 'Category',
      labelIntersectAction: 'Hide'
   };
   this.primaryYAxis = {
      minimum: 0, maximum: 80, interval: 10,
      title: 'People(in millions)'
   };
   this.title = 'Internet Users';
  }

  ngOnChanges() {
    this.reloadChart(this.enterprises,this.tableValues)
  }
  public lineChartData: ChartDataSets[] = [
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions) = {
    responsive: false,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line' as ChartType;
  public lineChartPlugins = [];

  reloadChart(enterprises,tableValues){
    const array_enterprises = []
    enterprises.forEach(element => {
      array_enterprises.push(element['enterprise'])
    })
   
    const lineChartData = [];
    array_enterprises.forEach(enterprise_id => {
      const data = []
      const label = ""+enterprise_id
      tableValues.forEach(item => {
        let value = 0
        if(Array.isArray(item['sales'])){
         item['sales'].forEach(element => {
           if (element['enterprise'] == enterprise_id){
            value = element['total_sale']
           }
         });
        }
        data.push(value)
      });      
      lineChartData.push({data, label})
    });
    this.lineChartData = lineChartData;
    const labels = []
    tableValues.forEach((element, index) => {
      labels.push(""+index);
    });
    this.lineChartLabels = labels;
  }

}
