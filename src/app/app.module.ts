import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { Observable } from 'rxjs';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

import {
  IMqttMessage,
  MqttModule,
  IMqttServiceOptions
} from 'ngx-mqtt';

import { DataService } from './services/data.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'sever.dev.ns0.it',
  port: 9001,
  path: '/mqtt',
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS)
  ],
  providers: [
    OneSignal,
    AndroidPermissions,
    Geolocation,
    NativeGeocoder,
    Diagnostic,
    LocalNotifications,
    DataService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})

export class AppModule { }
