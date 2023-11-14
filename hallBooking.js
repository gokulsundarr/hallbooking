const express = require('express');
const bodyParser = require("body-parser")
let room = [];
let booking = [];
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

function validHHMMstring(str) {
    if (/^0[0-9]|1[0-9]|2[0-3]:[0-5][0-9] to 0[0-9]|1[0-9]|2[0-3]:[0-5][0-9]$/.test(str)) {
        return true;
    }
    return false;
}

app.post('/bookRoom', (req, res) => {
    let roomDetails = req.body;

    if (!isValueExist(room)) {
        return res.status(403).send({
            message: 'Rooms not available'
        });
    }
    if (!isValueExist(roomDetails.customerName)) {
        return res.status(403).send({
            message: 'Customer Name should be passed'
        });
    }

    if (!isValueExist(roomDetails.roomName)) {
        return res.status(403).send({
            message: 'Room Id should be passed'
        });
    }

    if (!isValueExist(roomDetails.bookingDate)) {
        return res.status(403).send({
            message: 'Date should be passed'
        })
    }

    if (roomDetails.bookingDate instanceof Date) {
        return res.status(403).send({
            message: 'Date should is Date Format'
        });
    }



    if (!isValueExist(roomDetails.startTime)) {
        return res.status(403).send({
            message: 'Start Time should be passed'
        })
    }

    if (!validHHMMstring(roomDetails.startTime)) {
        return res.status(403).send({
            message: 'Start Time should is HH:MM'
        });
    }

    if (!isValueExist(roomDetails.endTime)) {
        return res.status(403).send({
            message: 'End Time should be passed'
        })
    }

    if (!validHHMMstring(roomDetails.endTime)) {
        return res.status(403).send({
            message: 'End Time should is HH:MM'
        });
    }

    let roomId = 0;
    let roomName ="";
    let roomNo = 0;
    for (let i = 0; i < room.length; i++) {
        if (room[i].roomId == roomDetails.roomId) {

            roomId = room[i].roomId;
            roomName =room[i].roomName;
            if (room[i].noOfAvailableRoom == 0) {
                return res.status(403).send({
                    message: 'All room are booked'
                });
            } else {
                
                room[i].noOfAvailableRoom = room[i].noOfAvailableRoom - 1;
                room[i].noOfBookedRoom += 1;
                room[i].bookingStatus = "Partial Booked";
                roomNo  = room[i].noOfBookedRoom;
            }

            if (room[i].noOfAvailableRoom == 0) {
                room[i].bookingStatus = "Booked";
            }
            break;
        }
    }

    if (roomId == 0) {
        return res.status(403).send({
            message: 'Room not exist'
        });
    }

    let tempRoom = {};

    tempRoom.roomId = roomId;
    tempRoom.roomNo = roomNo;
    tempRoom.roomName = roomDetails.roomName;
    tempRoom.bookingStatus = "Available";
    tempRoom.customerName = roomDetails.customerName;
    tempRoom.bookingDate = roomDetails.bookingDate;
    tempRoom.startTime = roomDetails.startTime;
    tempRoom.endTime = roomDetails.endTime;

    booking.push(tempRoom);

    return res.status(200).send({
        message: 'Room booked successfully'
    })
})

app.post('/createRoom', (req, res) => {
    let roomDetails = req.body;

    if (!isValueExist(roomDetails.noOfRoom)) {
        return res.status(403).send({
            message: 'No Of rooms should be passed'
        });
    }

    if (typeof roomDetails.noOfRoom !== 'number') {
        return res.status(403).send({
            message: 'No Of rooms should be number'
        });
    }

    if (!isValueExist(roomDetails.amenities)) {
        return res.status(403).send({
            message: 'Amenities should be passed'
        });
    }

    if (!(roomDetails.amenities instanceof Array)) {
        return res.status(403).send({
            message: 'amenities for 1Hrs should be Array'
        });
    }

    if (!isValueExist(roomDetails.priceFor1Hrs)) {
        return res.status(403).send({
            message: 'Price for 1 hrs should be passed'
        })
    }

    if (typeof roomDetails.priceFor1Hrs !== 'number') {
        return res.status(403).send({
            message: 'Price for 1Hrs should be number'
        });
    }

    let tempRoom = {};
    let count = 0;
    if (room.length) {
        count = room.length;
    }
    tempRoom.romId = "Room" + (count + 1);
    tempRoom.roomName = "Room" + (count + 1);
    tempRoom.noOfRoom = roomDetails.noOfRoom;
    tempRoom.noOfAvailableRoom = roomDetails.noOfRoom;
    tempRoom.noOfBookedRoom = 0;
    tempRoom.amenities = roomDetails.amenities;
    tempRoom.priceFor1Hrs = roomDetails.priceFor1Hrs;

    room.push(tempRoom);

    return res.status(200).send({
        message: 'Room created successfully'
    })
})

app.get('/listOfRoom', (req, res) => {
    let returnJson = [];
    for (let i = 0; i < room.length; i++) {

        var result = booking.filter(function (e, v) {
            return e.roomId == room[i].roomId
        })

        if (result.length > 0) {
            for (let j = 0; j < result.length; j++) {
                let returnData = {};
                returnData.roomId = result[j].roomId;
                returnData.bookingStatus = room[i].bookingStatus;
                returnData.customerName = result[j].customerName;
                returnData.bookingDate = result[j].bookingDate;
                returnData.startTime = result[j].startTime;
                returnData.roomNo = result[j].roomNo
                returnData.endTime = result[j].endTime;
                returnJson.push(returnData);
            }
        }
        else {
            let returnData = {};
            returnData.roomName = room[i].roomName;
            returnData.bookingStatus = room[i].bookingStatus;
            returnData.customerName = "";
            returnData.bookingDate = "";
            returnData.startTime = "";
            returnData.endTime = "";
            returnJson.push(returnData);
        }
    }
    return res.status(200).send({
        returnJson
    })
})


app.get('/listOfBooking', (req, res) => {
    let returnJson = [];
    for (let i = 0; i < room.length; i++) {

        var result = booking.filter(function (e, l) {
            return e.roomId == room[i].roomId
        })

        if (result.length > 0) {
            for (let j = 0; j < result.length; j++) {
                let returnData = {};
                returnData.roomId = result[j].roomId;
              
                returnData.customerName = result[j].customerName;
                returnData.bookingDate = result[j].bookingDate;
                returnData.startTime = result[j].startTime;
                
                returnData.endTime = result[j].endTime;
                returnJson.push(returnData);
            }
        }
        
    }
    return res.status(200).send({
        returnJson
    })
})
app.get('/nooftimescustomer', (req, res) => {
    let returnJson = [];
    for (let i = 0; i < room.length; i++) {

        var result = booking.filter(function (e, n) {
            return e.roomId == room[i].roomId && e.customerName == req.body.customerName
        })

        if (result.length > 0) {
            for (let j = 0; j < result.length; j++) {
                let returnData = {};
                returnData.roomId = result[j].roomId;
                returnData.bookingStatus = room[i].bookingStatus;
                returnData.customerName = result[j].customerName;
                returnData.bookingDate = result[j].bookingDate;
                returnData.startTime = result[j].startTime;
                
                returnData.endTime = result[j].endTime;
                returnJson.push(returnData);
            }
        }
        
    }
    return res.status(200).send({
        returnJson
    })
})



function getNumberOfRooms() {
    return room;
}

function isValueExist(val) {
    return val != undefined && val != null && val != '';
}
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(
    `Server started on port ${PORT}`));