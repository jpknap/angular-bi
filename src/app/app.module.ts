import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ChartsModule } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { WavesModule, TableModule, IconsModule, MDBBootstrapModule } from 'angular-bootstrap-md';
import { LinealchartComponent } from './component/linealchart/linealchart.component';
import { TableComponent } from './component/table/table.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    DashboardComponent,
    LinealchartComponent,
    TableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    WavesModule,
    TableModule,
    IconsModule,
    MDBBootstrapModule.forRoot(),
    FontAwesomeModule,
  ],
  exports: [LinealchartComponent],
  providers: [],
  bootstrap: [DashboardComponent]
})
export class AppModule { }
