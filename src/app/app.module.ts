import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { ErrorComponent } from './error/error.component';
import { MathModule } from './math/math.module';

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MathModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
