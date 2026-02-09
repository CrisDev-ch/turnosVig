import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'calendar',
    loadChildren: () => import('./pages/calendar/calendar.module').then(m => m.CalendarPageModule)
  },
  {
    path: 'day-detail',
    loadChildren: () => import('./pages/day-detail/day-detail.module').then(m => m.DayDetailPageModule)
  },
  {
    path: 'general-calendar',
    loadChildren: () => import('./pages/general-calendar/general-calendar.module').then(m => m.GeneralCalendarPageModule)
  },
  {
    path: 'general-day-detail',
    loadChildren: () => import('./pages/general-day-detail/general-day-detail.module').then(m => m.GeneralDayDetailPageModule)
  },
  {
    path: 'create-event',
    loadChildren: () => import('./pages/create-event/create-event.module').then(m => m.CreateEventPageModule)
  },
  {
    path: 'requests',
    loadChildren: () => import('./pages/requests/requests.module').then(m => m.RequestsPageModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then(m => m.UsersPageModule)
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
