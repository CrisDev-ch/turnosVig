import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GeneralDayDetailPage } from './general-day-detail.page';

const routes: Routes = [
  {
    path: '',
    component: GeneralDayDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralDayDetailPageRoutingModule { }
