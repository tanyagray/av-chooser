import { DeviceChooserComponent } from '../device-chooser.component';

class AudioInputChooser extends DeviceChooserComponent {

    

    filterDevices( device ) {
        return device.type == 'audioinput';
    }

}