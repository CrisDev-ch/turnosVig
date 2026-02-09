import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DayDetailPageRoutingModule } from './day-detail-routing.module';

import { DayDetailPage } from './day-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DayDetailPageRoutingModule
  ],
  declarations: [DayDetailPage]
})
export class DayDetailPageModule { }
