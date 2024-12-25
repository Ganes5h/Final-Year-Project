import {Platform} from "react-native";
import * as Device from "expo-device";

const generateDeviceFingerprint = () => {

    return btoa(JSON.stringify({
        deviceName: Device.deviceName || 'Unknown',
        deviceType: Device.deviceType,
        osName: Platform.OS,
        osVersion: Platform.Version,
        manufacturer: Device.manufacturer,
        modelName: Device.modelName,
        isTablet: Device.isTablet,
        timezone: new Date().getTimezoneOffset()
    }));
};
export default generateDeviceFingerprint();