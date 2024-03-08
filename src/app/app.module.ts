import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { NthPlainTextPipe } from './nth-plain-text.pipe';
import { HeaderComponent } from './components/header/header.component';
import { StudentDashboardHeaderComponent } from './components/student-header/student-header.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HeaderComponent,
    StudentDashboardHeaderComponent,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
