import { expect,APIRequestContext } from "@playwright/test"

const BASE_url = "https://restful-booker.herokuapp.com";
let tokenValue : string
let  booking_id : string

export async function createToken(request: APIRequestContext): Promise<string> {
    const response = await request.post(`${BASE_url}/auth`, {
        headers: {"Content-Type":"application/json"},
        data:{ 
            "username": "admin",
            "password": "password123"
        }
    })
    expect(response.status()).toBe(200)
    tokenValue = (await response.json()).token;

    console.log("Token created successfully")
    return tokenValue

}


export async function createBooking(request: APIRequestContext): Promise<string> {

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


    //GET VALUE
    booking_id = String(createbody.bookingid);
    console.log('POST create:',booking_id)
    console.log('POST create:', Createresponse);
    
    return booking_id

}