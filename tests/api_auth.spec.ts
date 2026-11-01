import { test , expect } from "@playwright/test";
import { createToken, createBooking } from "../page/api_function";


const BASE_url = "https://restful-booker.herokuapp.com"
let tokenValue : string
let booking_id : string


test('Create New authen token',async({request}) => {

    //1 ต้องการ reponหำ กลังมาสร้างตัวแปรก่อน

    let response = await request.post(`${BASE_url}/auth`, {
        headers: {"Content-Type":"application/json"},
        data:{ 
            "username": "admin",
            "password": "password123"
        }
    })


    expect(response.status()).toBe(200)
    expect(response).toBeDefined()
    tokenValue = (await response.json()).token;

    console.log(tokenValue)

})

test('GET Booking Returns the ids of all the bookings',async({request}) => {

    let response = await request.get(`${BASE_url}/booking`)

    expect(response.status()).toBe(200)
    const GETallbody = await response.json()
    
    expect(Array.isArray(GETallbody)).toBe(true)
    expect(GETallbody.length).toBeGreaterThan(0)
    expect(GETallbody[0]).toHaveProperty("bookingid")
    
    //show all
    //console.log(GETallbody)
})

test('GET booking with non-existent ID', async ({ request }) => {
    const nonExistentId = 999999999;

    const response = await request.get(`${BASE_url}/booking/${nonExistentId}`);

    // Verify HTTP status
    expect(response.status()).toBe(404);
});

test('Create  booking',async({request}) => {


    let Createresponse = await request.post(`${BASE_url}/booking`, {
        headers: {
            "Content-Type": "application/json",           
        },
        data: {
            "firstname": "Jim",
            "lastname": "Brownnnn",
            "totalprice": 111,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2018-01-01",
                "checkout": "2019-01-01"
            },
            "additionalneeds": "Breakfast"
        }

    })

    expect(Createresponse.status()).toBe(200)
    const createbody = await Createresponse.json()
    
    expect(createbody).toBeDefined()
    // Level 1: Root
    expect(createbody).toHaveProperty("bookingid")
    expect(createbody.bookingid).toBeGreaterThan(0)
    expect(createbody).toHaveProperty("booking")
    // Level 2: Inside booking
    expect(createbody.booking).toHaveProperty("firstname")
    expect(createbody.booking).toHaveProperty("lastname")
    expect(createbody.booking).toHaveProperty("totalprice")
    expect(createbody.booking).toHaveProperty("depositpaid")
    expect(createbody.booking).toHaveProperty("bookingdates")
    expect(createbody.booking).toHaveProperty("additionalneeds")
    // Level 3: Inside bookingdates
    expect(createbody.booking.bookingdates).toHaveProperty("checkin")
    expect(createbody.booking.bookingdates).toHaveProperty("checkout")

    expect(createbody.booking).toMatchObject({
    firstname: "Jim",
    lastname: "Brownnnn",
    totalprice: 111,
    depositpaid: true,
    bookingdates: {
        checkin: "2018-01-01",
        checkout: "2019-01-01"
    },
    additionalneeds: "Breakfast"
    })

    //GET Booking_ID VALUE for CRUD Test all 
    booking_id = String(createbody.bookingid);
    console.log('POST create:',booking_id)
    console.log('POST create:', Createresponse);
    

})

test('Create booking with Missing Field',async({request}) => {

    
    let Createresponse = await request.post(`${BASE_url}/booking`, {
        headers: {
            "Content-Type": "application/json",           
        },
        data: {
            "firstname": "Jim",
            "lastname": "Brownnnn",
            //"totalprice": 111,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2018-01-01",
                "checkout": "2019-01-01"
            },
            "additionalneeds": "Breakfast"
        }

    })

    //Received: 500
    expect(Createresponse.status()).not.toBe(200)
    expect(Createresponse.status()).toBe(500)

})


test('Updates a current booking Valid Token',async({request}) => {


    if (booking_id === undefined || tokenValue === undefined ) {
    
    booking_id = await createBooking(request);
    tokenValue = await createToken(request);
    }

    let updateResponse = await request.put(`${BASE_url}/booking/${booking_id}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Cookie": `token=${tokenValue}`
        },
        data: {
            "firstname": "James",
            "lastname": "Brown",
            "totalprice": 111,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2018-01-01",
                "checkout": "2019-01-01"
            },
            "additionalneeds": "Breakfast"
        }

    })

    expect(updateResponse.status()).toBe(200)
    const updatebody = await updateResponse.json()
    
    expect(updatebody).toBeDefined()
    expect(updatebody).toHaveProperty("firstname")
    expect(updatebody).toHaveProperty("lastname")
    expect(updatebody).toHaveProperty("totalprice")
      
    //show all
    //console.log(updatebody)

    expect(updatebody.firstname).toBe("James");
    expect(updatebody.lastname).toBe("Brown");
    console.log('PUT update data:', updatebody);

    // CHECK UPDATE
    const getResponse = await request.get(
        `${BASE_url}/booking/${booking_id}`
    );

    expect(getResponse.status()).toBe(200);

    const savedBody = await getResponse.json();

    expect(savedBody.firstname).toBe("James");
    expect(savedBody.lastname).toBe("Brown");
})

test('Update booking with invalid token', async ({ request }) => {
    const id = await createBooking(request);

    const response = await request.put(`${BASE_url}/booking/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Cookie": "token=invalid_token_12345"
        },
        data: {
            firstname: "James",
            lastname: "Brown",
            totalprice: 111,
            depositpaid: true,
            bookingdates: {
                checkin: "2018-01-01",
                checkout: "2019-01-01"
            },
            additionalneeds: "Breakfast"
        }
    });

    expect(response.status()).toBe(403);
});


test('Delete Booking and Verify Deletion',async({request}) => {

   if (booking_id === undefined || tokenValue === undefined ) {
    
    booking_id = await createBooking(request);
    tokenValue = await createToken(request);
    }

    let DeleteBooking = await request.delete(`${BASE_url}/booking/${booking_id}`, {
        headers: {
            "Content-Type": "application/json",
            "Cookie": `token=${tokenValue}`
        }

    })

    //Default HTTP 201 response
    expect(DeleteBooking.status()).toBe(201)
    
    


    //Varify Delete Success
    let verifyResponse = await request.get(`${BASE_url}/booking/${booking_id}`)
    expect(verifyResponse.status()).toBe(404);

})

test('Delete booking with invalid token',async({request}) => {


    booking_id = await createBooking(request);
    
    let DeleteBooking = await request.delete(`${BASE_url}/booking/${booking_id}`, {
        headers: {
            "Content-Type": "application/json",
            "Cookie": `token=${55555}`
        }

    })

    //Received 403 invalid token
    expect(DeleteBooking.status()).toBe(403)

})

test('Delete Booking with Invalid Booking ID',async({request}) => {


    if (tokenValue === undefined ) {
    
    tokenValue = await createToken(request);
    }
    
    let DeleteBooking = await request.delete(`${BASE_url}/booking/${'confirmed non-existent ID'}`, {
        headers: {
            "Content-Type": "application/json",
            "Cookie": `token=${tokenValue}`
        }

    })

    //Received 405 invalid ID
    expect(DeleteBooking.status()).toBe(405)

})