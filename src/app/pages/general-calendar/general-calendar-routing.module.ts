import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GeneralCalendarPage } from './general-calendar.page';

const routes: Routes = [
  {
    path: '',
    component: GeneralCalendarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralCalendarPageRoutingModule { }
