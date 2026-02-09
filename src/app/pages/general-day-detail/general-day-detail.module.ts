import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GeneralDayDetailPageRoutingModule } from './general-day-detail-routing.module';

import { GeneralDayDetailPage } from './general-day-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GeneralDayDetailPageRoutingModule
  ],
  declarations: [GeneralDayDetailPage]
})
export class GeneralDayDetailPageModule { }
