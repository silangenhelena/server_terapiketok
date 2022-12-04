import mongoose from 'mongoose';
import BookForm25 from '../models/book25.js';

// functions
import { formatDate } from '../utils/utils.js';

// open new date for booking
export const createBook = async (req, res) => {
    if(!req.userId) return res.json({ message: 'Unauthenticated' });

    try {
        const bookingdate = req.body.newdatebook;
        let newDate = formatDate(bookingdate)
        let tomorrowDate = formatDate(bookingdate);
        tomorrowDate.setDate(newDate.getDate() + 1)
        
        // console.log("today:", newDate)
        // console.log("tomorrow:", tomorrowDate)
        const arrIsAlreadyMade = await BookForm25.find({ $and: [{ bookingdate: { $gte: newDate, $lt: tomorrowDate} }, { available: true }] })
        
        if(arrIsAlreadyMade.length > 0) return res.json({message: "Date already exist" , type: "err_data"})

        const { creator, maxbooking, shifts } = req.body;
        const max = req.body.capacitybook;
        const schedules = req.body.schedule;
        const shiftInfo = { quantity: shifts, schedules }
    
        const newBook = await BookForm25({bookingdate: new Date(bookingdate).toISOString(), max: max, maxbooking, shiftInfo, creator});

        await newBook.save()
        res.status(201).json(newBook)
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

// fetch all available dates for booking
export const deleteDate = async (req, res) => {
    const { id : _id } = req.params;
    console.log("delete date id:", _id)

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("No such date");
    
    await BookForm25.findByIdAndRemove(_id);

    res.json({ message: 'Date deleted successfully' })
}

// fetch all available dates for booking
export const getDates = async (req, res) => {
    console.log("Someone access the available date");
    
    const { date: availableDate } = req.params;
    let newDate = formatDate(availableDate);

    try {
        const arr = await BookForm25.find({ $and: [{ bookingdate: { $gte: newDate} }, { available: true }] })
        res.json(arr)
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

// fetch all dates
export const getAllDates = async (req, res) => {
    console.log("Dashboard get all dates");
    
    const { date: availableDate } = req.params;
    let newDate = formatDate(availableDate);
    
    try {
        const arr = await BookForm25.find({ bookingdate: { $gte: newDate} })
        res.json(arr)
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

// first step for booking, make an appointment and save it on the database list
export const makeAppointment = async (req, res) => {
    console.log("someone make an appoinment")
    
    const { name, cellphone, sessionbook, bookingcode } = req.body;
    const id = req.params.dateID;
    
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Tanggal tesebut belum terima booking")
        // if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send({message:"Tanggal tesebut belum terima booking", type: "err_data"})
        
        const book = await BookForm25.findById(id);
        if(!book) return res.json({message: `Maaf tanggal tersebut sudah ditutup. Booking anda tidak berhasil` , type: "err_data"})
        const maxBooking = book.maxbooking;

        // check apakah shift yang dipilih masih ada tempat atau tidak
        const capacityShift = `${sessionbook}Available`;
        if(book[capacityShift] == false){
            return res.json({message: "Jam ini sudah penuh", type: "err_data"})
        };

        //check apakah sudah booking 2x
        let count = 0;
        let shifts = ['shift1', 'shift2', 'shift3']

        for (let i = 0; i < shifts.length; i++){
            book[shifts[i]].map((item) => {
                if(item.cellphone == cellphone){
                    count++
                }
            })
        }

        console.log("count:", count)
        if(count >= maxBooking){
            return res.json({message: `Maaf anda sudah booking ${maxBooking} kali. Booking anda tidak berhasil` , type: "err_data"})
        }

        book[sessionbook].push({name, cellphone, bookingcode, timestamp: new Date()});

        if(book[sessionbook].length >= book['max']){
            book[capacityShift] = false;
            if(book['shift1Available'] == false && book['shift2Available'] == false && book['shift3Available'] == false){
                book['available'] = false;
                console.log("full, close the date, at:", new Date())
            }
        }
    
        const updatedBook = await BookForm25.findByIdAndUpdate(id, book, {new: true});
    
        let bookingID; 
        updatedBook[sessionbook].map((booked) => {
            if(booked.bookingcode === bookingcode){
                bookingID = booked._id
            }
        })
        res.json(bookingID);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

// second step for booking, get the data from the given bookID
export const getAppointment = async (req, res) => {
    console.log("get the appointment")

    const { dateID, bookID } = req.params;
    const { shiftquery } = req.query;
    let book, index;
    let newData = {}
    
    if(!mongoose.Types.ObjectId.isValid(dateID)) return res.status(404).send("Tanggal tesebut belum terima booking")

    try {
        const booksOnTheDate = await BookForm25.findById(dateID);
    
        booksOnTheDate[shiftquery].map((item, ind) => {
            if(item._id.toString() == bookID){
                book = item;
                index = ind;
            }
        })

        if(!book.name || !book.cellphone || !book._id ){
            return res.json({message: "Maaf jam ini sudah penuh" , type: "err_data"})
        }
        
        if(book){
            newData.name = book.name;
            newData.cellphone = book.cellphone;
            newData.bookingcode = book.bookingcode;
            newData.timestamp = book.timestamp;
            newData.bookingdate = booksOnTheDate.bookingdate;
            newData.shift = shiftquery;
            newData.index = index;
            newData.id = book._id;
            console.log("end")
        }
        
        res.json(newData);
        
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}