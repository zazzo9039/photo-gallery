import { Component, OnDestroy, OnInit } from '@angular/core';
import { ELocalNotificationTriggerUnit, ILocalNotification, LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { DataService } from './services/data.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  public message: string;


  scheduled = [];
  id = 0;
  device = {}

  constructor(
    private oneSignal: OneSignal,
    private diagnostic: Diagnostic,
    private _mqttService: MqttService,
    private dataService: DataService,
    private plt: Platform,
    private localNotifications: LocalNotifications,
    private alertCtrl: AlertController,
    private permission: AndroidPermissions,

  ) {
    this.plt.ready().then(() => {


      this.localNotifications.on('click').subscribe(res => {
        let msg = res.data ? res.data.mydata : '';
        this.showAlert(res.title, res.text, msg);
      });

      this.localNotifications.on('trigger').subscribe(res => {
        let msg = res.data ? res.data.mydata : '';
        //this.showAlert(res.title, res.text, msg);
      });
    });

    

    /*     this.subscription = this._mqttService.observe('my/topic2').subscribe((message: IMqttMessage) => {
    
          this.message = message.payload.toString();
          console.log(this.message);
    
          this.dataService.message.next(this.message)
          if (this.message != 'tab1' && this.message != '') {
            this.scheduleNotification()
          }
        }); */


    this.subscription = this._mqttService.observe('my/topic').subscribe((message: IMqttMessage) => {

      this.message = message.payload.toString();
      console.log(this.message);

      this.dataService.message.next(this.message)
      if (this.message != 'tab1' && this.message != '') {
        this.scheduleNotification()
      }
    });

    this.reqPermAndroid()
    this.loadOneSignal()
  }

  ngOnInit(): void {
    setInterval(() => {
      this.unsafePublish('my/topic_data', 'device')
    }, 5000);
  }

  unsafePublish(topic: string, message: string): void {
    this._mqttService.unsafePublish(topic, message, { qos: 2, retain: false });
  }

  scheduleNotification() {
    this.localNotifications.schedule({
      id: this.id++,
      title: 'Nome Cognome',
      text: this.message,
      icon: 'https://png.pngtree.com/element_our/20190602/ourlarge/pngtree-attention-security-alert-illustration-image_1416998.jpg',
      data: { mydata: 'My hidden message this is' },
      //      trigger: { in: 5, unit: ELocalNotificationTriggerUnit.SECOND },
      trigger: { at: new Date(new Date().getTime() + 0 * 1000) },
      sound: "file://bell.mp3",
      foreground: false // Show the notification while app is open
    });

    // Works as well!
    // this.localNotifications.schedule({
    //   id: 1,
    //   title: 'Attention',
    //   text: 'Simons Notification',
    //   data: { mydata: 'My hidden message this is' },
    //   trigger: { at: new Date(new Date().getTime() + 5 * 1000) }
    // });
  }

  recurringNotification() {
    this.localNotifications.schedule({
      id: 22,
      title: 'Recurring',
      text: 'Simons Recurring Notification',
      trigger: { every: ELocalNotificationTriggerUnit.MINUTE }
    });
  }

  repeatingDaily() {
    this.localNotifications.schedule({
      id: 42,
      title: 'Good Morning',
      text: 'Code something epic today!',
      trigger: { every: { hour: 9, minute: 30 } }
    });
  }

  showAlert(header, sub, msg) {
    this.alertCtrl.create({
      header: header,
      subHeader: sub,
      message: msg,
      buttons: ['Ok']
    }).then(alert => alert.present());
  }

  getAll() {
    this.localNotifications.getAll().then((res: ILocalNotification[]) => {
      this.scheduled = res;
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  reqPermAndroid() {
    this.permission.checkPermission(this.permission.PERMISSION.RECEIVE_BOOT_COMPLETED).then(
      result => {
        console.log('RECEIVE_BOOT_COMPLETED Has permission?', result.hasPermission)
        this.permission.requestPermission(this.permission.PERMISSION.RECEIVE_BOOT_COMPLETED).then(a => {
          console.log('res1', a);

        }).catch(e => {
          console.log('err', e);

        })
      }
    )
    this.permission.checkPermission(this.permission.PERMISSION.CAMERA).then(
      result => {
        console.log('CAMERA Has permission?', result.hasPermission)
        this.permission.requestPermission(this.permission.PERMISSION.CAMERA).then(a => {
          console.log('res1', a);

        }).catch(e => {
          console.log('err', e);

        })
      }
    )
    this.permission.checkPermission(this.permission.PERMISSION.CALL_PHONE).then(
      result => {
        console.log('CALL_PHONE Has permission?', result.hasPermission)
        this.permission.requestPermission(this.permission.PERMISSION.CALL_PHONE).then(a => {
          console.log('res1', a);

        }).catch(e => {
          console.log('err', e);

        })
      }
    );
    this.permission.checkPermission(this.permission.PERMISSION.GET_ACCOUNTS).then(
      result => {
        console.log('GET_ACCOUNTS Has permission?', result.hasPermission)
        this.permission.requestPermission(this.permission.PERMISSION.GET_ACCOUNTS).then(a => {
          console.log('res1', a);

        }).catch(e => {
          console.log('err', e);

        })
      }
    );
    this.permission.checkPermission(this.permission.PERMISSION.READ_EXTERNAL_STORAGE).then(
      result => {
        console.log('READ_EXTERNAL_STORAGE Has permission?', result.hasPermission)
        this.permission.requestPermission(this.permission.PERMISSION.READ_EXTERNAL_STORAGE).then(a => {
          console.log('res1', a);

        }).catch(e => {
          console.log('err', e);

        })
      }
    );
    this.permission.checkPermission(this.permission.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
      result => {
        console.log('WRITE_EXTERNAL_STORAGE Has permission?', result.hasPermission)
        this.permission.requestPermission(this.permission.PERMISSION.WRITE_EXTERNAL_STORAGE).then(a => {
          console.log('res1', a);

        }).catch(e => {
          console.log('err', e);

        })
      }
    );



    let successCallback = (isAvailable) => {
      console.log('Is available? ' + isAvailable);
    }
    let errorCallback = (e) => console.log(e);
    console.log(this.diagnostic);
    this.diagnostic.requestBluetoothAuthorization().then((e) => {
      console.log('requestBluetoothAuthorization', e);
    }).catch((e) => {
      console.log(e);
    })

    this.diagnostic.isLocationAuthorized().then((e) => {
      console.log('isLocationAuthorized', e);
    }).catch((e) => {
      console.log(e);
    })

    this.diagnostic.isLocationAvailable().then((e) => {
      console.log('isLocationAvailable', e);
    }).catch((e) => {
      console.log(e);
    })
    this.diagnostic.isLocationEnabled().then((e) => {
      console.log('isLocationEnabled', e);
    }).catch((e) => {
      console.log(e);
    })

    this.diagnostic.isGpsLocationAvailable().then((e) => {
      console.log('isGpsLocationAvailable', e);
    }).catch((e) => {
      console.log(e);
    })
    this.diagnostic.isGpsLocationEnabled().then((e) => {
      console.log('isGpsLocationEnabled', e);
    }).catch((e) => {
      console.log(e);
    })

    this.diagnostic.isBluetoothAvailable().then(successCallback, errorCallback);

    this.diagnostic.isNFCPresent().then(successCallback, errorCallback);
    this.diagnostic.isNFCEnabled().then(successCallback, errorCallback);
    this.diagnostic.isNFCAvailable().then(successCallback, errorCallback);
    this.diagnostic.isDeviceRooted().then(successCallback, errorCallback);

    //this.diagnostic.switchToNFCSettings()

    this.diagnostic.isCameraAvailable().then((e) => {
      console.log(e);
    }).catch((e) => {
      console.log(e);
    })

    this.diagnostic.getBluetoothState()
      .then((state) => {
        if (state == this.diagnostic.bluetoothState.POWERED_ON) {
          // do something
          console.log('bluetoothState', state);
        } else {
          // do something else
          console.log('no bluetoothState', state);

        }
      }).catch(e => console.error(e));


    this.diagnostic.getLocationAccuracyAuthorization()
      .then((state) => {
        if (state) {
          // do something
          console.log('locationState', state, this.diagnostic.locationAuthorizationMode);

        } else {
          // do something else
          console.log('locationState', state, this.diagnostic.locationAuthorizationMode);
        }
      }).catch(e => console.error(e));


    this.diagnostic.getLocationAuthorizationStatus()
      .then((state) => {
        console.log('state', state);

        if (state == this.diagnostic.locationMode.LOCATION_OFF) {
          // do something
          console.log('locationState', state);

        } else {
          // do something else
          console.log('no locationState', state);
        }
      }).catch(e => console.error(e));



  }

  loadOneSignal(){
    if (this.plt.is('cordova')) {
      console.log('cordova platform');
      setTimeout(async () => {
        await this.oneSignal.startInit(environment.onesignal.appId, environment.onesignal.googleProjectNumber);
        this.oneSignal.getIds().then((data: any) => {
          console.log('iddddd', data);
          localStorage.setItem('fcm', data.userId);
          const uid = localStorage.getItem('uid');
          console.log('localStorage', localStorage.getItem('fcm'), uid);
          
          if (uid && uid !== null && uid !== 'null') {
            const param = {
              id: uid,
              fcm_token: data.userId
            }; 
            console.log('users/edit_profile');
            /* this.api.post('users/edit_profile', param).then((data: any) => {
              console.log('user info=>', data);
            }, error => {
              console.log(error);
            }); */
          } 
        }).catch((err)=>{
          console.log(err);
          
        })
        this.oneSignal.enableSound(true);
        await this.oneSignal.endInit();

      }, 1000);
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
    }
  }

}
