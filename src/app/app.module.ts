import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { NthPlainTextPipe } from './nth-plain-text.pipe';
import { StudentHeaderComponent } from './components/student-header/student-header.component';

import { BarService } from './services/problem-generation/problem-generation.service';

function initializeBarService(barService: BarService) {
  console.log('HELLO FROM APP_INITIALIZER');
  return (): Promise<void> => barService.initializeFunctionRegistry();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HeaderComponent,
    StudentHeaderComponent,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeBarService,
      deps: [BarService],
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
