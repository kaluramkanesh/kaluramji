const reviewModel = require('../models/reviewModel')
const booksModel = require('../models/booksModel')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId


/**************************************Start's Create Review Api'sππ****************************************/
exports.createReview = async function (req, res) {
    try {
        const { reviewedBy, review, rating } = req.body

        let bookId = req.params.bookId.trim()

        if (!(/^[A-Za-z0-9#@*. ]{1,}$/.test(review))) return res.status(400).send({ status: false, msg: 'review cant be blank or invalid' })

        let findBook = await booksModel.findOne({ _id: bookId, isDeleted: false })

        if (!findBook) return res.status(404).send({ status: false, msg: 'your searched book is not existπ₯π₯' })

        let details = {}

        details.bookId = bookId.trim()

        details.reviewedBy = reviewedBy.trim()

        details.review = review.trim()

        details.rating = rating

        let setReview = await reviewModel.create(details)

        let updateBook = await booksModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: 1 } }, { new: true })

        let mixed = { ...updateBook.toJSON(), reviewsData: setReview }

        res.status(201).send({ status: true, message: "Success", data: mixed })


    } catch (err) {
        res.status(500).send(err.message)
    }
}

/**************************************End Create Review Api'sππ****************************************/

/**************************************Start's Delete Review Api'sππ****************************************/
exports.deleteReview = async function (req, res) {
    try {
        let bookId = req.params.bookId

        let reviewId = req.params.reviewId

        if (!ObjectId.isValid(bookId) || !ObjectId.isValid(reviewId)) return res.status(400).send({ status: false, msg: 'please put a valid ObjectId' })

        //  let findBook = await booksModel.findOne({ _id: bookId })

        let findBook = await booksModel.findOne({ _id: bookId, isDeleted: false })

        if (!findBook) return res.status(404).send({ status: false, msg: "no such book existπ€·ββοΈπ€·ββοΈ" })

        let findreview = await reviewModel.findOneAndUpdate({ bookId: bookId, _id: reviewId }, { $set: { isDeleted: true } }, { new: true })

        if (!findreview) return res.status(404).send({ status: false, msg: 'no such review existπ₯π₯' })

        let updateBook = await booksModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } }, { new: true })
        res.status(200).send({ status: true, message: "Success", data: findreview })


    } catch (err) {
        res.status(500).send(err.message)
    }
}

/**************************************End Delete Review Api'sππ****************************************/


/**************************************Start's  Review Put Api'sππ****************************************/

exports.UpdateRiew = async function (req, res) {
    let bookIdData = req.params.bookId.trim()

    let reviewIdData = req.params.reviewId.trim()
 let updateReviewData = req.body
       
    let isValidBookId = mongoose.Types.ObjectId.isValid(bookIdData)

    if (!isValidBookId) { return res.status(400).send({ status: false, msg: "Book Id is not correct..." }) }

    let isValidReviewId = mongoose.Types.ObjectId.isValid(reviewIdData)

    if (!isValidReviewId) { return res.status(400).send({ status: false, msg: "Review ID is not correct....." }) }

    let BookData = await booksModel.findOne({ _id: bookIdData, isDeleted: false })

    if (!BookData) { return res.status(404).send({ status: false, msg: "Book does not exist" }) }

    let reviewData = await reviewModel.findOneAndUpdate({ _id: reviewIdData, isDeleted: false }, { $set: updateReviewData }, { new: true }).select({ __v: 0, isDeleted: 0, createdAt: 0 })

    if (!reviewData) { return res.status(404).send({ status: false, msg: "Review does not exist" }) }

    res.status(200).send({ status: true, BookData: BookData, UpdatedReviewData: reviewData })

}

/**************************************End  Review Put Api'sππ****************************************/
