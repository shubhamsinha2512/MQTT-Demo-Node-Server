export const DEVICE_TRIGGERS = {
    SOS:{code:1, message: 'SOS'},
    DEVICE_REMOVED:{code:4, message: 'Device Removed'},
    DEVICE_RESTARTED:{code:3, message: 'Device Restarted'},
}

export const SYSTEM_TRIGGERS = {
    LOW_HEART_RATE : {code : 11, message: 'Heart Rate Very Low!'},
    HIGH_HEART_RATE : {code : 12, message: 'Heart Rate Very High!'},
    UNUSUAL_HEART_RATE : {code : 13, message: 'Heart Rate Very Low!'},
    LOW_BPS : {code : 21, message: 'BPS Very Low!'},
    HIGH_BPS : {code : 22, message: 'BPS Very High!'},
    LOW_BPD: {code : 23, message: 'BPD Very Low!'},
    HIGH_BPS : {code : 24, message: 'BPD Very High!'},
    LOW_SPO2 : {code : 31, message: 'Low Blood Oxygen!'},
    HIGH_BODY_TEMP : {code : 41, message: 'Body Temperature Very High!'},
    LOW_BODY_TEMP : {code : 42, message: 'Body Temperature Very Low!'},
    LOW_BATTERY : {code : 51, message: 'Low Battery!'},
}