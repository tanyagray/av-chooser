import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DeviceChooserComponent } from './device-chooser/device-chooser.component';
import { AvSelectorComponent } from './av-selector/av-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    DeviceChooserComponent,
    AvSelectorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
