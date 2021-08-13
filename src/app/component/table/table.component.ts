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
    const aux_header = ['#','Fechas',...aux_enterprises]
    this.data.forEach((element, index) => {
      let obj = {}
      let  acc = 0
      let items = []
      aux_header.forEach((item) => {
        if(item === '#') {
          obj['id'] = index;
        }
        else if(item === 'Fechas') {
          const dateStart = new Date(element.date_start)
          const dateEnd = new Date(element.date_end)
          obj['date'] = `${dateStart.getDate() + "/"+ (dateStart.getMonth()+1)+ "/" +dateStart.getFullYear()} - ${dateEnd.getDate() + "/"+ (dateEnd.getMonth()+1)+ "/" +dateEnd.getFullYear()}`;
        }
        else{
          let assignated = false;
          element.sales.forEach(i => {
            if(item =="i"+i.enterprise)  {
              obj[item] = i.total_sale
              items.push(i.total_sale)
              acc+= i.total_sale
              assignated = true
              return
            }         
          });
          if(!assignated){
            items.push(0)
            obj[item] = 0
          }
        }
      });
      obj['total'] = acc
      obj['items'] = items
      aux_elements.push(obj);
    });
    this.elements = aux_elements
    }  
  elements: any = [];
  headElements = [];

}