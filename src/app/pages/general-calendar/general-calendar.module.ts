import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GeneralCalendarPageRoutingModule } from './general-calendar-routing.module';

import { GeneralCalendarPage } from './general-calendar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GeneralCalendarPageRoutingModule
  ],
  declarations: [GeneralCalendarPage]
})
export class GeneralCalendarPageModule { }
