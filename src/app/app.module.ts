import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NthPlainTextPipe } from './nth-plain-text.pipe';
import { HeaderComponent } from './components/header/header.component';
import { StudentDashboardHeaderComponent } from './components/student-header/student-header.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HeaderComponent,
    StudentDashboardHeaderComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
