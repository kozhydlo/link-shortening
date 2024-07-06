const {Router} = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()

// /api/auth/registration
router.post(
    '/registration',
    [
        check('email', 'Некоректний email').isEmail(),
        check('password', 'Мінімальна довжина пароля 4 символи').isLength({min: 4})
    ], 
    async (req, res) => {
    try {
        console.log(req.body)

        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некоректні дані'
            })
        }

        const {email, password} = req.body
        
        const candidate = await User.findOne({ email })

        if (candidate) {
            return res.status(400).json({ message: 'Такий користувач вже існує' })
        }

        const hashPassword = await bcrypt.hash(password, 12)
        const user = new User({ email, password: hashPassword })

        await user.save()

        res.status(201).json({message: 'Користувача створено'})

    } catch (e) {
        res.status(500).json({message: 'Щось пішло не так...'})
    }
})

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Некоректний email').normalizeEmail().isEmail(),
        check('password', 'Введіть пароль').exists()
    ],
    async (req, res) => {
        try {
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некоректні дані'
            })
        }

        const {email, password} = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: 'Користувача не знайдено' })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: 'Невірний пароль' })
        }
        const token = jwt.sign(
            { userId: user.id },
            config.get('secret'),
            { expiresIn: '1h' }
        )
        res.json({ token, userId: user.id, message: 'Вітаємо!' })

    } catch (e) {
        res.status(500).json({message: 'Щось пішло не так...'})
    }
})

module.exports = router

// 47.33