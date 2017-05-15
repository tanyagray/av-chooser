import { Component, OnInit, Input, Output } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/defaultIfEmpty';

@Component({
  selector: 'device-chooser',
  templateUrl: './device-chooser.component.html',
  styleUrls: ['./device-chooser.component.scss']
})
export class DeviceChooserComponent implements OnInit {

  @Input() public kind: string;
  @Input() public okayStatus = 'Success with';
  @Input() public notOkayStatus = 'No success with';

  @Output() public $selectedDevice: Subject<MediaDeviceInfo>;
  @Output() public selectedDeviceLabel: string;

  public $availableDevices: Observable<MediaDeviceInfo[]>;
  public $defaultDevice: Observable<MediaDeviceInfo>;

  public $deviceList: Observable<MediaDeviceInfo[]>;

  constructor() {

    this.$selectedDevice = new Subject();

    this.$selectedDevice.subscribe( device => {
      this.selectedDeviceLabel = device.label;
    });

    // observable of all available devices
    this.$availableDevices = Observable.timer( 0, 3000 )
      .flatMap( this.getAvailableDevices )
      .map( devices => this.filterDevicesByType(devices) )
      .distinctUntilChanged( null, this.deviceListToString )
      .share();
  }

  ngOnInit() {

    // observable of the array of suitable devices
    this.$deviceList = this.$availableDevices
      .map( devices => devices.filter(this.excludeDefaultDevice) );

    // observable of the default device, if any
    this.$defaultDevice = this.$availableDevices
      .flatMap( this.getUniqueDevices )
      .scan( this.scanForDefault );

    // combine the device list and default device
    // to get the default selection
    Observable.combineLatest( this.$deviceList, this.$defaultDevice, this.findDefaultInDevices )
      .subscribe( selected => this.setSelectedDevice(selected) );
  }

  scanForDefault( acc, curr ) {

    if ( !acc ) {
      return curr;
    }

    if ( curr.groupId === acc.groupId ) {
      acc = curr;
    }

    return acc;

  }

  /**
   * Gets all available media devices
   */
  getAvailableDevices(): Observable<MediaDeviceInfo[]> {
    return Observable.fromPromise( navigator.mediaDevices.enumerateDevices() );
  }

  /**
   * Reduces a list of MediaDeviceInfo objects to a
   * string of their deviceIds separated by commas
   */
  deviceListToString( devices ) {

    const toDeviceIdString = ( deviceString, currentDevice ) => {
      return deviceString + currentDevice.deviceId + ', ';
    };

    return devices.reduce( toDeviceIdString, '' );
  }

  /**
   * Splits an array of MediaDevices into individual devices
   */
  getUniqueDevices( deviceArray ):Observable<MediaDeviceInfo> {
    return Observable.from( deviceArray );
  }

  /**
   * Filters a device array for only the required type of device
   */
  filterDevicesByType( devices ) {
    return devices.filter( device => device.kind === this.kind );
  }

  /**
   * This filter returns false for any default device
   */
  excludeDefaultDevice( device ) {
    return device.deviceId !== 'default';
  }

  /**
   * This filter returns false for any default device
   */
  includeDefaultDevice( device ) {
    return device.deviceId === 'default';
  }

  /**
   * Filter array to include only the default device,
   * or otherwise select the first alternate option
   */
  findDefaultInDevices(devices, defaultDevice) {

    let selected;

    if ( defaultDevice ) {
      selected = devices.find( device => device.groupId === defaultDevice.groupId);
    }

    if ( !selected && devices.length > 0 ) {
      selected = devices[0];
    }

    return selected;
  }

  setSelectedDevice(device) {
    this.$selectedDevice.next( device );
  }

}
