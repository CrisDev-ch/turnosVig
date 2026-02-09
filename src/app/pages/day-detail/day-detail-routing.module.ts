import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DayDetailPage } from './day-detail.page';

const routes: Routes = [
  {
    path: '',
    component: DayDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DayDetailPageRoutingModule { }
