const {Guest} = require('../models')

class GuestController {
    static findAll (req, res, next) {
        Guest.findAll({order: [['createdAt', 'DESC']]})
        .then((guests) => {
            let output = guests.map(el => {
                return {
                    id: el.id,
                    name: el.name,
                    email: el.email,
                    phoneNumber: el.phoneNumber,
                    WeddingId: el.WeddingId
                }
            })
            res.status(200).json(output)
        })
        .catch(err => {
            next(err)
        })
    }

    static findById (req, res, next) {
        Guest.findByPk(+req.params.id)
        .then(guest => {
            const {id, name, email, phoneNumber, WeddingId} = guest
            res.status(200).json({id, name, email, phoneNumber, WeddingId})
        })
        .catch(err => {
            next(err)})
        
    }

    static create (req, res, next) {
        const {name, email, phoneNumber, WeddingId} = req.body
        console.log(req.body)
        Guest.create({name, email, phoneNumber, WeddingId})
          .then(guest => {
            const {id, name, email, phoneNumber, WeddingId} = guest
            res.status(201).json({id, name, email, phoneNumber, WeddingId})
          })
          .catch(err => {
            next(err)
          })
    }

    static edit (req, res, next) {
        const {name, email, phoneNumber, WeddingId} = req.body
        Guest.update({name, email, phoneNumber, WeddingId}, {where: {id: +req.params.id}})
          .then(guest => {
            res.status(200).json({message: "edit guest successfull"})
          })
          .catch(err => {
            next(err)
          })
        
    }

    static delete (req, res, next) {
        Guest.destroy({where: {id: +req.params.id}})
        .then(data => {
            res.status(200).json({message: 'delete guest successfull'})
        })
        .catch(err => next(err))
    }

}

module.exports = GuestController