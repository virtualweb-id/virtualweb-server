const { Wedding, Invitation } = require('../models')
const { cloudinary } = require('../helpers')

class WeddingController {
  static async getWeddingInfoById(req, res, next) {
    try {
      const UserId = req.user.id
      const data = await Wedding.findOne({
        where: {UserId},
        include: [Invitation]
      })
      res.status(200).json(data || {})
    } catch (error) {
      next(error)
    }
  }

  static async createWeddingPlan(req, res, next) {
    try {
      const UserId = req.user.id
      const { title, date, address, groomName, groomImg, brideImg, brideName, status } = req.body
      let uploadResponseGroom
      let uploadResponseBride
      if (groomImg) {
        uploadResponseGroom = await cloudinary.uploader
        .upload(groomImg)
      }
      if (brideImg) {
        uploadResponseBride = await cloudinary.uploader
          .upload(brideImg)
      }
      const newData = {
        id: Math.random() * 10e8 | 0,
        title: title || '',
        date: date || '',
        address: address || '',
        groomName: groomName || '',
        brideName: brideName || '',
        groomImg: (uploadResponseGroom ? uploadResponseGroom.url : ''),
        brideImg: (uploadResponseBride ? uploadResponseBride.url : ''),
        status: status || false,
        UserId
      }
      const createWedding = await Wedding.create(newData)
      if (createWedding) await Invitation.create({ 
        WeddingId: createWedding.id,
        brigeNickname: createWedding.brideName,
        groomNickname: createWedding.groomName,
        story: "Your story here",
        title: "Title",
        backgroundColor: '#1687a7', 
        textColor: '#d3e0ea', 
        timeEvent1: '8.00', 
        timeEvent2: '11.00',  
      })
      res.status(201).json(createWedding)
    } catch (error) {
      next(error)
    }
  }

  static async updateWeddingInfo(req, res, next) {
    try {
      const { id } = req.params
      const { title, date, address, groomName, groomImg, brideImg, brideName, status } = req.body
      let uploadResponseGroom
      let uploadResponseBride
      if (groomImg) {
        uploadResponseGroom = await cloudinary.uploader
        .upload(groomImg)
      }
      if (brideImg) {
        uploadResponseBride = await cloudinary.uploader
          .upload(brideImg)
      }
      const editData = {
        title: title || '',
        date: date || '',
        address: address || '',
        groomName: groomName || '',
        brideName: brideName || '',
        groomImg: (uploadResponseGroom ? uploadResponseGroom.url : ''),
        brideImg: (uploadResponseBride ? uploadResponseBride.url : ''),
        status: status || false
      }
      const editedData = await Wedding.update(editData, {
        where: { id }, returning: true
      })
      res.status(200).json(editedData[1][0])
    } catch (error) {
      next(error)
    }
  }

  static async deleteWeddingPlan(req, res, next) {
    try {
      const { id } = req.params
      await Wedding.destroy({ where: { id } })
      res.status(200).json({ message: 'Wedding deleted' })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = WeddingController
