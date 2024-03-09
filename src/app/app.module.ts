import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { NthPlainTextPipe } from './nth-plain-text.pipe';
import { StudentHeaderComponent } from './components/student-header/student-header.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HeaderComponent,
    StudentHeaderComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
