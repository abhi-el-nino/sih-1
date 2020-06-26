const jwt = require('jsonwebtoken')
const secret = 'buYfreshDtU2020'
const Farmer = require('../../../models/Farmer')
const { Token } = require('graphql')


module.exports.localSignUp = async function (req, res) {
    try {
        check = await Farmer.findOne({ phone: req.body.phone });
        if (check) {
            return res.status(500).json({
                message: 'User already exist'
            })
        } else {
            farmer = await Farmer.create({
                phone: req.body.phone,
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
                address: req.body.address
            })

            token = jwt.sign({ id: farmer._id }, secret, { expiresIn: 60 * 60 * 24 })
            farmer.local_access_token = token
            await farmer.save()
            return res.status(200).json({
                message: 'User Sign Up Successfull',
                access_token: token
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(404).json({
            message: 'Internal server Error'
        })
    }

}

module.exports.googleSignUp = async function (req, res) {
    try {
        check = await Farmer.findOne({ phone: req.body.phone });
        if (check) {
            return res.status(500).json({
                message: 'User already exist'
            })
        } else {
            farmer = await Farmer.create({
                phone: req.body.phone,
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
                address: req.body.address,
                google_access_token: req.body.token
            })

            return res.status(200).json({
                message: 'User Sign Up Successfull',
                access_token: req.body.token
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(404).json({
            message: 'Internal server Error'
        })
    }
}

module.exports.localLogin = async function (req, res) {
    try {
        farmer = await Farmer.findOne({ phone: req.body.phone });
        if (!farmer) {
            return res.status(400).json({
                message: 'No Such User Found'
            })
        }
        if (farmer.password != req.body.password) {
            return res.status(400).json({
                message: 'Worng Password'
            })
        }
        jwt.sign({ id: farmer._id }, secret, { expiresIn: 60 * 60 * 24 }, async (err, token) => {
            if (err) {
                console.log(err)
                return res.status(400).json({
                    message: 'Internal Server error'
                })
            }
            farmer.local_access_token = token
            await farmer.save()
            return res.status(200).json({
                message: 'User Signed In',
                access_token: token
            })
        })
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            message: 'Internal Server error'
        })
    }
}

module.exports.googleLogin = async function (req, res) {
    try {
        farmer = await Farmer.findOne({ phone: req.query.phone });
        farmer.google_access_token = req.query.token
        await farmer.save()
        return res.status(200).json({
            message: 'User Signed In',
            access_token: token
        })

    } catch (err) {
        console.log(err)
        return res.status(400).json({
            message: 'Internal Server error'
        })
    }
}