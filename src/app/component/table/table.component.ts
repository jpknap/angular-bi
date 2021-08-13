import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styles: [
  ]
})
export class TableComponent implements OnInit, OnChanges{

  @Input('data') data: any ;
  @Input('enterprises') enterprises: any ;
  faCoffee = faCoffee 
  
  ngOnInit() {
  }
  ngOnChanges() {
    const aux_enterprises = []
    this.enterprises.forEach(element => {
      aux_enterprises.push("i"+element)
    });
    this.headElements = ['#','Fechas',...aux_enterprises, 'Total']
    const aux_elements = []
    this.data.forEach((element, index) => {
      let obj = {}
      let  acc = 0
      this.headElements.forEach((item) => {
        if(item === '#') {
          obj['id'] = index;
        }
        else if(item === 'Fechas') {
          const dateStart = new Date(element.date_start)
          const dateEnd = new Date(element.date_end)
          obj['date'] = `${dateStart.getDate() + "/"+ dateStart.getMonth()+ "/" +dateStart.getFullYear()} - ${dateEnd.getDate() + "/"+ dateEnd.getMonth()+ "/" +dateEnd.getFullYear()}`;
        }
        else{
          let assignated = false;
          element.sales.forEach(i => {
            if(item =="i"+i.enterprise)  {
              obj[item] = i.total_sale
              acc+= i.total_sale
              assignated = true
              return
            }         
          });
          if(!assignated){
            obj[item] = 0
          }
        }
      });
      obj['total'] = acc
      aux_elements.push(obj);
    });
    this.elements = aux_elements
    }  
  elements: any = [];
  headElements = [];

}