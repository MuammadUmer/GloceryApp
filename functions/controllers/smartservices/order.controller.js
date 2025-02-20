const functions = require("firebase-functions");
var admin = require("firebase-admin");
var db = admin.firestore();
const { responseMessage, responseError } = require("../../model/responsemessage")
const rateLimit = require("express-rate-limit");
const rateLimiter = rateLimit({
    windowMs: 60 * 60 * 500,
    max: 60,
    message:
        "Too many login attempts from this IP, please try again after half an hour"
});

// orderstatus: 0 for user still creating order, 1 waiting for servieprovider acception or rejection phase, 2 for canceled by client, 3,4 accepted and rejected, 5 paid or unpaid, 6 paid, 7 inprogress, 

const addOrder = async (req, res) => {
    try {
        // console.log(admin.firestore.FieldValue.serverTimestamp)
        // if (req.user.userkey === req.body.serviceproviderid) {
        //     return responseMessage(res, 400, "You can not order your own service", null)
        // }
        const serviceverfication = db.collection('smartservices').doc(req.body.serviceproviderid).collection('services').doc(req.body.serviceid).get()
        const subservicevSerfication = db.collection('smartservices').doc(req.body.serviceproviderid).collection('services').doc(req.body.serviceid).collection('subservices').doc(req.body.subserviceid).get()
        const orderverification = db.collection('smartservices').doc(req.user.userkey).collection("orders").where('serviceproviderid', '==', req.body.serviceproviderid).where('ordercompleted', '==', false).get()
        Promise.all([serviceverfication, subservicevSerfication, orderverification]).then(values => {
            if (!values[0].exists) {
                responseMessage(res, 400, "Invalid service id", null)
            }
            if (!values[1].exists) {
                responseMessage(res, 400, "Invalid subservice id", null)
            }
            var servicedata = values[0].data();
            var subservicedata = values[1].data();
            var orderdata = orderDataSchema(values[0].data())
            var orderdetail = {
                subservicename: subservicedata.subservicename,
                serviceid: subservicedata.serviceid,
                price: subservicedata.price,
                subserviceid: values[1].id
            }
            if (values[2].empty) {
                console.log(servicedata)
                console.log(subservicedata)

                db.collection('smartservices').doc(req.user.userkey).collection("orders").add({
                    ...orderdata, createdtime: admin.firestore.FieldValue.serverTimestamp()
                }).then(snapshot => {
                    db.collection('smartservices').doc(req.user.userkey).collection("orders").doc(snapshot.id).collection("orderdetail").add({
                        ...orderdetail, createdtime: admin.firestore.FieldValue.serverTimestamp()
                    }).then(snapshotorderdetail => {
                        updateTotalPrice(req, snapshot.id)
                    })
                })
                responseMessage(res, 201, "Order has been created successfully", null)

            } else {
                db.collection('smartservices').doc(req.user.userkey).collection("orders").doc(values[2].docs[0].id).collection("orderdetail").add({
                    ...orderdetail, createdtime: admin.firestore.FieldValue.serverTimestamp()
                }).then(snapshotorderdetail => {
                    updateTotalPrice(req, values[2].docs[0].id)
                })
                responseMessage(res, 201, "Service has been added to order", null)
            }
        })
    } catch (error) {
        console.log('error inside addorder => ', error)
    }
}
const orderDataSchema = (servicedata) => {
    return {
        subcatagoryid: servicedata.subcatagoryid,
        subcatagoryname: servicedata.subcatagoryname,
        catagoryid: servicedata.catagoryid,
        catagoryname: servicedata.customname,
        serviceproviderid: servicedata.userid,
        serviceproviderfirstname: servicedata.firstname,
        serviceproviderlastname: servicedata.lastname,
        ordercompleted: false,
        orderstatus: 0,
        totalprice: 0
    }
}

const updateTotalPrice = async (req, orderid) => {

    db.collection('smartservices').doc(req.user.userkey).collection("orders").doc(orderid).collection("orderdetail").get().then(snapshotupdateprice => {
        let price = 0;
        // console.log("price", price)

        if (!snapshotupdateprice.empty) {
            snapshotupdateprice.forEach(doc => {
                price += doc.data().price
                // console.log("price", price)
            })
            db.collection('smartservices').doc(req.user.userkey).collection("orders").doc(orderid).set({
                totalprice: price
            }, { merge: true })
        } else {
            console.log("order update Total Price function error => empty which is not possible")
        }
    })
}

const removeSubOrder = async (req, res) => {
    try {
        const ordercompleted = db.collection('smartservices').doc(req.user.userkey).collection("orders").doc(req.body.orderid).get()
        const ref = db.collection('smartservices').doc(req.user.userkey).collection("orders").doc(req.body.orderid).collection("orderdetail").doc(req.body.suborderid).get()
        Promise.all([ordercompleted, ref]).then(values => {
            if (values[0].exists) {
                if (values[0].data().ordercompleted === true) {
                    return responseMessage(res, 400, "Service can not be removed after order completion", null)
                } else {
                    if (values[1].exists) {
                        db.collection('smartservices').doc(req.user.userkey).collection("orders").doc(req.body.orderid).collection("orderdetail").doc(req.body.suborderid).delete()
                        return responseMessage(res, 200, "Service has been removed from order", null)
                    } else {
                        return responseMessage(res, 400, "Service does not exist in your order", null)
                    }
                }
            } else {
                return responseMessage(res, 400, "Invalid Order id", null)
            }
        })
    } catch (error) {
        console.log("order update removeSubOrder function error => empty which is not possible")
    }
}

const getOrderPlaceByMe = async (req, res) => {
    try {
        var ref = db.collection('smartservices').doc(req.user.userkey).collection("orders").get();
        Promise.all([ref]).then(values => {
            if (values[0].empty) {
                responseMessage(res, 200, "You do have have any order", null)
            } else {
                let response = [];
                values[0].forEach(doc => {
                    response.push({ ...doc.data(), orderid: doc.id })
                })
                responseMessage(res, 200, "List of orders", response)
            }
        })
    } catch (error) {
        console.log("error inside get order placed by me => ", error)
    }
}

const scheduleOrder = async (req, res) => {
    try {

        // const scheduledate = new Date(req.body.dateandtime);
        // var workinghours = { lastordertime: '16:00', open: '09:00', close: '18:00' }


        // console.log("Get Day", scheduledate.getDay())

        // return responseMessage(res, 200, "Allowed", null);

        var promiseusersettings = db.collection('userSetting').doc(req.body.userid).get();
        var promiseorderref = db.collection('smartservices').doc(req.user.userkey).collection("orders").doc(req.body.orderid).get();
        var promiseschedule = db.collection('smartservices').doc(req.body.userid).collection("schedule").get();
        // var promisepaymentmethod = db.collection('privatePayments').doc(req.user.userkey).get();

        Promise.all([promiseusersettings, promiseorderref, promiseschedule]).then(values => {
            var userSettingData, orderRefData, scheduleData = [], paymentDetails;
            var scheduledate = new Date(req.body.dateandtime);

            //payment methods verification
            // if (values[3].exists) {
            //     paymentDetails = values[3].data()
            // } else {
            //     return responseMessage(res, 400, "Forbidden, Please add payment method", null)
            // }
            if (values[0].exists) {
                userSettingData = values[0].data()
            } else {
                return responseMessage(res, 400, "Forbidden, Invalid Userid", null)
            }
            // To verify order day to match user setting
            if (validateOrderDay(userSettingData.weekdays, scheduledate))
                return responseMessage(res, 400, "Forbidden, Schedule not available", null)

            // to verify the time of order to match user setting
            if (validateOrderTime(userSettingData.workinghours, scheduledate)) {
                return responseMessage(res, 400, "Forbidden, Schedule not available", null)
            }


            if (values[1].exists) {
                orderRefData = values[1].data()
            } else {
                return responseMessage(res, 400, "Forbidden, Invalid Orderid", null)
            }
            if (orderRefData.serviceproviderid !== req.body.userid || orderRefData.orderstatus !== undefined && orderRefData.orderstatus > 1) {
                return responseMessage(res, 400, "Forbidden, Invalid request", null)
            }


            if (values[2].empty) {
                confirmOrder(req.user.userkey, values[1]);
                console.log(values[1].id)
                db.collection('smartservices').doc(req.user.userkey).collection("orders").doc(values[1].id).update({
                    orderstatus: 1,
                    confirmationTime: admin.firestore.FieldValue.serverTimestamp()
                });
                db.collection('smartservices').doc(req.body.userid).collection("schedule").add({
                    date: "",
                    time: "",
                    dateandtime: "",
                    orderby: "",
                    orderto: "",
                    createdAt: ""
                });
                responseMessage(res, 200, "Order has been confirmed successfully", null)

            } else {

                if (!validateAllSchedule(values[2]))
                    return responseMessage(res, 400, "Another Order is booked for this time, please select another data or time", null)



            }
            // values[2].forEach(doc=>{
            //     scheduleData.push(doc.data())
            // })
            console.log(userSettingData)
            console.log(orderRefData)


            responseMessage(res, 200, "Working", null);
            // if(values[2].empty){
            //     orderRefData = values[1].data();
            // }else{
            //     responseMessage(res, 400, "Forbidden, Invalid Orderid", null);
            // }

        })


    } catch (error) {
        console.log("error inside schedule order =>", error)
    }
}
const validateAllSchedule = async (scheduleOrders) => {
    scheduleOrders.forEach()
}
const confirmOrder = async (userKey, orderid) => {
    // values[2].
    // orderstatus
    console.log(userKey)
    db.collection('smartservices').doc(userKey).collection("orders").doc(orderid).update({
        orderstatus: 1,
        confirmationTime: admin.firestore.FieldValue.serverTimestamp()
    });
}

const validateOrderDay = (weekdays, scheduleday) => {
    if (scheduleday.getDay() === 1 && !weekdays.monday) {
        return true
    }
    if (scheduleday.getDay() === 2 && !weekdays.tuesday) {
        return true
    }
    if (scheduleday.getDay() === 3 && !weekdays.wednesday) {
        return true
    }
    if (scheduleday.getDay() === 4 && !weekdays.thursday) {
        return true
    }
    if (scheduleday.getDay() === 5 && !weekdays.friday) {
        return true
    }
    if (scheduleday.getDay() === 6 && !weekdays.saturday) {
        return true
    }
    if (scheduleday.getDay() === 7 && !weekdays.sunday) {
        return true
    }
    return false
}
const validateOrderTime = (userSetting, scheduleOrderTime) => {
    var tmpopen = userSetting.open.split(':');
    var openTime = {
        hours: parseInt(tmpopen[0]),
        mins: parseInt(tmpopen[1])
    };
    var tmpclose = userSetting.lastordertime.split(':');
    var lastOrderTime = {
        hours: parseInt(tmpclose[0]),
        mins: parseInt(tmpclose[1])
    };
    if (scheduleOrderTime.getHours() >= openTime.hours) {
        if (scheduleOrderTime.getHours() === lastOrderTime.hours && scheduleOrderTime.getMinutes() <= lastOrderTime.mins) {
            return false
        }
        if (scheduleOrderTime.getHours() < lastOrderTime.hours) {
            return false
        }

    }
    return true
}

module.exports = {
    rateLimiter,
    addOrder,
    removeSubOrder,
    getOrderPlaceByMe,
    scheduleOrder
}