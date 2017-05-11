import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'device-chooser',
  templateUrl: './device-chooser.component.html',
  styleUrls: ['./device-chooser.component.scss'],
  inputs: ['kind', 'okayStatus', 'notOkayStatus'],
  outputs: ['okayStatus', 'notOkayStatus', 'selectedDeviceLabel']
})
export class DeviceChooserComponent implements OnInit {

  public kind: string;
  public okayStatus: string = "Success with";
  public notOkayStatus: string = "No success with";

  public selectedDeviceLabel: string = '';

  public defaultDevice: MediaDeviceInfo;
  public devices: MediaDeviceInfo[];
  public selectedDevice: Subject<MediaDeviceInfo>;
  


  ngOnInit() {
    
  }


  constructor() { 

    this.selectedDevice = new Subject();
    this.devices = [];

    Observable.fromPromise( navigator.mediaDevices.enumerateDevices() )
      .subscribe( devices => this.processDevices(devices) );

      // to array
      // filter audio inputs
      // do

    this.selectedDevice
      .subscribe( device => this.selectedDeviceChanged( device ) );

  }


  processDevices( allDevices ){

    this.devices = allDevices.filter( device => device.kind == this.kind );
    this.selectDefaultDevice();

  }

  selectDefaultDevice() {

    this.defaultDevice = this.devices.find( device => device.deviceId == 'default');

    if( this.defaultDevice ) {
      // remove the default from the list
      let defaultDeviceIndex = this.devices.indexOf(this.defaultDevice);
      this.devices.splice( defaultDeviceIndex, 1 );

    } else {
      // use any available device
      this.defaultDevice = this.devices[0];

    }

    // select the matching actual device
    let selectedDevice = this.devices.find( device => device.groupId == this.defaultDevice.groupId );
    this.selectedDevice.next( selectedDevice );

  }


  selectedDeviceChanged(device) {

    this.selectedDeviceLabel = device.label;

    // TODO: show video or audio status
    switch( this.kind ) {

      case 'audioinput':
        console.log('connect audio input');
        break;

      case 'audiooutput':
        console.log('connect audio output');
        break;

      case 'videoinput':
        console.log('connect video input');
        break;

    }
  }

}
