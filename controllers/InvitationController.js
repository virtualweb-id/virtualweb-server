const { Wedding, Invitation } = require('../models')
const cloudinary = require('../helpers/cloudinary')

class InvitationController {
  static async showOne(req, res, next) {
    try {
      const UserId = req.user.id
      const { id: WeddingId } = await Wedding.findByPk(UserId)
      const invitation = await Invitation.findOne({where: { WeddingId }})
      res.status(200).json(invitation)
    } catch (err) {
      next(err)
    }
  }

  static async edit(req, res, next) {
    try {
      const { id } = req.params
      const { 
        brigeNickname, groomNickname, story, 
        title, backgroundImg, additionalImg, 
        videoUrl, backgroundColor, textColor, 
        timeEvent1, timeEvent2, youtubeUrl 
      } = req.body
      const uploadResponseBackgroundImg = await cloudinary.uploader
      .upload(backgroundImg)
      const uploadResponseAdditionalImg = await cloudinary.uploader
      .upload(additionalImg)
      const input = { 
        brigeNickname: brigeNickname || '', 
        groomNickname: groomNickname || '', 
        story: story || '', 
        title: title || '', 
        backgroundImg: uploadResponseBackgroundImg.url || '', 
        additionalImg: uploadResponseAdditionalImg.url || '', 
        videoUrl: videoUrl || '', 
        backgroundColor: backgroundColor || '', 
        textColor: textColor || '', 
        timeEvent1: timeEvent1 || '', 
        timeEvent2: timeEvent2 || '', 
        youtubeUrl: youtubeUrl || ''
      }
      const invitation = await Invitation.update(input, {
        where: { id }, returning: true
      })
      res.status(200).json(invitation[1][0])
    } catch (err) {
      next(err)
    }
  }
}

module.exports = InvitationController