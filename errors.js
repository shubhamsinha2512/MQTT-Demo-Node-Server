const ERROR = {
    NO_PAYLOAD_FOUND : {code:'ERR_01', message: 'No payload found'},
    PAYLOAD_EMPTY : {code:'ERR_02', message: 'Payload empty'},
    INVALID_PAYLOAD_STRUCTURE : {code:'ERR_03', message: 'Invalid payload structure'},
    USER_UNAUTHORIZED : {code:'ERR_04', message: 'User Unauthorized'},
    USER_ROLE_FORBIDDEN : {code:'ERR_05', message: 'User role forbidden to access data'},
    NO_PATIENT_FOUND : {code:'ERR_06', message: 'No paitien with given Patient Id found'},
    NO_DEVICE_FOUND : {code:'ERR_07', message: 'No device with give MAC found'},
    NO_PATIENT_ID : {code:'ERR_06', message: 'No paitien id'},
    NO_MAC_ID : {code:'ERR_07', message: 'No MAC'},
}

module.exports = ERROR